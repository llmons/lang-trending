/**
 * Minimal client for the public GitHub search API.
 *
 * Without a token, requests are subject to the public rate limits
 * (10 search requests / minute, per IP). With a token — the
 * automatically injected `GITHUB_TOKEN` in CI — the limits are
 * dedicated: 30 search requests / minute. `403`/`429` responses are
 * honored by waiting out the documented reset window.
 */

const SEARCH_API_URL = "https://api.github.com/search/repositories"

/**
 * Pacing defaults per mode, matching the documented search limits exactly.
 * `pace()` sleeps until the full interval has elapsed, so actual spacing can
 * only be ≥ the interval and the ceiling can never be exceeded.
 */
export const UNAUTHENTICATED_INTERVAL_MS = 6_000 // 10 req/min
export const AUTHENTICATED_INTERVAL_MS = 2_000 // 30 req/min

const REQUEST_TIMEOUT_MS = 60_000

const BASE_HEADERS = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  // GitHub requires a User-Agent on every API request.
  "User-Agent": "lang-trending (https://github.com/llmons/lang-trending)",
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

/** Unix time (seconds) of the last request start — module-level so all callers share the pace. */
let lastRequestAt = 0

async function pace(intervalMs: number): Promise<void> {
  const elapsed = Date.now() - lastRequestAt
  if (elapsed < intervalMs) await sleep(intervalMs - elapsed)
  lastRequestAt = Date.now()
}

interface RateLimitInfo {
  remaining: string | null
  reset: string | null
  retryAfter: string | null
}

function readRateLimit(res: Response): RateLimitInfo {
  return {
    remaining: res.headers.get("x-ratelimit-remaining"),
    reset: res.headers.get("x-ratelimit-reset"),
    retryAfter: res.headers.get("retry-after"),
  }
}

/**
 * Wait until the API budget is replenished.
 * Returns `true` if it waited, so the caller knows to retry.
 */
async function waitForBudget(
  info: RateLimitInfo,
  log?: (msg: string) => void
): Promise<boolean> {
  const parsed =
    info.retryAfter !== null
      ? Number(info.retryAfter)
      : info.reset !== null
        ? Number(info.reset) - Date.now() / 1000
        : 60

  // Secondary rate limits need real cooling — GitHub's retry-after can be
  // as short as a few seconds while the throttle is still active, so wait
  // at least 30s before knocking again.
  const waitSeconds = Math.max(Number.isFinite(parsed) ? parsed : 60, 30)

  log?.(`  · rate-limited — waiting ${Math.ceil(waitSeconds)}s before retrying`)
  await sleep(Math.ceil(waitSeconds) * 1000 + 1000)
  return true
}

export interface CountOptions {
  /** Spacing between requests in milliseconds. */
  intervalMs?: number
  /** Optional bearer token — the auto-injected `GITHUB_TOKEN` in CI. */
  token?: string
  log?: (message: string) => void
}

/**
 * Total number of repositories matching a GitHub search query.
 * Throws when the query itself is invalid (HTTP 422) — network or rate-limit
 * issues are retried a bounded number of times before giving up.
 */
export async function countRepos(
  query: string,
  { intervalMs = UNAUTHENTICATED_INTERVAL_MS, token, log }: CountOptions = {}
): Promise<number> {
  const url = `${SEARCH_API_URL}?q=${encodeURIComponent(query)}&per_page=1`

  // Exponential backoff for transient failures: 20s → 40s.
  // Callers are expected to run pipeline-level recovery rounds on top of
  // this, so a single request never needs unbounded retries.
  const backoffMs = [20_000, 40_000]

  for (let attempt = 0; attempt < 3; attempt++) {
    await pace(intervalMs)

    let res: Response
    let data: { total_count?: unknown }
    try {
      // The whole exchange — headers and body — shares the timeout signal,
      // so a stall at any stage is retried rather than fatal.
      res = await fetch(url, {
        headers: {
          ...BASE_HEADERS,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      })
      data = (await res.json()) as { total_count?: unknown }
    } catch {
      const backoff = backoffMs[attempt] ?? 40_000
      log?.(`  · network error — retrying in ${backoff / 1000}s`)
      await sleep(backoff)
      continue
    }

    const info = readRateLimit(res)

    // Pre-emptively sleep when the budget is visibly exhausted.
    if (res.ok && info.remaining === "0" && (await waitForBudget(info, log)))
      continue

    if (res.status === 403 || res.status === 429) {
      if (await waitForBudget(info, log)) continue
      throw new Error(`GitHub search rate-limited (HTTP ${res.status})`)
    }

    if (res.status === 422) {
      throw new Error(`GitHub search rejected the query (HTTP 422): ${query}`)
    }

    if (!res.ok) {
      throw new Error(
        `GitHub search failed (HTTP ${res.status}): ${JSON.stringify(data)}`
      )
    }

    if (typeof data.total_count !== "number") {
      throw new Error("Unexpected GitHub search response: missing total_count")
    }
    return data.total_count
  }

  throw new Error(`GitHub search failed after retries: ${query}`)
}

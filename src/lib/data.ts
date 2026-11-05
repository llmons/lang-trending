/**
 * Build-time ranking pipeline.
 *
 * The site has no committed data files. `astro build` fetches every count
 * from the public GitHub search API exactly once — the top-level await below
 * runs a single time per build and every page shares the resolved result —
 * then renders all pages as static HTML from it.
 *
 * Four queries per language, one per star tier: all repositories, and the
 * repositories that cleared 10 / 50 / 100 stars. 29 languages × 4 tiers =
 * 116 requests. In CI the auto-injected `GITHUB_TOKEN` grants the dedicated
 * authenticated limit (30 req/min ≈ 5 min); locally the build runs
 * unauthenticated (10 req/min ≈ 12 min).
 *
 * `astro dev` re-evaluates this module once per dev-server session, so the
 * first page request after `astro dev` performs a full fetch.
 * For a quick local look, prefer `astro build && astro preview`.
 *
 * ⚠ Server-only: never import a VALUE from this module in client code
 * (islands). The bundler would ship the fetch pipeline — including this
 * module's top-level await — into the browser bundle and every visitor
 * would start a 116-request fetch. Client code imports the data model
 * from `@/lib/tiers` instead.
 */

import {
  AUTHENTICATED_INTERVAL_MS,
  UNAUTHENTICATED_INTERVAL_MS,
  countRepos,
} from "@/lib/github"
import {
  LANGUAGE_CATALOG,
  LANGUAGE_CATEGORIES,
  type LanguageMeta,
} from "@/lib/languages"
import {
  STAR_TIERS,
  TIER_WEIGHTS,
  type RankedLanguage,
  type Rankings,
  type RankingsMeta,
  type TierId,
  type TierRanking,
} from "@/lib/tiers"
import {
  createdQualifier,
  rollingWindow,
  toDatePart,
  type RollingWindow,
} from "@/lib/window"

function buildQuery(
  languageId: string,
  tier: (typeof STAR_TIERS)[number],
  window: RollingWindow
): string {
  const stars = tier.starsQualifier ? `${tier.starsQualifier} ` : ""
  return `language:${languageId} fork:false mirror:false ${stars}${createdQualifier(window)}`
}

/** Per-language, per-tier counts, filled by the fetch rounds. */
const counts = new Map<string, number>()

/**
 * The auto-injected `GITHUB_TOKEN` from GitHub Actions. Present in CI, absent
 * locally — the pipeline adapts its pacing to the matching rate-limit mode.
 */
const githubToken = process.env.GITHUB_TOKEN
const requestInterval = githubToken
  ? AUTHENTICATED_INTERVAL_MS
  : UNAUTHENTICATED_INTERVAL_MS
const requestRate = githubToken ? 30 : 10
const requestMode = githubToken ? "authenticated" : "unauthenticated"

/** One round of per-language fetches. Returns the languages that failed. */
async function fetchCountsRound(
  pending: readonly LanguageMeta[],
  window: RollingWindow
): Promise<LanguageMeta[]> {
  const failed: LanguageMeta[] = []
  for (const [index, language] of pending.entries()) {
    const progress = `[${index + 1}/${pending.length}]`
    const log = (message: string) => console.log(`  ${message}`)

    try {
      for (const tier of STAR_TIERS) {
        console.log(`${progress} ${language.name} — ${tier.label}`)
        const repos = await countRepos(buildQuery(language.id, tier, window), {
          intervalMs: requestInterval,
          token: githubToken,
          log,
        })
        counts.set(`${language.id}:${tier.id}`, repos)
      }
    } catch (error) {
      console.log(`  · ${language.name} failed — ${(error as Error).message}`)
      failed.push(language)
    }
  }
  return failed
}

async function fetchRankings(): Promise<Rankings> {
  const current = rollingWindow()

  console.log(
    `Fetching live data from the GitHub search API\n` +
      `  window:    ${toDatePart(current.from)} .. ${toDatePart(current.to)}\n` +
      `  languages: ${LANGUAGE_CATALOG.length} × ${STAR_TIERS.length} tiers = ${LANGUAGE_CATALOG.length * STAR_TIERS.length} requests (${requestMode}, paced at ${requestRate} req/min)`
  )

  // First pass over every language, then up to two recovery rounds for the
  // stragglers — a single flaky request must not sink the whole build.
  let pending: readonly LanguageMeta[] = LANGUAGE_CATALOG
  const cooldowns = [120_000, 240_000]
  for (
    let round = 0;
    round <= cooldowns.length && pending.length > 0;
    round++
  ) {
    if (round > 0) {
      console.log(
        `  · ${pending.length} language(s) failed — cooling down ${cooldowns[round - 1] / 1000}s before recovery round ${round}`
      )
      await new Promise((resolve) => setTimeout(resolve, cooldowns[round - 1]))
    }
    pending = await fetchCountsRound(pending, current)
  }

  if (pending.length > 0) {
    throw new Error(
      `Could not fetch counts for: ${pending.map((language) => language.name).join(", ")}`
    )
  }

  const tiers = {} as Record<TierId, TierRanking>
  for (const tier of STAR_TIERS) {
    const ranked: RankedLanguage[] = LANGUAGE_CATALOG.map((language) => {
      const repos = counts.get(`${language.id}:${tier.id}`)
      if (repos === undefined) {
        throw new Error(`Missing ${tier.id} count for ${language.id}`)
      }
      return { ...language, repos, share: 0, rank: 0 }
    }).sort((a, b) => b.repos - a.repos)

    const total = ranked.reduce((sum, language) => sum + language.repos, 0)
    ranked.forEach((language, index) => {
      language.share = total > 0 ? language.repos / total : 0
      language.rank = index + 1
    })

    tiers[tier.id] = { id: tier.id, label: tier.label, total, ranked }
  }

  const categories = Object.values(LANGUAGE_CATEGORIES).map((category) => {
    const repos = tiers.all.ranked
      .filter((language) => language.category === category.id)
      .reduce((sum, language) => sum + language.repos, 0)
    return {
      id: category.id,
      label: category.label,
      repos,
      share: tiers.all.total > 0 ? repos / tiers.all.total : 0,
    }
  })

  // Composite score: each tier count × its weight (higher star thresholds
  // count for more). Derived entirely from the counts above — no extra fetches.
  const weighted = LANGUAGE_CATALOG.map((language) => {
    const score = STAR_TIERS.reduce((sum, tier) => {
      const repos = counts.get(`${language.id}:${tier.id}`)
      if (repos === undefined) {
        throw new Error(`Missing ${tier.id} count for ${language.id}`)
      }
      return sum + repos * TIER_WEIGHTS[tier.id]
    }, 0)
    return { ...language, score, rank: 0 }
  }).sort((a, b) => b.score - a.score)

  weighted.forEach((language, index) => {
    language.rank = index + 1
  })

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      window: { from: toDatePart(current.from), to: toDatePart(current.to) },
      languagesTracked: LANGUAGE_CATALOG.length,
    },
    tiers,
    weighted: {
      total: weighted.reduce((sum, language) => sum + language.score, 0),
      ranked: weighted,
    },
    categories,
  }
}

// One fetch per build — module-level top-level await, shared by all pages.
const rankings: Rankings = await fetchRankings().catch((error) => {
  throw new Error(
    `Ranking fetch failed — the site cannot be built without fresh data.\n${error}`
  )
})

/** The fetched rankings (already resolved by the time any page renders). */
export function loadRankings(): Rankings {
  return rankings
}

/** Deep link to the live GitHub search results for the ranking window. */
export function githubSearchUrl(window: RankingsMeta["window"]): string {
  const query = `created:${window.from}..${window.to} fork:false mirror:false`
  return `https://github.com/search?q=${encodeURIComponent(query)}&type=repositories`
}

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
 * 116 requests ≈ 12 minutes at the 10 req/min public limit.
 *
 * `astro dev` re-evaluates this module once per dev-server session, so the
 * first page request after `astro dev` performs a full (~12 minute) fetch.
 * For a quick local look, prefer `astro build && astro preview`.
 */

import { countRepos } from "@/lib/github"
import {
  LANGUAGE_CATALOG,
  LANGUAGE_CATEGORIES,
  type CategoryId,
  type LanguageMeta,
} from "@/lib/languages"
import {
  createdQualifier,
  rollingWindow,
  toDatePart,
  type RollingWindow,
} from "@/lib/window"

/** The four ranking tiers — one GitHub query per tier per language. */
export const STAR_TIERS = [
  { id: "all", label: "All repos", starsQualifier: "" },
  { id: "gt10", label: "Stars > 10", starsQualifier: "stars:>10" },
  { id: "gt50", label: "Stars > 50", starsQualifier: "stars:>50" },
  { id: "gt100", label: "Stars > 100", starsQualifier: "stars:>100" },
] as const

export type TierId = (typeof STAR_TIERS)[number]["id"]

export interface RankingsMeta {
  /** ISO timestamp of when the counts were fetched. */
  generatedAt: string
  window: { from: string; to: string }
  languagesTracked: number
}

export interface RankedLanguage extends LanguageMeta {
  /** Repositories created in the window, within this tier. */
  repos: number
  /** Share of the tier total across all tracked languages. */
  share: number
  /** 1-based position within the tier. */
  rank: number
}

export interface TierRanking {
  id: TierId
  label: string
  /** Sum of the tier across all tracked languages. */
  total: number
  ranked: RankedLanguage[]
}

export interface CategoryShare {
  id: CategoryId
  label: string
  repos: number
  share: number
}

export interface Rankings {
  meta: RankingsMeta
  tiers: Record<TierId, TierRanking>
  /** Share of the year's new repositories (all-repos tier) by family. */
  categories: CategoryShare[]
}

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
      `  languages: ${LANGUAGE_CATALOG.length} × ${STAR_TIERS.length} tiers = ${LANGUAGE_CATALOG.length * STAR_TIERS.length} requests (paced at 10 req/min)`
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

  return {
    meta: {
      generatedAt: new Date().toISOString(),
      window: { from: toDatePart(current.from), to: toDatePart(current.to) },
      languagesTracked: LANGUAGE_CATALOG.length,
    },
    tiers,
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

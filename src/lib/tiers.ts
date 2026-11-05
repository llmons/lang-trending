/**
 * Pure data model shared by the build-time pipeline and the UI.
 *
 * This module MUST stay free of side effects and top-level awaits: it is
 * imported by client-side islands (`ranking-section.tsx`), where its values
 * ship inside the client bundle. The fetch pipeline lives in `data.ts` and
 * must never be imported from client code.
 */

import type { CategoryId, LanguageMeta } from "@/lib/languages"

/**
 * The four ranking tiers — one GitHub query per tier per language.
 * Thresholds are inclusive: `stars:>=100` also matches exactly 100 stars.
 */
export const STAR_TIERS = [
  { id: "all", label: "All repos", starsQualifier: "" },
  { id: "ge10", label: "Stars ≥ 10", starsQualifier: "stars:>=10" },
  { id: "ge50", label: "Stars ≥ 50", starsQualifier: "stars:>=50" },
  { id: "ge100", label: "Stars ≥ 100", starsQualifier: "stars:>=100" },
] as const

export type TierId = (typeof STAR_TIERS)[number]["id"]

/**
 * Weights for the composite "weighted ranking" in Field notes. Higher star
 * thresholds carry more signal, so each tier's count is multiplied by its
 * weight and summed per language. Because the tiers are nested, a repository
 * that cleared every threshold contributes 1 + 2 + 4 + 8 = 15 points, while
 * one below 10 stars contributes 1.
 */
export const TIER_WEIGHTS: Record<TierId, number> = {
  all: 1,
  ge10: 2,
  ge50: 4,
  ge100: 8,
}

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

export interface WeightedLanguage extends LanguageMeta {
  /** Composite score: Σ over tiers of count × tier weight (TIER_WEIGHTS). */
  score: number
  /** 1-based position in the composite ranking. */
  rank: number
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
  /** Composite across the four tiers, weighted by star threshold. */
  weighted: { total: number; ranked: WeightedLanguage[] }
  /** Share of the year's new repositories (all-repos tier) by family. */
  categories: CategoryShare[]
}

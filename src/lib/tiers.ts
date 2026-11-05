/**
 * Pure data model shared by the build-time pipeline and the UI.
 *
 * This module MUST stay free of side effects and top-level awaits: it is
 * imported by client-side islands (`ranking-section.tsx`), where its values
 * ship inside the client bundle. The fetch pipeline lives in `data.ts` and
 * must never be imported from client code.
 */

import type { CategoryId, LanguageMeta } from "@/lib/languages"

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

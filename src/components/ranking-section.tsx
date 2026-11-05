"use client"

import { cn } from "cn"

import RankingTable from "@/components/ranking-table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatFull, formatPercent } from "@/lib/format"
import { STAR_TIERS, type TierId, type TierRanking } from "@/lib/tiers"

function Podium({ tier }: { tier: TierRanking }) {
  return (
    <div className="grid gap-px border border-border bg-border md:grid-cols-3">
      {tier.ranked.slice(0, 3).map((language) => (
        <article
          key={language.id}
          className={cn(
            "bg-background p-8 transition-colors hover:bg-muted/30",
            language.rank === 1 &&
              "border-t-2 border-t-viz-accent pt-10 md:pt-14"
          )}
        >
          <div className="flex items-start justify-between gap-4">
            <p
              className={cn(
                "font-serif text-6xl leading-none tabular-nums md:text-7xl",
                language.rank === 1
                  ? "text-viz-accent"
                  : "text-muted-foreground"
              )}
            >
              {String(language.rank).padStart(2, "0")}
            </p>
            {language.rank === 1 && (
              <Badge className="text-viz-accent">№ 1 — the leader</Badge>
            )}
          </div>

          <div className="mt-6 flex items-center gap-2.5">
            <span
              aria-hidden
              className="size-2.5 rounded-full"
              style={{ backgroundColor: language.color }}
            />
            <h3 className="font-heading text-lg font-semibold tracking-wider uppercase">
              {language.name}
            </h3>
          </div>

          <p className="mt-4 font-serif text-3xl tabular-nums md:text-4xl">
            {formatFull(language.repos)}
          </p>
          <p className="mt-1 text-[0.625rem] font-semibold tracking-widest text-muted-foreground uppercase">
            repositories in this tier
          </p>

          <div className="mt-8 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold tracking-widest text-muted-foreground uppercase">
                Share of the tier
              </span>
              <span className="font-serif text-muted-foreground tabular-nums">
                {formatPercent(language.share)}
              </span>
            </div>
            <div className="h-1.5 bg-muted">
              <div
                className="h-full bg-viz-accent"
                style={{ width: `${Math.max(language.share * 100, 2)}%` }}
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

export default function RankingSection({
  tiers,
}: {
  tiers: Record<TierId, TierRanking>
}) {
  return (
    <Tabs defaultValue="all">
      {/* Sticks below the site header (h-16) while the ranking scrolls, so the
          tier can be switched mid-table without scrolling back to the top. */}
      <div className="sticky top-16 z-40 bg-background">
        <TabsList
          variant="line"
          className="mb-10 w-full gap-8 border-b border-border"
          aria-label="Star threshold"
        >
          {STAR_TIERS.map((tier) => (
            <TabsTrigger key={tier.id} value={tier.id}>
              {tier.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {STAR_TIERS.map((tier) => (
        <TabsContent key={tier.id} value={tier.id} className="space-y-6">
          <Podium tier={tiers[tier.id]} />
          <div className="border border-border">
            <RankingTable tier={tiers[tier.id]} />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}

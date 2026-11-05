import { cn } from "cn"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { TierRanking } from "@/lib/data"
import { formatFull, formatPercent } from "@/lib/format"

export default function RankingTable({ tier }: { tier: TierRanking }) {
  return (
    <Table className="min-w-[640px]">
      <TableHeader>
        <TableRow className="border-border">
          <TableHead className="w-16">№</TableHead>
          <TableHead>Language</TableHead>
          <TableHead className="text-right">Repositories</TableHead>
          <TableHead className="w-56">Share of the tier</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tier.ranked.map((language) => (
          <TableRow key={language.id} className="group/row border-border/60">
            <TableCell
              className={cn(
                "font-serif text-lg tabular-nums transition-colors group-hover/row:text-viz-accent",
                language.rank <= 3 ? "text-viz-accent" : "text-muted-foreground"
              )}
            >
              {String(language.rank).padStart(2, "0")}
            </TableCell>
            <TableCell>
              <span className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: language.color }}
                />
                <span className="font-heading text-sm font-semibold tracking-wider uppercase">
                  {language.name}
                </span>
              </span>
            </TableCell>
            <TableCell className="text-right font-serif text-base tabular-nums">
              {formatFull(language.repos)}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <div className="h-1.5 min-w-12 grow bg-muted">
                  <div
                    className="h-full bg-viz-accent opacity-80 transition-opacity group-hover/row:opacity-100"
                    style={{ width: `${Math.max(language.share * 100, 1.5)}%` }}
                  />
                </div>
                <span className="w-16 text-right font-serif text-sm text-muted-foreground tabular-nums">
                  {formatPercent(language.share)}
                </span>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableCaption>
        Share = each language&apos;s percentage of the &ldquo;{tier.label}
        &rdquo; tier across all tracked languages.
      </TableCaption>
    </Table>
  )
}

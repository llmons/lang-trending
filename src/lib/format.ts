/** Shared number/date formatting for the whole site. */

const compactFormatter = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
})

const fullFormatter = new Intl.NumberFormat("en")

const dateFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "UTC",
})

/** `6234123` → `6.2M` */
export function formatCompact(value: number): string {
  return compactFormatter.format(value)
}

/** `6234123` → `6,234,123` */
export function formatFull(value: number): string {
  return fullFormatter.format(value)
}

/** `2026-11-05` → `Nov 5, 2026` */
export function formatDate(isoDate: string): string {
  return dateFormatter.format(new Date(isoDate))
}

/** ISO timestamp → `Nov 5, 2026, 14:30 UTC`-style date. */
export function formatDateTime(iso: string): string {
  return `${dateTimeFormatter.format(new Date(iso))} UTC`
}

/** `0.6241` → `62.4%` */
export function formatPercent(share: number): string {
  return `${(share * 100).toFixed(1)}%`
}

/**
 * Rolling one-year window computation.
 *
 * Per the project's core principles, the window is always computed at
 * build/run time relative to the current date — never hardcoded.
 */

const DAY_MS = 86_400_000

export interface RollingWindow {
  from: Date
  to: Date
}

/**
 * The trailing one-year window ending today (UTC).
 * `from` and `to` are inclusive on both ends, giving `days` distinct dates.
 */
export function rollingWindow(now = new Date(), days = 365): RollingWindow {
  const to = new Date(now)
  to.setUTCHours(0, 0, 0, 0)
  const from = new Date(to.getTime() - (days - 1) * DAY_MS)
  return { from, to }
}

/** `YYYY-MM-DD` (UTC), the format the GitHub search API expects. */
export function toDatePart(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** GitHub search qualifier, e.g. `created:2025-11-05..2026-11-05`. */
export function createdQualifier(window: RollingWindow): string {
  return `created:${toDatePart(window.from)}..${toDatePart(window.to)}`
}

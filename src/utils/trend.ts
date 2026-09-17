import type { TrendPoint } from '@/data/trends'
import { formatNumber } from '@/utils/formatNumber'

export interface TrendSummary {
  first: TrendPoint
  last: TrendPoint
  /** Highest point of the series; ties resolve to the earlier year */
  peak: TrendPoint
  /** Change from the peak to the last point, in percent, negative when falling */
  changeFromPeakPercent: number
  /** Change from the first to the last point, in percent */
  changeFromFirstPercent: number
}

function percent(from: number, to: number): number {
  return from === 0 ? 0 : ((to - from) / from) * 100
}

/**
 * Needs at least two points. Callers guard with `points.length > 1`, because a
 * single point has no trend and an empty one would make the chart draw NaN.
 */
export function trendSummary(points: readonly TrendPoint[]): TrendSummary | undefined {
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last || points.length < 2) return undefined

  let peak = first
  for (const point of points) {
    if (point.count > peak.count) peak = point
  }

  return {
    first,
    last,
    peak,
    changeFromPeakPercent: percent(peak.count, last.count),
    changeFromFirstPercent: percent(first.count, last.count),
  }
}

/**
 * "−40,5 %" or "+7,0 %", with a real minus sign. Rounds through the project's
 * one de-DE formatter rather than toFixed, which rounds half away from zero.
 * A value that rounds to zero gets no sign, so nothing reads as a change.
 */
export function formatPercent(value: number): string {
  const rounded = formatNumber(Math.abs(value), 1)
  if (rounded === '0') return '0 %'
  const sign = value < 0 ? '−' : '+'
  return `${sign}${rounded} %`
}

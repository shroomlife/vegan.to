import type { TrendPoint } from '@/data/trends'

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
 * Adds several series year by year, keeping only the years present in every
 * one of them. Summing a year that one species is missing would draw a cliff
 * that never happened: poultry starts in 2010, the land animals in 1993.
 */
export function sumSeries(seriesList: readonly (readonly TrendPoint[])[]): TrendPoint[] {
  const [head, ...rest] = seriesList
  if (!head) return []

  const shared = new Set(head.map((point) => point.year))
  for (const series of rest) {
    const years = new Set(series.map((point) => point.year))
    for (const year of [...shared]) {
      if (!years.has(year)) shared.delete(year)
    }
  }

  return [...shared]
    .sort((a, b) => a - b)
    .map((year) => ({
      year,
      count: seriesList.reduce(
        (total, series) => total + (series.find((point) => point.year === year)?.count ?? 0),
        0,
      ),
    }))
}

/** "−40,5 %" or "+7,0 %", with a real minus sign and a German decimal comma */
export function formatPercent(value: number): string {
  const sign = value < 0 ? '−' : '+'
  return `${sign}${Math.abs(value).toFixed(1).replace('.', ',')} %`
}

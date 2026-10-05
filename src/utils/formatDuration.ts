/**
 * German elapsed time, e.g. "3 Minuten, 12 Sekunden". Largest unit first,
 * zero units left out, the smallest shown unit rounded (and carried into the
 * next larger one when it rounds up to a full unit), so the text never shows
 * fractions and never jumps from "59 Sekunden" to "1 Minute, 0 Sekunden".
 */
interface DurationUnit {
  ms: number
  singular: string
  plural: string
}

const UNITS: readonly DurationUnit[] = [
  { ms: 31_557_600_000, singular: 'Jahr', plural: 'Jahre' },
  { ms: 86_400_000, singular: 'Tag', plural: 'Tage' },
  { ms: 3_600_000, singular: 'Stunde', plural: 'Stunden' },
  { ms: 60_000, singular: 'Minute', plural: 'Minuten' },
  { ms: 1_000, singular: 'Sekunde', plural: 'Sekunden' },
]

const SEPARATOR = ', '

function label(count: number, unit: DurationUnit): string {
  return `${count} ${count === 1 ? unit.singular : unit.plural}`
}

export function formatDuration(ms: number): string {
  const counts: number[] = []
  let remaining = Math.max(0, ms)
  UNITS.forEach((unit, index) => {
    const isSmallest = index === UNITS.length - 1
    const count = isSmallest ? remaining / unit.ms : Math.floor(remaining / unit.ms)
    counts.push(count)
    remaining -= count * unit.ms
  })

  // Round the smallest unit; a full carry bubbles up ("59.6 Sekunden" -> next minute)
  for (let index = UNITS.length - 1; index >= 0; index--) {
    const count = counts[index] ?? 0
    if (count === 0) continue
    const rounded = Math.round(count)
    counts[index] = rounded
    if (index === 0) break
    const larger = UNITS[index - 1]
    const current = UNITS[index]
    if (!larger || !current) break
    const carry = Math.floor((rounded * current.ms) / larger.ms)
    if (carry === 0) break
    counts[index - 1] = (counts[index - 1] ?? 0) + carry
    counts[index] = 0
  }

  const pieces = UNITS.flatMap((unit, index) => {
    const count = counts[index] ?? 0
    return count > 0 ? [label(count, unit)] : []
  })

  const smallest = UNITS[UNITS.length - 1]
  if (pieces.length === 0 && smallest) return label(0, smallest)
  return pieces.join(SEPARATOR)
}

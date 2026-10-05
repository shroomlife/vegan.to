/**
 * The statistics describe Germany, so "heute" and "dieses Jahr" follow German
 * time, not the visitor's clock. Everything here is derived from
 * Intl.DateTimeFormat, which knows the Berlin summer time rules, so the result
 * is the same whatever timezone the host runs in.
 */
export const BERLIN_TIME_ZONE = 'Europe/Berlin'

export interface BerlinParts {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
}

type PartName = keyof BerlinParts

/** en-CA writes numeric dates as YYYY-MM-DD; with h23 midnight reads 00, never 24 */
const berlinFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: BERLIN_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
})

function isPartName(type: string): type is PartName {
  return type === 'year' || type === 'month' || type === 'day' || type === 'hour' || type === 'minute' || type === 'second'
}

/** The Berlin wall clock reading for an instant */
export function berlinParts(date: Date): BerlinParts {
  const parts: BerlinParts = { year: 0, month: 0, day: 0, hour: 0, minute: 0, second: 0 }
  for (const part of berlinFormatter.formatToParts(date)) {
    if (isPartName(part.type)) parts[part.type] = Number(part.value)
  }
  return parts
}

/** Berlin's offset from UTC in ms at this instant: 1 h in winter, 2 h in summer */
function berlinOffsetMs(date: Date): number {
  const wall = berlinParts(date)
  const asUtc = Date.UTC(wall.year, wall.month - 1, wall.day, wall.hour, wall.minute, wall.second)
  return asUtc - (date.getTime() - date.getMilliseconds())
}

/**
 * The instant at which Berlin's clock shows midnight of the given date.
 *
 * Deriving the calendar through the HOST's timezone (as a plain new Date()
 * would) gave a visitor in New York a Berlin midnight that was an hour out on
 * the days either zone switches to or from summer time. Here the wall time is
 * read back through Berlin's own offset instead. The offset is taken at a
 * first guess and once more at the guess itself: on a switch day the offset at
 * midnight differs from the offset at noon, and the second pass lands on the
 * right one. Berlin switches at 02:00/03:00, so midnight always exists once.
 */
function berlinMidnight(year: number, month: number, day: number): Date {
  const wallAsUtc = Date.UTC(year, month - 1, day)
  const guess = new Date(wallAsUtc - berlinOffsetMs(new Date(wallAsUtc)))
  return new Date(wallAsUtc - berlinOffsetMs(guess))
}

/** Start of the current Berlin day */
export function startOfBerlinDay(date: Date): Date {
  const { year, month, day } = berlinParts(date)
  return berlinMidnight(year, month, day)
}

/** Start of the current Berlin year */
export function startOfBerlinYear(date: Date): Date {
  return berlinMidnight(berlinParts(date).year, 1, 1)
}

/** 365 or 366, so a yearly figure spread over the year lands exactly on Dec 31 */
export function daysInBerlinYear(date: Date): number {
  const { year } = berlinParts(date)
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
  return isLeap ? 366 : 365
}

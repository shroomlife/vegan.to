import { test, expect } from '@playwright/test'
import { berlinParts, startOfBerlinDay, startOfBerlinYear, daysInBerlinYear } from '../src/utils/berlinTime'
import { formatDuration } from '../src/utils/formatDuration'
import { localIsoDate } from '../src/utils/isoDate'

/**
 * Fixtures for the pure time helpers behind the live counters. Berlin switches
 * to summer time on the last Sunday of March and back on the last Sunday of
 * October, both at 01:00 UTC; in 2026 that is March 29 and October 25.
 */
test.describe('Berlin time helpers', () => {
  test('wall clock parts, including the summer time switch minute', () => {
    expect(berlinParts(new Date('2026-03-29T00:59:59Z'))).toEqual({ year: 2026, month: 3, day: 29, hour: 1, minute: 59, second: 59 })
    expect(berlinParts(new Date('2026-03-29T01:00:00Z'))).toEqual({ year: 2026, month: 3, day: 29, hour: 3, minute: 0, second: 0 })
    expect(berlinParts(new Date('2026-10-25T01:00:00Z'))).toEqual({ year: 2026, month: 10, day: 25, hour: 2, minute: 0, second: 0 })
    // midnight reads 00, not 24
    expect(berlinParts(new Date('2026-06-30T22:00:00Z'))).toEqual({ year: 2026, month: 7, day: 1, hour: 0, minute: 0, second: 0 })
  })

  test('start of day is Berlin midnight, also on the switch days', () => {
    expect(startOfBerlinDay(new Date('2026-01-15T12:00:00Z')).toISOString()).toBe('2026-01-14T23:00:00.000Z')
    expect(startOfBerlinDay(new Date('2026-07-01T12:00:00Z')).toISOString()).toBe('2026-06-30T22:00:00.000Z')
    // March 29: noon is CEST, midnight was still CET
    expect(startOfBerlinDay(new Date('2026-03-29T10:00:00Z')).toISOString()).toBe('2026-03-28T23:00:00.000Z')
    // October 25: noon is CET, midnight was still CEST
    expect(startOfBerlinDay(new Date('2026-10-25T12:00:00Z')).toISOString()).toBe('2026-10-24T22:00:00.000Z')
    // the first seconds of a Berlin day belong to it
    expect(startOfBerlinDay(new Date('2026-03-28T23:00:00Z')).toISOString()).toBe('2026-03-28T23:00:00.000Z')
    expect(startOfBerlinDay(new Date('2026-03-28T22:59:59Z')).toISOString()).toBe('2026-03-27T23:00:00.000Z')
  })

  test('start of year and its length follow the Berlin calendar', () => {
    // 23:30 UTC on New Year's Eve is already January 1 in Berlin
    expect(startOfBerlinYear(new Date('2025-12-31T23:30:00Z')).toISOString()).toBe('2025-12-31T23:00:00.000Z')
    expect(startOfBerlinYear(new Date('2025-12-31T22:59:59Z')).toISOString()).toBe('2024-12-31T23:00:00.000Z')
    expect(startOfBerlinYear(new Date('2026-08-01T00:00:00Z')).toISOString()).toBe('2025-12-31T23:00:00.000Z')
    expect(daysInBerlinYear(new Date('2026-06-01T00:00:00Z'))).toBe(365)
    expect(daysInBerlinYear(new Date('2024-06-01T00:00:00Z'))).toBe(366)
    expect(daysInBerlinYear(new Date('2028-06-01T00:00:00Z'))).toBe(366)
    expect(daysInBerlinYear(new Date('2100-06-01T00:00:00Z'))).toBe(365)
  })
})

test.describe('formatDuration', () => {
  test('German units, largest first, zero units left out', () => {
    expect(formatDuration(0)).toBe('0 Sekunden')
    expect(formatDuration(1000)).toBe('1 Sekunde')
    expect(formatDuration(192_000)).toBe('3 Minuten, 12 Sekunden')
    expect(formatDuration(3_725_000)).toBe('1 Stunde, 2 Minuten, 5 Sekunden')
    expect(formatDuration(3_600_000)).toBe('1 Stunde')
    expect(formatDuration(90_061_000)).toBe('1 Tag, 1 Stunde, 1 Minute, 1 Sekunde')
    expect(formatDuration(31_557_600_000)).toBe('1 Jahr')
  })

  test('rounds the smallest unit and carries a full unit upwards', () => {
    expect(formatDuration(499)).toBe('0 Sekunden')
    expect(formatDuration(500)).toBe('1 Sekunde')
    expect(formatDuration(59_499)).toBe('59 Sekunden')
    expect(formatDuration(59_500)).toBe('1 Minute')
    expect(formatDuration(3_599_500)).toBe('1 Stunde')
    expect(formatDuration(86_399_500)).toBe('1 Tag')
  })
})

test.describe('localIsoDate', () => {
  test('pads month and day', () => {
    expect(localIsoDate(new Date(2026, 0, 5))).toBe('2026-01-05')
    expect(localIsoDate(new Date(2026, 11, 31))).toBe('2026-12-31')
  })
})

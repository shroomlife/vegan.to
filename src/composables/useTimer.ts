import { ref, computed, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import humanizeDuration from 'humanize-duration'

dayjs.extend(utc)
dayjs.extend(timezone)

/** The statistics describe Germany, so "heute" and "dieses Jahr" follow German time, not the visitor's clock */
const TIME_ZONE = 'Europe/Berlin'
const SECONDS_PER_DAY = 86_400

export function useTimer() {
  const started = dayjs()
  const now = ref(dayjs())

  const intervalId = setInterval(() => {
    now.value = dayjs()
  }, 1000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  const nowBerlin = computed(() => now.value.tz(TIME_ZONE))

  const elapsedMs = computed(() => now.value.diff(started))

  const secondsSinceStart = computed(() => elapsedMs.value / 1000)

  const elapsedFormatted = computed(() =>
    humanizeDuration(elapsedMs.value, {
      language: 'de',
      fallbacks: ['en'],
      round: true,
    }),
  )

  /**
   * startOf() on a .tz() instance re-derives the calendar through the HOST's
   * timezone, so a visitor in New York got a Berlin midnight that was an hour
   * out on the days either zone switches to or from summer time. dayjs.tz()
   * parses the string AS Berlin wall time, which is host independent.
   */
  const berlinStartOf = (unit: 'year' | 'day') =>
    dayjs.tz(nowBerlin.value.format(unit === 'year' ? 'YYYY-01-01' : 'YYYY-MM-DD'), TIME_ZONE)

  const secondsSinceYearStart = computed(() =>
    now.value.diff(berlinStartOf('year'), 'second', true),
  )

  const secondsSinceDayStart = computed(() =>
    now.value.diff(berlinStartOf('day'), 'second', true),
  )

  /** 365 or 366, so a yearly figure spread over the year lands exactly on Dec 31 */
  const daysInCurrentYear = computed(() =>
    dayjs.tz(nowBerlin.value.format('YYYY-12-31'), TIME_ZONE).diff(berlinStartOf('year'), 'day') + 1,
  )

  const secondsInCurrentYear = computed(() => daysInCurrentYear.value * SECONDS_PER_DAY)

  return {
    now,
    started,
    secondsSinceStart,
    elapsedFormatted,
    secondsSinceYearStart,
    secondsSinceDayStart,
    daysInCurrentYear,
    secondsInCurrentYear,
  }
}

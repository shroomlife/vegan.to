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

  const secondsSinceYearStart = computed(() =>
    nowBerlin.value.diff(nowBerlin.value.startOf('year'), 'second', true),
  )

  const secondsSinceDayStart = computed(() =>
    nowBerlin.value.diff(nowBerlin.value.startOf('day'), 'second', true),
  )

  /** 365 or 366, so a yearly figure spread over the year lands exactly on Dec 31 */
  const daysInCurrentYear = computed(() =>
    nowBerlin.value.endOf('year').diff(nowBerlin.value.startOf('year'), 'day') + 1,
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

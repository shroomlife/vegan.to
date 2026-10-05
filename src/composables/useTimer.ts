import { ref, computed, onUnmounted } from 'vue'
import { startOfBerlinDay, startOfBerlinYear, daysInBerlinYear } from '@/utils/berlinTime'
import { formatDuration } from '@/utils/formatDuration'

const SECONDS_PER_DAY = 86_400

export function useTimer() {
  const started = new Date()
  const now = ref(new Date())

  const intervalId = setInterval(() => {
    now.value = new Date()
  }, 1000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  const elapsedMs = computed(() => now.value.getTime() - started.getTime())

  const secondsSinceStart = computed(() => elapsedMs.value / 1000)

  const elapsedFormatted = computed(() => formatDuration(elapsedMs.value))

  /** The statistics describe Germany, so "heute" and "dieses Jahr" follow Berlin time, not the visitor's clock */
  const secondsSinceYearStart = computed(() =>
    (now.value.getTime() - startOfBerlinYear(now.value).getTime()) / 1000,
  )

  const secondsSinceDayStart = computed(() =>
    (now.value.getTime() - startOfBerlinDay(now.value).getTime()) / 1000,
  )

  /** 365 or 366, so a yearly figure spread over the year lands exactly on Dec 31 */
  const daysInCurrentYear = computed(() => daysInBerlinYear(now.value))

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

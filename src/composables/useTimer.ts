import { ref, computed, onUnmounted } from 'vue'
import dayjs from 'dayjs'
import humanizeDuration from 'humanize-duration'

export function useTimer() {
  const started = dayjs()
  const now = ref(dayjs())

  const intervalId = setInterval(() => {
    now.value = dayjs()
  }, 1000)

  onUnmounted(() => {
    clearInterval(intervalId)
  })

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
    Math.abs(dayjs().startOf('year').diff(now.value) / 1000),
  )

  const secondsSinceDayStart = computed(() =>
    Math.abs(dayjs().startOf('day').diff(now.value) / 1000),
  )

  return {
    now,
    started,
    secondsSinceStart,
    elapsedFormatted,
    secondsSinceYearStart,
    secondsSinceDayStart,
  }
}

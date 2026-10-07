import { ref, computed, watch } from 'vue'

/** Read by the Datenschutzerklärung, which names every key the site stores */
export const TRACKER_STORAGE_KEY = 'vegan-to-since'

function loadDate(): string | null {
  try {
    return localStorage.getItem(TRACKER_STORAGE_KEY)
  } catch {
    return null
  }
}

function saveDate(date: string | null) {
  try {
    if (date) {
      localStorage.setItem(TRACKER_STORAGE_KEY, date)
    } else {
      localStorage.removeItem(TRACKER_STORAGE_KEY)
    }
  } catch {
    // LocalStorage not available (private mode, etc.)
  }
}

/**
 * A number of days in dative case, as it reads after "seit" or "in"
 * ("2 Jahren", "1 Monat", "5 Tagen"); zero days are "heute".
 */
export function formatDurationDative(days: number): string {
  if (days === 0) return 'heute'
  const years = Math.floor(days / 365)
  const months = Math.floor((days % 365) / 30)
  const remainingDays = (days % 365) % 30
  const parts: string[] = []
  if (years > 0) parts.push(`${years} ${years === 1 ? 'Jahr' : 'Jahren'}`)
  if (months > 0) parts.push(`${months} ${months === 1 ? 'Monat' : 'Monaten'}`)
  if (remainingDays > 0 && years === 0) parts.push(`${remainingDays} ${remainingDays === 1 ? 'Tag' : 'Tagen'}`)
  return parts.join(', ')
}

export function usePersonalTracker() {
  const stored = loadDate()
  const veganSince = ref(stored ?? '')
  const isSet = computed(() => veganSince.value.length > 0)

  const daysSinceVegan = computed(() => {
    if (!veganSince.value) return 0
    const start = new Date(veganSince.value)
    if (isNaN(start.getTime())) return 0
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)))
  })

  /** "seit 2 Jahren", "seit 1 Monat", "seit 5 Tagen", "seit heute" */
  const formattedDuration = computed(() => formatDurationDative(daysSinceVegan.value))

  watch(veganSince, (val) => {
    saveDate(val || null)
  })

  function clear() {
    veganSince.value = ''
  }

  return {
    veganSince,
    isSet,
    daysSinceVegan,
    formattedDuration,
    clear,
  }
}

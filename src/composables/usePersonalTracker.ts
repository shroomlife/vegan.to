import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'vegan-to-since'

function loadDate(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

function saveDate(date: string | null) {
  try {
    if (date) {
      localStorage.setItem(STORAGE_KEY, date)
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // LocalStorage not available (private mode, etc.)
  }
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

  /**
   * Duration in dative case, because it is always used after "seit"
   * ("seit 2 Jahren", "seit 1 Monat", "seit 5 Tagen").
   */
  const formattedDuration = computed(() => {
    const days = daysSinceVegan.value
    if (days === 0) return 'heute'
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    const remainingDays = (days % 365) % 30
    const parts: string[] = []
    if (years > 0) parts.push(`${years} ${years === 1 ? 'Jahr' : 'Jahren'}`)
    if (months > 0) parts.push(`${months} ${months === 1 ? 'Monat' : 'Monaten'}`)
    if (remainingDays > 0 && years === 0) parts.push(`${remainingDays} ${remainingDays === 1 ? 'Tag' : 'Tagen'}`)
    return parts.join(', ')
  })

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

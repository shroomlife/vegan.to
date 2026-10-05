import { computed, readonly, ref } from 'vue'
import { CONSENT_STORAGE_KEY, isConsentChoice, type ConsentChoice } from '@/utils/consentStorage'
import { disableAnalytics, enableAnalytics } from '@/utils/analytics'

function loadChoice(): ConsentChoice | null {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    return isConsentChoice(stored) ? stored : null
  } catch {
    // Storage blocked (private mode, strict settings): ask again next time
    return null
  }
}

function saveChoice(choice: ConsentChoice): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, choice)
  } catch {
    // Choice still applies for this visit
  }
}

// One state for the whole app: banner, footer link and analytics share it
const choice = ref<ConsentChoice | null>(loadChoice())
const settingsOpen = ref(false)

/** Called once at start-up: a visitor who agreed earlier is measured again */
export function applyStoredConsent(): void {
  if (choice.value === 'granted') enableAnalytics()
}

export function useConsent() {
  const bannerVisible = computed(() => choice.value === null || settingsOpen.value)

  function decide(next: ConsentChoice): void {
    choice.value = next
    settingsOpen.value = false
    saveChoice(next)
    document.documentElement.setAttribute('data-consent', 'decided')
    if (next === 'granted') enableAnalytics()
    else disableAnalytics()
  }

  function openSettings(): void {
    settingsOpen.value = true
    // The head script in index.html hides the banner for decided visitors; opening the settings lifts that
    document.documentElement.removeAttribute('data-consent')
  }

  return { choice: readonly(choice), bannerVisible, decide, openSettings }
}

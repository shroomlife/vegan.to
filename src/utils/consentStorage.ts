/**
 * Where the visitor's analytics choice is kept. No imports on purpose: the
 * prerender script and the Playwright config read this key outside the app.
 */
/** Also written as a literal in the head script of index.html, which runs before any module loads */
export const CONSENT_STORAGE_KEY = 'vegan-to-consent'

export type ConsentChoice = 'granted' | 'denied'

export function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === 'granted' || value === 'denied'
}

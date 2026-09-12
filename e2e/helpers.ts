import type { Page } from '@playwright/test'

/** Parses a de-DE formatted integer like "1.234.567" or "≈ 1.234" */
export function parseDeNumber(text: string): number {
  const digits = text.replace(/[^\d]/g, '')
  return digits.length ? Number.parseInt(digits, 10) : Number.NaN
}

/** Collects console errors and page errors for the lifetime of the page */
export function collectErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console: ${msg.text()}`)
  })
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`))
  return errors
}

/** Scrolls through the whole page so every whileInView animation has fired */
export async function scrollThroughPage(page: Page): Promise<void> {
  await page.evaluate(async () => {
    const step = Math.max(300, window.innerHeight * 0.6)
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo(0, y)
      await new Promise((resolve) => setTimeout(resolve, 60))
    }
    window.scrollTo(0, 0)
  })
}

import { test, expect } from '@playwright/test'
import { scrollThroughPage } from './helpers'

const WIDTHS = [320, 375, 414, 768, 1024, 1440, 1920]

const KEY_SECTIONS = [
  '.hero-counter',
  '.animal-card',
  '.growth-progress',
  '.timeline',
  '.impact-card',
  '.why-how-card',
  '.cta-button',
  '.site-footer',
  '.site-header',
]

test.describe('responsive layout', () => {
  // The viewport sweep is device independent, so it runs on the desktop project only.
  test.skip(({ isMobile }) => isMobile, 'sweep runs on the desktop project only')

  for (const width of WIDTHS) {
    test(`no overflow and key sections visible at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await scrollThroughPage(page)
      await page.waitForTimeout(800)

      const { scrollWidth, innerWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
      }))
      expect(scrollWidth, 'horizontal overflow').toBeLessThanOrEqual(innerWidth)

      for (const selector of KEY_SECTIONS) {
        const el = page.locator(selector).first()
        await el.scrollIntoViewIfNeeded()
        await expect(el, selector).toBeVisible()
        const box = await el.boundingBox()
        expect(box, selector).not.toBeNull()
        if (!box) continue
        expect(box.x, `${selector} left edge`).toBeGreaterThanOrEqual(0)
        expect(box.x + box.width, `${selector} right edge`).toBeLessThanOrEqual(width + 1)
      }
    })
  }
})

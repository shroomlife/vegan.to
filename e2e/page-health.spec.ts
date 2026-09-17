import { test, expect } from '@playwright/test'
import { collectErrors, scrollThroughPage } from './helpers'

test.describe('page health', () => {
  test('loads without console or page errors', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await expect(page).toHaveTitle(/Live-Zähler/)
    await scrollThroughPage(page)
    await page.waitForTimeout(1500)
    expect(errors).toEqual([])
  })

  // The start page loads its view eagerly, every other route is a lazy chunk, so
  // only these caught the prerendered preload urls that pointed at 127.0.0.1
  test('no route asks the visitor for a resource that cannot exist', async ({ browser }) => {
    for (const path of ['/', '/tiere', '/tiere/rinder', '/quellen', '/gibt-es-nicht']) {
      // A fresh context per path: on a shared page the next goto aborts the
      // previous page's in-flight requests and those land in the wrong array
      const context = await browser.newContext()
      const page = await context.newPage()
      const errors = collectErrors(page)
      const failed: string[] = []
      page.on('requestfailed', (request) => failed.push(request.url()))
      await page.goto(path)
      await page.waitForTimeout(1200)
      expect(errors, path).toEqual([])
      expect(failed, path).toEqual([])
      await context.close()
    }
  })

  test('every image is loaded and has alt text', async ({ page }) => {
    await page.goto('/')
    const images = await page.locator('img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).map((img) => ({
        src: img.currentSrc,
        alt: img.alt,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
      })),
    )
    for (const img of images) {
      expect(img.alt, img.src).not.toBe('')
      expect(img.complete, img.src).toBe(true)
      expect(img.naturalWidth, img.src).toBeGreaterThan(0)
    }
  })

  test('icons, manifest and PWA files respond', async ({ page, request }) => {
    await page.goto('/')
    const hrefs = await page
      .locator('link[rel*="icon"], link[rel="manifest"]')
      .evaluateAll((links) => links.map((link) => link.getAttribute('href') ?? ''))
    const urls = [...new Set([...hrefs, '/manifest.json', '/sw.js', '/robots.txt', '/sitemap.xml', '/img/icon.png'])]
    for (const url of urls) {
      const res = await request.get(url)
      expect(res.status(), url).toBe(200)
    }
  })

  test('chart axis labels are readable against their section', async ({ page }) => {
    await page.goto('/')
    await page.locator('.timeline').scrollIntoViewIfNeeded()
    const ratio = await page.evaluate(() => {
      const label = document.querySelector('.timeline-axis-label')
      const section = document.querySelector('.growth-section')
      if (!label || !section) return 0
      const channels = (colour: string): number[] =>
        (colour.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number)
      const luminance = (colour: string): number => {
        const [r = 0, g = 0, b = 0] = channels(colour)
        const lin = (v: number): number => {
          const c = v / 255
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        }
        return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
      }
      const a = luminance(getComputedStyle(label).color)
      const b = luminance(getComputedStyle(section).backgroundColor)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    })
    // WCAG AA for small text. The labels were white on cream once, at 1.13
    expect(ratio).toBeGreaterThanOrEqual(4.5)
  })

  test('has no horizontal overflow', async ({ page }) => {
    await page.goto('/')
    await scrollThroughPage(page)
    const { scrollWidth, innerWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }))
    expect(scrollWidth).toBeLessThanOrEqual(innerWidth)
  })
})

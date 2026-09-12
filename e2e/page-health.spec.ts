import { test, expect } from '@playwright/test'
import { collectErrors, scrollThroughPage } from './helpers'

test.describe('page health', () => {
  test('loads without console or page errors', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/')
    await expect(page).toHaveTitle(/Echtzeit-Zähler/)
    await scrollThroughPage(page)
    await page.waitForTimeout(1500)
    expect(errors).toEqual([])
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

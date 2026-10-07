import { test, expect } from '@playwright/test'
import { collectErrors } from './helpers'

test.describe('zeitreise', () => {
  test('the counter runs from 1961 to 2024 while scrolling and nothing overflows', async ({ page }) => {
    const errors = collectErrors(page)
    await page.goto('/zeitreise')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('.prolog-year')).toHaveText('1961')

    await expect(page.locator('.prolog-value')).toHaveText('8,36 Mrd.')

    // Part of the way through the prolog track the year has moved on. On a wide screen the
    // scene is pinned for the whole track, on a phone it runs while the section scrolls by
    await page.evaluate(() => {
      const track = document.getElementById('prolog')
      if (!track) throw new Error('prolog track missing')
      const pinned = track.offsetHeight > window.innerHeight * 1.5
      window.scrollTo(0, pinned ? track.offsetHeight * 0.4 : track.offsetHeight * 0.2)
    })
    await page.waitForTimeout(300)
    const midYear = Number(await page.locator('.prolog-year').innerText())
    expect(midYear).toBeGreaterThan(1961)
    expect(midYear).toBeLessThan(2024)

    await page.evaluate(() => {
      const track = document.getElementById('prolog')
      window.scrollTo(0, track ? track.offsetHeight : 0)
    })
    await page.waitForTimeout(300)
    await expect(page.locator('.prolog-year')).toHaveText('2024')
    await expect(page.locator('.prolog-value')).toHaveText('87,90 Mrd.')

    // Scroll everything so every scene and lazy image has run once
    await page.evaluate(async () => {
      const step = Math.max(300, window.innerHeight * 0.5)
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 40))
      }
    })
    await page.waitForTimeout(500)
    await expect(page.locator('.countdown-number')).toHaveText('0')

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
    expect(overflow).toBeLessThanOrEqual(1)
    expect(errors).toEqual([])
  })

  test('every picture of the journey loads and names what it shows', async ({ page }) => {
    await page.goto('/zeitreise')
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y)
        await new Promise((resolve) => setTimeout(resolve, 60))
      }
    })
    await page.waitForTimeout(800)
    const images = await page.locator('.journey img').evaluateAll((imgs) =>
      (imgs as HTMLImageElement[]).map((img) => ({
        src: img.currentSrc,
        alt: img.alt,
        decorative: img.closest('[aria-hidden="true"]') !== null,
        ok: img.complete && img.naturalWidth > 0,
      })),
    )
    expect(images.length).toBeGreaterThan(8)
    for (const img of images) {
      // A purely decorative picture sits inside an aria-hidden figure and carries an empty alt on purpose
      if (!img.decorative) expect(img.alt, img.src).not.toBe('')
      expect(img.ok, img.src).toBe(true)
    }
  })

  test('the chapter list reaches every act', async ({ page }) => {
    await page.goto('/zeitreise')
    const links = await page.locator('.journey-acts a').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href') ?? ''))
    expect(links.length).toBeGreaterThan(5)
    for (const href of links) {
      await expect(page.locator(href)).toHaveCount(1)
    }
  })
})

test.describe('zeitreise cage', () => {
  test('the hen square covers the share of the A4 sheet that 450 cm² really are', async ({ page }) => {
    await page.goto('/zeitreise')
    // The track's bottom edge at 40 % of the viewport: progress is 1 whether the scene is pinned or in the flow
    await page.evaluate(() => {
      const track = document.getElementById('akt-3')
      if (!track) throw new Error('cage track missing')
      window.scrollTo(0, track.offsetTop + track.offsetHeight - window.innerHeight * 0.4)
    })
    await page.waitForTimeout(500)
    const sheet = await page.locator('.cage-a4:not(.cage-a4--blank)').boundingBox()
    const hen = await page.locator('.cage-hen').boundingBox()
    if (!sheet || !hen) throw new Error('cage art not rendered')
    const share = (hen.width * hen.height) / (sheet.width * sheet.height)
    expect(share).toBeGreaterThan(450 / (21 * 29.7) - 0.02)
    expect(share).toBeLessThan(450 / (21 * 29.7) + 0.02)
  })
})

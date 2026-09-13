import { test, expect } from '@playwright/test'

test.describe('editorial chapters', () => {
  test('chapters are numbered in reading order', async ({ page }) => {
    await page.goto('/')
    const kickers = await page.locator('.chapter').allInnerTexts()
    // innerText is upper-cased by CSS, so match case-insensitively
    const numbers = kickers.map((text) => Number(/kapitel (\d+)/i.exec(text)?.[1]))
    expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  test('every species fact and every condition names a linked source', async ({ page }) => {
    await page.goto('/')
    const facts = page.locator('.species-fact')
    await expect(facts).toHaveCount(10)
    for (const card of await facts.all()) {
      await expect(card.locator('.source-links a').first()).toHaveAttribute('href', /^https?:\/\//)
    }
    const conditions = page.locator('.life-fact')
    await expect(conditions).toHaveCount(9)
    for (const card of await conditions.all()) {
      await expect(card.locator('.source-links a').first()).toHaveAttribute('href', /^https?:\/\//)
    }
  })

  test('the questions open, answer and cite', async ({ page }) => {
    await page.goto('/')
    const first = page.locator('.faq-item').first()
    await first.scrollIntoViewIfNeeded()
    await expect(first.locator('.faq-answer')).toBeHidden()
    await first.locator('summary').click()
    await expect(first.locator('.faq-answer p').first()).toBeVisible()
    await expect(first.locator('.source-links a').first()).toHaveAttribute('href', /^https?:\/\//)
  })

  test('the live sentence names the newest card', async ({ page }) => {
    await page.goto('/')
    const name = (await page.locator('.live-name').innerText()).trim()
    expect(name.length).toBeGreaterThan(1)
    await expect(page.locator('.recent-grid .victim-card').first().locator('.victim-card-name')).toHaveText(name)
  })

  test('the counter pill follows once the hero has scrolled away', async ({ page, isMobile }) => {
    await page.goto('/')
    await expect(page.locator('.counter-pill')).toHaveCount(0)
    await page.locator('#zahlen').scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, 400))
    const pill = page.locator(isMobile ? '.mobile-pill .counter-pill' : '.site-header .counter-pill')
    await expect(pill).toBeVisible()
    await expect(pill).toContainText('seit du hier bist')
  })
})

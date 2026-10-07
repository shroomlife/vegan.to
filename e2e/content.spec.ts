import { test, expect, type Locator, type Page } from '@playwright/test'

/** The card cites by number, and the number leads to a list entry with the real link */
async function expectCitation(page: Page, card: Locator): Promise<void> {
  const note = card.locator('.source-note').first()
  await expect(note).toHaveAttribute('href', /^#quelle-\d+$/)
  const anchor = (await note.getAttribute('href')) ?? ''
  await expect(page.locator(anchor).locator('a[href^="https://"]')).toHaveCount(1)
}

test.describe('editorial chapters', () => {
  test('the chapters follow the story in reading order', async ({ page }) => {
    await page.goto('/')
    // textContent, not innerText: chapters below the fold use content-visibility and are not rendered yet
    const kickers = (await page.locator('.chapter').allTextContents()).map((text) => text.trim())
    expect(kickers).toEqual([
      'Wer sie waren',
      'Wie viele',
      'Wer sie sind',
      'Wie sie lebten',
      'Wie es dazu kam',
      'Die anderen',
      'Was du bewirkst',
      'Die Fragen davor',
      'Mach mit',
      'Quellen',
    ])
  })

  test('every species fact and every condition cites a source by number', async ({ page }) => {
    await page.goto('/')
    const facts = page.locator('.species-fact')
    await expect(facts).toHaveCount(10)
    for (const card of await facts.all()) {
      await expectCitation(page, card)
    }
    const conditions = page.locator('.life-fact')
    await expect(conditions).toHaveCount(9)
    for (const card of await conditions.all()) {
      await expectCitation(page, card)
    }
  })

  test('a number in the text opens and highlights its source in the list', async ({ page }) => {
    await page.goto('/')
    const first = page.locator('.species-fact').first()
    await first.scrollIntoViewIfNeeded()
    const note = first.locator('.source-note').first()
    const anchor = (await note.getAttribute('href')) ?? ''
    await note.click()
    const item = page.locator(anchor)
    await expect(item).toBeInViewport()
    await expect(item.locator('details')).toHaveAttribute('open', '')
    await expect(item).toHaveClass(/source-list-item--target/)
    await expect(item.locator('a[href^="https://"]')).toHaveCount(1)
    // one source, one number: the list holds no duplicates
    const labels = await page.locator('.source-list-label').allInnerTexts()
    expect(new Set(labels).size).toBe(labels.length)
    await expect(page.locator('.source-list .chapter-lead')).toContainText(`${labels.length} Quellen`)
  })

  test('the questions open, answer and cite', async ({ page }) => {
    await page.goto('/')
    const first = page.locator('.faq-item').first()
    await first.scrollIntoViewIfNeeded()
    await expect(first.locator('.faq-answer')).toBeHidden()
    await first.locator('summary').click()
    await expect(first.locator('.faq-answer p').first()).toBeVisible()
    await expectCitation(page, first)
  })

  test('the live sentence names the newest card', async ({ page }) => {
    await page.goto('/')
    const name = (await page.locator('.live-name').innerText()).trim()
    expect(name.length).toBeGreaterThan(1)
    await expect(page.locator('.recent-list .victim-card').first().locator('.victim-card-name')).toHaveText(name)
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

import { test, expect } from '@playwright/test'

test.describe('outbound links and sources', () => {
  test('the three core question cards link to the partner domains', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.why-how-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(0)).toHaveAttribute('href', 'https://warum-vegan.com/')
    await expect(cards.nth(1)).toHaveAttribute('href', 'https://wie-vegan.com/')
    await expect(cards.nth(2)).toHaveAttribute('href', 'https://vegan-community.de/')
  })

  test('every external link opens safely in a new tab', async ({ page }) => {
    await page.goto('/')
    const external = page.locator('a[href^="http"]:not([href^="https://vegan.to"])')
    const count = await external.count()
    expect(count).toBeGreaterThan(20)
    for (let i = 0; i < count; i++) {
      const link = external.nth(i)
      const href = (await link.getAttribute('href')) ?? ''
      expect(href, 'href').toMatch(/^https:\/\//)
      await expect(link, href).toHaveAttribute('target', '_blank')
      await expect(link, href).toHaveAttribute('rel', /noopener/)
    }
  })

  test('share links carry the page url', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1500)
    const share = page.locator('.shareLinks a')
    await expect(share).toHaveCount(6)
    const hrefs = await share.evaluateAll((anchors) =>
      anchors.map((a) => decodeURIComponent((a as HTMLAnchorElement).href)),
    )
    for (const href of hrefs) {
      expect(href).toContain('vegan.to')
    }
  })

  test('the footer lists every data source with a link', async ({ page }) => {
    await page.goto('/')
    const sources = page.locator('.sources-list li')
    expect(await sources.count()).toBeGreaterThanOrEqual(10)
    for (const item of await sources.all()) {
      await expect(item.locator('a[href^="https://"]').first()).toHaveAttribute('href', /^https:\/\//)
    }
    await expect(page.locator('.sources-list')).toContainText('Destatis')
    await expect(page.locator('.sources-list')).toContainText('fishcount')
    await expect(page.locator('.sources-list')).toContainText('Scarborough')
  })
})

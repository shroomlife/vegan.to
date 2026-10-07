import { test, expect } from '@playwright/test'
import { parseDeNumber } from './helpers'

test.describe('impact section', () => {
  test('values grow with the selected period and every card has a comparison', async ({ page }) => {
    await page.goto('/')
    const tabs = page.locator('.impact-tab')
    await expect(tabs).toHaveCount(7)

    let previous = -1
    for (let i = 0; i < 7; i++) {
      await tabs.nth(i).click()
      await expect(tabs.nth(i)).toHaveClass(/impact-tab--active/)
      const water = parseDeNumber(await page.locator('.impact-card--water .impact-card-value').innerText())
      expect(water).toBeGreaterThan(previous)
      previous = water
      for (const list of await page.locator('.impact-card-comparisons').all()) {
        await expect(list.locator('li').first()).toBeVisible()
      }
    }
  })

  test('sources are cited below the cards and resolve in the list', async ({ page }) => {
    await page.goto('/')
    const notes = page.locator('.impact-source .source-note')
    await expect(notes).toHaveCount(4)
    const anchor = (await notes.first().getAttribute('href')) ?? ''
    const item = page.locator(anchor)
    await expect(item).toContainText('Scarborough')
    await expect(item.locator('a[href^="https://"]')).toHaveCount(1)
  })
})

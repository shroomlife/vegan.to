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

  test('sources are linked below the cards', async ({ page }) => {
    await page.goto('/')
    const source = page.locator('.impact-source')
    await expect(source).toContainText('Scarborough')
    expect(await source.locator('a[href^="https://"]').count()).toBeGreaterThan(0)
  })
})

import { test, expect } from '@playwright/test'
import { animals } from '../src/data/animals'
import { sources } from '../src/data/sources'
import { topicPages } from '../src/data/topics'
import { pigStock, cattleStock, stockByState } from '../src/data/topics/livestock'
import { byOrigin2025, byState2025, monthly, poultry2025 } from '../src/data/topics/slaughterStats'
import { hens, hensBySystem } from '../src/data/topics/chicks'
import { meatConsumption } from '../src/data/topics/perCapita'
import { collectErrors } from './helpers'

const sum = (values: readonly number[]) => values.reduce((total, value) => total + value, 0)
const yearly = (single: string) => animals.find((animal) => animal.names.single === single)?.deaths.year

/**
 * The topic data is typed in by hand from Destatis and BLE tables. Where the
 * tables add up, these checks make a typo in one cell fail the build.
 */
test.describe('topic data adds up', () => {
  test('monthly and per state slaughter figures sum to the yearly totals', () => {
    expect(sum(monthly.pigs2025)).toBe(yearly('Schwein'))
    expect(sum(monthly.cattle2025)).toBe(yearly('Rind'))
    expect(sum(monthly.poultry2025)).toBe(poultry2025.total)
    expect(sum(byState2025.map((row) => row.pigs ?? 0))).toBe(yearly('Schwein'))
    expect(sum(byState2025.map((row) => row.cattle ?? 0))).toBe(yearly('Rind'))
    expect(sum(byState2025.map((row) => row.lambsAndSheep ?? 0))).toBe(yearly('Schaf'))
  })

  test('slaughter by origin matches animals.ts for domestic animals', () => {
    expect(byOrigin2025.find((row) => row.name === 'Schweine')?.domestic).toBe(yearly('Schwein'))
    expect(byOrigin2025.find((row) => row.name === 'Rinder')?.domestic).toBe(yearly('Rind'))
    expect(poultry2025.broilers + poultry2025.boilingHens).toBe(yearly('Huhn'))
    expect(poultry2025.turkeys).toBe(yearly('Truthuhn'))
  })

  test('stock per state matches the national figure', () => {
    expect(sum(stockByState.map((row) => row.cattle))).toBe(cattleStock.may2026)
    // Destatis rounds the pig figures per state to hundreds
    expect(Math.abs(sum(stockByState.map((row) => row.pigs ?? 0)) - pigStock.may2026)).toBeLessThanOrEqual(1000)
  })

  test('laying hens by housing add up to the total', () => {
    expect(sum(hensBySystem.map((row) => row.hens2015))).toBe(hens.total2015)
    expect(sum(hensBySystem.map((row) => row.hens2025))).toBe(hens.total2025)
  })

  test('meat consumption parts never exceed the total', () => {
    for (const year of meatConsumption) {
      expect(year.pork + year.poultry + year.beef + year.sheepGoat, String(year.year)).toBeLessThanOrEqual(year.total)
    }
  })
})

test.describe('topic pages', () => {
  for (const topic of topicPages) {
    test(`${topic.path} renders with its own meta, sources and answers`, async ({ page }) => {
      const errors = collectErrors(page)
      await page.goto(topic.path)

      await expect(page.locator('h1')).toHaveCount(1)
      await expect(page).toHaveTitle(topic.title)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://vegan.to${topic.path}`)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', topic.description)

      // Every source link points at an entry of sources.ts
      const knownUrls = new Set(Object.values(sources).map((source) => source.url))
      const links = await page.locator('.source-links a').evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')))
      expect(links.length).toBeGreaterThan(0)
      for (const href of links) expect(knownUrls.has(href ?? ''), href ?? '').toBe(true)

      await expect(page.getByRole('heading', { name: 'Lichtblicke' })).toBeVisible()
      await expect(page.getByRole('heading', { name: 'Kurz beantwortet' })).toBeVisible()

      const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts()
      const types = blocks.map((text) => (JSON.parse(text) as { '@type'?: string })['@type'])
      expect(types).toEqual(expect.arrayContaining(['FAQPage', 'BreadcrumbList']))

      // The related links reach every other topic
      const related = page.getByRole('navigation', { name: 'Weiterlesen' })
      await expect(related.getByRole('link')).toHaveCount(topicPages.length)

      expect(errors).toEqual([])
    })
  }

  test('the start page chapter links every topic page, the Zeitreise as its feature', async ({ page }) => {
    await page.goto('/')
    const chapter = page.locator('#hintergruende')
    await chapter.scrollIntoViewIfNeeded()
    await expect(chapter.locator('.timeline-feature')).toHaveAttribute('href', '/zeitreise')
    await expect(chapter.locator('.topic-card')).toHaveCount(topicPages.length - 1)
    for (const topic of topicPages) {
      await expect(chapter.locator(`a[href="${topic.path}"]`)).toHaveCount(1)
    }
    await chapter.locator('.timeline-feature').click()
    await expect(page).toHaveURL('/zeitreise')
    await expect(page.locator('h1')).toBeVisible()
  })

  test('the header links the Zeitreise', async ({ page, isMobile }) => {
    test.skip(isMobile, 'The phone header keeps only the sources link')
    await page.goto('/')
    await page.getByRole('navigation', { name: 'Hauptnavigation' }).getByRole('link', { name: 'Zeitreise' }).click()
    await expect(page).toHaveURL('/zeitreise')
  })

  test('the footer links every topic page', async ({ page }) => {
    await page.goto('/')
    const footer = page.locator('.site-footer').getByRole('navigation', { name: 'Hintergründe' })
    for (const topic of topicPages) {
      await expect(footer.locator(`a[href="${topic.path}"]`)).toHaveCount(1)
    }
  })
})

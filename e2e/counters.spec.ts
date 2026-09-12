import { test, expect } from '@playwright/test'
import { parseDeNumber } from './helpers'
import { animals } from '../src/data/animals'

/** Same definition as the app: the yearly figure is spread over the current year in Berlin time */
function berlinNow(): Date {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Berlin' }))
}
function daysInYear(year: number): number {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365
}
function secondsPerYearNow(): number {
  return daysInYear(berlinNow().getFullYear()) * 86_400
}

function findAnimal(plural: string) {
  const animal = animals.find((a) => a.names.plural === plural)
  if (!animal) throw new Error(`animal ${plural} missing in animals.ts`)
  return animal
}

test.describe('live counters', () => {
  test('hero counter appears and keeps rising', async ({ page }) => {
    await page.goto('/')
    const number = page.locator('.hero-counter-number')
    await expect(number).toBeVisible()
    const first = parseDeNumber(await number.innerText())
    await page.waitForTimeout(2500)
    const second = parseDeNumber(await number.innerText())
    expect(second).toBeGreaterThan(first)
  })

  test('"heute" ticks at the per-second rate of the source data', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('.animal-card', { hasText: 'Hühner' })
    const today = card.locator('.animal-stat-value').first()
    await expect(today).toBeVisible()
    const expectedPerSec = findAnimal('Hühner').deaths.year / secondsPerYearNow()

    const start = parseDeNumber(await today.innerText())
    const t0 = Date.now()
    await page.waitForTimeout(6000)
    const end = parseDeNumber(await today.innerText())
    const seconds = (Date.now() - t0) / 1000

    const measured = (end - start) / seconds
    expect(measured).toBeGreaterThan(expectedPerSec * 0.8)
    expect(measured).toBeLessThan(expectedPerSec * 1.2)
  })

  test('"heute" and "dieses Jahr" equal the yearly figure spread over Berlin time', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('.animal-card', { hasText: 'Hühner' })
    await expect(card.locator('.animal-stat-value').first()).toBeVisible()

    const yearly = findAnimal('Hühner').deaths.year
    const now = berlinNow()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfYear = new Date(now.getFullYear(), 0, 1)
    const rate = yearly / secondsPerYearNow()
    const expectedToday = rate * ((now.getTime() - startOfDay.getTime()) / 1000)
    const expectedYear = rate * ((now.getTime() - startOfYear.getTime()) / 1000)
    const expectedPerDay = yearly / daysInYear(now.getFullYear())

    const values = await card.locator('.animal-stat-value').allInnerTexts()
    const [today, perDay, thisYear] = values.map(parseDeNumber)
    // a few seconds of tolerance for page load and the 1 s tick
    expect(Math.abs((today ?? 0) - expectedToday)).toBeLessThan(rate * 15)
    expect(Math.abs((thisYear ?? 0) - expectedYear)).toBeLessThan(rate * 15)
    expect(Math.abs((perDay ?? 0) - expectedPerDay)).toBeLessThanOrEqual(1)
  })

  test('sub groups sum up to their parent', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('.animal-card', { hasText: 'Rinder' })
    await card.getByRole('button', { name: 'Untergruppen' }).click()
    const children = card.locator('.animal-child')
    await expect(children).toHaveCount(findAnimal('Rinder').children?.length ?? 0)

    const parentYear = parseDeNumber(await card.locator('.animal-stat-value').nth(2).innerText())
    const childYears = await children.locator('.animal-child-stat--wide').allInnerTexts()
    const sum = childYears.reduce((acc, text) => acc + parseDeNumber(text), 0)
    expect(Math.abs(sum - parentYear)).toBeLessThanOrEqual(10)

    await card.getByRole('button', { name: 'ausblenden' }).click()
    await expect(children).toHaveCount(0)
  })

  test('fish are shown as a flagged estimate', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('.animal-card', { hasText: 'Fische' })
    await expect(card.locator('.animal-estimate')).toHaveText('Schätzung')
    await expect(card.locator('.animal-estimate')).toHaveAttribute('title', /Tonnen/)
    for (const value of await card.locator('.animal-stat-value').allInnerTexts()) {
      expect(value.trim()).toMatch(/^≈/)
    }
  })

  test('emoji wall stays capped', async ({ page }) => {
    await page.goto('/')
    const card = page.locator('.animal-card', { hasText: 'Fische' })
    // fish reach the cap within a few seconds
    await expect(card.locator('.animal-card-emojis-more')).toContainText('weitere', { timeout: 30_000 })
    const emojiText = await card
      .locator('.animal-card-emojis')
      .evaluate((el) => el.childNodes[0]?.textContent?.trim() ?? '')
    expect([...emojiText].length).toBeLessThanOrEqual(2000)
  })
})

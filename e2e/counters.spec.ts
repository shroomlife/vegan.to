import { test, expect } from '@playwright/test'
import { parseDeNumber } from './helpers'
import { animals } from '../src/data/animals'
import { startOfBerlinDay, startOfBerlinYear, daysInBerlinYear } from '../src/utils/berlinTime'

/**
 * Same definition as useTimer.ts: the yearly figure is spread over the current
 * year in Berlin time. The helpers derive the Berlin calendar through Intl, so
 * the expectation holds whatever the runner's own clock is set to; their own
 * fixtures live in time-utils.spec.ts.
 */
function secondsPerYearNow(): number {
  return daysInBerlinYear(new Date()) * 86_400
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
    const now = new Date()
    const rate = yearly / secondsPerYearNow()
    const expectedToday = (rate * (now.getTime() - startOfBerlinDay(now).getTime())) / 1000
    const expectedYear = (rate * (now.getTime() - startOfBerlinYear(now).getTime())) / 1000
    const expectedPerDay = yearly / daysInBerlinYear(now)

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
    // the wall only takes new values while it is on screen
    await card.scrollIntoViewIfNeeded()
    // fish reach the cap within a few seconds
    await expect(card.locator('.animal-card-emojis-more')).toContainText('weitere', { timeout: 30_000 })
    const emojiText = await card.locator('.animal-card-emojis-wall').innerText()
    expect([...emojiText.trim()].length).toBeLessThanOrEqual(140)
    // the strip keeps its height while it fills, so nothing below it moves
    const height = await card.locator('.animal-card-emojis-wall').evaluate((el) => el.getBoundingClientRect().height)
    await page.waitForTimeout(3000)
    const heightLater = await card.locator('.animal-card-emojis-wall').evaluate((el) => el.getBoundingClientRect().height)
    expect(heightLater).toBe(height)
  })
})

import { test, expect } from '@playwright/test'
import { animals } from '../src/data/animals'
import { speciesProfiles } from '../src/data/species'
import { slaughterTrendBySpecies } from '../src/data/trends'

/**
 * The series are keyed by the singular name as a plain string, so nothing in
 * the type system ties them to animals.ts. These checks are that tie.
 */
test.describe('slaughter trends', () => {
  test('every series ends on the yearly figure animals.ts states', () => {
    for (const [single, series] of Object.entries(slaughterTrendBySpecies)) {
      const last = series?.[series.length - 1]
      const animal = animals.find((a) => a.names.single === single)
      expect(animal, `${single} fehlt in animals.ts`).toBeDefined()
      expect(last?.count, `${single}: Reihe endet auf ${last?.count}`).toBe(animal?.deaths.year)
    }
  })

  test('every series runs year by year without a gap or a repeat', () => {
    for (const [single, series] of Object.entries(slaughterTrendBySpecies)) {
      const years = (series ?? []).map((point) => point.year)
      expect(years.length, `${single} hat zu wenige Punkte`).toBeGreaterThan(1)
      for (let i = 1; i < years.length; i++) {
        expect(years[i], `${single} springt von ${years[i - 1]} auf ${years[i]}`).toBe(
          (years[i - 1] ?? 0) + 1,
        )
      }
      for (const point of series ?? []) {
        expect(point.count, `${single} ${point.year}`).toBeGreaterThan(0)
      }
    }
  })

  test('exactly the counted species have a series, fish has none', () => {
    for (const profile of speciesProfiles) {
      const series = slaughterTrendBySpecies[profile.single]
      if (profile.single === 'Fisch') {
        expect(series, 'Fisch ist eine Schätzung ohne Jahresreihe').toBeUndefined()
      } else {
        expect(series, `${profile.single} hat keine Reihe`).toBeDefined()
      }
    }
    for (const single of Object.keys(slaughterTrendBySpecies)) {
      expect(
        speciesProfiles.some((profile) => profile.single === single),
        `${single} ist keine bekannte Tierart`,
      ).toBe(true)
    }
  })

  test('a species page draws the gap and names both ends of it', async ({ page }) => {
    await page.goto('/tiere/rinder')
    const section = page.locator('.species-trend')
    await expect(section).toHaveCount(1)
    await expect(section.locator('.gap-chart svg')).toHaveCount(1)
    // The viewBox has to match the rendered box, or the chart is scaled and inset
    const svg = section.locator('.gap-chart svg')
    const box = await svg.boundingBox()
    const viewBox = (await svg.getAttribute('viewBox'))?.split(' ').map(Number) ?? []
    expect(Math.round(box?.width ?? 0)).toBe(viewBox[2])
    expect(Math.round(box?.height ?? 0)).toBe(viewBox[3])
    await expect(section.locator('.species-trend-figure')).toHaveText('1.885.216')
    // Three, not four: 1993 is also the peak, so the window card would repeat it
    await expect(section.locator('.species-trend-stat')).toHaveCount(3)
    // Domestic origin is a property of 41331-0001 only
    await expect(section.locator('.species-trend-note')).toContainText('inländischer Herkunft')
  })

  test('a poultry page does not claim a scope its source does not have', async ({ page }) => {
    await page.goto('/tiere/huehner')
    const note = page.locator('.species-trend .species-trend-note')
    await expect(note).toContainText('Geflügelschlachtereien')
    await expect(note).not.toContainText('inländischer Herkunft')
    // 0,9 percent below the peak but seven percent above 2010: leading with the
    // gap would read as progress, so the absolute figure leads instead
    await expect(page.locator('.species-trend-figure')).toHaveText('660.977.701')
    // The rise over the window has to be on the page, not only the fall from the peak
    const stats = page.locator('.species-trend .species-trend-stat')
    await expect(stats).toHaveCount(4)
    await expect(stats.filter({ hasText: 'seit 2010' })).toContainText('+7')
  })

  test('fish get no trend section at all', async ({ page }) => {
    await page.goto('/tiere/fische')
    await expect(page.locator('.species-trend')).toHaveCount(0)
  })
})

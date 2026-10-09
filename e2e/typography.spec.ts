import { test, expect } from '@playwright/test'
import { routePaths } from '../src/data/routes'

/** A figure followed by a plain space and its unit: the unit could land on the next line */
const LOOSE_UNIT = /\d (kg|g|t|L|m²|cm²|km|%|Prozent|Mio\.|Mrd\.|Millionen|Milliarden|Billionen|Jahre|Jahren|Jahr|Monate|Monaten|Monat|Wochen|Woche|Tage|Tagen|Tag|Stunden|Stunde|Minuten|Minute|Sekunden)(?![\p{L}])/u

/** Where a figure stands on its own: headlines, table cells, values, key and topic figures, trends, lived ages. Running text in paragraphs and notes may break like any text. */
const FIGURE_SELECTOR = ['h1', 'h2', 'h3', 'td', '[class*="-value"]', '[class$="-figure"]', '[class*="trend-"]', '[class*="-lived"]', '.curve-now'].join(', ')

test.describe('typography', () => {
  test.skip(({ isMobile }) => isMobile, 'the markup is the same on every device, the desktop run covers it')

  test('figures keep their unit on the same line on every route', async ({ page }) => {
    test.setTimeout(120_000)
    const loose: string[] = []
    for (const path of routePaths) {
      await page.goto(path)
      const texts = await page.locator(FIGURE_SELECTOR).allTextContents()
      for (const text of texts) {
        const match = LOOSE_UNIT.exec(text)
        if (match) loose.push(`${path}: "${text.trim().slice(Math.max(0, match.index - 20), match.index + 30)}"`)
      }
    }
    expect([...new Set(loose)], 'join number and unit with a no-break space (\\u00A0 in strings, &nbsp; in templates)').toEqual([])
  })
})

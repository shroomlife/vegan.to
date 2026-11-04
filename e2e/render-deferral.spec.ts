import { test, expect } from '@playwright/test'

/**
 * Chrome crashes the tab (STATUS_BREAKPOINT, a CHECK in AXBlockFlowData::ComputeNeighborOnLine, crbug.com/552018997) when assistive technology is on and text changes inside a section that content-visibility: auto is skipping. Screen readers, password managers and other tools switch that accessibility mode on, so live numbers must never sit inside such a section (custom.css, .render-when-near).
 *
 * The first test pins the rule itself. The crash tests replay what visitors did; the crash is a race, so they catch a regression most of the time, not every time.
 */

// Full accessibility with inline text boxes, the mode a screen reader asks for. This replaces the project's launchOptions, which set none today.
test.use({ launchOptions: { args: ['--force-renderer-accessibility=complete'] } })

test.describe('render deferral', () => {
  test('nothing changes on its own inside a section that content-visibility may skip', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.render-when-near').first()).toBeAttached()
    // Watching starts once the page has mounted: building the sections is not a change on its own
    const changes = await page.evaluateHandle(() => {
      const found: string[] = []
      const deferredSection = (node: Node): Element | null => {
        for (let el = node instanceof Element ? node : node.parentElement; el; el = el.parentElement) {
          if (getComputedStyle(el).contentVisibility === 'auto') return el
        }
        return null
      }
      new MutationObserver((records) => {
        for (const record of records) {
          const section = deferredSection(record.target)
          if (section) found.push(`${section.id || section.className}: ${record.type}`)
        }
      }).observe(document, { subtree: true, childList: true, characterData: true })
      return found
    })
    // Live numbers tick every second: watch from the top, then from the end of the page
    await page.waitForTimeout(3000)
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.waitForTimeout(3000)
    expect([...new Set(await changes.jsonValue())]).toEqual([])
  })

  test('fast wheel scrolling with assistive technology on keeps the page alive', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'mouse wheel input needs the desktop project')
    await page.goto('/')
    await expect(page.locator('.render-when-near').first()).toBeAttached()
    // A crashed tab fails every following call with "Target crashed"
    for (let round = 0; round < 4; round++) {
      for (const delta of [1500, -1500]) {
        for (let i = 0; i < 40; i++) {
          await page.mouse.wheel(0, delta)
          await page.waitForTimeout(16)
        }
      }
    }
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => document.readyState)).toBe('complete')
  })

  test('a footnote opens its source in the list with assistive technology on', async ({ page }) => {
    await page.goto('/')
    const note = page.locator('.source-note').first()
    const hash = ((await note.getAttribute('href')) ?? '').replace(/^\//, '')
    expect(hash).toMatch(/^#quelle-\d+$/)
    await note.click()
    const entry = page.locator(hash)
    await expect(entry).toBeInViewport()
    await page.waitForTimeout(500)
    expect(await page.evaluate(() => document.readyState)).toBe('complete')
  })
})

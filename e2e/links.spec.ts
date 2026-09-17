import { test, expect } from '@playwright/test'
import { routePaths } from '../src/data/routes'

test.describe('outbound links and sources', () => {
  test('the three core question cards link to the partner domains', async ({ page }) => {
    await page.goto('/')
    const cards = page.locator('.why-how-card')
    await expect(cards).toHaveCount(3)
    await expect(cards.nth(0)).toHaveAttribute('href', 'https://warum-vegan.com/')
    await expect(cards.nth(1)).toHaveAttribute('href', 'https://wie-vegan.com/')
    await expect(cards.nth(2)).toHaveAttribute('href', 'https://vegan-community.de/')
  })

  // Nothing checked internal targets before, so a link to a route that was
  // still only planned shipped all the way into the built html
  test('every internal link reaches a real page, not the 404 route', async ({ page }) => {
    const seen = new Set<string>()
    for (const path of routePaths) {
      await page.goto(path)
      const targets = await page.locator('a[href^="/"]').evaluateAll((nodes) =>
        nodes.map((node) => node.getAttribute('href') ?? ''),
      )
      for (const href of targets) {
        const target = (href.split('#')[0]?.split('?')[0] ?? '') || '/'
        seen.add(target.length > 1 ? target.replace(/\/$/, '') : target)
      }
    }
    expect(seen.size).toBeGreaterThan(3)
    // Asking the router itself rather than a path list: routes.ts also feeds the
    // sitemap, so a path can be listed there while no route renders it
    for (const target of seen) {
      await page.goto(target)
      await expect(page.locator('meta[name="robots"]'), target).toHaveAttribute('content', /^index/)
    }
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

  test('header and footer carry the brand, the partner links and the sources page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.site-header .wordmark')).toHaveText(/vegan\s*to/)
    await expect(page.locator('.site-header').getByRole('link', { name: 'Quellen' })).toHaveAttribute('href', '/quellen')
    const footer = page.locator('.site-footer')
    await expect(footer.locator('.wordmark')).toBeVisible()
    await expect(footer.locator('.pride-flag')).toBeVisible()
    for (const domain of ['warum-vegan.com', 'wie-vegan.com', 'vegan-community.de']) {
      await expect(footer.getByRole('link', { name: domain })).toHaveAttribute('href', `https://${domain}/`)
    }
    await expect(footer.getByRole('link', { name: 'Quellen und Methodik' })).toHaveAttribute('href', '/quellen')
  })

  test('the sources page lists every data source with a link and explains the method', async ({ page }) => {
    await page.goto('/quellen')
    await expect(page).toHaveTitle(/Quellen und Methodik/)
    const sources = page.locator('.sources-item')
    expect(await sources.count()).toBeGreaterThanOrEqual(14)
    for (const item of await sources.all()) {
      await expect(item.locator('a[href^="https://"]').first()).toHaveAttribute('href', /^https:\/\//)
    }
    await expect(page.locator('.sources-body')).toContainText('Destatis')
    await expect(page.locator('.sources-body')).toContainText('fishcount')
    await expect(page.locator('.sources-body')).toContainText('Scarborough')
    await expect(page.locator('#methodik')).toContainText('Vom Jahr zur Sekunde')
    await expect(page.locator('.site-footer')).toBeVisible()
  })

  test('the 404 fallback serves the app for deep links', async ({ request }) => {
    const res = await request.get('/404.html')
    expect(res.status()).toBe(200)
    expect(await res.text()).toContain('id="app"')
  })
})

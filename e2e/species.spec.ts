import { test, expect } from '@playwright/test'

test.describe('species pages', () => {
  test('the index lists every species and links to its page', async ({ page }) => {
    await page.goto('/tiere')
    await expect(page).toHaveTitle(/Alle Tierarten/)
    const cards = page.locator('.species-index-card')
    await expect(cards).toHaveCount(10)
    await expect(cards.last()).toContainText('Fische')
    await cards.first().click()
    await expect(page).toHaveURL(/\/tiere\/huehner$/)
    await expect(page.locator('h1')).toContainText('Hühner')
  })

  test('a species page carries live numbers, its own meta and sources', async ({ page }) => {
    await page.goto('/tiere/schweine')
    await expect(page).toHaveTitle(/Wie viele Schweine werden in Deutschland geschlachtet/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vegan.to/tiere/schweine')
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description).toContain('44.016.159 Schweine')

    await expect(page.locator('h1')).toContainText('44.016.159 Schweine im Jahr')
    const today = page.locator('.species-live-card').first().locator('.species-live-value')
    const before = Number((await today.innerText()).replace(/\./g, ''))
    await page.waitForTimeout(2500)
    const after = Number((await today.innerText()).replace(/\./g, ''))
    expect(after).toBeGreaterThan(before)

    // conditions tagged for pigs, plus the life card and the who-they-are card
    await expect(page.locator('.species-condition')).toHaveCount(4)
    await expect(page.locator('.species-card')).toHaveCount(2)
    for (const links of await page.locator('.source-links').all()) {
      await expect(links.locator('a').first()).toHaveAttribute('href', /^https?:\/\//)
    }
    const breadcrumb = await page.locator('script#species-breadcrumb').innerText()
    expect(JSON.parse(breadcrumb)['@type']).toBe('BreadcrumbList')
  })

  test('fish are flagged as an estimate and show their sub groups', async ({ page }) => {
    await page.goto('/tiere/fische')
    await expect(page.locator('.chapter').first()).toContainText('Schätzung')
    await expect(page.locator('.species-table tbody tr')).toHaveCount(2)
  })

  test('an unknown species ends on the 404 page', async ({ page }) => {
    await page.goto('/tiere/einhoerner')
    await expect(page.locator('.not-found')).toBeVisible()
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^noindex/)
  })

  test('the sitemap lists the start page, every species and the sources', async ({ request }) => {
    const sitemap = await (await request.get('/sitemap.xml')).text()
    for (const path of ['/', '/tiere', '/tiere/huehner', '/tiere/fische', '/quellen']) {
      expect(sitemap).toContain(`<loc>https://vegan.to${path}</loc>`)
    }
    expect(sitemap.match(/<url>/g)).toHaveLength(13)
  })

  test('every route has its own html copy so the host answers with 200', async ({ request }) => {
    for (const path of ['/tiere.html', '/tiere/schweine.html', '/quellen.html']) {
      const res = await request.get(path)
      expect(res.status(), path).toBe(200)
      expect(await res.text()).toContain('id="app"')
    }
  })

  test('start page cards and the footer link to the species pages', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.animal-card a.animal-label')).toHaveCount(10)
    await expect(page.locator('.site-footer a[href="/tiere/rinder"]')).toHaveCount(1)
  })
})

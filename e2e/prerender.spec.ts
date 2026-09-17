import { test, expect } from '@playwright/test'

/** What a crawler without JavaScript gets: the raw HTML files of the build */
test.describe('prerendered html', () => {
  test('the start page ships its headings, meta and structured data in plain html', async ({ request }) => {
    const html = await (await request.get('/index.html')).text()
    expect(html).toContain('<h1')
    expect(html).toContain('Sie hatten Namen.')
    expect(html).toContain('Kapitel 3')
    expect(html).toContain('id="faq-jsonld"')
    expect(html).toContain('<link rel="canonical" href="https://vegan.to/"')
  })

  test('a species page ships its own title, description and canonical', async ({ request }) => {
    const html = await (await request.get('/tiere/schweine.html')).text()
    expect(html).toContain('<title>Wie viele Schweine werden in Deutschland geschlachtet? | vegan.to</title>')
    expect(html).toContain('44.016.159 Schweine im Jahr')
    expect(html).toContain('href="https://vegan.to/tiere/schweine"')
    expect(html).toContain('Das steht so im Gesetz.')
    expect(html).toContain('id="species-breadcrumb"')
  })

  test('the 404 copy is prerendered as the not found page, not as the start page', async ({ request }) => {
    const html = await (await request.get('/404.html')).text()
    expect(html).toContain('Seite nicht gefunden | vegan.to')
    expect(html).toContain('noindex, follow')
    // GitHub Pages serves this file for every unknown url, so it must claim no address
    expect(html).not.toContain('rel="canonical"')
    expect(html).not.toContain('og:url')
    // still the spa fallback: deep links have to boot the router from here
    expect(html).toContain('id="app"')
  })

  test('the app still mounts on top of the prerendered page without duplicate structured data', async ({ page }) => {
    await page.goto('/tiere/schweine')
    await expect(page.locator('h1')).toHaveCount(1)
    await expect(page.locator('script#species-breadcrumb')).toHaveCount(1)
    await page.goto('/')
    await expect(page.locator('script#faq-jsonld')).toHaveCount(1)
    await expect(page.locator('h1')).toHaveCount(1)
  })
})

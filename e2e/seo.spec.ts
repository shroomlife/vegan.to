import { test, expect } from '@playwright/test'

test.describe('on-page seo', () => {
  test('every route carries its own title, description and canonical', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Live-Zähler \| vegan\.to$/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vegan.to/')
    const homeDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(homeDescription).toContain('Destatis')

    await page.getByRole('link', { name: 'Quellen' }).first().click()
    await expect(page).toHaveTitle(/Quellen und Methodik/)
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://vegan.to/quellen')
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://vegan.to/quellen')
    const sourcesDescription = await page.locator('meta[name="description"]').getAttribute('content')
    expect(sourcesDescription).not.toBe(homeDescription)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^index/)

    await page.goto('/gibt-es-nicht')
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /^noindex/)
  })

  test('the start page has exactly one h1 that names the topic', async ({ page }) => {
    await page.goto('/')
    const h1 = page.locator('h1')
    await expect(h1).toHaveCount(1)
    await expect(h1).toContainText('Deutschland')
    await expect(h1).toContainText('Sie hatten Namen')
  })

  test('structured data covers the site and the questions', async ({ page }) => {
    await page.goto('/')
    const blocks = await page.locator('script[type="application/ld+json"]').allInnerTexts()
    const types = blocks.flatMap((text) => {
      const parsed: unknown = JSON.parse(text)
      const graph = parsed && typeof parsed === 'object' && '@graph' in parsed ? parsed['@graph'] : [parsed]
      return (graph as { '@type': string }[]).map((node) => node['@type'])
    })
    expect(types).toEqual(expect.arrayContaining(['WebSite', 'Organization', 'WebApplication', 'FAQPage']))
    const faq = blocks.find((text) => text.includes('FAQPage'))
    expect(faq).toBeDefined()
    expect(JSON.parse(faq ?? '{}').mainEntity).toHaveLength(5)
  })

  test('sharing assets respond', async ({ request }) => {
    for (const path of ['/img/og.png', '/robots.txt', '/sitemap.xml', '/manifest.json']) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
    }
    const sitemap = await (await request.get('/sitemap.xml')).text()
    expect(sitemap).toContain('https://vegan.to/quellen')
  })
})

import { test, expect, type Page, type Request } from '@playwright/test'
import { CONSENT_STORAGE_KEY } from '../src/utils/consentStorage'

// A first visit: nothing stored yet
test.use({ storageState: { cookies: [], origins: [] } })

const GOOGLE_HOSTS = /(^|\.)(google-analytics\.com|googletagmanager\.com|google\.com|gstatic\.com|googleapis\.com)$/

/** Records every request to a Google host; the real ones are answered locally so no test ever reaches Google */
async function watchGoogle(page: Page): Promise<string[]> {
  const hits: string[] = []
  await page.route((url) => GOOGLE_HOSTS.test(url.hostname), (route) => {
    hits.push(route.request().url())
    return route.fulfill({ status: 204, body: '' })
  })
  return hits
}

test.describe('analytics consent', () => {
  test('the head script in index.html reads the same storage key as the app', async ({ request }) => {
    const html = await (await request.get('/')).text()
    expect(html).toContain(`localStorage.getItem('${CONSENT_STORAGE_KEY}')`)
  })

  test('a visitor who already decided never sees the prerendered banner', async ({ browser, baseURL }) => {
    const context = await browser.newContext({
      storageState: { cookies: [], origins: [{ origin: baseURL ?? '', localStorage: [{ name: CONSENT_STORAGE_KEY, value: 'denied' }] }] },
      javaScriptEnabled: true,
    })
    const page = await context.newPage()
    // Block the app bundle, so only the prerendered html and the head script are at work
    await page.route('**/assets/*.js', (route) => route.abort())
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await expect(page.locator('html')).toHaveAttribute('data-consent', 'decided')
    await expect(page.getByRole('dialog', { name: /mitzählen/ })).toBeHidden()
    await context.close()
  })

  test('nothing leaves for a third party before the visitor decides', async ({ page, baseURL }) => {
    const foreign: string[] = []
    page.on('request', (request: Request) => {
      const url = new URL(request.url())
      if (url.origin !== new URL(baseURL ?? '').origin && !url.protocol.startsWith('data')) foreign.push(request.url())
    })
    const google = await watchGoogle(page)

    await page.goto('/')
    await expect(page.getByRole('dialog', { name: /mitzählen/ })).toBeVisible()
    await page.goto('/tiere/huehner')
    await page.waitForLoadState('networkidle')

    expect(google).toEqual([])
    expect(foreign).toEqual([])
  })

  test('declining hides the banner, stores the choice and loads nothing', async ({ page }) => {
    const google = await watchGoogle(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Ablehnen' }).click()

    await expect(page.getByRole('dialog', { name: /mitzählen/ })).toBeHidden()
    expect(await page.evaluate((key) => localStorage.getItem(key), CONSENT_STORAGE_KEY)).toBe('denied')

    await page.reload()
    await expect(page.getByRole('dialog', { name: /mitzählen/ })).toBeHidden()
    expect(google).toEqual([])
  })

  test('agreeing loads the Google tag once, also after a reload', async ({ page }) => {
    const google = await watchGoogle(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Einverstanden' }).click()

    await expect.poll(() => google.filter((url) => url.includes('gtag/js?id=G-1B0G94DX8X')).length).toBe(1)
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1)

    await page.reload()
    await expect(page.getByRole('dialog', { name: /mitzählen/ })).toBeHidden()
    await expect(page.locator('script[src*="googletagmanager.com/gtag/js"]')).toHaveCount(1)
  })

  test('the footer reopens the choice and a withdrawal removes the cookies', async ({ page, context }) => {
    await watchGoogle(page)
    await page.goto('/')
    await page.getByRole('button', { name: 'Einverstanden' }).click()
    // What gtag.js would have written, set by hand because the tag is stubbed
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.1.1', domain: '127.0.0.1', path: '/' },
      { name: '_ga_1B0G94DX8X', value: 'GS1.1.1', domain: '127.0.0.1', path: '/' },
    ])

    await page.locator('.site-footer').getByRole('button', { name: 'Cookie-Einstellungen' }).click()
    await page.getByRole('button', { name: 'Ablehnen' }).click()

    const names = (await context.cookies()).map((cookie) => cookie.name)
    expect(names).not.toContain('_ga')
    expect(names).not.toContain('_ga_1B0G94DX8X')
    expect(await page.evaluate(() => Reflect.get(window, 'ga-disable-G-1B0G94DX8X'))).toBe(true)
  })

  test('Impressum and Datenschutz are reachable from every page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Ablehnen' }).click()
    await page.locator('.site-footer').getByRole('link', { name: 'Impressum' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Impressum' })).toBeVisible()
    await expect(page.getByText('71679 Asperg')).toBeVisible()

    await page.locator('.site-footer').getByRole('link', { name: 'Datenschutz' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Datenschutzerklärung' })).toBeVisible()
    await expect(page.getByText('Aktuell hast du')).toContainText('abgelehnt')
  })
})

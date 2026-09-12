import { test, expect } from '@playwright/test'

test.describe('navigation feels right', () => {
  test('a page change lands at the top, back restores the old position', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 3000))
    await page.waitForTimeout(300)
    await page.locator('.site-footer').getByRole('link', { name: 'Quellen und Methodik' }).click()
    await expect(page).toHaveURL(/\/quellen$/)
    await expect(page).toHaveTitle(/Quellen und Methodik/)
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBeLessThan(10)

    await page.goBack()
    await expect(page).toHaveURL(/\/$/)
    await page.waitForTimeout(800)
    expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(2000)
  })

  test('header anchors scroll to their section from another page and on the same page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'the section links live in the footer on phones')
    await page.goto('/quellen')
    await page.locator('.site-header').getByRole('link', { name: 'Impact' }).click()
    await expect(page).toHaveURL(/\/#impact$/)
    await expect.poll(() => page.locator('#impact').evaluate((el) => el.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(140)

    // already on /#impact: a second click on "Zahlen" still scrolls
    await page.locator('.site-header').getByRole('link', { name: 'Zahlen' }).click()
    await expect.poll(() => page.locator('#zahlen').evaluate((el) => el.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(140)
  })

  test('footer anchors reach their section from the sources page', async ({ page }) => {
    await page.goto('/quellen')
    await page.locator('.site-footer').getByRole('link', { name: 'Dein Impact' }).click()
    await expect(page).toHaveURL(/\/#impact$/)
    await expect.poll(() => page.locator('#impact').evaluate((el) => el.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(140)
  })

  test('only real pages announce themselves as current, anchors never do', async ({ page, isMobile }) => {
    test.skip(isMobile, 'desktop header links')
    await page.goto('/')
    await expect(page.locator('.site-header [aria-current="page"]')).toHaveCount(1) // the logo
    await page.goto('/quellen')
    await expect(page.locator('.site-header').getByRole('link', { name: 'Quellen' })).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('.site-header [aria-current="page"]')).toHaveCount(1)
  })

  test('the logo brings you back to the top of the start page', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => window.scrollTo(0, 2500))
    await page.waitForTimeout(300)
    await page.locator('.site-header .wordmark').click()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBeLessThan(10)
  })

  test('a back-to-top button appears after scrolling and works', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: 'Nach oben' })).toBeHidden()
    await page.evaluate(() => window.scrollTo(0, 2000))
    const button = page.getByRole('button', { name: 'Nach oben' })
    await expect(button).toBeVisible()
    await button.click()
    await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 4000 }).toBeLessThan(10)
  })

  test('unknown urls get a friendly page with a way home', async ({ page }) => {
    await page.goto('/gibt-es-nicht')
    await expect(page).toHaveTitle(/Seite nicht gefunden/)
    await expect(page.locator('.not-found')).toContainText('404')
    await page.locator('.not-found').getByRole('link', { name: 'Zur Startseite' }).click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.locator('.hero-counter-number')).toBeVisible()
  })

  test('the estimate badge explains itself on the sources page', async ({ page }) => {
    await page.goto('/')
    await page.locator('.animal-estimate').first().click()
    await expect(page).toHaveURL(/\/quellen#methodik$/)
    await expect.poll(() => page.locator('#methodik').evaluate((el) => el.getBoundingClientRect().top), { timeout: 4000 }).toBeLessThan(140)
  })

  test('keyboard users can skip to the content', async ({ page, isMobile }) => {
    test.skip(isMobile, 'no keyboard on the phone project')
    await page.goto('/')
    await page.keyboard.press('Tab')
    await expect(page.locator('.skip-link')).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main$/)
    await expect(page.locator('#main')).toBeFocused()
  })
})

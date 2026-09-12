import { test, expect } from '@playwright/test'

test.describe('personal tracker dialog', () => {
  test('opens, focuses the date field and closes with Escape', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Jetzt eintragen' }).click()
    const dialog = page.locator('dialog.vt-modal')
    await expect(dialog).toBeVisible()
    await expect(dialog.locator('input[type="date"]')).toBeFocused()
    await page.keyboard.press('Escape')
    await expect(dialog).toBeHidden()
  })

  test('saves a date, survives a reload and can be reset', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Jetzt eintragen' }).click()
    const dialog = page.locator('dialog.vt-modal')
    const save = dialog.getByRole('button', { name: 'Speichern' })
    await expect(save).toBeDisabled()

    const twoYearsAgo = new Date()
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2)
    await dialog.locator('input[type="date"]').fill(twoYearsAgo.toISOString().slice(0, 10))
    await expect(save).toBeEnabled()
    await save.click()
    await expect(dialog).toBeHidden()
    await expect(page.locator('.personal-duration')).toContainText('seit 2 Jahren')
    await expect(page.locator('.personal-impact-value--lives')).not.toHaveText('0')

    await page.reload()
    await expect(page.locator('.personal-duration')).toContainText('seit 2 Jahren')

    await page.getByRole('button', { name: 'ändern' }).click()
    await dialog.getByRole('button', { name: 'Zurücksetzen' }).click()
    await expect(dialog).toBeHidden()
    await expect(page.getByRole('button', { name: 'Jetzt eintragen' })).toBeVisible()
  })

  test('date picked today reads "seit heute"', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Jetzt eintragen' }).click()
    const input = page.locator('dialog.vt-modal input[type="date"]')
    const max = await input.getAttribute('max')
    expect(max).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    await input.fill(max ?? '')
    await page.locator('dialog.vt-modal').getByRole('button', { name: 'Speichern' }).click()
    await expect(page.locator('.personal-duration')).toContainText('seit heute')
  })
})

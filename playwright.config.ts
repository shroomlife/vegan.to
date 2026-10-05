import { defineConfig, devices } from '@playwright/test'
import { CONSENT_STORAGE_KEY } from './src/utils/consentStorage'

const PORT = 4173
const BASE_URL = `http://127.0.0.1:${PORT}`

export default defineConfig({
  testDir: './e2e',
  timeout: 45_000,
  expect: { timeout: 10_000 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    locale: 'de-DE',
    timezoneId: 'Europe/Berlin',
    // Every test starts as a visitor who already declined analytics, so the
    // banner does not cover the page; e2e/consent.spec.ts starts without it
    storageState: {
      cookies: [],
      origins: [{ origin: BASE_URL, localStorage: [{ name: CONSENT_STORAGE_KEY, value: 'denied' }] }],
    },
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],
  webServer: {
    command: `bun run build && bun run preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
})

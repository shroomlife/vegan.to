/**
 * Prerender: after `vite build`, open every route in a headless browser and
 * save the rendered HTML in place of the plain index.html copy. Crawlers that
 * do not run JavaScript (and social previews) then see the real headings,
 * text, meta tags and JSON-LD of each page; the app mounts on top as usual.
 *
 * Run with: bun run scripts/prerender.ts   (part of `bun run build`)
 */
import { preview } from 'vite'
import { chromium } from '@playwright/test'
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'
import { routePaths } from '../src/data/routes'

const OUT_DIR = 'docs'
const PORT = 4188

const server = await preview({ preview: { port: PORT, strictPort: true, host: '127.0.0.1' }, logLevel: 'silent' })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

try {
  for (const path of routePaths) {
    await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' })
    // one tick for the in-view animations and the meta hooks to settle
    await page.waitForTimeout(400)
    const html = await page.evaluate(() => '<!doctype html>\n' + document.documentElement.outerHTML)
    const file = path === '/' ? `${OUT_DIR}/index.html` : `${OUT_DIR}${path}.html`
    mkdirSync(dirname(file), { recursive: true })
    writeFileSync(file, html)
    const title = await page.title()
    console.log(`prerendered ${path} → ${file} (${title})`)
  }
} finally {
  await browser.close()
  await server.close()
}

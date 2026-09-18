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

/**
 * Renders one route and writes the snapshot.
 *
 * stripCanonical is for the 404 page only: GitHub Pages serves 404.html for
 * every unknown url, so a canonical baked into it would name the wrong
 * address on all of them.
 */
async function snapshot(path: string, file: string, stripCanonical = false): Promise<void> {
  await page.goto(`http://127.0.0.1:${PORT}${path}`, { waitUntil: 'networkidle' })
  // Past the longest entrance animation (0.5 s delay plus 0.6 s duration) so the
  // ones that do run have finished writing frames
  await page.waitForTimeout(1400)

  /*
   * Tidy and serialise in ONE evaluate. Done in two, a still-running animation
   * could write opacity back between the two calls, which is exactly what made
   * this pass locally and fail on the runner.
   *
   * motion-v writes its `initial` state as an inline style at once and clears
   * it only when the animation runs. Elements below the fold animate on
   * whileInView, which never fires in a headless snapshot, so 51 of them froze
   * at opacity 0 and the start page was blank without javascript.
   *
   * The absolute urls are the preload links vite injects for the lazy route
   * chunks; left as they are, every visitor would be pointed at 127.0.0.1.
   */
  const { html, revealed, rewritten } = await page.evaluate((dropCanonical) => {
    if (dropCanonical) {
      document.head.querySelector('link[rel="canonical"]')?.remove()
      document.head.querySelector('meta[property="og:url"]')?.remove()
    }

    let revealed = 0
    for (const el of document.querySelectorAll<HTMLElement>('[data-ap]')) {
      if (!el.style.opacity && !el.style.transform) continue
      el.style.removeProperty('opacity')
      el.style.removeProperty('transform')
      if (!el.getAttribute('style')) el.removeAttribute('style')
      revealed++
    }

    let rewritten = 0
    for (const el of document.querySelectorAll('[href], [src]')) {
      for (const attr of ['href', 'src']) {
        const value = el.getAttribute(attr)
        if (!value || value.startsWith('/')) continue
        let url: URL
        try {
          url = new URL(value, document.baseURI)
        } catch {
          continue
        }
        if (url.origin !== location.origin) continue
        el.setAttribute(attr, url.pathname + url.search)
        rewritten++
      }
    }

    return { html: '<!doctype html>\n' + document.documentElement.outerHTML, revealed, rewritten }
  }, stripCanonical)

  // A blank #app means a view threw; writing it would ship an empty page
  if (!html.includes('<h1')) throw new Error(`prerender: ${path} rendered without an h1`)
  if (/style="[^"]*opacity:\s*0[;"]/.test(html)) throw new Error(`prerender: ${path} still hides content`)

  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
  const title = await page.title()
  console.log(`prerendered ${path} → ${file} (${title}, ${revealed} unhidden, ${rewritten} urls)`)
}

try {
  for (const path of routePaths) {
    await snapshot(path, path === '/' ? `${OUT_DIR}/index.html` : `${OUT_DIR}${path}.html`)
  }
  // vite build copies index.html to 404.html, so without this it ships the home
  // title and robots: index. Any unknown path renders the NotFound route.
  await snapshot('/404', `${OUT_DIR}/404.html`, true)
} finally {
  await browser.close()
  await server.close()
}

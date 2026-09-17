import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { routePaths } from './src/data/routes.ts'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

const SITE_URL = 'https://vegan.to'

/**
 * GitHub Pages serves <path>.html for /<path> with status 200 and 404.html for
 * everything else. A copy of index.html per route gives every page a real 200
 * (search engines skip pages served as 404), the 404 copy keeps deep links
 * to anything else inside the router.
 */
function spaFallback(outDir: string, paths: readonly string[]): Plugin {
  return {
    name: 'spa-fallback',
    apply: 'build',
    closeBundle() {
      copyFileSync(`${outDir}/index.html`, `${outDir}/404.html`)
      for (const path of paths) {
        if (path === '/') continue
        mkdirSync(dirname(`${outDir}${path}.html`), { recursive: true })
        copyFileSync(`${outDir}/index.html`, `${outDir}${path}.html`)
      }
    },
  }
}

function sitemap(outDir: string, paths: readonly string[]): Plugin {
  return {
    name: 'sitemap',
    apply: 'build',
    closeBundle() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = paths.map((path) => [
        '  <url>',
        `    <loc>${SITE_URL}${path}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        '  </url>',
      ].join('\n'))
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls,
        '</urlset>',
        '',
      ].join('\n')
      writeFileSync(`${outDir}/sitemap.xml`, xml)
    },
  }
}

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
    }),
    spaFallback('docs', routePaths),
    sitemap('docs', routePaths),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})

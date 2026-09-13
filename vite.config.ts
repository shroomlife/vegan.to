import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { copyFileSync, readFileSync, writeFileSync } from 'node:fs'
import { speciesSlugs } from './src/data/species'

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8')) as { version: string }

/** GitHub Pages serves 404.html for unknown paths; a copy of index.html lets the router handle /quellen */
function spaFallback(outDir: string): Plugin {
  return {
    name: 'spa-fallback-404',
    apply: 'build',
    closeBundle() {
      copyFileSync(`${outDir}/index.html`, `${outDir}/404.html`)
    },
  }
}

/** Every indexable route, so the sitemap can never forget a species page */
const SITE_URL = 'https://vegan.to'
const sitemapPaths = ['/', '/tiere', ...speciesSlugs.map((slug) => `/tiere/${slug}`), '/quellen']

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
    spaFallback('docs'),
    sitemap('docs', sitemapPaths),
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

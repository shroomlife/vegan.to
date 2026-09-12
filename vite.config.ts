import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'
import { copyFileSync, readFileSync } from 'node:fs'

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

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
    }),
    spaFallback('docs'),
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

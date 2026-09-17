import { speciesSlugs } from './species.ts'

/**
 * Every indexable path, in one place: the sitemap, the per-route HTML copies
 * and the prerenderer all read this list. Relative import only, the Vite
 * config and the build scripts load this file outside the app bundle.
 */
export const routePaths: readonly string[] = ['/', '/tiere', ...speciesSlugs.map((slug) => `/tiere/${slug}`), '/quellen']

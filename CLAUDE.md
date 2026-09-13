# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**vegan.to** — A single-page Vue 3 app that displays real-time animal slaughter counters for Germany, extrapolated from official Destatis statistics. The site is in German.

## Commands

```bash
bun run dev       # Vite dev server with HMR
bun run build     # Type-check + production build → docs/, then scripts/prerender.ts snapshots every route to static HTML
bun run indexnow  # After a deploy: ping IndexNow (Bing & Co.) with every route from src/data/routes.ts
bun run preview   # Preview production build locally
bun run lint      # ESLint (vue3-recommended + typescript-eslint)
```

Build output goes to `docs/` (configured in `vite.config.ts`) for GitHub Pages deployment (CNAME: vegan.to).

## Stack

- **Vue 3.5** + TypeScript + Composition API (`<script setup lang="ts">`)
- **Vite 6** with `@vitejs/plugin-vue` and `vite-plugin-pwa`
- **Vue Router 4** (history mode, routes `/`, `/tiere`, `/tiere/:slug` (one page per species from `src/data/species.ts`) and `/quellen`; `docs/404.html` is a copy of index.html so GitHub Pages deep links reach the router). `docs/sitemap.xml`, one `<path>.html` copy per route (GitHub Pages then answers 200) and the prerendered snapshots all come from `src/data/routes.ts`
- **@vueuse/core** — `useTransition` for animated number counters
- **dayjs** — lightweight date math (replaces moment.js)
- **humanize-duration** — German-language elapsed time display
- **Bun** as package manager (never npm/yarn)

## Architecture

### Data flow

1. `src/data/animals.ts` — typed array of animal species with yearly kill counts from Destatis (2025 data). Exports raw numbers only, no rate calculations.
2. `src/composables/useTimer.ts` — reactive timer updating every second, provides `secondsSinceStart`, `secondsSinceYearStart`, `secondsSinceDayStart`, `elapsedFormatted`.
3. `src/composables/useAnimalData.ts` — takes timer, computes all derived values reactively (per-day rates, current year/day totals, killed-since-start counts). Returns `animalData` and `totalDeathCount`.
4. `src/composables/useLiveState.ts` — `provideLiveState()` in `App.vue` creates one timer, animal data and victim ticker; header, home view and counter pill inject it via `useLiveState()`.
5. `src/views/HomeView.vue` — main view: hero (`HeroSky` canvas with one light per killed animal, `VictimCard` lanes), sheet with live sentence, species grid, then the editorial chapters (`SpeciesFactsChapter`, `LifeFactsChapter`, `FaqChapter`) fed by `src/data/facts.ts`, growth, `ImpactChapter` (impact math, personal tracker, dialog), `ActionChapter` (hand-offs from `src/data/actions.ts`).

### Key files

- `src/utils/formatNumber.ts` — `Intl.NumberFormat('de-DE')` wrapper (replaces humanize package)
- `src/utils/scroll.ts` — smooth scrolling that respects `prefers-reduced-motion`; `src/composables/useAnchorNavigation.ts` handles same-location clicks (logo, anchors)
- `src/App.vue` — `SiteHeader` (sticky glass header) + `<RouterView />` + `SiteFooter`
- `src/components/BrandWordmark.vue`, `PrideFlag.vue`, `SiteHeader.vue`, `SiteFooter.vue` — brand shell; tokens in `src/assets/custom.css` (forest green, cream, accent, Unbounded display font)
- `src/data/sources.ts` — every external figure's source with category; rendered on `/quellen` (`src/views/SourcesView.vue`). `src/data/facts.ts`, `src/data/lifespans.ts` (lifespans and slaughter ages) and `src/data/species.ts` reference sources by id, `SourceLinks.vue` renders them inline. `species.ts` must stay free of runtime imports, the Vite config reads it
- `src/components/CounterPill.vue` — the running total that follows the visitor (header on desktop, bottom pill on mobile) once the hero is out of view
- `src/utils/documentMeta.ts` — `applyDocumentMeta()` sets title, description, canonical and Open Graph tags; static routes via `router.afterEach`, dynamic pages (species) call it themselves; `src/composables/useJsonLd.ts` injects schema.org blocks (FAQPage from the FAQ data). Static head tags, WebSite/Organization/WebApplication graph and the OG image (`public/img/og.png`) live in `index.html`
- `motion-v`: the element is set with `as="h2"`, never `tag` (that would render a div with a stray attribute)
- `public/` — static assets, CNAME, manifest.json, icons, robots.txt, sitemap.xml

### Styling

Bootstrap 4 (vendored minified CSS in `src/assets/`), plus `custom.css` and `social.css` for sharing buttons. No CSS preprocessor.

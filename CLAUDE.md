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
- **No date library** — Berlin day and year boundaries come from `Intl.DateTimeFormat` (`src/utils/berlinTime.ts`), the German elapsed time from `src/utils/formatDuration.ts`
- **Bun** as package manager (never npm/yarn)

## Architecture

### Data flow

1. `src/data/animals.ts` — typed array of animal species with yearly kill counts from Destatis (2025 data). Exports raw numbers only, no rate calculations.
2. `src/composables/useTimer.ts` — reactive timer updating every second, provides `secondsSinceStart`, `secondsSinceYearStart`, `secondsSinceDayStart`, `elapsedFormatted`.
3. `src/composables/useAnimalData.ts` — takes timer, computes all derived values reactively (per-day rates, current year/day totals, killed-since-start counts). Returns `animalData` and `totalDeathCount`.
4. `src/composables/useLiveState.ts` — `provideLiveState()` in `App.vue` creates one timer, animal data and victim ticker; header, home view and counter pill inject it via `useLiveState()`.
5. `src/views/HomeView.vue` — main view: hero (`HeroSky` canvas with one light per killed animal, `VictimCard` lanes), sheet with live sentence, species grid, then the editorial chapters (`SpeciesFactsChapter`, `LifeFactsChapter`, `FaqChapter`) fed by `src/data/facts.ts`, `BackgroundsChapter` (the door to the Zeitreise and the topic pages from `src/data/topics.ts`), growth, `ImpactChapter` (impact math, personal tracker, dialog), `ActionChapter` (hand-offs from `src/data/actions.ts`).

### Key files

- `src/utils/formatNumber.ts` — `Intl.NumberFormat('de-DE')` wrapper (replaces humanize package)
- `src/utils/scroll.ts` — smooth scrolling that respects `prefers-reduced-motion`; `src/composables/useAnchorNavigation.ts` handles same-location clicks (logo, anchors)
- `src/App.vue` — `SiteHeader` (sticky glass header) + `<RouterView />` + `SiteFooter`
- `src/components/BrandWordmark.vue`, `PrideFlag.vue`, `SiteHeader.vue`, `SiteFooter.vue`, `MobileMenu.vue` (the phone navigation, a native `<dialog>`) — brand shell; tokens in `src/assets/custom.css` (forest green, cream, accent, Unbounded display font)
- `src/data/sources.ts` — every external figure's source with category; rendered on `/quellen` (`src/views/SourcesView.vue`). `src/data/facts.ts`, `src/data/lifespans.ts` (lifespans and slaughter ages) and `src/data/species.ts` reference sources by id, `SourceLinks.vue` renders them inline. `species.ts` must stay free of runtime imports, the Vite config reads it
- `src/components/CounterPill.vue` — the running total that follows the visitor (header on desktop, bottom pill on mobile) once the hero is out of view
- `src/utils/documentMeta.ts` — `applyDocumentMeta()` sets title, description, canonical and Open Graph tags; static routes via `router.afterEach`, dynamic pages (species) call it themselves; `src/composables/useJsonLd.ts` injects schema.org blocks (FAQPage from the FAQ data). Static head tags, WebSite/Organization/WebApplication graph and the OG image (`public/img/og.png`) live in `index.html`
- Scroll-in animations use the `v-reveal` directive (`src/directives/reveal.ts`, IntersectionObserver plus CSS transition): every element starts when its top crosses `ENTER_LINE` (`src/utils/scroll.ts`, shared with `useSceneProgress`), elements crossing together stagger automatically, so no per-index delays in templates; the hero entrance is CSS keyframes. No animation library
- `public/` — static assets, CNAME, manifest.json, icons, robots.txt, sitemap.xml

### Styling

`src/assets/base.css` (own reboot, `.container`, `.text-center`), plus `custom.css` (brand tokens, shared chapter and prose styles) and `social.css` for sharing buttons. No CSS framework, no CSS preprocessor.

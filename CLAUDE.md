# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**vegan.to** — A single-page Vue 3 app that displays real-time animal slaughter counters for Germany, extrapolated from official Destatis statistics. The site is in German.

## Commands

```bash
bun run dev       # Vite dev server with HMR
bun run build     # Type-check + production build → docs/
bun run preview   # Preview production build locally
bun run lint      # ESLint (vue3-recommended + typescript-eslint)
```

Build output goes to `docs/` (configured in `vite.config.ts`) for GitHub Pages deployment (CNAME: vegan.to).

## Stack

- **Vue 3.5** + TypeScript + Composition API (`<script setup lang="ts">`)
- **Vite 6** with `@vitejs/plugin-vue` and `vite-plugin-pwa`
- **Vue Router 4** (history mode, single route `/`)
- **@vueuse/core** — `useTransition` for animated number counters
- **dayjs** — lightweight date math (replaces moment.js)
- **humanize-duration** — German-language elapsed time display
- **Bun** as package manager (never npm/yarn)

## Architecture

### Data flow

1. `src/data/animals.ts` — typed array of animal species with yearly kill counts from Destatis (2024/2025 data). Exports raw numbers only, no rate calculations.
2. `src/composables/useTimer.ts` — reactive timer updating every second, provides `secondsSinceStart`, `secondsSinceYearStart`, `secondsSinceDayStart`, `elapsedFormatted`.
3. `src/composables/useAnimalData.ts` — takes timer, computes all derived values reactively (per-day rates, current year/day totals, killed-since-start counts). Returns `animalData`, `totalDeathCount`, `totalDeathEmojis`.
4. `src/views/HomeView.vue` — main view consuming both composables, renders counters with `useTransition` for smooth animation.

### Key files

- `src/utils/formatNumber.ts` — `Intl.NumberFormat('de-DE')` wrapper (replaces humanize package)
- `src/utils/shuffle.ts` — Fisher-Yates shuffle (replaces lodash)
- `src/App.vue` — navbar + `<RouterView />`
- `public/` — static assets, CNAME, manifest.json, icons

### Styling

Bootstrap 4 (vendored minified CSS in `src/assets/`), plus `custom.css` and `social.css` for sharing buttons. No CSS preprocessor.

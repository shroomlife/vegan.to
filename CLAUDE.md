# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**vegan.to** — A single-page Vue 2 app that displays a real-time counter of animal slaughter statistics in Germany, extrapolated from official data sources (Statistisches Bundesamt, Statista). The site is in German.

## Commands

```bash
bun run serve   # Dev server with hot-reload
bun run build   # Production build → outputs to docs/
bun run lint    # ESLint (Vue essential + Standard config)
```

Build output goes to `docs/` (configured in `vue.config.js`) for GitHub Pages deployment.

## Architecture

- **Vue 2** with Vue CLI 4, Vue Router 3 (history mode), Babel, PWA plugin
- **Single route** — `/` renders `src/views/Home.vue`, which is the entire app
- **No state management** — all state lives in `Home.vue`'s `data()` and computed properties
- `src/components/HelloWorld.vue` is unused (default scaffold artifact)

### Data flow

1. `src/data/animals.js` exports a pre-computed array of animal types with yearly kill counts, per-day/per-hour/per-second rates, and emoji identifiers. Data uses `node-emoji` for emoji lookup.
2. `Home.vue` imports this data, calculates current year/day totals on mount (`loadData`), then runs `updateData` every second via `setInterval` to show live counters.
3. `@maxflex/v-number` provides animated number transitions in the UI.
4. `humanize` formats large numbers with German-style separators; `humanize-duration` shows elapsed time in German; `moment` handles date math; `lodash` shuffles emoji arrays.

### Styling

Bootstrap (vendored minified CSS in `src/assets/`), plus `custom.css` and `social.css` for sharing buttons. No CSS preprocessor.

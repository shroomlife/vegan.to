<script setup lang="ts">
import { nextTick, ref, useTemplateRef, watch } from 'vue'
import { useRoute } from 'vue-router'
import BrandWordmark from '@/components/BrandWordmark.vue'
import TopicIcon from '@/components/TopicIcon.vue'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'
import { useLiveState } from '@/composables/useLiveState'
import { animals } from '@/data/animals'
import { speciesProfiles } from '@/data/species'
import { topicPages } from '@/data/topics'

/**
 * The phone navigation: a "Menü" button in the header opening a sheet from the
 * right. Native <dialog> via showModal() gives the top layer, the focus trap,
 * Escape and focus return to the button for free, like PauseButton and ImpactChapter.
 */
const pageLinks = [
  { label: 'Zahlen', to: '/#zahlen' },
  { label: 'Dein Impact', to: '/#impact' },
  { label: 'Mitmachen', to: '/#mitmachen' },
  { label: 'Quellen und Methodik', to: '/quellen' },
]

/** The species index link shows every species it leads to, in the order of the species pages */
const speciesEmojis = speciesProfiles
  .map((profile) => animals.find((a) => a.names.single === profile.single)?.names.emoji)
  .filter((emoji): emoji is string => emoji !== undefined)

const dialog = useTemplateRef<HTMLDialogElement>('dialog')
// The link lists only render while open, so the closed menu adds no second copy of every link to the page
const isOpen = ref(false)
const { onNavClick, isPageLink } = useAnchorNavigation()
const { isMobile } = useLiveState()
const route = useRoute()

async function open() {
  isOpen.value = true
  // The lists render on open; showModal has to find the autofocus target already in place
  await nextTick()
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}

/**
 * Close before navigating: the page scroll is locked while the sheet is open,
 * and a same-location anchor click has to scroll the page right away.
 */
function follow(navigate: (event?: MouseEvent) => unknown, event: MouseEvent, to: string) {
  close()
  navigate(event)
  onNavClick(to)
}

// Back and forward buttons change the route without a click inside the sheet
watch(() => route.fullPath, close)
// Turning a tablet to landscape hides the button; a sheet left open there would trap focus out of sight
watch(isMobile, (mobile) => {
  if (!mobile) close()
})
</script>

<template>
  <div class="mobile-menu">
    <button
      type="button"
      class="mobile-menu-button"
      aria-haspopup="dialog"
      aria-controls="mobile-menu-dialog"
      :aria-expanded="isOpen"
      @click="open"
    >
      <svg class="mobile-menu-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
      <span class="mobile-menu-label">Menü</span>
    </button>

    <dialog
      id="mobile-menu-dialog"
      ref="dialog"
      class="mobile-menu-dialog"
      aria-label="Menü"
      @close="isOpen = false"
      @mousedown.self="close"
    >
      <div v-if="isOpen" class="mobile-menu-sheet">
        <div class="mobile-menu-top">
          <BrandWordmark class="mobile-menu-brand" @click="close" />
          <button type="button" class="mobile-menu-close" aria-label="Menü schließen" autofocus @click="close">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav class="mobile-menu-nav" aria-label="Navigation">
          <section class="mobile-menu-group" aria-labelledby="mobile-menu-page">
            <h2 id="mobile-menu-page" class="mobile-menu-title">Seite</h2>
            <ul class="mobile-menu-list">
              <li v-for="link in pageLinks" :key="link.to">
                <RouterLink :to="link.to" custom v-slot="{ href, navigate, isExactActive }">
                  <a
                    :href="href"
                    class="mobile-menu-link"
                    :aria-current="isExactActive && isPageLink(link.to) ? 'page' : undefined"
                    @click="follow(navigate, $event, link.to)"
                  >
                    <span>{{ link.label }}</span>
                    <span class="mobile-menu-arrow" aria-hidden="true">→</span>
                  </a>
                </RouterLink>
              </li>
            </ul>
          </section>

          <section class="mobile-menu-group" aria-labelledby="mobile-menu-species">
            <h2 id="mobile-menu-species" class="mobile-menu-title">Tierarten</h2>
            <RouterLink to="/tiere" custom v-slot="{ href, navigate, isExactActive }">
              <a
                :href="href"
                class="mobile-menu-species"
                :aria-current="isExactActive ? 'page' : undefined"
                @click="follow(navigate, $event, '/tiere')"
              >
                <span class="mobile-menu-species-head">
                  <span class="mobile-menu-species-label">Alle {{ speciesEmojis.length }} Tierarten</span>
                  <span class="mobile-menu-arrow" aria-hidden="true">→</span>
                </span>
                <span class="mobile-menu-species-emojis" aria-hidden="true">
                  <span v-for="emoji in speciesEmojis" :key="emoji">{{ emoji }}</span>
                </span>
              </a>
            </RouterLink>
          </section>

          <section class="mobile-menu-group" aria-labelledby="mobile-menu-topics">
            <h2 id="mobile-menu-topics" class="mobile-menu-title">Hintergründe</h2>
            <ul class="mobile-menu-list">
              <li v-for="topic in topicPages" :key="topic.path">
                <RouterLink :to="topic.path" custom v-slot="{ href, navigate, isExactActive }">
                  <a
                    :href="href"
                    class="mobile-menu-link mobile-menu-link--topic"
                    :aria-current="isExactActive ? 'page' : undefined"
                    @click="follow(navigate, $event, topic.path)"
                  >
                    <TopicIcon :name="topic.name" class="mobile-menu-topic-icon" />
                    <span>{{ topic.label }}</span>
                  </a>
                </RouterLink>
              </li>
            </ul>
          </section>
        </nav>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
/* Follows the header's colour (cream over the hero, green below it), so it needs no variant of its own */
.mobile-menu-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 12px 0 10px;
  border: 1px solid color-mix(in srgb, currentColor 32%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, currentColor 6%, transparent);
  color: inherit;
  font: inherit;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.mobile-menu-button:hover,
.mobile-menu-button[aria-expanded='true'] {
  background: color-mix(in srgb, currentColor 14%, transparent);
}
.mobile-menu-button:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 3px;
}
.mobile-menu-icon {
  width: 20px;
  height: 20px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
}

/* The sheet: full height on the right, the backdrop strip on the left closes it */
.mobile-menu-dialog {
  inset: 0 0 0 auto;
  width: min(420px, calc(100% - 40px));
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 0;
  border: none;
  background: var(--brand-cream);
  color: var(--brand-green);
  box-shadow: -24px 0 80px rgba(0, 0, 0, 0.3);
}
.mobile-menu-dialog[open] {
  animation: mobile-menu-in 0.32s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.mobile-menu-dialog::backdrop {
  background: rgba(6, 15, 9, 0.6);
  backdrop-filter: blur(6px);
  animation: mobile-menu-fade 0.2s ease;
}
@keyframes mobile-menu-in {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
@keyframes mobile-menu-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
.mobile-menu-sheet {
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 20px calc(28px + env(safe-area-inset-bottom));
}
/* Same height as the header, so the wordmark sits where the eye left it */
.mobile-menu-top {
  position: sticky;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--header-height);
  margin: 0 -20px;
  padding: env(safe-area-inset-top) 8px 0 20px;
  box-sizing: content-box;
  background: var(--brand-cream);
  border-bottom: 1px solid rgba(20, 54, 31, 0.1);
}
.mobile-menu-brand {
  font-size: 20px;
  padding-block: 12px;
}
.mobile-menu-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: none;
  color: var(--brand-green);
  cursor: pointer;
  transition: background 0.15s;
}
.mobile-menu-close svg {
  width: 24px;
  height: 24px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2.2;
  stroke-linecap: round;
}
.mobile-menu-close:hover,
.mobile-menu-close:focus-visible {
  background: rgba(20, 54, 31, 0.08);
}

.mobile-menu-nav {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-top: 24px;
}
.mobile-menu-title {
  margin: 0 0 6px;
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}
.mobile-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.mobile-menu-list li + li {
  border-top: 1px solid rgba(20, 54, 31, 0.08);
}
.mobile-menu-link {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 48px;
  padding: 10px 4px;
  font-size: 1.02rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--brand-green);
  text-decoration: none;
}
.mobile-menu-link > span:first-child {
  flex: 1;
}
.mobile-menu-link--topic {
  font-weight: 600;
}
.mobile-menu-arrow {
  font-weight: 700;
  color: var(--brand-accent-text);
  transition: transform 0.15s;
}
.mobile-menu-topic-icon {
  flex: none;
  width: 22px;
  height: 22px;
  color: var(--brand-green-soft);
}
.mobile-menu-link:hover,
.mobile-menu-link:focus-visible,
.mobile-menu-species:hover,
.mobile-menu-species:focus-visible {
  color: var(--brand-green);
  text-decoration: none;
}
.mobile-menu-link:hover .mobile-menu-arrow,
.mobile-menu-species:hover .mobile-menu-arrow {
  transform: translateX(3px);
}
.mobile-menu-link[aria-current='page'],
.mobile-menu-species[aria-current='page'] {
  color: var(--brand-accent-text);
}
.mobile-menu-link:focus-visible,
.mobile-menu-species:focus-visible,
.mobile-menu-close:focus-visible {
  outline: 2px solid var(--brand-green);
  outline-offset: 2px;
  border-radius: 10px;
}
.mobile-menu-close:focus-visible {
  border-radius: 50%;
}

/* The species index as one card: the emojis say what is behind it before the label does */
.mobile-menu-species {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 48px;
  padding: 14px 16px;
  border: 1px solid rgba(20, 54, 31, 0.1);
  border-radius: 18px;
  background: var(--brand-surface);
  color: var(--brand-green);
  text-decoration: none;
}
.mobile-menu-species-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}
.mobile-menu-species-label {
  font-size: 1.02rem;
  font-weight: 700;
}
/* One row across the card at every phone width, never a lone fish on a second line */
.mobile-menu-species-emojis {
  display: flex;
  justify-content: space-between;
  /* Scales down on the narrowest phones so all ten still fit */
  font-size: min(1.05rem, 4.4vw);
  line-height: 1.2;
}

/* Below 375 px brand, hand-off and a labelled button do not fit side by side: icon only, the label stays the accessible name */
@media (max-width: 374px) {
  .mobile-menu-button {
    width: 44px;
    padding: 0;
    justify-content: center;
  }
  .mobile-menu-label {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
}
@media (prefers-reduced-motion: reduce) {
  .mobile-menu-dialog[open],
  .mobile-menu-dialog::backdrop {
    animation: none;
  }
  .mobile-menu-arrow {
    transition: none;
  }
}
</style>

<style>
/* Not every browser stops the page behind a modal dialog from scrolling */
html:has(.mobile-menu-dialog[open]) {
  overflow: hidden;
}
</style>

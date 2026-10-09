<script setup lang="ts">
/**
 * A door between two chapters of the start page: one line that says where
 * the story continues in depth, and the page it continues on.
 */
import SceneImage from '@/components/SceneImage.vue'

defineProps<{
  kicker: string
  title: string
  text: string
  to: string
  label: string
  /** A licensed photo under public/img/zeitreise that stands for the page behind the door */
  picture: string
  pictureAlt: string
}>()
</script>

<template>
  <aside class="chapter-exit" :aria-label="kicker">
    <RouterLink v-reveal="{ y: 20, duration: 0.5 }" :to="to" class="chapter-exit-link">
      <span class="chapter-exit-picture">
        <SceneImage :name="picture" :alt="pictureAlt" sizes="(max-width: 767px) 100vw, 320px" />
      </span>
      <span class="chapter-exit-copy">
        <span class="chapter-exit-kicker">{{ kicker }}</span>
        <span class="chapter-exit-title">{{ title }}</span>
        <span class="chapter-exit-text">{{ text }}</span>
      </span>
      <span class="chapter-exit-cta">
        {{ label }}
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
          <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14m-6-6l6 6l-6 6" />
        </svg>
      </span>
    </RouterLink>
  </aside>
</template>

<style scoped>
.chapter-exit {
  background: var(--brand-green);
  color: var(--brand-cream);
  padding: 0 var(--page-gutter);
}
.chapter-exit-link {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 1.5rem 0;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr) auto;
  align-items: center;
  gap: 2rem;
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid rgba(246, 241, 231, 0.12);
}
.chapter-exit-picture {
  display: block;
  aspect-ratio: 16 / 10;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(246, 241, 231, 0.06);
}
.chapter-exit-picture :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1.02);
  transition: transform 0.6s ease-out;
}
.chapter-exit-copy {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 0;
}
.chapter-exit-kicker {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #7fe0a5;
}
.chapter-exit-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(1.15rem, 2.2vw, 1.6rem);
  letter-spacing: -0.025em;
  line-height: 1.15;
  text-wrap: balance;
}
.chapter-exit-text {
  max-width: 60ch;
  font-size: 0.95rem;
  line-height: 1.55;
  color: rgba(246, 241, 231, 0.76);
}
.chapter-exit-cta {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.3rem;
  border-radius: 999px;
  border: 1.5px solid rgba(246, 241, 231, 0.3);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s, color 0.2s, transform 0.2s;
}
.chapter-exit-cta svg {
  transition: transform 0.2s;
}
.chapter-exit-link:hover,
.chapter-exit-link:focus-visible {
  color: inherit;
  text-decoration: none;
}
.chapter-exit-link:focus-visible .chapter-exit-cta {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: var(--brand-green);
}
/* Hover effects only where a pointer hovers; on touch they would stick after the tap */
@media (hover: hover) {
  .chapter-exit-link:hover .chapter-exit-picture :deep(img) {
    transform: scale(1.08);
  }
  .chapter-exit-link:hover .chapter-exit-cta {
    background: var(--brand-accent);
    border-color: var(--brand-accent);
    color: var(--brand-green);
  }
  .chapter-exit-link:hover .chapter-exit-cta svg {
    transform: translateX(3px);
  }
}
.chapter-exit-link:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 4px;
}
@media (prefers-reduced-motion: reduce) {
  .chapter-exit-cta,
  .chapter-exit-cta svg,
  .chapter-exit-picture :deep(img) {
    transition: none;
  }
  .chapter-exit-link:hover .chapter-exit-cta svg,
  .chapter-exit-link:hover .chapter-exit-picture :deep(img) {
    transform: none;
  }
}
@media (max-width: 767px) {
  .chapter-exit-link {
    grid-template-columns: 1fr;
    align-items: flex-start;
    gap: 1.1rem;
    padding: 1.6rem 0;
  }
  .chapter-exit-picture {
    width: 100%;
    aspect-ratio: 2 / 1;
  }
  .chapter-exit-cta {
    justify-content: center;
    min-height: 48px;
  }
}
</style>

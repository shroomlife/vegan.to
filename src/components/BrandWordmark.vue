<script setup lang="ts">
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'

// On the start page the logo scrolls back to the top instead of doing nothing
const { onNavClick } = useAnchorNavigation()
</script>

<template>
  <!-- Size follows the parent's font-size; the leaf replaces the dot -->
  <RouterLink to="/" class="wordmark" aria-label="vegan.to, zur Startseite" @click="onNavClick('/')">
    <span>vegan</span>
    <svg class="wordmark-leaf" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M20 4c-8 0-14 4-15 12 4-6 9-8 12-9-3 2-7 5-9 12 9 0 13-7 12-15z" />
    </svg>
    <span>to</span>
  </RouterLink>
</template>

<style scoped>
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 0.06em;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1em;
  letter-spacing: -0.03em;
  line-height: 1;
  color: inherit;
  text-decoration: none;
  white-space: nowrap;
}
.wordmark:hover,
.wordmark:focus-visible {
  color: inherit;
  text-decoration: none;
}
.wordmark:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 4px;
  border-radius: 4px;
}
.wordmark-leaf {
  width: 0.72em;
  height: 0.72em;
  margin-top: 0.12em;
  fill: var(--brand-accent);
}
</style>

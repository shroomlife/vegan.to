<script setup lang="ts">
import { formatNumber } from '@/utils/formatNumber'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'

defineProps<{
  count: number
}>()

// The pill only shows on the start page, where a plain RouterLink to "/" would ignore the tap
const { onNavClick } = useAnchorNavigation()
</script>

<template>
  <!-- The counter follows the visitor once the hero has scrolled away; a tap brings the big counter back. A fixed name: the figure changes every second and would be announced again and again. No comment inside the slot: RouterLink renders its only child as the root, a comment next to it would turn that into a fragment in dev builds -->
  <RouterLink to="/" custom v-slot="{ href, navigate }">
    <a :href="href" class="counter-pill" aria-label="seit du hier bist, zurück zum Zähler" @click="navigate($event); onNavClick('/')">
      <span class="counter-pill-dot" aria-hidden="true"></span>
      <span class="counter-pill-number">{{ formatNumber(count) }}</span>
      <span class="counter-pill-label">seit du hier bist</span>
    </a>
  </RouterLink>
</template>

<style scoped>
.counter-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(246, 241, 231, 0.2);
  background: rgba(246, 241, 231, 0.08);
  color: var(--brand-cream);
  font-size: 12px;
  text-decoration: none;
  white-space: nowrap;
  transition: background 0.15s;
}
.counter-pill:hover,
.counter-pill:focus-visible {
  color: var(--brand-cream);
  text-decoration: none;
  background: rgba(246, 241, 231, 0.14);
}
.counter-pill-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--brand-accent);
  box-shadow: 0 0 0 3px rgba(255, 106, 61, 0.2);
}
.counter-pill-number {
  font-family: var(--font-display);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--brand-accent);
}
.counter-pill-label {
  opacity: 0.8;
}
</style>

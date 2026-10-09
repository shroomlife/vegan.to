<script setup lang="ts">
import type { SourceId } from '@/data/sources'
import SourceLinks from '@/components/SourceLinks.vue'

export interface KeyFigure {
  /** Already formatted, e.g. "20.950.800" or "rund 15 %" */
  value: string
  label: string
  note?: string
  sources?: readonly SourceId[]
}

defineProps<{
  items: readonly KeyFigure[]
}>()
</script>

<template>
  <dl class="figure-grid">
    <div v-for="item in items" :key="item.label" class="figure-grid-item">
      <dt class="figure-grid-label">{{ item.label }}</dt>
      <dd class="figure-grid-value">{{ item.value }}</dd>
      <dd v-if="item.note" class="figure-grid-note">{{ item.note }}</dd>
      <dd v-if="item.sources?.length" class="figure-grid-sources"><SourceLinks :ids="item.sources" /></dd>
    </div>
  </dl>
</template>

<style scoped>
/* Two cards side by side even on a 360px phone */
.figure-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
  gap: 0.9rem;
  margin: 0 0 1.75rem;
}
.figure-grid-item {
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  padding: 1.15rem 1.25rem;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
/* Label first in the markup for screen readers, shown under the number */
.figure-grid-label {
  order: 2;
  margin-top: 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.4;
  color: var(--brand-green);
}
/* A figure breaks only between words ("10,9 bis 12,5 %" may break after "bis"), never inside a number. The cap of 13.5cqi keeps an eleven-character number such as "156.300.900" inside its card at any card width. */
.figure-grid-value {
  order: 1;
  margin: 0;
  font-family: var(--font-display);
  font-size: min(clamp(1.3rem, 2.6vw, 1.7rem), 13.5cqi);
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--brand-death-text);
  font-variant-numeric: tabular-nums;
  overflow-wrap: normal;
}
.figure-grid-note {
  order: 3;
  margin: 0.4rem 0 0;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--brand-muted);
}
.figure-grid-sources {
  order: 4;
  margin: 0.6rem 0 0;
}
@media (max-width: 767px) {
  .figure-grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 140px), 1fr));
    gap: 0.6rem;
  }
  .figure-grid-item {
    padding: 0.95rem 1rem;
    border-radius: 16px;
  }
  .figure-grid-value {
    font-size: min(clamp(1.05rem, 4.6vw, 1.35rem), 13.5cqi);
  }
  .figure-grid-label {
    font-size: 0.78rem;
  }
}
</style>

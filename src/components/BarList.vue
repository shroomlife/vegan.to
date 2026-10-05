<script setup lang="ts">
import { computed } from 'vue'
import type { SourceId } from '@/data/sources'
import { formatNumber } from '@/utils/formatNumber'
import SourceLinks from '@/components/SourceLinks.vue'

export interface Bar {
  label: string
  value: number
  /** Shown instead of the formatted value, e.g. "6.613 (Seuchenjahr)" */
  display?: string
}

const props = defineProps<{
  caption: string
  items: readonly Bar[]
  note?: string
  sources?: readonly SourceId[]
}>()

const max = computed(() => Math.max(0, ...props.items.map((item) => item.value)))
/** A value above zero always gets a visible sliver, zero gets none */
function width(value: number): string {
  if (max.value <= 0 || value <= 0) return '0%'
  return `${Math.max(0.8, (value / max.value) * 100)}%`
}
</script>

<template>
  <figure class="bar-list">
    <figcaption class="bar-list-caption">{{ caption }}</figcaption>
    <ol class="bar-list-items">
      <li v-for="item in items" :key="item.label" class="bar-list-item">
        <span class="bar-list-label">{{ item.label }}</span>
        <span class="bar-list-track" aria-hidden="true"><span :style="{ width: width(item.value) }"></span></span>
        <span class="bar-list-value">{{ item.display ?? formatNumber(item.value) }}</span>
      </li>
    </ol>
    <p v-if="note" class="bar-list-note">{{ note }}</p>
    <SourceLinks v-if="sources?.length" :ids="sources" />
  </figure>
</template>

<style scoped>
.bar-list {
  margin: 0 0 1.75rem;
  padding: 1.1rem 1.25rem 1rem;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.bar-list-caption {
  margin-bottom: 0.9rem;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--brand-green);
}
.bar-list-items {
  list-style: none;
  margin: 0 0 0.75rem;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.bar-list-item {
  margin: 0;
  display: grid;
  grid-template-columns: minmax(7rem, 11rem) 1fr auto;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
}
.bar-list-label {
  color: var(--brand-green);
  font-weight: 600;
  line-height: 1.3;
}
.bar-list-track {
  height: 10px;
  border-radius: 5px;
  background: rgba(20, 54, 31, 0.07);
  overflow: hidden;
}
.bar-list-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: var(--brand-death);
}
.bar-list-value {
  min-width: 5.5rem;
  text-align: right;
  font-variant-numeric: tabular-nums;
  color: var(--brand-ink);
}
.bar-list-note {
  margin: 0 0 0.4rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--brand-muted);
}
@media (max-width: 767px) {
  .bar-list-item {
    grid-template-columns: 1fr auto;
    gap: 0.25rem 0.75rem;
  }
  .bar-list-track {
    grid-column: 1 / -1;
    grid-row: 2;
  }
}
</style>

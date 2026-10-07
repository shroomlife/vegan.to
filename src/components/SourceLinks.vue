<script setup lang="ts">
import { computed } from 'vue'
import { sources, type SourceId } from '@/data/sources'
import { citationAnchor, useCitations } from '@/composables/useCitations'

/**
 * The sources behind a figure or a sentence. On a page that provides a
 * citation registry (the start page) this renders small numbers that lead to
 * the source list at the end; everywhere else the full source line.
 */
const props = defineProps<{
  ids: readonly SourceId[]
}>()

const citations = useCitations()
const entries = computed(() => props.ids.map((id) => sources[id]))
/** Number and label per source, only with a registry; computed once, the registry never renumbers */
const notes = computed(() => {
  if (!citations) return []
  const numbers = citations.cite(props.ids)
  return props.ids.map((id, index) => ({ id, number: numbers[index] ?? 0, label: sources[id].label }))
})
</script>

<template>
  <sup v-if="citations" class="source-notes">
    <a
      v-for="note in notes"
      :key="note.id"
      :href="`#${citationAnchor(note.number)}`"
      class="source-note"
      :aria-label="`Quelle ${note.number}: ${note.label}`"
      :title="note.label"
    >{{ note.number }}</a>
  </sup>
  <p v-else class="source-links">
    <span class="source-links-label">{{ entries.length > 1 ? 'Quellen' : 'Quelle' }}:</span>
    <template v-for="(source, index) in entries" :key="source.url">
      <a :href="source.url" target="_blank" rel="noopener">{{ source.label }}</a><template v-if="index < entries.length - 1">, </template>
    </template>
  </p>
</template>

<style scoped>
/* The numbers: small pills at the end of the text, no line of their own */
.source-notes {
  display: inline-flex;
  gap: 3px;
  margin-left: 4px;
  font-size: 0;
  line-height: 0;
  vertical-align: 4px;
}
.source-note {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 999px;
  background: rgba(255, 106, 61, 0.14);
  font-family: 'Lato', sans-serif;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.3;
  color: var(--brand-accent-text);
  text-decoration: none;
  font-variant-numeric: tabular-nums;
  transition: background-color 0.2s, color 0.2s;
}
.source-note:hover,
.source-note:focus-visible {
  background: var(--brand-accent);
  color: var(--brand-green);
  text-decoration: none;
}
/* On a dark chapter the pill lightens instead */
:global(.chapter-title--on-dark) ~ .source-notes .source-note,
:global(.on-dark) .source-note {
  background: rgba(255, 179, 122, 0.18);
  color: #ffb37a;
}

.source-links {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--brand-faint);
}
.source-links-label {
  margin-right: 0.25em;
}
.source-links a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(107, 100, 87, 0.5);
  text-underline-offset: 2px;
}
.source-links a:hover,
.source-links a:focus-visible {
  color: var(--brand-green);
}
</style>

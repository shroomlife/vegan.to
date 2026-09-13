<script setup lang="ts">
import { computed } from 'vue'
import { sources, type SourceId } from '@/data/sources'

const props = defineProps<{
  ids: readonly SourceId[]
}>()

const entries = computed(() => props.ids.map((id) => sources[id]))
</script>

<template>
  <p class="source-links">
    <span class="source-links-label">{{ entries.length > 1 ? 'Quellen' : 'Quelle' }}:</span>
    <template v-for="(source, index) in entries" :key="source.url">
      <a :href="source.url" target="_blank" rel="noopener">{{ source.label }}</a><template v-if="index < entries.length - 1">, </template>
    </template>
  </p>
</template>

<style scoped>
.source-links {
  margin: 0;
  font-size: 0.75rem;
  line-height: 1.5;
  color: #8d8474;
}
.source-links-label {
  margin-right: 0.25em;
}
.source-links a {
  color: inherit;
  text-decoration: underline;
  text-decoration-color: rgba(141, 132, 116, 0.5);
  text-underline-offset: 2px;
}
.source-links a:hover,
.source-links a:focus-visible {
  color: var(--brand-green);
}
</style>

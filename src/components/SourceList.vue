<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { sources } from '@/data/sources'
import { citationAnchor, useCitations } from '@/composables/useCitations'

/**
 * The source list at the end of the start page: every source the page cites,
 * numbered in the order of its first citation, each folded until a number in
 * the text is clicked. The clicked source opens and is highlighted (CSS
 * :target), and the list keeps working without JavaScript as plain anchors.
 */
const route = useRoute()
const citations = useCitations()
const items = computed(() =>
  (citations?.order ?? []).map((id, index) => ({
    id,
    number: index + 1,
    anchor: citationAnchor(index + 1),
    source: sources[id],
    host: new URL(sources[id].url).hostname.replace(/^www\./, ''),
  })),
)

/** The list stays folded; it unfolds as a whole on request and for the source a number points at */
const expanded = ref(false)
/** The number the route's hash points at, so its entry is open */
const targeted = ref<string | null>(null)
watch(
  () => route.hash,
  (hash) => {
    const anchor = hash.replace(/^#/, '')
    targeted.value = /^quelle-\d+$/.test(anchor) ? anchor : null
  },
  { immediate: true },
)
</script>

<template>
  <section v-if="items.length > 0" id="quellen" class="source-list chapter-section" aria-labelledby="source-list-title">
    <div class="container">
      <span class="chapter">Quellen</span>
      <h2 id="source-list-title" class="chapter-title">Alle Quellen dieser Seite</h2>
      <p class="chapter-lead">
        Die kleinen Nummern im Text führen hierher. Ein Klick auf eine Nummer öffnet die Quelle und hebt sie hervor.
        {{ items.length }} Quellen, in der Reihenfolge, in der sie im Text vorkommen. Wie die Zahlen entstehen, steht unter
        <RouterLink :to="{ path: '/quellen', hash: '#methodik' }">Quellen und Methodik</RouterLink>.
      </p>
      <button type="button" class="source-list-toggle" :aria-expanded="expanded" aria-controls="source-list-items" @click="expanded = !expanded">
        {{ expanded ? 'Alle zuklappen' : 'Alle aufklappen' }}
      </button>
      <ol id="source-list-items" class="source-list-items">
        <li v-for="item in items" :id="item.anchor" :key="item.id" class="source-list-item" :class="{ 'source-list-item--target': targeted === item.anchor }">
          <details class="source-list-details" :open="expanded || targeted === item.anchor">
            <summary class="source-list-summary">
              <span class="source-list-number" aria-hidden="true">{{ item.number }}</span>
              <span class="source-list-label">{{ item.source.label }}</span>
            </summary>
            <div class="source-list-body">
              <span class="source-list-use">{{ item.source.usedFor }}</span>
              <a :href="item.source.url" target="_blank" rel="noopener" class="source-list-link">{{ item.host }} <span aria-hidden="true">&nearr;</span></a>
            </div>
          </details>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.source-list {
  background: var(--brand-mint);
}
.source-list .container {
  max-width: 860px;
}
.source-list-toggle {
  margin-bottom: 1rem;
  padding: 0.55rem 1rem;
  border: 1px solid rgba(20, 54, 31, 0.2);
  border-radius: 999px;
  background: transparent;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--brand-green);
  cursor: pointer;
}
.source-list-toggle:hover,
.source-list-toggle:focus-visible {
  border-color: var(--brand-accent);
  color: var(--brand-accent-text);
}
.source-list-items {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.source-list-item {
  border-radius: 14px;
  border: 1px solid rgba(20, 54, 31, 0.1);
  background: var(--brand-surface);
  scroll-margin-top: calc(var(--header-height) + 24px);
  transition: border-color 0.3s, box-shadow 0.3s;
}
/* The source a number was clicked on: an accent ring, until the next click */
.source-list-item--target,
.source-list-item:target {
  border-color: var(--brand-accent);
  box-shadow: 0 0 0 4px rgba(255, 106, 61, 0.12);
}
.source-list-details[open] {
  background: #fff;
  border-radius: 14px;
}
.source-list-summary {
  list-style: none;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  padding: 0.95rem 1.1rem;
  cursor: pointer;
}
.source-list-summary::-webkit-details-marker {
  display: none;
}
.source-list-number {
  flex: 0 0 auto;
  min-width: 30px;
  height: 26px;
  padding: 0 8px;
  border-radius: 999px;
  background: rgba(255, 106, 61, 0.14);
  color: var(--brand-accent-text);
  font-size: 0.75rem;
  font-weight: 700;
  line-height: 26px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.source-list-label {
  font-size: 0.95rem;
  line-height: 1.55;
  color: var(--brand-green);
}
.source-list-body {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0 1.1rem 1rem calc(1.1rem + 30px + 0.85rem);
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--brand-muted);
}
.source-list-link {
  align-self: flex-start;
  font-weight: 700;
  color: var(--brand-green);
}
@media (max-width: 767px) {
  .source-list-body {
    padding-left: 1.1rem;
  }
}
</style>

<script setup lang="ts">
import type { SourceId } from '@/data/sources'
import SourceLinks from '@/components/SourceLinks.vue'

/**
 * A plain table of figures: first column is the row label, the rest are
 * numbers that arrive already formatted and are aligned right.
 */
defineProps<{
  caption: string
  head: readonly string[]
  rows: readonly (readonly string[])[]
  note?: string
  sources?: readonly SourceId[]
}>()
</script>

<template>
  <figure class="data-table">
    <div class="data-table-scroll">
      <table>
        <caption>{{ caption }}</caption>
        <thead>
          <tr>
            <th v-for="cell in head" :key="cell" scope="col">{{ cell }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row[0]">
            <template v-for="(cell, index) in row" :key="index">
              <th v-if="index === 0" scope="row">{{ cell }}</th>
              <td v-else>{{ cell }}</td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
    <figcaption v-if="note || sources?.length" class="data-table-foot">
      <p v-if="note" class="data-table-note">{{ note }}</p>
      <SourceLinks v-if="sources?.length" :ids="sources" />
    </figcaption>
  </figure>
</template>

<style scoped>
.data-table {
  margin: 0 0 1.75rem;
}
/* Wide tables scroll inside their card, the page itself never scrolls sideways */
.data-table-scroll {
  overflow-x: auto;
  border-radius: 18px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-variant-numeric: tabular-nums;
}
caption {
  caption-side: top;
  padding: 1rem 1rem 0.5rem;
  text-align: left;
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--brand-green);
}
th,
td {
  padding: 0.7rem 1rem;
  text-align: right;
  border-top: 1px solid #f1f3f5;
  font-size: 0.92rem;
  line-height: 1.4;
  white-space: nowrap;
}
th:first-child {
  text-align: left;
  white-space: normal;
}
thead th {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
tbody th {
  font-weight: 600;
  color: var(--brand-green);
}
.data-table-foot {
  margin-top: 0.6rem;
}
.data-table-note {
  margin: 0 0 0.35rem;
  font-size: 0.85rem;
  line-height: 1.55;
  color: var(--brand-muted);
}
@media (max-width: 767px) {
  th,
  td {
    padding: 0.6rem 0.65rem;
    font-size: 0.85rem;
  }
}
</style>

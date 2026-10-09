<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import type { SourceId } from '@/data/sources'
import SourceLinks from '@/components/SourceLinks.vue'

/**
 * A plain table of figures: first column is the row label, the rest are numbers that arrive already formatted and are aligned right.
 *
 * On a phone, 'scroll' keeps the grid and lets it scroll sideways inside its card; 'stack' turns every row into a small block with labelled figures, meant for tables with few columns and few rows.
 */
const props = withDefaults(defineProps<{
  caption: string
  head: readonly string[]
  rows: readonly (readonly string[])[]
  note?: string
  sources?: readonly SourceId[]
  layout?: 'stack' | 'scroll'
}>(), {
  note: undefined,
  sources: undefined,
  layout: 'scroll',
})

/** Figures per stacked row: four read best as two by two, otherwise up to three in a row */
const stackColumns = computed(() => {
  const figures = props.head.length - 1
  return figures === 4 ? 2 : Math.min(3, figures)
})

/* Whether the table is wider than its box, at any width and in any layout (a stacked table is a plain grid above 600px). Only then is it a keyboard stop, a region for screen readers and marked as scrolling. Both boxes are watched: the table can grow (a web font arriving) while its box keeps its size. */
const scroller = useTemplateRef<HTMLElement>('scroller')
const table = useTemplateRef<HTMLTableElement>('table')
const overflows = shallowRef(false)
useResizeObserver(() => [scroller.value, table.value], () => {
  const el = scroller.value
  overflows.value = el !== null && el.scrollWidth > el.clientWidth
})
</script>

<template>
  <figure class="data-table" :class="[`data-table--${layout}`, { 'data-table--overflowing': overflows }]" :style="{ '--stack-columns': stackColumns }">
    <!-- When it scrolls: focusable and named, so a keyboard can scroll it and a screen reader announces it -->
    <div
      ref="scroller"
      class="data-table-scroll"
      :tabindex="overflows ? 0 : undefined"
      :role="overflows ? 'region' : undefined"
      :aria-label="overflows ? caption : undefined"
    >
      <table ref="table">
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
              <td v-else :data-label="head[index]">{{ cell }}</td>
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
.data-table-scroll:focus-visible {
  outline: 2px solid var(--brand-green);
  outline-offset: 2px;
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
  min-width: 0;
  text-align: left;
  white-space: normal;
}
/* Header cells break into two lines before they widen the table */
thead th {
  min-width: 6.5rem;
  white-space: normal;
  vertical-align: bottom;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.08em;
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

/* A table wider than its box: the first column stays put and a soft shadow at the right edge shows that more is hidden. The shadow is fixed to the box, its white cover scrolls with the content and slides over it once the end is reached. The left edge needs no shadow, the sticky column marks it. None of this changes the table's width, so it cannot switch itself off. */
.data-table--overflowing .data-table-scroll {
  background:
    linear-gradient(to left, #fff 30%, rgba(255, 255, 255, 0)) right center / 2.5rem 100% no-repeat local,
    radial-gradient(farthest-side at 100% 50%, rgba(20, 54, 31, 0.16), rgba(20, 54, 31, 0)) right center / 0.9rem 100% no-repeat scroll,
    #fff;
  /* The caption measures itself against the visible box, not the wide table */
  container-type: inline-size;
}
.data-table--overflowing th:first-child {
  position: sticky;
  left: 0;
  z-index: 1;
  background: #fff;
  box-shadow: 1px 0 0 #f1f3f5;
}
.data-table--overflowing caption {
  position: sticky;
  left: 0;
  box-sizing: border-box;
  max-width: 100cqi;
}

/* Stack: below 600px each row is a block, its label on top and the figures in a row below, each with its column name. The header row stays in the accessibility tree, only hidden from sight. */
@media (max-width: 599px) {
  .data-table--stack table,
  .data-table--stack tbody {
    display: block;
  }
  .data-table--stack caption {
    display: block;
  }
  .data-table--stack thead {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  .data-table--stack tbody tr {
    display: grid;
    grid-template-columns: repeat(var(--stack-columns), minmax(0, 1fr));
    gap: 0.5rem 0.75rem;
    padding: 0.85rem 1rem;
    border-top: 1px solid #f1f3f5;
  }
  .data-table--stack tbody th,
  .data-table--stack tbody td {
    padding: 0;
    border-top: none;
    text-align: left;
  }
  /* Words may break apart ("meist 10 bis 15 Wochen"), a number has no break opportunity and stays whole */
  .data-table--stack td {
    white-space: normal;
  }
  .data-table--stack tbody th {
    grid-column: 1 / -1;
    font-weight: 700;
  }
  /* An empty cell (a total without a share, say) keeps its place but shows nothing */
  .data-table--stack td:empty {
    visibility: hidden;
  }
  .data-table--stack td::before {
    content: attr(data-label);
    display: block;
    margin-bottom: 0.15rem;
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    line-height: 1.3;
    text-transform: uppercase;
    /* Column names like "Selbstversorgungsgrad" are wider than a third of a phone */
    hyphens: auto;
    overflow-wrap: break-word;
    color: var(--brand-faint);
  }
}
</style>

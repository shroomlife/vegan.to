<script setup lang="ts">
import { computed, ref } from 'vue'
import { formatNumber } from '@/utils/formatNumber'

export interface TimelinePoint {
  year: number
  count: number
}

const props = withDefaults(defineProps<{
  points: readonly TimelinePoint[]
  /** Years that get an axis label; all points still get a marker */
  labelYears?: readonly number[]
}>(), {
  labelYears: () => [],
})

/** Percentage of vertical space kept free above the highest point */
const TOP_HEADROOM = 18

const minYear = computed(() => Math.min(...props.points.map((p) => p.year)))
const maxYear = computed(() => Math.max(...props.points.map((p) => p.year)))
const maxCount = computed(() => Math.max(...props.points.map((p) => p.count)))

/** Linear scales into a 0..100 percent coordinate space (x right, y down) */
function xPercent(year: number): number {
  const span = maxYear.value - minYear.value
  return span === 0 ? 0 : ((year - minYear.value) / span) * 100
}
function yPercent(count: number): number {
  const usable = 100 - TOP_HEADROOM
  return 100 - (count / maxCount.value) * usable
}

const plotted = computed(() =>
  props.points.map((p, index) => ({
    ...p,
    index,
    x: xPercent(p.year),
    y: yPercent(p.count),
    label: `${p.year}: ${formatNumber(p.count)}`,
  })),
)

const linePath = computed(() =>
  plotted.value.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' '),
)

const areaPath = computed(() => {
  const first = plotted.value[0]
  const last = plotted.value[plotted.value.length - 1]
  if (!first || !last) return ''
  return `${linePath.value} L${last.x} 100 L${first.x} 100 Z`
})

const axisLabels = computed(() =>
  props.labelYears
    .filter((year) => year >= minYear.value && year <= maxYear.value)
    .map((year) => ({ year, x: xPercent(year) })),
)

const summary = computed(() =>
  plotted.value.map((p) => p.label).join(', '),
)

const activeIndex = ref<number | null>(null)
const activePoint = computed(() =>
  activeIndex.value === null ? null : plotted.value[activeIndex.value] ?? null,
)
</script>

<template>
  <figure class="timeline" :aria-label="`Zeitverlauf: ${summary}`">
    <div class="timeline-plot">
      <!-- Line and area stretch with the container; the stroke stays 2px -->
      <svg class="timeline-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <path class="timeline-area" :d="areaPath" />
        <path class="timeline-line" :d="linePath" />
      </svg>

      <!-- Markers are HTML so they keep their size and stay keyboard reachable -->
      <button
        v-for="p in plotted"
        :key="p.year"
        type="button"
        class="timeline-marker"
        :class="{ 'timeline-marker--active': activeIndex === p.index }"
        :style="{ left: `${p.x}%`, top: `${p.y}%` }"
        :aria-label="p.label"
        @mouseenter="activeIndex = p.index"
        @mouseleave="activeIndex = null"
        @focus="activeIndex = p.index"
        @blur="activeIndex = null"
      />

      <span
        v-if="activePoint"
        class="timeline-tooltip"
        :class="{ 'timeline-tooltip--end': activePoint.x > 75 }"
        :style="{ left: `${activePoint.x}%`, top: `${activePoint.y}%` }"
        aria-hidden="true"
      >{{ activePoint.label }}</span>
    </div>

    <div class="timeline-axis" aria-hidden="true">
      <span
        v-for="l in axisLabels"
        :key="l.year"
        class="timeline-axis-label"
        :class="{ 'timeline-axis-label--start': l.x === 0, 'timeline-axis-label--end': l.x === 100 }"
        :style="{ left: `${l.x}%` }"
      >{{ l.year }}</span>
    </div>
  </figure>
</template>

<style scoped>
.timeline {
  max-width: 720px;
  margin: 0 auto 1.5rem;
  padding: 0 0.5rem;
}
.timeline-plot {
  position: relative;
  height: 96px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}
.timeline-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}
.timeline-area {
  fill: rgba(46, 204, 113, 0.14);
}
.timeline-line {
  fill: none;
  stroke: #2ecc71;
  stroke-width: 2px;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.timeline-marker {
  position: absolute;
  width: 24px;
  height: 24px;
  padding: 0;
  margin: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
.timeline-marker::after {
  content: '';
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: #1b2a1b;
  border: 2px solid #2ecc71;
  transition: inset 0.15s, background 0.15s;
}
.timeline-marker--active::after,
.timeline-marker:focus-visible::after {
  inset: 6px;
  background: #2ecc71;
}
.timeline-marker:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 2px;
}
.timeline-tooltip {
  position: absolute;
  transform: translate(-50%, calc(-100% - 14px));
  padding: 0.25rem 0.6rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.95);
  color: #1b2a1b;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  pointer-events: none;
}
.timeline-tooltip--end {
  transform: translate(-100%, calc(-100% - 14px));
}
.timeline-axis {
  position: relative;
  height: 1.4rem;
}
.timeline-axis-label {
  position: absolute;
  top: 0.35rem;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
}
.timeline-axis-label--start {
  transform: none;
}
.timeline-axis-label--end {
  transform: translateX(-100%);
}
@media (max-width: 767px) {
  .timeline-plot {
    height: 72px;
  }
}
</style>

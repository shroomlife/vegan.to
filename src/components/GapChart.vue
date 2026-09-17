<script setup lang="ts">
import { computed, useId } from 'vue'
import { area, line, curveMonotoneX } from 'd3-shape'
import type { TrendPoint } from '@/data/trends'

/**
 * Not a line chart: the subject is the distance to the worst year.
 *
 * A dashed rule sits at the peak, the band between it and the curve is what is
 * no longer killed, the solid mass below the curve is what remains. A species
 * whose numbers barely moved shows almost no band, which says more than any
 * headline could for all nine of them at once.
 */
const props = withDefaults(defineProps<{
  points: readonly TrendPoint[]
  /** Accessible summary; the visible caption lives next to the chart */
  label: string
  height?: number
}>(), { height: 320 })

/** Plot in its own pixel space and let the viewBox scale it */
const W = 1000
const PAD_TOP = 14
/** Room on the right so the measure line and its caps are not flush to the edge */
const PAD_RIGHT = 26

const H = computed(() => props.height)

const peak = computed(() => props.points.reduce((a, p) => (p.count > a.count ? p : a), props.points[0]!))
const first = computed(() => props.points[0]!)
const last = computed(() => props.points[props.points.length - 1]!)

const scaleX = computed(() => {
  const span = last.value.year - first.value.year
  return (year: number) => (span === 0 ? 0 : ((year - first.value.year) / span) * (W - PAD_RIGHT))
})
const scaleY = computed(() => {
  const top = peak.value.count
  return (count: number) => PAD_TOP + (1 - count / top) * (H.value - PAD_TOP)
})

const peakY = computed(() => scaleY.value(peak.value.count))

const linePath = computed(() =>
  line<TrendPoint>()
    .x((p) => scaleX.value(p.year))
    .y((p) => scaleY.value(p.count))
    .curve(curveMonotoneX)(props.points) ?? '',
)

/** What is still killed: from the curve down to the baseline */
const massPath = computed(() =>
  area<TrendPoint>()
    .x((p) => scaleX.value(p.year))
    .y0(H.value)
    .y1((p) => scaleY.value(p.count))
    .curve(curveMonotoneX)(props.points) ?? '',
)

/** The gap: from the peak rule down to the curve */
const gapPath = computed(() =>
  area<TrendPoint>()
    .x((p) => scaleX.value(p.year))
    .y0(peakY.value)
    .y1((p) => scaleY.value(p.count))
    .curve(curveMonotoneX)(props.points) ?? '',
)

const nowX = computed(() => scaleX.value(last.value.year))
const nowY = computed(() => scaleY.value(last.value.count))
/** Half the cap width, in user units, for the measure line's end ticks */
const CAP = 9

/** The hub page draws nine of these, so the pattern id has to be per instance */
const hatchId = `gap-hatch-${useId()}`
</script>

<template>
  <figure class="gap-chart">
    <svg
      class="gap-chart-svg"
      :viewBox="`0 0 ${W} ${H}`"
      preserveAspectRatio="none"
      role="img"
      :aria-label="label"
    >
      <defs>
        <pattern :id="hatchId" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" class="gap-chart-hatch-line" />
        </pattern>
      </defs>

      <path class="gap-chart-gap" :d="gapPath" />
      <path class="gap-chart-gap-hatch" :d="gapPath" :fill="`url(#${hatchId})`" />
      <path class="gap-chart-mass" :d="massPath" />
      <line class="gap-chart-peak" x1="0" :y1="peakY" :x2="W" :y2="peakY" />
      <path class="gap-chart-line" :d="linePath" />

      <!-- The distance, drawn as a distance: a measured line at the last year -->
      <g class="gap-chart-measure">
        <line :x1="nowX" :y1="peakY" :x2="nowX" :y2="nowY" />
        <line :x1="nowX - CAP" :y1="peakY" :x2="nowX + CAP" :y2="peakY" />
        <line :x1="nowX - CAP" :y1="nowY" :x2="nowX + CAP" :y2="nowY" />
      </g>
      <circle class="gap-chart-now" :cx="nowX" :cy="nowY" r="6" />
    </svg>

    <div class="gap-chart-axis" aria-hidden="true">
      <span>{{ first.year }}</span>
      <span class="gap-chart-peak-label">gestrichelt: Höchststand {{ peak.year }}</span>
      <span>{{ last.year }}</span>
    </div>
  </figure>
</template>

<style scoped>
.gap-chart {
  margin: 0;
}
.gap-chart-svg {
  display: block;
  width: 100%;
  height: var(--gap-chart-height, 320px);
  overflow: visible;
}
/* The gap carries the statement, so it gets the texture and the mass steps
   back. Solid red at full strength read as the whole chart and buried it. */
.gap-chart-gap {
  fill: var(--brand-accent);
  fill-opacity: 0.1;
}
.gap-chart-hatch-line {
  stroke: var(--brand-accent);
  stroke-width: 1.5;
  stroke-opacity: 0.45;
}
.gap-chart-mass {
  fill: #e74c3c;
  fill-opacity: 0.5;
}
.gap-chart-measure line {
  stroke: var(--brand-green);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}
.gap-chart-peak {
  stroke: rgba(20, 54, 31, 0.45);
  stroke-width: 1.5;
  stroke-dasharray: 2 6;
  vector-effect: non-scaling-stroke;
}
.gap-chart-line {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}
.gap-chart-now {
  fill: var(--brand-accent);
  stroke: var(--brand-cream);
  stroke-width: 2;
  vector-effect: non-scaling-stroke;
}
.gap-chart-axis {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 1rem;
  margin-top: 0.6rem;
  font-size: 0.78rem;
  color: var(--brand-muted);
  font-variant-numeric: tabular-nums;
}
.gap-chart-peak-label {
  color: var(--brand-faint);
}
@media (max-width: 767px) {
  .gap-chart-svg {
    height: var(--gap-chart-height-mobile, 210px);
  }
  .gap-chart-peak-label {
    display: none;
  }
}
</style>

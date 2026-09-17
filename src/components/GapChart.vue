<script setup lang="ts">
import { computed, useId, useTemplateRef } from 'vue'
import { useElementSize } from '@vueuse/core'
import { area, line, curveMonotoneX } from 'd3-shape'
import type { TrendPoint } from '@/data/trends'

/**
 * Not a line chart: the subject is the distance to the worst year.
 *
 * A dashed rule sits at the peak, the hatched band below it is what is no
 * longer killed, the mass under the curve is what remains. A species whose
 * numbers barely moved shows almost no band, which says more than any single
 * headline could for all nine of them at once.
 */
const props = defineProps<{
  points: readonly TrendPoint[]
  /** Accessible summary; the visible caption lives next to the chart */
  label: string
}>()

/** Room above the peak rule and to the right of the measure line, in px */
const PAD_TOP = 14
const PAD_RIGHT = 26
/** Half the width of the measure line's end ticks, in px */
const CAP = 9
/** Only used until the element has been measured */
const FALLBACK_W = 1000
const FALLBACK_H = 300

/**
 * Drawn in real pixels instead of a stretched viewBox. preserveAspectRatio
 * "none" squashed the marker into an ellipse and smeared the hatch, worst on
 * a phone where the box is widest relative to its height.
 */
const root = useTemplateRef<HTMLElement>('root')
const { width: boxWidth, height: boxHeight } = useElementSize(root)

/** No non-null assertions: an unusable series yields undefined and draws nothing */
const series = computed(() => {
  const points = props.points
  const first = points[0]
  const last = points[points.length - 1]
  if (!first || !last || points.length < 2) return undefined

  let peak = first
  for (const point of points) {
    if (point.count > peak.count) peak = point
  }
  if (peak.count <= 0) return undefined

  return { points, first, last, peak }
})

const geometry = computed(() => {
  const s = series.value
  if (!s) return undefined

  const w = Math.round(boxWidth.value) || FALLBACK_W
  const h = Math.round(boxHeight.value) || FALLBACK_H
  const span = s.last.year - s.first.year
  const x = (year: number) => (span === 0 ? 0 : ((year - s.first.year) / span) * (w - PAD_RIGHT))
  // The peak lands on PAD_TOP by definition, which is why the rule never moves
  const y = (count: number) => PAD_TOP + (1 - count / s.peak.count) * (h - PAD_TOP)

  const stroke = line<TrendPoint>().x((p) => x(p.year)).y((p) => y(p.count)).curve(curveMonotoneX)
  const mass = area<TrendPoint>().x((p) => x(p.year)).y0(h).y1((p) => y(p.count)).curve(curveMonotoneX)
  const gap = area<TrendPoint>().x((p) => x(p.year)).y0(PAD_TOP).y1((p) => y(p.count)).curve(curveMonotoneX)

  return {
    w,
    h,
    peakY: PAD_TOP,
    linePath: stroke(s.points) ?? '',
    massPath: mass(s.points) ?? '',
    gapPath: gap(s.points) ?? '',
    nowX: x(s.last.year),
    nowY: y(s.last.count),
    firstYear: s.first.year,
    lastYear: s.last.year,
    peakYear: s.peak.year,
  }
})

/** Several of these can share one page, so the pattern id has to be per instance */
const hatchId = `gap-hatch-${useId()}`
</script>

<template>
  <figure ref="root" class="gap-chart">
    <template v-if="geometry">
      <svg
        class="gap-chart-svg"
        :viewBox="`0 0 ${geometry.w} ${geometry.h}`"
        role="img"
        :aria-label="label"
      >
        <defs>
          <pattern :id="hatchId" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="7" class="gap-chart-hatch-line" />
          </pattern>
        </defs>

        <path class="gap-chart-gap" :d="geometry.gapPath" />
        <path :d="geometry.gapPath" :fill="`url(#${hatchId})`" />
        <path class="gap-chart-mass" :d="geometry.massPath" />
        <line class="gap-chart-peak" x1="0" :y1="geometry.peakY" :x2="geometry.w" :y2="geometry.peakY" />
        <path class="gap-chart-line" :d="geometry.linePath" />

        <!-- The distance, drawn as a distance: a measured line at the last year -->
        <g class="gap-chart-measure">
          <line :x1="geometry.nowX" :y1="geometry.peakY" :x2="geometry.nowX" :y2="geometry.nowY" />
          <line :x1="geometry.nowX - CAP" :y1="geometry.peakY" :x2="geometry.nowX + CAP" :y2="geometry.peakY" />
          <line :x1="geometry.nowX - CAP" :y1="geometry.nowY" :x2="geometry.nowX + CAP" :y2="geometry.nowY" />
        </g>
        <circle class="gap-chart-now" :cx="geometry.nowX" :cy="geometry.nowY" r="6" />
      </svg>

      <figcaption class="gap-chart-axis">
        <span>{{ geometry.firstYear }}</span>
        <span class="gap-chart-peak-label">gestrichelt: Höchststand {{ geometry.peakYear }}</span>
        <span>{{ geometry.lastYear }}</span>
      </figcaption>
    </template>
  </figure>
</template>

<style scoped>
.gap-chart {
  margin: 0;
}
.gap-chart-svg {
  display: block;
  width: 100%;
  height: var(--gap-chart-height, 300px);
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
  fill: var(--brand-death);
  fill-opacity: 0.5;
}
.gap-chart-measure line {
  stroke: var(--brand-green);
  stroke-width: 1.5;
}
.gap-chart-peak {
  stroke: rgba(20, 54, 31, 0.45);
  stroke-width: 1.5;
  stroke-dasharray: 2 6;
}
.gap-chart-line {
  fill: none;
  stroke: var(--brand-green);
  stroke-width: 2;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.gap-chart-now {
  fill: var(--brand-accent);
  stroke: var(--brand-mint);
  stroke-width: 2;
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
    height: var(--gap-chart-height-mobile, 190px);
  }
  .gap-chart-peak-label {
    display: none;
  }
}
</style>

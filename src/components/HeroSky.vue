<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { usePreferredReducedMotion, useResizeObserver } from '@vueuse/core'

/**
 * One light per animal killed since the page opened. New lights rise from the
 * bottom for a few seconds and settle into a slowly twinkling sky.
 *
 * Settled lights are painted once into an offscreen canvas, so the per-frame
 * cost only covers the lights still rising (a few hundred), never the total.
 * The canvas size comes from a ResizeObserver, which reports after layout
 * instead of forcing one in the middle of the mount.
 */
const props = defineProps<{
  /** Total number of lights that should exist right now */
  count: number
  /** False while the hero is scrolled away; the sky then stops drawing until it is back */
  active: boolean
}>()

const RISE_SECONDS = 9
const MAX_LIGHTS = 60_000
const COLORS = ['255, 179, 122', '246, 241, 231', '255, 140, 100']
/** Alpha is rounded to this many steps while a light rises, so lights can be drawn in batches */
const ALPHA_STEPS = 8

interface Light {
  x: number
  /** Resting y as a fraction of the height */
  y: number
  r: number
  color: string
  alpha: number
  born: number
}

const canvasRef = useTemplateRef<HTMLCanvasElement>('canvas')
const reducedMotion = usePreferredReducedMotion()

const rising: Light[] = []
let settled: HTMLCanvasElement | null = null
let spawned = 0
let frame = 0

function makeLight(now: number): Light {
  return {
    x: Math.random(),
    // The sky reaches every edge of the hero, only a little denser towards the top
    y: Math.pow(Math.random(), 1.4),
    r: Math.random() < 0.85 ? 1 : 1.8,
    color: COLORS[Math.floor(Math.random() * COLORS.length)] ?? COLORS[0]!,
    alpha: 0.35 + Math.random() * 0.55,
    born: now,
  }
}

function paintSettled(light: Light) {
  if (!settled) return
  const ctx = settled.getContext('2d')
  if (!ctx) return
  ctx.fillStyle = `rgba(${light.color}, ${light.alpha})`
  ctx.beginPath()
  ctx.arc(light.x * settled.width, light.y * settled.height, light.r, 0, Math.PI * 2)
  ctx.fill()
}

function resize(width: number, height: number) {
  const canvas = canvasRef.value
  const w = Math.round(width)
  const h = Math.round(height)
  if (!canvas || !w || !h) return
  canvas.width = w
  canvas.height = h
  settled = document.createElement('canvas')
  settled.width = w
  settled.height = h
  // Repaint everything already spawned at its resting place
  const now = performance.now()
  for (let i = 0; i < spawned; i++) paintSettled(makeLight(now))
  rising.length = 0
}

function spawnUpTo(target: number, now: number) {
  const wanted = Math.min(target, MAX_LIGHTS)
  while (spawned < wanted) {
    const light = makeLight(now)
    spawned++
    if (reducedMotion.value === 'reduce') paintSettled(light)
    else rising.push(light)
  }
}

/** Rising lights grouped by fill style, so each group costs one path and one fill instead of hundreds */
const batches = new Map<string, { x: number; y: number; r: number }[]>()

function draw(now: number) {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || !settled) {
    frame = requestAnimationFrame(draw)
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(settled, 0, 0)

  for (const batch of batches.values()) batch.length = 0
  for (let i = rising.length - 1; i >= 0; i--) {
    const light = rising[i]!
    const age = (now - light.born) / 1000
    const progress = Math.min(1, age / RISE_SECONDS)
    if (progress >= 1) {
      paintSettled(light)
      rising.splice(i, 1)
      continue
    }
    // Ease out: fast start, gentle landing
    const eased = 1 - Math.pow(1 - progress, 3)
    const alpha = Math.round(light.alpha * (0.4 + 0.6 * eased) * ALPHA_STEPS) / ALPHA_STEPS
    const key = `rgba(${light.color}, ${alpha})`
    let batch = batches.get(key)
    if (!batch) {
      batch = []
      batches.set(key, batch)
    }
    batch.push({ x: light.x * canvas.width, y: (1 - (1 - light.y) * eased) * canvas.height, r: light.r + (1 - eased) * 0.8 })
  }
  for (const [fillStyle, batch] of batches) {
    if (batch.length === 0) continue
    ctx.fillStyle = fillStyle
    ctx.beginPath()
    for (const dot of batch) {
      ctx.moveTo(dot.x + dot.r, dot.y)
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
    }
    ctx.fill()
  }
  frame = props.active ? requestAnimationFrame(draw) : 0
}

useResizeObserver(canvasRef, (entries) => {
  const rect = entries[0]?.contentRect
  if (rect) resize(rect.width, rect.height)
})

watch(() => props.count, (count) => spawnUpTo(count, performance.now()))
watch(
  () => props.active,
  (active) => {
    if (active && frame === 0) frame = requestAnimationFrame(draw)
  },
)

onMounted(() => {
  frame = requestAnimationFrame(draw)
})

onUnmounted(() => {
  cancelAnimationFrame(frame)
})
</script>

<template>
  <canvas ref="canvas" class="hero-sky" aria-hidden="true"></canvas>
</template>

<style scoped>
.hero-sky {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
</style>

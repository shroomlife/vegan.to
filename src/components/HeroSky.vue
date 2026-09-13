<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch } from 'vue'
import { useElementSize, usePreferredReducedMotion } from '@vueuse/core'

/**
 * One light per animal killed since the page opened. New lights rise from the
 * bottom for a few seconds and settle into a slowly twinkling sky.
 *
 * Settled lights are painted once into an offscreen canvas, so the per-frame
 * cost only covers the lights still rising (a few hundred), never the total.
 */
const props = defineProps<{
  /** Total number of lights that should exist right now */
  count: number
}>()

const RISE_SECONDS = 9
const MAX_LIGHTS = 60_000
const COLORS = ['255, 179, 122', '246, 241, 231', '255, 140, 100']

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
const { width, height } = useElementSize(canvasRef)
const reducedMotion = usePreferredReducedMotion()

const rising: Light[] = []
let settled: HTMLCanvasElement | null = null
let spawned = 0
let frame = 0

function makeLight(now: number): Light {
  return {
    x: Math.random(),
    // Lights gather in the upper two thirds, denser towards the top
    y: 0.06 + Math.pow(Math.random(), 1.6) * 0.62,
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

function resizeSettled() {
  const w = Math.round(width.value)
  const h = Math.round(height.value)
  if (!w || !h) return
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

function draw(now: number) {
  const canvas = canvasRef.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx || !settled) {
    frame = requestAnimationFrame(draw)
    return
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(settled, 0, 0)

  const t = now
  for (let i = rising.length - 1; i >= 0; i--) {
    const light = rising[i]!
    const age = (t - light.born) / 1000
    const progress = Math.min(1, age / RISE_SECONDS)
    if (progress >= 1) {
      paintSettled(light)
      rising.splice(i, 1)
      continue
    }
    // Ease out: fast start, gentle landing
    const eased = 1 - Math.pow(1 - progress, 3)
    const y = 1 - (1 - light.y) * eased
    const alpha = light.alpha * (0.4 + 0.6 * eased)
    ctx.fillStyle = `rgba(${light.color}, ${alpha})`
    ctx.beginPath()
    ctx.arc(light.x * canvas.width, y * canvas.height, light.r + (1 - eased) * 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
  frame = requestAnimationFrame(draw)
}

watch([width, height], () => {
  const canvas = canvasRef.value
  if (!canvas) return
  canvas.width = Math.round(width.value)
  canvas.height = Math.round(height.value)
  resizeSettled()
})

watch(() => props.count, (count) => spawnUpTo(count, performance.now()))

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

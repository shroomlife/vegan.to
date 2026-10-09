<script setup lang="ts">
import { onBeforeUnmount, shallowRef, useTemplateRef, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { formatNumber } from '@/utils/formatNumber'

const props = defineProps<{
  value: number
  duration?: number
}>()

const el = useTemplateRef<HTMLElement>('el')
/* Off screen the number simply follows its source; nobody sees the easing and every tick stays cheap */
const visible = useElementVisibility(el)

/*
 * The eased value is kept here rather than in useTransition: that one only
 * catches up with its source when it gets disabled, so a number that mounts
 * off screen stayed at its start value and showed 0, or an old figure, for
 * a moment when it scrolled into view. Here every change starts from what is
 * on screen right now.
 */
const shown = shallowRef(props.value)
let frame = 0

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

watch(
  () => props.value,
  (to) => {
    cancelAnimationFrame(frame)
    if (!visible.value) {
      shown.value = to
      return
    }
    const from = shown.value
    const duration = props.duration ?? 369
    const start = performance.now()
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      shown.value = from + (to - from) * easeOutCubic(progress)
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
  },
)

onBeforeUnmount(() => cancelAnimationFrame(frame))
</script>

<template>
  <span ref="el">{{ formatNumber(shown) }}</span>
</template>

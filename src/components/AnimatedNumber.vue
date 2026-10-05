<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { useElementVisibility, useTransition, TransitionPresets } from '@vueuse/core'
import { formatNumber } from '@/utils/formatNumber'

const props = defineProps<{
  value: number
  duration?: number
}>()

const source = computed(() => props.value)
const el = useTemplateRef<HTMLElement>('el')
/* Off screen the number simply follows its source; nobody sees the easing and every tick stays cheap */
const visible = useElementVisibility(el)

const animated = useTransition(source, {
  duration: props.duration ?? 369,
  transition: TransitionPresets.easeOutCubic,
  disabled: computed(() => !visible.value),
})
</script>

<template>
  <span ref="el">{{ formatNumber(animated) }}</span>
</template>

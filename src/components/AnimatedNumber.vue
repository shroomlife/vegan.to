<script setup lang="ts">
import { computed } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'
import { formatNumber } from '@/utils/formatNumber'

const props = defineProps<{
  value: number
  duration?: number
}>()

const source = computed(() => props.value)

const animated = useTransition(source, {
  duration: props.duration ?? 369,
  transition: TransitionPresets.easeOutCubic,
})
</script>

<template>
  {{ formatNumber(animated) }}
</template>

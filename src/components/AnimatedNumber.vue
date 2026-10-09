<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { formatNumber } from '@/utils/formatNumber'
import { useEasedNumber } from '@/composables/useEasedNumber'

const props = defineProps<{
  value: number
  duration?: number
}>()

const el = useTemplateRef<HTMLElement>('el')
const visible = useElementVisibility(el)
const shown = useEasedNumber(() => props.value, visible, props.duration)
</script>

<template>
  <span ref="el">{{ formatNumber(shown) }}</span>
</template>

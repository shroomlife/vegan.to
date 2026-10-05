<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue'
import { useElementVisibility } from '@vueuse/core'
import { formatNumber } from '@/utils/formatNumber'

/**
 * The wall of emojis under an animal card, one per animal killed since the
 * page opened. Laying out thousands of emoji glyphs every second is the most
 * expensive thing on the start page, so the wall only takes a new value while
 * it is on screen. Off screen it keeps its last text and catches up the moment
 * it scrolls into view, which nobody can tell apart from a live wall.
 */
const props = defineProps<{
  emojis: string
  /** Kills beyond the rendered cap */
  hidden: number
}>()

const el = useTemplateRef<HTMLElement>('el')
const visible = useElementVisibility(el)
const shown = ref({ emojis: props.emojis, hidden: props.hidden })

watch(
  [visible, () => props.emojis, () => props.hidden],
  ([isVisible, emojis, hidden]) => {
    if (isVisible) shown.value = { emojis, hidden }
  },
  { immediate: true },
)
</script>

<template>
  <div ref="el" class="animal-card-emojis">
    <div class="animal-card-emojis-wall" aria-hidden="true">{{ shown.emojis }}</div>
    <span class="animal-card-emojis-more">
      <template v-if="shown.hidden > 0">+ {{ formatNumber(shown.hidden) }} weitere</template>
    </span>
  </div>
</template>

<style scoped>
/* The box itself (padding, size) is styled by the card that places it */
/* Exactly two rows, always the same height: no layout shift while it fills */
.animal-card-emojis-wall {
  height: 3.6em;
  overflow: hidden;
  line-height: 1.8;
  word-break: break-all;
}
.animal-card-emojis-more {
  display: block;
  min-height: 1.2rem;
  margin-top: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #6c757d;
}
</style>

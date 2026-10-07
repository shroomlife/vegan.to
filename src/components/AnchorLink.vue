<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'

/**
 * A link to a section of the current page. It goes through the router, so the
 * jump scrolls smoothly, keeps the sticky header clear of the target and lands
 * in the URL; a click on the hash the URL already carries scrolls again.
 * Everything else (class, aria attributes, click handlers) falls through to the
 * rendered anchor.
 */
const props = defineProps<{
  /** The target, with its leading # */
  hash: string
}>()

const route = useRoute()
const { onNavClick } = useAnchorNavigation()
const to = computed(() => `${route.path}${props.hash}`)
</script>

<template>
  <RouterLink :to="to" custom v-slot="{ href, navigate }">
    <a :href="href" @click="navigate($event); onNavClick(to)"><slot /></a>
  </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWindowScroll } from '@vueuse/core'
import { scrollToTop } from '@/utils/scroll'

/** Shows up once the hero is out of view */
const SHOW_AFTER_PX = 700

const { y } = useWindowScroll()
const visible = computed(() => y.value > SHOW_AFTER_PX)
</script>

<template>
  <Transition name="back-to-top">
    <button
      v-if="visible"
      type="button"
      class="back-to-top"
      aria-label="Nach oben"
      @click="scrollToTop"
    >
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </Transition>
</template>

<style scoped>
.back-to-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 90;
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background: var(--brand-green);
  color: var(--brand-cream);
  box-shadow: 0 8px 24px rgba(15, 42, 23, 0.35);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s, background 0.2s;
}
.back-to-top svg {
  width: 22px;
  height: 22px;
}
.back-to-top:hover {
  background: var(--brand-accent);
  color: var(--brand-green);
  transform: translateY(-2px);
}
.back-to-top:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 3px;
}
.back-to-top-enter-active,
.back-to-top-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.back-to-top-enter-from,
.back-to-top-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
@media (max-width: 767px) {
  .back-to-top {
    right: 14px;
    bottom: 14px;
    width: 44px;
    height: 44px;
  }
}
</style>

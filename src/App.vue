<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
import CounterPill from '@/components/CounterPill.vue'
import { provideLiveState } from '@/composables/useLiveState'

// One clock and one ticker for header, home view and the floating pill
const live = provideLiveState()
const route = useRoute()

// On phones the counter follows along the bottom edge once the hero is gone
const showMobilePill = computed(() => live.isMobile.value && route.name === 'Home' && !live.heroVisible.value)
</script>

<template>
  <a href="#main" class="skip-link">Zum Inhalt springen</a>
  <SiteHeader />
  <!-- tabindex -1 so the skip link really moves focus into the content -->
  <div id="main" tabindex="-1">
    <RouterView />
  </div>
  <SiteFooter />
  <Transition name="mobile-pill">
    <div v-if="showMobilePill" class="mobile-pill">
      <CounterPill :count="live.totalDeathCount.value" />
    </div>
  </Transition>
  <BackToTop />
</template>

<style>
/* Keyboard users see where they are, everywhere on the site */
:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 3px;
}
#main:focus {
  outline: none;
}
.skip-link {
  position: absolute;
  top: 8px;
  left: 8px;
  z-index: 200;
  padding: 0.6rem 1rem;
  border-radius: 999px;
  background: var(--brand-accent);
  color: var(--brand-green);
  font-weight: 700;
  text-decoration: none;
  transform: translateY(-200%);
  transition: transform 0.15s;
}
.skip-link:focus {
  transform: translateY(0);
  color: var(--brand-green);
  text-decoration: none;
}
/* Left of the back-to-top button, never under it */
.mobile-pill {
  position: fixed;
  left: 14px;
  right: 72px;
  bottom: 14px;
  display: flex;
  z-index: 95;
}
.mobile-pill .counter-pill {
  background: var(--brand-green);
  border-color: rgba(246, 241, 231, 0.25);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  padding: 10px 16px;
}
.mobile-pill-enter-active,
.mobile-pill-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.mobile-pill-enter-from,
.mobile-pill-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>

<script setup lang="ts">
import SiteHeader from '@/components/SiteHeader.vue'
import SiteFooter from '@/components/SiteFooter.vue'
import BackToTop from '@/components/BackToTop.vue'
</script>

<template>
  <a href="#main" class="skip-link">Zum Inhalt springen</a>
  <SiteHeader />
  <div id="main">
    <RouterView />
  </div>
  <SiteFooter />
  <BackToTop />
</template>

<style>
/* Keyboard users see where they are, everywhere on the site */
:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: 3px;
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
</style>

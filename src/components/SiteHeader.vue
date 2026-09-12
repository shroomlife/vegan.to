<script setup lang="ts">
import BrandWordmark from '@/components/BrandWordmark.vue'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'

const navLinks = [
  { label: 'Zahlen', to: '/#zahlen', mobile: false },
  { label: 'Impact', to: '/#impact', mobile: false },
  { label: 'Quellen', to: '/quellen', mobile: true },
]

const { onNavClick } = useAnchorNavigation()
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner">
      <BrandWordmark class="site-header-brand" />
      <nav class="site-header-nav" aria-label="Hauptnavigation">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="site-header-link"
          :class="{ 'site-header-link--desktop': !link.mobile }"
          @click="onNavClick(link.to)"
        >
          {{ link.label }}
        </RouterLink>
        <RouterLink to="/#mitmachen" class="site-header-cta" @click="onNavClick('/#mitmachen')">#GoVegan</RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: rgba(15, 42, 23, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(246, 241, 231, 0.12);
  color: var(--brand-cream);
}
.site-header-inner {
  max-width: 1280px;
  height: 100%;
  margin: 0 auto;
  padding: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}
.site-header-brand {
  font-size: 20px;
}
.site-header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}
.site-header-link {
  position: relative;
  padding: 6px 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-cream);
  text-decoration: none;
  transition: color 0.15s;
}
.site-header-link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
  border-radius: 2px;
  background: var(--brand-accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.2s;
}
.site-header-link:hover,
.site-header-link:focus-visible {
  color: #e9c9a8;
  text-decoration: none;
}
.site-header-link:hover::after,
.site-header-link.router-link-exact-active::after {
  transform: scaleX(1);
}
.site-header-cta {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--brand-green);
  background: var(--brand-accent);
  padding: 12px 20px;
  border-radius: 999px;
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.site-header-cta:hover,
.site-header-cta:focus-visible {
  color: var(--brand-green);
  text-decoration: none;
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(255, 106, 61, 0.35);
}
.site-header-link:focus-visible,
.site-header-cta:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 3px;
}

@media (max-width: 767px) {
  .site-header-inner {
    padding: 0 18px;
  }
  .site-header-brand {
    font-size: 18px;
  }
  .site-header-nav {
    gap: 16px;
  }
  .site-header-link {
    font-size: 11px;
  }
  .site-header-link--desktop {
    display: none;
  }
  .site-header-cta {
    font-size: 11px;
    padding: 10px 14px;
  }
}
</style>

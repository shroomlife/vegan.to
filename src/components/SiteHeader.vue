<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BrandWordmark from '@/components/BrandWordmark.vue'
import CounterPill from '@/components/CounterPill.vue'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'
import { useLiveState } from '@/composables/useLiveState'

const navLinks = [
  { label: 'Zahlen', to: '/#zahlen', mobile: false },
  { label: 'Impact', to: '/#impact', mobile: false },
  { label: 'Quellen', to: '/quellen', mobile: true },
]

const { onNavClick, isPageLink } = useAnchorNavigation()
const live = useLiveState()
const route = useRoute()

// The counter moves into the header once the hero has scrolled away (desktop only)
const showPill = computed(() => !live.isMobile.value && route.name === 'Home' && !live.heroVisible.value)
</script>

<template>
  <header class="site-header">
    <div class="site-header-inner">
      <BrandWordmark class="site-header-brand" />
      <Transition name="header-pill">
        <CounterPill v-if="showPill" :count="live.totalDeathCount.value" class="site-header-pill" />
      </Transition>
      <nav class="site-header-nav" aria-label="Hauptnavigation">
        <!-- custom links: anchors on the start page must not claim aria-current="page" -->
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          custom
          v-slot="{ href, navigate, isExactActive }"
        >
          <a
            :href="href"
            class="site-header-link"
            :class="{
              'site-header-link--desktop': !link.mobile,
              'site-header-link--active': isExactActive && isPageLink(link.to),
            }"
            :aria-current="isExactActive && isPageLink(link.to) ? 'page' : undefined"
            @click="navigate($event); onNavClick(link.to)"
          >
            {{ link.label }}
          </a>
        </RouterLink>
        <RouterLink to="/#mitmachen" custom v-slot="{ href, navigate }">
          <a :href="href" class="site-header-cta" @click="navigate($event); onNavClick('/#mitmachen')">#GoVegan</a>
        </RouterLink>
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
  /* Opaque enough that headlines scrolling underneath do not bloom through the blur */
  background: rgba(15, 42, 23, 0.88);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
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
.site-header-pill {
  margin-left: auto;
  margin-right: 8px;
}
.header-pill-enter-active,
.header-pill-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.header-pill-enter-from,
.header-pill-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
.site-header-link--active::after {
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

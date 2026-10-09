<script setup lang="ts">
import BrandWordmark from '@/components/BrandWordmark.vue'
import PrideFlag from '@/components/PrideFlag.vue'
import { useAnchorNavigation } from '@/composables/useAnchorNavigation'
import { useConsent } from '@/composables/useConsent'
import { animals } from '@/data/animals'
import { speciesProfiles } from '@/data/species'
import { topicPages } from '@/data/topics'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__
const currentYear = new Date().getFullYear()
const { onNavClick, isPageLink } = useAnchorNavigation()
const { openSettings } = useConsent()

const siteLinks = [
  { label: 'Zahlen', to: '/#zahlen' },
  { label: 'Alle Tierarten', to: '/tiere' },
  { label: 'Dein Impact', to: '/#impact' },
  { label: 'Mitmachen', to: '/#mitmachen' },
  { label: 'Quellen und Methodik', to: '/quellen' },
]

/** One link per species page, in the order of the data (fish last) */
const speciesLinks = speciesProfiles.map((profile) => ({
  label: animals.find((a) => a.names.single === profile.single)?.names.plural ?? profile.single,
  to: `/tiere/${profile.slug}`,
}))

const partnerLinks = [
  { label: 'warum-vegan.com', href: 'https://warum-vegan.com/' },
  { label: 'wie-vegan.com', href: 'https://wie-vegan.com/' },
  { label: 'vegan-community.de', href: 'https://vegan-community.de/' },
]
</script>

<template>
  <footer class="site-footer">
    <div class="site-footer-inner">
      <div class="site-footer-grid">
        <div class="site-footer-brand">
          <BrandWordmark class="site-footer-wordmark" />
          <p class="site-footer-tagline">
            Ein Zähler, der nicht wegschaut. Offizielle Zahlen, in Echtzeit, für die Tiere.
          </p>
          <div class="site-footer-pride">
            <PrideFlag />
            <span>Für alle. Für die Tiere.</span>
          </div>
        </div>

        <nav class="site-footer-col site-footer-col--list" aria-label="Seite">
          <h2 class="site-footer-title">Seite</h2>
          <RouterLink v-for="link in siteLinks" :key="link.to" :to="link.to" custom v-slot="{ href, navigate, isExactActive }">
            <a
              :href="href"
              :aria-current="isExactActive && isPageLink(link.to) ? 'page' : undefined"
              @click="navigate($event); onNavClick(link.to)"
            >{{ link.label }}</a>
          </RouterLink>
        </nav>

        <nav class="site-footer-col site-footer-col--list" aria-label="Tierarten">
          <h2 class="site-footer-title">Tierarten</h2>
          <RouterLink v-for="link in speciesLinks" :key="link.to" :to="link.to" custom v-slot="{ href, navigate, isExactActive }">
            <a :href="href" :aria-current="isExactActive ? 'page' : undefined" @click="navigate($event); onNavClick(link.to)">{{ link.label }}</a>
          </RouterLink>
        </nav>

        <nav class="site-footer-col site-footer-col--list" aria-label="Hintergründe">
          <h2 class="site-footer-title">Hintergründe</h2>
          <RouterLink v-for="link in topicPages" :key="link.path" :to="link.path" custom v-slot="{ href, navigate, isExactActive }">
            <a :href="href" :aria-current="isExactActive ? 'page' : undefined" @click="navigate($event); onNavClick(link.path)">{{ link.label }}</a>
          </RouterLink>
        </nav>

        <nav class="site-footer-col" aria-label="Weitergehen">
          <h2 class="site-footer-title">Weitergehen</h2>
          <a v-for="link in partnerLinks" :key="link.href" :href="link.href" target="_blank" rel="noopener">{{ link.label }}</a>
        </nav>

        <nav class="site-footer-col" aria-label="Projekt">
          <h2 class="site-footer-title">Projekt</h2>
          <a href="https://github.com/shroomlife/vegan.to" target="_blank" rel="noopener">GitHub</a>
          <RouterLink to="/quellen#datenstand" custom v-slot="{ href, navigate }">
            <a :href="href" @click="navigate($event); onNavClick('/quellen#datenstand')">Datenstand 2025</a>
          </RouterLink>
          <RouterLink to="/impressum">Impressum</RouterLink>
          <RouterLink to="/datenschutz">Datenschutz</RouterLink>
          <button type="button" class="site-footer-consent" @click="openSettings">Cookie-Einstellungen</button>
          <span class="site-footer-version">Version {{ appVersion }}</span>
        </nav>
      </div>

      <div class="site-footer-bottom">
        <span>&copy; 2020 bis {{ currentYear }} vegan.to</span>
        <span>Open Source, ohne Werbung</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  background: var(--brand-green);
  color: var(--brand-cream);
  border-top: 5px solid var(--brand-accent);
  padding: 56px 40px 28px;
}
.site-footer-inner {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 44px;
}
.site-footer-grid {
  display: grid;
  grid-template-columns: 4fr repeat(5, 2fr);
  gap: 32px;
}
.site-footer-brand {
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.site-footer-wordmark {
  font-size: 40px;
}
.site-footer-tagline {
  margin: 0;
  max-width: 380px;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(246, 241, 231, 0.75);
}
.site-footer-pride {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.78);
}
.site-footer-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.site-footer-title {
  margin: 0;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-accent);
}
.site-footer-col a {
  /* At least 24 px tall, the touch target size WCAG asks for */
  display: inline-block;
  line-height: 1.6;
  font-size: 15px;
  font-weight: 600;
  color: var(--brand-cream);
  text-decoration: none;
  transition: color 0.15s;
}
.site-footer-col a:hover,
.site-footer-col a:focus-visible {
  color: #e9c9a8;
  text-decoration: none;
}
.site-footer-col a:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 3px;
}
/* Looks like the links next to it, but it opens the consent banner instead of navigating */
.site-footer-consent {
  padding: 0;
  border: none;
  background: none;
  text-align: left;
  font-size: 15px;
  font-weight: 600;
  color: var(--brand-cream);
  cursor: pointer;
  transition: color 0.15s;
}
.site-footer-consent:hover,
.site-footer-consent:focus-visible {
  color: #e9c9a8;
}
.site-footer-consent:focus-visible {
  outline: 2px solid var(--brand-cream);
  outline-offset: 3px;
}
.site-footer-version {
  font-size: 13px;
  color: rgba(246, 241, 231, 0.75);
}
.site-footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  border-top: 1px solid rgba(246, 241, 231, 0.15);
  padding-top: 20px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(246, 241, 231, 0.75);
}

@media (max-width: 991px) {
  .site-footer-grid {
    grid-template-columns: 1fr 1fr;
  }
  .site-footer-brand {
    grid-column: 1 / -1;
  }
}
@media (max-width: 767px) {
  .site-footer {
    /* Room at the bottom for the counter pill and the back-to-top button floating over the corners */
    padding: 40px 18px calc(80px + env(safe-area-inset-bottom));
  }
  .site-footer-inner {
    gap: 32px;
  }
  .site-footer-grid {
    gap: 28px 16px;
  }
  /* Taller rows instead of gaps: every link a 44 px touch target */
  .site-footer-col {
    gap: 0;
  }
  .site-footer-title {
    margin-bottom: 4px;
  }
  .site-footer-col a,
  .site-footer-consent {
    padding-block: 10px;
    line-height: 1.6;
  }
  .site-footer-version {
    padding-top: 10px;
  }
  /* The long lists take the full width and split into two columns, so no column runs far below its neighbour */
  .site-footer-col--list {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: 16px;
    align-items: start;
  }
  .site-footer-col--list .site-footer-title {
    grid-column: 1 / -1;
  }
  .site-footer-wordmark {
    font-size: 30px;
  }
  .site-footer-tagline {
    font-size: 14px;
  }
  .site-footer-pride {
    font-size: 11px;
  }
  .site-footer-bottom {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    font-size: 11px;
  }
}
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useTransition, TransitionPresets } from '@vueuse/core'
import { Motion, AnimatePresence } from 'motion-v'
import { useTimer } from '@/composables/useTimer'
import { useAnimalData, type ComputedAnimal } from '@/composables/useAnimalData'
import { useVictimTicker } from '@/composables/useVictimTicker'
import { formatNumber } from '@/utils/formatNumber'
import AnimatedNumber from '@/components/AnimatedNumber.vue'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__

const timer = useTimer()
const { animalData, totalDeathCount, totalDeathEmojis } = useAnimalData(timer)
const { victims } = useVictimTicker(2500, 5)

const childViewState = ref<Record<string, boolean>>({})

function toggleChildView(animal: ComputedAnimal) {
  childViewState.value[animal.names.single] = !childViewState.value[animal.names.single]
}

function isChildViewOpen(animal: ComputedAnimal): boolean {
  return childViewState.value[animal.names.single] ?? false
}

const animatedTotalDeaths = useTransition(totalDeathCount, {
  duration: 369,
  transition: TransitionPresets.easeOutCubic,
})

const currentYear = new Date().getFullYear()

const shareText = () =>
  `In nur ${timer.elapsedFormatted.value} in denen ich auf https://vegan.to war, sind in #Deutschland schon ${totalDeathCount.value} Tiere ermordet worden...\n\n#GoVegan\n#StopEatingAnimals\n#PostmeatGeneration\n\n🐷🐮🐔`
</script>

<template>
  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-inner">
      <Motion
        tag="p"
        class="hero-label"
        :initial="{ opacity: 0, y: -20 }"
        :animate="{ opacity: 0.6, y: 0 }"
        :transition="{ duration: 0.6 }"
      >
        Echtzeit-Zähler
      </Motion>

      <Motion
        tag="h1"
        class="hero-title"
        :initial="{ opacity: 0, y: 30 }"
        :animate="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.1 }"
      >
        Tiermorde in Deutschland
      </Motion>

      <Motion
        tag="p"
        class="hero-subtitle"
        :initial="{ opacity: 0, y: 20 }"
        :animate="{ opacity: 0.8, y: 0 }"
        :transition="{ duration: 0.8, delay: 0.3 }"
      >
        Jeden Tag werden in Deutschland Tiere getötet, damit sie auf dem Teller landen.
        Ohne Hoffnung. Ohne Perspektive. Ohne Wahl.
      </Motion>

      <!-- Live Counter -->
      <Motion
        v-if="totalDeathCount > 0"
        class="hero-counter"
        :initial="{ opacity: 0, scale: 0.8 }"
        :animate="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.6, delay: 0.5, type: 'spring', stiffness: 200 }"
      >
        <span class="hero-counter-number">{{ formatNumber(animatedTotalDeaths) }}</span>
        <span class="hero-counter-label">Tiere getötet seit du hier bist</span>
        <span class="hero-counter-time">🕰 {{ timer.elapsedFormatted.value }}</span>
      </Motion>

      <!-- Victim Ticker -->
      <div class="victim-ticker">
        <AnimatePresence>
          <Motion
            v-for="victim in victims"
            :key="victim.id"
            class="victim-entry"
            :initial="{ opacity: 0, y: -15, filter: 'blur(4px)' }"
            :animate="{ opacity: 1, y: 0, filter: 'blur(0px)' }"
            :exit="{ opacity: 0, y: 15, filter: 'blur(4px)' }"
            :transition="{ duration: 0.5 }"
          >
            <span class="victim-emoji">{{ victim.emoji }}</span>
            <span class="victim-name">{{ victim.name }}</span>
            <span class="victim-age">({{ victim.age }} alt)</span>
            <span class="victim-fate">— wurde getötet</span>
          </Motion>
        </AnimatePresence>
      </div>
    </div>
  </section>

  <!-- Animal Data -->
  <section class="animals-section">
    <div class="container">
      <!-- Desktop Header -->
      <Motion
        class="animal-header d-none d-md-flex"
        :initial="{ opacity: 0 }"
        :in-view="{ opacity: 1 }"
        :transition="{ duration: 0.4 }"
      >
        <div class="animal-header-name">Tier</div>
        <div class="animal-header-stat">heute</div>
        <div class="animal-header-stat">pro Tag</div>
        <div class="animal-header-stat animal-header-stat--wide">dieses Jahr</div>
      </Motion>

      <!-- Animal Cards with stagger -->
      <Motion
        v-for="(animal, index) in animalData"
        :key="animal.names.single"
        class="animal-card"
        :initial="{ opacity: 0, y: 40 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.5, delay: index * 0.06 }"
        :in-view-options="{ once: true, amount: 0.2 }"
      >
        <div class="animal-card-main">
          <div class="animal-card-name">
            <span class="animal-emoji">{{ animal.names.emoji }}</span>
            <span class="animal-label">{{ animal.names.plural }}</span>
          </div>
          <div class="animal-card-stats">
            <div class="animal-stat">
              <span class="animal-stat-label d-md-none">heute</span>
              <span class="animal-stat-value animal-stat-value--danger"><AnimatedNumber :value="animal.currentDay" /></span>
            </div>
            <div class="animal-stat">
              <span class="animal-stat-label d-md-none">pro Tag</span>
              <span class="animal-stat-value">{{ formatNumber(animal.perDay) }}</span>
            </div>
            <div class="animal-stat animal-stat--wide">
              <span class="animal-stat-label d-md-none">dieses Jahr</span>
              <span class="animal-stat-value animal-stat-value--danger"><AnimatedNumber :value="animal.currentYear" /></span>
            </div>
          </div>
        </div>

        <div
          v-if="animal.killedSinceStart > 0 || animal.children.length > 0"
          class="animal-card-footer"
        >
          <div class="animal-card-since">
            <small v-if="animal.killedSinceStart > 0">
              Seit du da bist {{ animal.killedSinceStart > 1 ? 'wurden' : 'wurde' }}
              <span class="text-killed">{{ animal.killedSinceStart }} {{ animal.getNameByCount(animal.killedSinceStart) }}</span>
              getötet...
            </small>
          </div>
          <button
            v-if="animal.children.length > 0"
            class="btn-children"
            @click="toggleChildView(animal)"
          >
            {{ isChildViewOpen(animal) ? 'ausblenden' : 'Untergruppen' }}
          </button>
        </div>

        <div v-if="animal.killedSinceStart > 0" class="animal-card-emojis">
          {{ animal.killedSinceStartEmojis }}
        </div>

        <div v-if="isChildViewOpen(animal)" class="animal-children">
          <div v-for="child in animal.children" :key="child.name" class="animal-child">
            <span class="animal-child-name">davon {{ child.name }}</span>
            <span class="animal-child-stat">{{ child.currentDayFormatted }}</span>
            <span class="animal-child-stat">{{ child.perDayFormatted }}</span>
            <span class="animal-child-stat animal-child-stat--wide">{{ child.currentYearFormatted }}</span>
          </div>
        </div>
      </Motion>
    </div>
  </section>

  <!-- Emoji Summary -->
  <Motion
    v-if="totalDeathCount > 0"
    tag="section"
    class="emoji-section"
    :initial="{ opacity: 0 }"
    :in-view="{ opacity: 1 }"
    :transition="{ duration: 0.8 }"
    :in-view-options="{ once: true, amount: 0.3 }"
  >
    <div class="container">
      <h2 class="section-title">Seit du da bist</h2>
      <p class="emoji-cloud">{{ totalDeathEmojis }}</p>
      <div class="emoji-badges">
        <span v-for="animal in animalData" :key="'badge-' + animal.names.single">
          <span v-if="animal.killedSinceStart > 0" class="emoji-badge">
            {{ animal.killedSinceStart }} {{ animal.names.emoji }} {{ animal.getNameByCount(animal.killedSinceStart) }}
          </span>
        </span>
      </div>
    </div>
  </Motion>

  <!-- CTA -->
  <section class="cta-section">
    <div class="container">
      <Motion
        tag="h2"
        class="section-title"
        :initial="{ opacity: 0, y: 30 }"
        :in-view="{ opacity: 1, y: 0 }"
        :transition="{ duration: 0.6, type: 'spring' }"
        :in-view-options="{ once: true }"
      >
        Was kann ich tun?
      </Motion>
      <Motion
        tag="a"
        href="https://veganstart.de/"
        class="cta-button"
        target="_blank"
        rel="noopener"
        :initial="{ opacity: 0, scale: 0.9 }"
        :in-view="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.5, delay: 0.15, type: 'spring', stiffness: 200 }"
        :in-view-options="{ once: true }"
      >
        <span class="cta-emoji">🐷🐮🐔</span>
        <span class="cta-text">#GoVegan</span>
        <span class="cta-emoji">🐔🐮🐷</span>
      </Motion>
    </div>
  </section>

  <!-- Share -->
  <section class="share-section">
    <div class="container">
      <h3 class="section-title section-title--sm">Teile diese Seite</h3>
      <div class="text-center shareLinks">
        <a class="resp-sharing-button__link" href="https://facebook.com/sharer/sharer.php?u=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="Auf Facebook teilen"><div class="resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`https://x.com/intent/tweet?text=${encodeURIComponent(shareText())}&url=${encodeURIComponent('https://vegan.to')}`" target="_blank" rel="noopener" aria-label="Auf X teilen"><div class="resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`mailto:?subject=%23GoVegan&body=${encodeURIComponent(shareText())}`" target="_self" rel="noopener" aria-label="Per E-Mail teilen"><div class="resp-sharing-button resp-sharing-button--email resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" href="https://www.linkedin.com/sharing/share-offsite/?url=https%3A%2F%2Fvegan.to" target="_blank" rel="noopener" aria-label="Auf LinkedIn teilen"><div class="resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`whatsapp://send?text=${encodeURIComponent(shareText())}`" target="_blank" rel="noopener" aria-label="Per WhatsApp teilen"><div class="resp-sharing-button resp-sharing-button--whatsapp resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M20.1 3.9C17.9 1.7 15 .5 12 .5 5.8.5.7 5.6.7 11.9c0 2 .5 3.9 1.5 5.6L.6 23.4l6-1.6c1.6.9 3.5 1.3 5.4 1.3 6.3 0 11.4-5.1 11.4-11.4-.1-2.8-1.2-5.7-3.3-7.8zM12 21.4c-1.7 0-3.3-.5-4.8-1.3l-.4-.2-3.5 1 1-3.4L4 17c-1-1.5-1.4-3.2-1.4-5.1 0-5.2 4.2-9.4 9.4-9.4 2.5 0 4.9 1 6.7 2.8 1.8 1.8 2.8 4.2 2.8 6.7-.1 5.2-4.3 9.4-9.5 9.4zm5.1-7.1c-.3-.1-1.7-.9-1.9-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1s-1.2-.5-2.3-1.4c-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6s.3-.3.4-.5c.2-.1.3-.3.4-.5.1-.2 0-.4 0-.5C10 9 9.3 7.6 9 7c-.1-.4-.4-.3-.5-.3h-.6s-.4.1-.7.3c-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.3-.3-.4-.6-.5z" /></svg></div></div></a>
        <a class="resp-sharing-button__link" :href="`https://t.me/share/url?url=https%3A%2F%2Fvegan.to&text=${encodeURIComponent(shareText())}`" target="_blank" rel="noopener" aria-label="Per Telegram teilen"><div class="resp-sharing-button resp-sharing-button--telegram resp-sharing-button--small"><div aria-hidden="true" class="resp-sharing-button__icon resp-sharing-button__icon--solid"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M.707 8.475C.275 8.64 0 9.508 0 9.508s.284.867.718 1.03l5.09 1.897 1.986 6.38a1.102 1.102 0 0 0 1.75.527l2.96-2.41a.405.405 0 0 1 .494-.013l5.34 3.87a1.1 1.1 0 0 0 1.046.135 1.1 1.1 0 0 0 .682-.803l3.91-18.795A1.102 1.102 0 0 0 22.5.075L.706 8.475z" /></svg></div></div></a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-sources">
        <p class="footer-sources-title">Quellen</p>
        <p>
          <a href="https://www-genesis.destatis.de/genesis/online?language=de&sequenz=tabelleErgebnis&selectionname=41331-0001" target="_blank" rel="noopener">Gewerbliche Schlachtungen 2024</a>
          &amp;
          <a href="https://www-genesis.destatis.de/genesis/online?language=de&sequenz=tabelleErgebnis&selectionname=41322-0001" target="_blank" rel="noopener">Geflügelschlachtereien 2025</a>
          — Statistisches Bundesamt (Destatis)
        </p>
        <p class="footer-note">Die Zahlen sind eine Hochrechnung basierend auf offiziellen Statistiken.</p>
      </div>
      <div class="footer-bottom">
        <span>&copy; 2020–{{ currentYear }} vegan.to</span>
        <a class="footer-github" href="https://github.com/shroomlife/vegan.to" target="_blank" rel="noopener">
          <img src="/img/GitHub-Mark-32px.png" width="24" height="24" alt="GitHub" />
        </a>
        <span class="footer-version">v{{ appVersion }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* ── Hero ─────────────────────────────────────────── */
.hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  color: #fff;
  padding: 3rem 1.5rem 2rem;
  text-align: center;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hero-inner {
  max-width: 720px;
  margin: 0 auto;
  width: 100%;
}
.hero-label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  margin-bottom: 0.75rem;
}
.hero-title {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1rem;
}
.hero-subtitle {
  font-size: clamp(0.95rem, 2.5vw, 1.1rem);
  line-height: 1.6;
  max-width: 560px;
  margin: 0 auto 2rem;
}
.hero-counter {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}
.hero-counter-number {
  font-size: clamp(2.5rem, 10vw, 5rem);
  font-weight: 700;
  color: #e74c3c;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 40px rgba(231, 76, 60, 0.4);
}
.hero-counter-label {
  font-size: 1rem;
  opacity: 0.7;
}
.hero-counter-time {
  font-size: 0.85rem;
  opacity: 0.5;
}

/* ── Victim Ticker ────────────────────────────────── */
.victim-ticker {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-height: 120px;
  position: relative;
}
.victim-entry {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 50px;
  font-size: clamp(0.7rem, 2vw, 0.85rem);
  backdrop-filter: blur(4px);
  white-space: nowrap;
}
.victim-emoji {
  font-size: 1.1em;
}
.victim-name {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}
.victim-age {
  opacity: 0.5;
}
.victim-fate {
  color: #e74c3c;
  opacity: 0.8;
  font-size: 0.9em;
}

/* ── Animals Section ──────────────────────────────── */
.animals-section {
  padding: 2rem 0 3rem;
  background: #f8f9fa;
}
.animal-header {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.25rem;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #6c757d;
  border-bottom: 2px solid #dee2e6;
  margin-bottom: 0.5rem;
}
.animal-header-name { flex: 2; }
.animal-header-stat { flex: 1; text-align: right; }
.animal-header-stat--wide { flex: 1.3; }

.animal-card {
  background: #fff;
  border-radius: 12px;
  margin-bottom: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.animal-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.animal-card-main {
  display: flex;
  align-items: center;
  padding: 1rem 1.25rem;
  gap: 1rem;
}
.animal-card-name {
  flex: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.animal-emoji { font-size: 2rem; line-height: 1; }
.animal-label { font-size: 1.15rem; font-weight: 600; }
.animal-card-stats {
  flex: 3;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.animal-stat {
  flex: 1;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.animal-stat--wide { flex: 1.3; }
.animal-stat-label {
  font-size: 0.7rem;
  color: #6c757d;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.animal-stat-value {
  font-weight: 700;
  font-size: 1rem;
  font-variant-numeric: tabular-nums;
}
.animal-stat-value--danger { color: #e74c3c; }

/* Mobile: stack cards vertically */
@media (max-width: 767px) {
  .animal-card-main { flex-direction: column; align-items: stretch; }
  .animal-card-stats { flex-direction: column; }
  .animal-stat { justify-content: space-between; }
}
@media (min-width: 768px) {
  .animal-stat { justify-content: flex-end; }
}

.animal-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.25rem 0.75rem;
  gap: 0.75rem;
  flex-wrap: wrap;
}
.animal-card-since { color: #6c757d; font-size: 0.85rem; }
.text-killed { color: #e74c3c; font-weight: 700; }
.btn-children {
  background: none;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  color: #6c757d;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}
.btn-children:hover { background: #f1f3f5; border-color: #adb5bd; color: #333; }
.animal-card-emojis {
  padding: 0 1.25rem 0.75rem;
  font-size: 0.85rem;
  line-height: 1.8;
  word-break: break-all;
}
.animal-children { border-top: 1px solid #f1f3f5; background: #fafbfc; }
.animal-child {
  display: flex;
  align-items: center;
  padding: 0.5rem 1.25rem 0.5rem 2.5rem;
  font-size: 0.9rem;
  color: #495057;
}
.animal-child-name { flex: 2; }
.animal-child-stat { flex: 1; text-align: right; font-variant-numeric: tabular-nums; }
.animal-child-stat--wide { flex: 1.3; }

/* ── Emoji Summary ────────────────────────────────── */
.emoji-section { padding: 3rem 1rem; text-align: center; }
.section-title { font-size: 1.75rem; font-weight: 700; margin-bottom: 1.5rem; text-align: center; }
.section-title--sm { font-size: 1.25rem; }
.emoji-cloud {
  font-size: 1.1rem;
  line-height: 2;
  word-break: break-all;
  max-width: 800px;
  margin: 0 auto 1.5rem;
}
.emoji-badges { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.5rem; }
.emoji-badge {
  display: inline-block;
  background: #1a1a2e;
  color: #fff;
  padding: 0.35rem 0.85rem;
  border-radius: 50px;
  font-size: 0.85rem;
  font-weight: 500;
}

/* ── CTA ──────────────────────────────────────────── */
.cta-section { padding: 3rem 1rem; background: #f8f9fa; }
.cta-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
  background: linear-gradient(135deg, #2ecc71, #27ae60);
  color: #fff;
  border-radius: 16px;
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 8px 30px rgba(46, 204, 113, 0.3);
  transition: all 0.3s;
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(46, 204, 113, 0.4);
  color: #fff;
  text-decoration: none;
}
.cta-emoji { font-size: 0.7em; opacity: 0; transition: opacity 0.3s; }
.cta-button:hover .cta-emoji { opacity: 1; }
@media (max-width: 767px) {
  .cta-button { padding: 1.5rem; }
  .cta-emoji { display: none; }
}

/* ── Share ─────────────────────────────────────────── */
.share-section { padding: 2.5rem 1rem; text-align: center; }

/* ── Footer ───────────────────────────────────────── */
.site-footer {
  background: #1a1a2e;
  color: rgba(255, 255, 255, 0.6);
  padding: 2rem 1rem;
  font-size: 0.85rem;
}
.site-footer a { color: rgba(255, 255, 255, 0.5); text-decoration: underline; text-decoration-color: rgba(255, 255, 255, 0.2); }
.site-footer a:hover { color: #fff; }
.footer-sources { text-align: center; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.footer-sources-title { font-weight: 700; color: rgba(255, 255, 255, 0.8); margin-bottom: 0.5rem; }
.footer-note { font-size: 0.8rem; opacity: 0.5; margin-top: 0.5rem; }
.footer-bottom { display: flex; align-items: center; justify-content: center; gap: 1.5rem; flex-wrap: wrap; }
.footer-github { opacity: 0.4; transition: opacity 0.2s; }
.footer-github:hover { opacity: 0.8; }
.footer-github img { filter: invert(1); }
.footer-version { opacity: 0.4; font-size: 0.75rem; }
</style>

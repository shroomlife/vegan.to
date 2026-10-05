<script setup lang="ts">
import { useConsent } from '@/composables/useConsent'

const { bannerVisible, decide } = useConsent()
</script>

<template>
  <Transition name="consent">
    <section
      v-if="bannerVisible"
      class="consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="consent-title"
      aria-describedby="consent-text"
    >
      <h2 id="consent-title" class="consent-title">Darf vegan.to mitzählen, was gelesen wird?</h2>
      <p id="consent-text" class="consent-text">
        Wenn du einwilligst, messen wir mit Google Analytics, welche Seiten aufgerufen werden. Dafür werden
        Cookies (_ga) gesetzt und Nutzungsdaten an Google übermittelt, auch in die USA. Ohne deine Einwilligung wird nichts von Google geladen. Du kannst
        deine Wahl jederzeit unten auf jeder Seite unter „Cookie-Einstellungen“ ändern.
        <RouterLink to="/datenschutz" class="consent-link">Mehr in der Datenschutzerklärung</RouterLink>
        &middot;
        <RouterLink to="/impressum" class="consent-link">Impressum</RouterLink>
      </p>
      <!-- Both choices look the same: no nudging towards yes -->
      <div class="consent-actions">
        <button type="button" class="consent-btn" @click="decide('denied')">Ablehnen</button>
        <button type="button" class="consent-btn" @click="decide('granted')">Einverstanden</button>
      </div>
    </section>
  </Transition>
</template>

<style scoped>
.consent {
  position: fixed;
  left: 20px;
  bottom: 20px;
  z-index: 300;
  width: min(520px, calc(100vw - 40px));
  padding: 1.35rem 1.4rem 1.25rem;
  border-radius: 22px;
  border: 1.5px solid rgba(246, 241, 231, 0.14);
  background: rgba(14, 33, 20, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
  color: var(--brand-cream);
}
.consent-title {
  margin: 0 0 0.55rem;
  font-family: var(--font-display);
  font-size: 1.02rem;
  letter-spacing: -0.02em;
  line-height: 1.3;
  color: var(--brand-cream);
}
.consent-text {
  margin: 0 0 1.1rem;
  font-size: 0.88rem;
  line-height: 1.6;
  color: rgba(246, 241, 231, 0.8);
}
.consent-link {
  color: var(--brand-cream);
  text-decoration: underline;
  text-underline-offset: 2px;
}
.consent-link:hover,
.consent-link:focus-visible {
  color: var(--brand-accent);
}
.consent-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.6rem;
}
.consent-btn {
  padding: 11px 16px;
  border-radius: 999px;
  border: 1.5px solid rgba(246, 241, 231, 0.35);
  background: transparent;
  color: var(--brand-cream);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.consent-btn:hover,
.consent-btn:focus-visible {
  background: var(--brand-cream);
  border-color: var(--brand-cream);
  color: var(--brand-green);
}
.consent-enter-active,
.consent-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
@media (max-width: 767px) {
  .consent {
    left: 12px;
    right: 12px;
    bottom: 12px;
    width: auto;
    padding: 1.15rem 1.15rem 1.05rem;
    border-radius: 18px;
  }
}
@media (prefers-reduced-motion: reduce) {
  .consent-enter-active,
  .consent-leave-active {
    transition: none;
  }
}
</style>

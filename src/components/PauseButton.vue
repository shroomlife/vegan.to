<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue'
import AnchorLink from '@/components/AnchorLink.vue'
import AnimatedNumber from '@/components/AnimatedNumber.vue'
import { useLiveState } from '@/composables/useLiveState'
import { handOffUrl } from '@/data/actions'

/**
 * A big pause button next to the live sentence. Pressing it cannot stop the
 * counter, and the dialog says so: the count keeps running inside it, and the
 * three things that do stop it are one click away.
 */
const { totalDeathCount } = useLiveState()
// Native <dialog>: top layer, focus trap, Escape to close, backdrop for free
const dialog = useTemplateRef<HTMLDialogElement>('dialog')
/** The total at the moment the button was pressed, so the dialog counts from there */
const pressedAt = ref<number | null>(null)
const sincePressed = computed(() => (pressedAt.value === null ? 0 : Math.max(0, totalDeathCount.value - pressedAt.value)))

/** What really stops the count: three doors, two on this page and one out */
const ways = [
  { emoji: '🥦', label: 'Die nächste Mahlzeit pflanzlich.', note: 'Jeder Teller nimmt ein Stück Nachfrage aus dieser Rechnung.', href: '#mitmachen', external: false },
  { emoji: '🌱', label: '30 Tage mit Veganstart.', note: 'Das kostenlose Programm von PETA, Schritt für Schritt.', href: handOffUrl('pause'), external: true },
  { emoji: '📊', label: 'Nachrechnen, was ein Mensch bewirkt.', note: 'Ein Jahr vegan, in Tieren, Wasser und CO₂.', href: '#impact', external: false },
] as const

function press() {
  pressedAt.value = totalDeathCount.value
  dialog.value?.showModal()
}
function close() {
  dialog.value?.close()
}
</script>

<template>
  <div class="pause">
    <button type="button" class="pause-button" aria-haspopup="dialog" @click="press">
      <span class="pause-icon" aria-hidden="true"><i></i><i></i></span>
      <span class="pause-label">Pause</span>
    </button>

    <dialog ref="dialog" class="pause-dialog" aria-labelledby="pause-title" @mousedown.self="close">
      <div class="pause-dialog-body">
        <button type="button" class="pause-dialog-close" aria-label="Schließen" @click="close">&times;</button>
        <p class="pause-kicker">Pause</p>
        <h3 id="pause-title" class="pause-title">Geht nicht.</h3>
        <p class="pause-count">
          <span class="pause-count-number"><AnimatedNumber :value="sincePressed" /></span>
          Tiere, seit du auf Pause gedrückt hast.
        </p>
        <p class="pause-text">
          Dieser Zähler hat keinen Knopf. Er läuft, solange gekauft wird, was er zählt. Anhalten geht nur so:
        </p>
        <ul class="pause-ways">
          <li v-for="way in ways" :key="way.href">
            <!-- Out to Veganstart as a plain link, down the page through the router (smooth, header clear) -->
            <component
              :is="way.external ? 'a' : AnchorLink"
              v-bind="way.external ? { href: way.href, target: '_blank', rel: 'noopener' } : { hash: way.href }"
              class="pause-way"
              @click="close"
            >
              <span class="pause-way-emoji" aria-hidden="true">{{ way.emoji }}</span>
              <span class="pause-way-copy">
                <span class="pause-way-label">{{ way.label }}</span>
                <span class="pause-way-note">{{ way.note }}</span>
              </span>
              <span class="pause-way-arrow" aria-hidden="true">{{ way.external ? '↗' : '→' }}</span>
            </component>
          </li>
        </ul>
      </div>
    </dialog>
  </div>
</template>

<style scoped>
.pause {
  display: flex;
  justify-content: center;
}
/* The button: a big round pause sign, dark on the cream sheet */
.pause-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  width: 148px;
  height: 148px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: var(--brand-green);
  color: var(--brand-cream);
  box-shadow: 0 24px 60px rgba(20, 54, 31, 0.28);
  cursor: pointer;
  transition: transform 0.25s, box-shadow 0.25s, background-color 0.25s;
}
.pause-button:hover,
.pause-button:focus-visible {
  transform: scale(1.05);
  background: var(--brand-green-deep);
  box-shadow: 0 30px 70px rgba(20, 54, 31, 0.36);
}
.pause-button:focus-visible {
  outline: 3px solid var(--brand-accent);
  outline-offset: 4px;
}
.pause-button:active {
  transform: scale(0.97);
}
.pause-icon {
  display: flex;
  gap: 9px;
}
.pause-icon i {
  display: block;
  width: 13px;
  height: 42px;
  border-radius: 4px;
  background: currentColor;
}
.pause-label {
  font-family: var(--font-display);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

/* The dialog: the UA centers it in the top layer */
.pause-dialog {
  border: none;
  padding: 0;
  background: var(--brand-cream);
  color: var(--brand-green);
  border-radius: 28px;
  max-width: 520px;
  width: calc(100% - 2rem);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.3);
}
.pause-dialog[open] {
  animation: pause-in 0.3s ease;
}
.pause-dialog::backdrop {
  background: rgba(6, 15, 9, 0.6);
  backdrop-filter: blur(8px);
}
@keyframes pause-in {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
.pause-dialog-body {
  position: relative;
  padding: 2.5rem 2.25rem 2rem;
}
.pause-dialog-close {
  position: absolute;
  top: 0.75rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: none;
  font-size: 2rem;
  line-height: 1;
  color: var(--brand-faint);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.pause-dialog-close:hover,
.pause-dialog-close:focus-visible {
  background: rgba(20, 54, 31, 0.08);
  color: var(--brand-green);
}
.pause-kicker {
  margin: 0 0 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}
.pause-title {
  margin: 0 0 1.25rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 4vw, 2.4rem);
  line-height: 1.05;
  letter-spacing: -0.035em;
}
.pause-count {
  margin: 0 0 0.75rem;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  line-height: 1.35;
  letter-spacing: -0.02em;
}
.pause-count-number {
  color: var(--brand-death-text);
  font-variant-numeric: tabular-nums;
}
.pause-text {
  margin: 0 0 1.25rem;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--brand-muted);
}
.pause-ways {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}
.pause-way {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 0.9rem;
  align-items: center;
  padding: 0.85rem 1rem;
  border-radius: 16px;
  background: var(--brand-surface);
  border: 1px solid rgba(20, 54, 31, 0.1);
  color: var(--brand-green);
  text-decoration: none;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
}
.pause-way:hover,
.pause-way:focus-visible {
  border-color: var(--brand-accent);
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(20, 54, 31, 0.12);
  text-decoration: none;
}
.pause-way-emoji {
  font-size: 1.5rem;
  line-height: 1;
}
.pause-way-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.pause-way-label {
  font-weight: 700;
  font-size: 0.95rem;
}
.pause-way-note {
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--brand-muted);
}
.pause-way-arrow {
  font-weight: 700;
  color: var(--brand-accent-text);
}

@media (max-width: 767px) {
  .pause-button {
    width: 112px;
    height: 112px;
    gap: 0.4rem;
  }
  .pause-icon i {
    width: 10px;
    height: 32px;
  }
  .pause-dialog-body {
    padding: 2rem 1.25rem 1.5rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .pause-button,
  .pause-way {
    transition: none;
  }
  .pause-button:hover,
  .pause-button:focus-visible,
  .pause-way:hover,
  .pause-way:focus-visible {
    transform: none;
  }
  .pause-dialog[open] {
    animation: none;
  }
}
</style>

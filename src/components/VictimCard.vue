<script setup lang="ts">
import { computed } from 'vue'
import type { Victim } from '@/composables/useVictimTicker'

const props = withDefaults(defineProps<{
  victim: Victim
  /** The newest card gets the signal ring */
  hot?: boolean
  /** Light variant for the cream sheet, dark variant for the hero */
  variant?: 'dark' | 'light'
}>(), {
  hot: false,
  variant: 'dark',
})

/** Share of the possible life that was lived; a sliver at most for farmed animals */
const livedPercent = computed(() => {
  if (!props.victim.lifespanYears) return null
  const share = props.victim.livedDays / (props.victim.lifespanYears * 365)
  return Math.min(100, Math.max(0.6, share * 100))
})
</script>

<template>
  <article
    class="victim-card"
    :class="[`victim-card--${variant}`, { 'victim-card--hot': hot }]"
  >
    <div class="victim-card-head">
      <span class="victim-card-avatar" aria-hidden="true">{{ victim.emoji }}</span>
      <div class="victim-card-title">
        <span class="victim-card-name">{{ victim.name }}</span>
        <span class="victim-card-meta">{{ victim.species }} · {{ victim.location }}</span>
      </div>
    </div>
    <template v-if="livedPercent !== null">
      <div class="victim-card-bar" aria-hidden="true">
        <span :style="{ width: `${livedPercent}%` }"></span>
      </div>
      <div class="victim-card-note">
        <span class="victim-card-lived">{{ victim.age }} gelebt</span>
        <span>bis zu {{ victim.lifespanYears }} Jahre möglich</span>
      </div>
    </template>
    <div v-else class="victim-card-note">
      <span class="victim-card-lived">{{ victim.age }} gelebt</span>
    </div>
  </article>
</template>

<style scoped>
.victim-card {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 232px;
  padding: 13px 15px 12px;
  border-radius: 14px;
  border: 1px solid rgba(246, 241, 231, 0.12);
  border-top-color: rgba(246, 241, 231, 0.22);
  background: rgba(246, 241, 231, 0.055);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
  color: var(--brand-cream);
  transition: box-shadow 0.4s, border-color 0.4s;
}
.victim-card--hot {
  border-color: rgba(255, 106, 61, 0.55);
  border-top-color: rgba(255, 140, 100, 0.8);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3), 0 0 0 4px rgba(255, 106, 61, 0.08);
}
.victim-card--light {
  width: auto;
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  box-shadow: none;
  backdrop-filter: none;
  color: var(--brand-green);
  padding: 18px 20px;
  gap: 12px;
  border-radius: 18px;
}
.victim-card-head {
  display: flex;
  align-items: center;
  gap: 10px;
}
.victim-card-avatar {
  flex: 0 0 auto;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(246, 241, 231, 0.09);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 17px;
  line-height: 1;
}
.victim-card--hot .victim-card-avatar {
  background: rgba(255, 106, 61, 0.18);
}
.victim-card--light .victim-card-avatar {
  width: 44px;
  height: 44px;
  font-size: 24px;
  background: rgba(20, 54, 31, 0.06);
}
.victim-card--light.victim-card--hot .victim-card-avatar {
  background: rgba(255, 106, 61, 0.14);
}
.victim-card-title {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.victim-card-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 14px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.victim-card--light .victim-card-name {
  font-size: 20px;
}
.victim-card-meta {
  font-size: 11.5px;
  color: rgba(246, 241, 231, 0.62);
}
.victim-card--light .victim-card-meta {
  font-size: 13px;
  color: #6c757d;
}
.victim-card-bar {
  height: 3px;
  border-radius: 2px;
  background: rgba(246, 241, 231, 0.12);
  overflow: hidden;
}
.victim-card--light .victim-card-bar {
  height: 6px;
  border-radius: 3px;
  background: rgba(20, 54, 31, 0.08);
}
.victim-card-bar span {
  display: block;
  height: 100%;
  min-width: 3px;
  border-radius: inherit;
  background: var(--brand-accent);
}
.victim-card--light .victim-card-bar span {
  background: #e74c3c;
}
.victim-card-note {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: rgba(246, 241, 231, 0.55);
}
.victim-card--light .victim-card-note {
  font-size: 12.5px;
  color: #6c757d;
}
.victim-card-lived {
  font-weight: 700;
}
.victim-card--hot .victim-card-lived {
  color: var(--brand-accent);
}
.victim-card--light .victim-card-lived {
  color: #e74c3c;
}
</style>

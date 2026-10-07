<script setup lang="ts">
import { computed } from 'vue'
import type { Victim } from '@/composables/useVictimTicker'

const props = withDefaults(defineProps<{
  victim: Victim
  /** The newest card gets the signal ring */
  hot?: boolean
  /** Ticket for the hero lanes, or a lifeline row for the cream sheet */
  variant?: 'ticket' | 'row'
}>(), {
  hot: false,
  variant: 'ticket',
})

/** Share of the possible life that was lived; a sliver at most for farmed animals */
const livedPercent = computed(() => {
  const { livedDays, lifespanYears } = props.victim
  if (livedDays === undefined || !lifespanYears) return null
  const share = livedDays / (lifespanYears * 365)
  return Math.min(100, Math.max(0.6, share * 100))
})

/** The right column of a row: what is known about the possible life, in one line */
const rowNote = computed(() => {
  const parts: string[] = []
  if (!props.victim.age) parts.push('Alter unbekannt')
  if (props.victim.lifespanYears) parts.push(`bis zu ${props.victim.lifespanYears} Jahre möglich`)
  return parts.join(' · ')
})
</script>

<template>
  <div
    class="victim-card"
    :class="[`victim-card--${variant}`, { 'victim-card--hot': hot }]"
  >
    <div class="victim-card-head">
      <span class="victim-card-name">
        {{ victim.name }}<span v-if="hot && variant === 'row'" class="victim-card-dot" aria-hidden="true"></span>
      </span>
      <span class="victim-card-meta">{{ victim.species }} · {{ victim.location }}<template v-if="hot && variant === 'row'"> · gerade eben</template></span>
    </div>
    <!-- The lifeline: the whole possible life, and in red the part that was lived -->
    <div class="victim-card-line" aria-hidden="true">
      <span v-if="livedPercent !== null" class="victim-card-lived-bar" :style="{ width: `${livedPercent}%` }"></span>
      <span v-if="livedPercent !== null && variant === 'row'" class="victim-card-lived-label" :style="{ left: `${livedPercent}%` }">{{ victim.age }} gelebt</span>
    </div>
    <div class="victim-card-note">
      <span v-if="variant === 'row'">{{ rowNote }}</span>
      <template v-else>
        <span v-if="victim.age" class="victim-card-lived">{{ victim.age }} gelebt</span>
        <span v-if="victim.lifespanYears">bis zu {{ victim.lifespanYears }} Jahre möglich</span>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* ── Ticket: rises through the hero lanes ─────────── */
.victim-card--ticket {
  display: flex;
  flex-direction: column;
  gap: 9px;
  width: 264px;
  padding: 15px 18px 13px;
  border-radius: 16px;
  border: 1px solid rgba(246, 241, 231, 0.14);
  background: rgba(246, 241, 231, 0.06);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.32);
  color: var(--brand-cream);
  transition: border-color 0.4s;
}
.victim-card--ticket.victim-card--hot {
  border-color: rgba(255, 140, 100, 0.7);
  animation: victim-hot 2.4s ease-in-out infinite;
}
@keyframes victim-hot {
  0%, 100% { box-shadow: 0 24px 50px rgba(0, 0, 0, 0.32), 0 0 0 0 rgba(255, 106, 61, 0.35); }
  50% { box-shadow: 0 24px 50px rgba(0, 0, 0, 0.32), 0 0 0 10px rgba(255, 106, 61, 0); }
}
.victim-card--ticket .victim-card-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}
.victim-card-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 17px;
  letter-spacing: -0.02em;
  line-height: 1.1;
}
.victim-card-meta {
  font-size: 11.5px;
  color: rgba(246, 241, 231, 0.62);
  text-align: right;
}
.victim-card--ticket .victim-card-line {
  position: relative;
  height: 2px;
  border-radius: 1px;
  background: rgba(246, 241, 231, 0.16);
}
.victim-card--ticket .victim-card-lived-bar {
  position: absolute;
  left: 0;
  top: -2px;
  height: 6px;
  min-width: 4px;
  border-radius: 3px;
  background: var(--brand-accent);
}
.victim-card--ticket.victim-card--hot .victim-card-lived-bar {
  box-shadow: 0 0 12px rgba(255, 106, 61, 0.8);
}
.victim-card--ticket .victim-card-note {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
  color: rgba(246, 241, 231, 0.55);
}
.victim-card--ticket .victim-card-lived {
  font-weight: 700;
  color: #ff8c64;
}

/* ── Row: one lifeline on the cream sheet, all rows share the axis ── */
.victim-card--row {
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 190px;
  align-items: center;
  gap: 32px;
  padding: 22px 12px;
  border-bottom: 1px solid rgba(20, 54, 31, 0.1);
  border-radius: 12px;
  color: var(--brand-green);
  transition: background-color 0.3s;
}
.victim-card--row:hover {
  background: rgba(20, 54, 31, 0.035);
}
.victim-card--row .victim-card-head {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}
.victim-card--row .victim-card-name {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 22px;
}
.victim-card-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-accent);
  box-shadow: 0 0 0 4px rgba(255, 106, 61, 0.18);
}
.victim-card--row .victim-card-meta {
  font-size: 13px;
  color: var(--brand-faint);
  text-align: left;
}
.victim-card--row .victim-card-line {
  position: relative;
  height: 10px;
  border-radius: 5px;
  background: rgba(20, 54, 31, 0.08);
}
.victim-card--row .victim-card-lived-bar {
  position: absolute;
  left: 0;
  top: 0;
  height: 10px;
  min-width: 4px;
  border-radius: 5px;
  background: var(--brand-death);
}
.victim-card-lived-label {
  position: absolute;
  top: 18px;
  margin-left: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--brand-death-text);
  white-space: nowrap;
}
.victim-card--row .victim-card-note {
  font-size: 13px;
  color: var(--brand-faint);
  text-align: right;
}
@media (max-width: 991px) {
  .victim-card--row {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 4px 30px;
  }
  .victim-card--row .victim-card-note {
    text-align: left;
  }
}
@media (prefers-reduced-motion: reduce) {
  .victim-card--ticket.victim-card--hot {
    animation: none;
  }
}
</style>

import { inject, provide, ref, type InjectionKey, type Ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { useTimer } from '@/composables/useTimer'
import { useAnimalData } from '@/composables/useAnimalData'
import { useVictimTicker } from '@/composables/useVictimTicker'

/**
 * The emoji strip is a fixed two-row block, so the page never shifts while it fills.
 * Caps roughly match what two rows hold; the rest is counted as "+ N weitere".
 */
const WALL_CAP_DESKTOP = 140
const WALL_CAP_MOBILE = 42

export type LiveState = ReturnType<typeof createLiveState>

const LIVE_STATE: InjectionKey<LiveState> = Symbol('live-state')

function createLiveState() {
  const timer = useTimer()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const { animalData, totalDeathCount } = useAnimalData(timer, {
    emojiRenderCap: () => (isMobile.value ? WALL_CAP_MOBILE : WALL_CAP_DESKTOP),
  })
  // Few cards at a time, slowly: the hero should feel like a vigil, not a swarm
  const { victims, latest } = useVictimTicker(isMobile.value ? 4200 : 2300, isMobile.value ? 2 : 5)
  /** Set by the home view; the header shows the counter pill while the hero is off screen */
  const heroVisible: Ref<boolean> = ref(true)

  return { timer, isMobile, animalData, totalDeathCount, victims, latest, heroVisible }
}

/** Call once in App.vue so header, home view and pill share one clock and one ticker */
export function provideLiveState(): LiveState {
  const state = createLiveState()
  provide(LIVE_STATE, state)
  return state
}

export function useLiveState(): LiveState {
  const state = inject(LIVE_STATE)
  if (!state) throw new Error('useLiveState() needs provideLiveState() in an ancestor')
  return state
}

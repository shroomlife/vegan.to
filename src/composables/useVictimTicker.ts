import { shallowRef, triggerRef, onUnmounted, toValue, type MaybeRefOrGetter } from 'vue'
import { animals } from '@/data/animals'
import { lifespanYearsBySpecies, slaughterAgeBySpecies, DAYS_PER_UNIT } from '@/data/lifespans'

/** 130+ verifizierte Schlachthof-Standorte in Deutschland */
const slaughterhouseLocations = [
  'Ahaus', 'Ahlhorn', 'Altenburg', 'Alzey', 'Ansbach', 'Augsburg',
  'Backnang', 'Bad Belzig', 'Bad Bramstedt', 'Bad Iburg', 'Bad Laer',
  'Bad Oldesloe', 'Badbergen', 'Bakum', 'Balingen', 'Bamberg', 'Bayreuth',
  'Beckum', 'Berlin', 'Biberach', 'Birkenfeld', 'Bocholt', 'Bogen',
  'Boizenburg', 'Borgholzhausen', 'Böklund', 'Bramsche', 'Bremen', 'Brenz',
  'Britz', 'Buchloe', 'Buxtehude', 'Cappeln', 'Chemnitz', 'Cloppenburg',
  'Coburg', 'Coesfeld', 'Crailsheim', 'Damme', 'Dannenberg', 'Delbrück',
  'Delmenhorst', 'Diepholz', 'Dinklage', 'Dissen', 'Döbeln',
  'Donaueschingen', 'Eberswalde', 'Elsfleth', 'Emsdetten', 'Emstek',
  'Erlangen', 'Essen', 'Friesoythe', 'Fulda', 'Furth im Wald', 'Garrel',
  'Gärtringen', 'Gerolstein', 'Großenkneten', 'Großostheim', 'Gudensberg',
  'Gütersloh', 'Hadamar', 'Hainspitz', 'Halberstadt', 'Haldensleben',
  'Hamburg', 'Hamm', 'Haren', 'Hilden', 'Holzminden', 'Holzwickede',
  'Husum', 'Ingolstadt', 'Itzehoe', 'Kellinghusen', 'Kempten',
  'Königs Wusterhausen', 'Kulmbach', 'Laage', 'Landshut', 'Lindern',
  'Lohne', 'Lorup', 'Lübbecke', 'Lüttow-Valluhn', 'Mannheim',
  'Memmingen', 'Meppen', 'Mockrehna', 'Möckern', 'Münster', 'Nienburg',
  'Nürnberg', 'Oer-Erkenschwick', 'Oldenburg', 'Olpe', 'Paderborn',
  'Passau', 'Perleberg', 'Prüm', 'Quakenbrück', 'Rechterfeld',
  'Regensburg', 'Regenstauf', 'Reuden', 'Rheda-Wiedenbrück', 'Rietberg',
  'Satrup', 'Schöppingen', 'Schüttorf', 'Schwäbisch Hall', 'Sögel',
  'Steinfeld', 'Storkow', 'Straubing', 'Suhl', 'Teterow', 'Torgau',
  'Twist', 'Ulm', 'Vechta', 'Versmold', 'Vilshofen', 'Visbek',
  'Wachtendonk', 'Waldkraiburg', 'Weißenfels', 'Wietze', 'Wildeshausen',
  'Wilhelmshaven', 'Wittlich', 'Zerbst',
]

/** Where fish of the German fleet and aquaculture die: fishing grounds and ports */
const fishingLocations = [
  'Nordsee', 'Ostsee', 'Nordostatlantik', 'Bremerhaven', 'Cuxhaven',
  'Sassnitz', 'Rostock', 'Büsum', 'Heiligenhafen', 'Kiel', 'Aischgrund', 'Oberpfalz',
]

const namesBySpecies: Record<string, string[]> = {
  Fisch: [
    'Finn', 'Marina', 'Flossi', 'Blubb', 'Silba', 'Perla', 'Sprotti', 'Nixe',
    'Kiemo', 'Welle', 'Coral', 'Tide', 'Glitzer', 'Schuppi', 'Bubbles', 'Lotse',
  ],
  Huhn: [
    'Frieda', 'Berta', 'Hilde', 'Rosa', 'Lotte', 'Emma', 'Greta', 'Clara',
    'Martha', 'Elsa', 'Helga', 'Inge', 'Liesel', 'Minna', 'Trude', 'Alma',
    'Gerda', 'Ida', 'Paula', 'Heidi', 'Luise', 'Dora', 'Käthe', 'Wally',
  ],
  Schwein: [
    'Fritz', 'Rudi', 'Willi', 'Otto', 'Karl', 'Franz', 'Hans', 'Erwin',
    'Hugo', 'Max', 'Moritz', 'Babe', 'Eberhard', 'Gustav', 'Helmut', 'Kurt',
    'Ludwig', 'Oskar', 'Rainer', 'Siegfried', 'Werner', 'Alfred', 'Ernst', 'Paul',
  ],
  Truthuhn: [
    'Thea', 'Trudel', 'Tilda', 'Tamara', 'Toni', 'Trudi', 'Tabea', 'Theresa',
  ],
  Rind: [
    'Bella', 'Klara', 'Liesel', 'Berta', 'Alma', 'Flora', 'Heidi', 'Elsa',
    'Lina', 'Gisela', 'Rosmarie', 'Hanna', 'Brunhilde', 'Erna', 'Magda', 'Ilse',
    'Ferdinand', 'Bruno', 'Hansi', 'Seppl', 'Florian', 'Stefan', 'Anton', 'Korbinian',
  ],
  Schaf: [
    'Wolle', 'Shaun', 'Molly', 'Flöckchen', 'Schneeweiß', 'Wolke', 'Dolly',
    'Lammy', 'Flocke', 'Schnucki', 'Wilma', 'Nelly', 'Sofie',
  ],
  Ente: [
    'Donald', 'Daisy', 'Quaki', 'Schnatter', 'Fedora', 'Else', 'Elli', 'Ducky',
  ],
  Ziege: [
    'Peter', 'Geißlein', 'Zita', 'Heidi', 'Mecki', 'Gretel', 'Zicke', 'Metzi',
  ],
  Pferd: [
    'Blitz', 'Stern', 'Luna', 'Spirit', 'Halla', 'Fury', 'Sturmwind', 'Morgenrot',
  ],
  Gans: [
    'Gustl', 'Auguste', 'Gundi', 'Martina', 'Gisela', 'Gertrud', 'Greta', 'Gabi',
  ],
}

export type Lane = 'left' | 'right'

export interface Victim {
  id: number
  name: string
  emoji: string
  species: string
  /** Age at death as shown, e.g. "38 Tage" */
  age: string
  /** Age at death in days, for the lived-versus-possible bar */
  livedDays: number
  /** Natural life expectancy in years, when a sourced value exists */
  lifespanYears?: number
  location: string
  /** Cards rise in two lanes so the middle stays free for text and counter */
  lane: Lane
  /** Horizontal position inside the lane as a CSS percentage */
  left: string
  /** CSS animation duration in seconds */
  duration: number
  /** When this card expires (ms since epoch) */
  expiresAt: number
  /** Negative animation-delay in seconds for seed cards (0 for new ones) */
  startOffset: number
}

/**
 * Species are picked by their share of deaths, dampened with a cube root so the
 * order stays honest but the ticker keeps variety. Raw shares would give fish
 * about 85 % and chickens 13 % of all bubbles; dampened it is roughly 44 % and 23 %.
 */
const totalDeaths = animals.reduce((sum, a) => sum + a.deaths.year, 0)
const dampenedShares = animals.map((a) => Math.cbrt(a.deaths.year / totalDeaths))
const dampenedTotal = dampenedShares.reduce((sum, w) => sum + w, 0)
const weightedAnimals = animals.map((a, i) => ({
  single: a.names.single,
  emoji: a.names.emoji,
  weight: dampenedShares[i]! / dampenedTotal,
}))

function pickRandomSpecies() {
  const r = Math.random()
  let cumulative = 0
  for (const animal of weightedAnimals) {
    cumulative += animal.weight
    if (r <= cumulative) return animal
  }
  return weightedAnimals[0]!
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

let idCounter = 0
let lastLane: Lane = 'right'

function generateVictim(): Victim {
  const species = pickRandomSpecies()
  const names = namesBySpecies[species.single] ?? ['Unbekannt']
  const name = names[randomInt(0, names.length - 1)]!
  const ageData = slaughterAgeBySpecies[species.single] ?? { min: 1, max: 12, unit: 'Monate' }
  const ageValue = randomInt(ageData.min, ageData.max)
  const age = `${ageValue} ${ageData.unit}`
  const livedDays = Math.round(ageValue * DAYS_PER_UNIT[ageData.unit])
  // Slow enough to read a name and a life; the cards are a vigil, not confetti
  const duration = randomInt(14, 18)
  const locations = species.single === 'Fisch' ? fishingLocations : slaughterhouseLocations
  const location = locations[randomInt(0, locations.length - 1)]!
  lastLane = lastLane === 'left' ? 'right' : 'left'

  return {
    id: idCounter++,
    name,
    emoji: species.emoji,
    species: species.single,
    age,
    livedDays,
    lifespanYears: lifespanYearsBySpecies[species.single],
    location,
    lane: lastLane,
    left: `${randomInt(0, 70)}%`,
    duration,
    // +1s buffer so CSS animation is fully done before GC removes the node
    expiresAt: Date.now() + (duration + 1) * 1000,
    startOffset: 0,
  }
}

/**
 * Spawns floating victim cards. Each card has a CSS animation duration,
 * and gets garbage-collected from the array once that time has elapsed.
 * This keeps DOM node count stable even over long sessions.
 *
 * The interval may be reactive (bigger screens hold more cards); it is read
 * anew before every spawn, so a resize changes the pace without a restart.
 */
export function useVictimTicker(spawnIntervalMs: MaybeRefOrGetter<number> = 2300, seedCount: MaybeRefOrGetter<number> = 5) {
  // shallowRef + manual trigger for performance — avoids deep reactivity on the array
  const victims = shallowRef<Victim[]>([])

  // Seed immediately — use negative animation-delay to place them mid-flight
  const seed: Victim[] = []
  for (let i = 0; i < toValue(seedCount); i++) {
    const v = generateVictim()
    // Negative offset makes CSS animation start partway through
    const offset = randomInt(1, v.duration - 1)
    v.startOffset = -offset
    // Expires after the remaining animation time + 1s buffer
    v.expiresAt = Date.now() + (v.duration - offset + 1) * 1000
    seed.push(v)
  }
  victims.value = seed
  /** The most recently spawned card; the live sentence names it */
  const latest = shallowRef<Victim>(seed[seed.length - 1]!)

  // Spawn new cards, one timeout at a time so the pace can follow the viewport
  let spawnId: ReturnType<typeof setTimeout> | undefined
  function scheduleSpawn() {
    spawnId = setTimeout(() => {
      const arr = victims.value
      // GC expired cards in the same pass
      const alive = arr.filter((v) => Date.now() < v.expiresAt)
      const next = generateVictim()
      alive.push(next)
      victims.value = alive
      latest.value = next
      triggerRef(victims)
      scheduleSpawn()
    }, toValue(spawnIntervalMs))
  }
  scheduleSpawn()

  onUnmounted(() => {
    clearTimeout(spawnId)
  })

  return { victims, latest }
}

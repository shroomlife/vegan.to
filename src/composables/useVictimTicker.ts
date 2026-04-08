import { shallowRef, triggerRef, onUnmounted } from 'vue'
import { animals } from '@/data/animals'

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

const namesBySpecies: Record<string, string[]> = {
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

const slaughterAges: Record<string, { min: number; max: number; unit: string }> = {
  Huhn: { min: 28, max: 42, unit: 'Tage' },
  Schwein: { min: 150, max: 200, unit: 'Tage' },
  Truthuhn: { min: 90, max: 140, unit: 'Tage' },
  Rind: { min: 14, max: 24, unit: 'Monate' },
  Schaf: { min: 3, max: 12, unit: 'Monate' },
  Ente: { min: 42, max: 63, unit: 'Tage' },
  Ziege: { min: 3, max: 10, unit: 'Monate' },
  Pferd: { min: 2, max: 8, unit: 'Jahre' },
  Gans: { min: 100, max: 200, unit: 'Tage' },
}

export interface Victim {
  id: number
  name: string
  emoji: string
  species: string
  age: string
  location: string
  left: string
  /** CSS animation duration in seconds */
  duration: number
  /** When this bubble expires (ms since epoch) */
  expiresAt: number
  /** Negative animation-delay in seconds for seed bubbles (0 for new ones) */
  startOffset: number
}

const totalDeaths = animals.reduce((sum, a) => sum + a.deaths.year, 0)
const weightedAnimals = animals.map((a) => ({
  single: a.names.single,
  emoji: a.names.emoji,
  weight: a.deaths.year / totalDeaths,
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

function generateVictim(): Victim {
  const species = pickRandomSpecies()
  const names = namesBySpecies[species.single] ?? ['Unbekannt']
  const name = names[randomInt(0, names.length - 1)]!
  const ageData = slaughterAges[species.single] ?? { min: 1, max: 12, unit: 'Monate' }
  const age = `${randomInt(ageData.min, ageData.max)} ${ageData.unit}`
  const duration = randomInt(6, 11)
  const location = slaughterhouseLocations[randomInt(0, slaughterhouseLocations.length - 1)]!

  return {
    id: idCounter++,
    name,
    emoji: species.emoji,
    species: species.single,
    age,
    location,
    left: `${randomInt(2, 88)}%`,
    duration,
    // +1s buffer so CSS animation is fully done before GC removes the node
    expiresAt: Date.now() + (duration + 1) * 1000,
    startOffset: 0,
  }
}

/**
 * Spawns floating victim bubbles. Each bubble has a CSS animation duration,
 * and gets garbage-collected from the array once that time has elapsed.
 * This keeps DOM node count stable even over long sessions.
 */
export function useVictimTicker(spawnIntervalMs = 250) {
  // shallowRef + manual trigger for performance — avoids deep reactivity on the array
  const victims = shallowRef<Victim[]>([])

  // Seed immediately — use negative animation-delay to place them mid-flight
  const seed: Victim[] = []
  for (let i = 0; i < 12; i++) {
    const v = generateVictim()
    // Negative offset makes CSS animation start partway through
    const offset = randomInt(1, v.duration - 1)
    v.startOffset = -offset
    // Expires after the remaining animation time + 1s buffer
    v.expiresAt = Date.now() + (v.duration - offset + 1) * 1000
    seed.push(v)
  }
  victims.value = seed

  // Spawn new bubbles
  const spawnId = setInterval(() => {
    const arr = victims.value
    // GC expired bubbles in the same pass
    const alive = arr.filter((v) => Date.now() < v.expiresAt)
    alive.push(generateVictim())
    victims.value = alive
    triggerRef(victims)
  }, spawnIntervalMs)

  onUnmounted(() => {
    clearInterval(spawnId)
  })

  return { victims }
}

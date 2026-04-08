import { ref, onUnmounted } from 'vue'
import { animals } from '@/data/animals'

// Deutsche Tiernamen pro Tierart
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
    'Lammy', 'Flocke', 'Schnucki', 'Mäh', 'Schäfchen', 'Wilma', 'Nelly', 'Sofie',
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

// Typische Lebensdauer in der Massentierhaltung (Tage)
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

interface Victim {
  id: number
  name: string
  emoji: string
  species: string
  age: string
}

// Weighted random pick based on yearly deaths
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

  return {
    id: idCounter++,
    name,
    emoji: species.emoji,
    species: species.single,
    age,
  }
}

export function useVictimTicker(intervalMs = 3000, maxVisible = 4) {
  const victims = ref<Victim[]>([])

  // Start with one immediately
  victims.value = [generateVictim()]

  const intervalId = setInterval(() => {
    const newVictim = generateVictim()
    victims.value = [newVictim, ...victims.value].slice(0, maxVisible)
  }, intervalMs)

  onUnmounted(() => {
    clearInterval(intervalId)
  })

  return { victims }
}

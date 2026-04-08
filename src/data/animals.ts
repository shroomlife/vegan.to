/**
 * Schlachtstatistiken Deutschland
 *
 * Quellen:
 * - Rinder, Schweine, Schafe, Ziegen, Pferde: Statistisches Bundesamt (Destatis),
 *   GENESIS-Online Tabelle 41331-0001, Gewerbliche Schlachtungen inländischer Herkunft,
 *   Jahresdaten 2024 (endgültig). Stand: April 2026.
 * - Geflügel: Statistisches Bundesamt (Destatis),
 *   GENESIS-Online Tabelle 41322-0001, Geflügelschlachtereien,
 *   Jahresdaten 2025. Stand: April 2026.
 */

export interface AnimalChild {
  name: string
  deaths: {
    year: number
  }
}

export interface Animal {
  names: {
    single: string
    plural: string
    emoji: string
  }
  deaths: {
    year: number
  }
  children?: AnimalChild[]
}

export const animals: Animal[] = [
  {
    names: {
      single: 'Huhn',
      plural: 'Hühner',
      emoji: '🐔',
    },
    deaths: {
      year: 660_977_701,
    },
    children: [
      { name: 'Jungmasthühner', deaths: { year: 640_230_127 } },
      { name: 'Suppenhühner', deaths: { year: 20_747_574 } },
    ],
  },
  {
    names: {
      single: 'Schwein',
      plural: 'Schweine',
      emoji: '🐷',
    },
    deaths: {
      year: 43_274_683,
    },
  },
  {
    names: {
      single: 'Truthuhn',
      plural: 'Truthühner',
      emoji: '🦃',
    },
    deaths: {
      year: 27_556_012,
    },
  },
  {
    names: {
      single: 'Rind',
      plural: 'Rinder',
      emoji: '🐄',
    },
    deaths: {
      year: 2_987_184,
    },
    children: [
      { name: 'Bullen', deaths: { year: 1_100_900 } },
      { name: 'Kühe', deaths: { year: 996_057 } },
      { name: 'Färsen', deaths: { year: 552_530 } },
      { name: 'Kälber', deaths: { year: 288_235 } },
      { name: 'Ochsen', deaths: { year: 35_753 } },
      { name: 'Jungrinder', deaths: { year: 13_709 } },
    ],
  },
  {
    names: {
      single: 'Schaf',
      plural: 'Schafe',
      emoji: '🐑',
    },
    deaths: {
      year: 858_857,
    },
    children: [
      { name: 'Lämmer', deaths: { year: 742_014 } },
      { name: 'übrige Schafe', deaths: { year: 116_843 } },
    ],
  },
  {
    names: {
      single: 'Ente',
      plural: 'Enten',
      emoji: '🦆',
    },
    deaths: {
      year: 8_347_759,
    },
  },
  {
    names: {
      single: 'Ziege',
      plural: 'Ziegen',
      emoji: '🐐',
    },
    deaths: {
      year: 3_537,
    },
  },
  {
    names: {
      single: 'Pferd',
      plural: 'Pferde',
      emoji: '🐴',
    },
    deaths: {
      year: 719,
    },
  },
  {
    names: {
      single: 'Gans',
      plural: 'Gänse',
      emoji: '🪿',
    },
    deaths: {
      year: 414_898,
    },
  },
]

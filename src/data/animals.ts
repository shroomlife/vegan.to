/**
 * Schlachtstatistiken Deutschland
 *
 * Quellen (beide Tabellen gegengeprüft am 12.09.2026, Datenstand GENESIS: 21.08.2026):
 * - Rinder, Schweine, Schafe, Ziegen, Pferde: Statistisches Bundesamt (Destatis),
 *   GENESIS-Online Tabelle 41331-0001, Gewerbliche Schlachtungen von Tieren
 *   inländischer Herkunft, Jahresdaten 2025.
 *   Nicht enthalten: Tiere ausländischer Herkunft und Hausschlachtungen.
 * - Geflügel: Statistisches Bundesamt (Destatis),
 *   GENESIS-Online Tabelle 41322-0001, Geflügelschlachtereien, Jahresdaten 2025.
 * - Fische (Schätzung, amtlich nur in Tonnen erfasst):
 *   Wildfang der deutschen Fischerei nach fishcount.org.uk (Mood & Brooke 2025,
 *   FAO-Fangmengen geteilt durch geschätzte Stückgewichte je Art),
 *   Durchschnitt 2003 bis 2022: 3,7 bis 5,0 Mrd., hier der Mittelwert 4,4 Mrd.
 *   Aquakultur: Destatis Pressemitteilung 188/26 (16.600 t, 2025), nach
 *   fishcount-Stückgewichten rund 24 Mio. Tiere. Ohne Beifang, ohne Importe.
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
  /** Present when the count is derived from tonnage instead of counted per animal */
  estimate?: {
    note: string
  }
  children?: AnimalChild[]
}

export const animals: Animal[] = [
  {
    names: {
      single: 'Fisch',
      plural: 'Fische',
      emoji: '🐟',
    },
    deaths: {
      year: 4_424_000_000,
    },
    estimate: {
      note: 'Fische werden amtlich nur in Tonnen erfasst, nicht als Tiere. Umgerechnet mit Durchschnittsgewichten je Art nach fishcount.org.uk: Fang der deutschen Fischerei im Schnitt 2003 bis 2022 zwischen 3,7 und 5,0 Milliarden, hier 4,4 Milliarden, plus rund 24 Millionen aus deutscher Aquakultur. Ohne Beifang und ohne Importe.',
    },
    children: [
      { name: 'Wildfang der deutschen Fischerei', deaths: { year: 4_400_000_000 } },
      { name: 'Aquakultur', deaths: { year: 24_000_000 } },
    ],
  },
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
      year: 44_016_159,
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
      year: 2_772_791,
    },
    children: [
      { name: 'Bullen', deaths: { year: 1_024_169 } },
      { name: 'Kühe', deaths: { year: 925_409 } },
      { name: 'Färsen', deaths: { year: 512_598 } },
      { name: 'Kälber', deaths: { year: 262_283 } },
      { name: 'Ochsen', deaths: { year: 35_561 } },
      { name: 'Jungrinder', deaths: { year: 12_771 } },
    ],
  },
  {
    names: {
      single: 'Schaf',
      plural: 'Schafe',
      emoji: '🐑',
    },
    deaths: {
      year: 680_585,
    },
    children: [
      { name: 'Lämmer', deaths: { year: 578_042 } },
      { name: 'übrige Schafe', deaths: { year: 102_543 } },
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
      year: 20_961,
    },
  },
  {
    names: {
      single: 'Pferd',
      plural: 'Pferde',
      emoji: '🐴',
    },
    deaths: {
      year: 3_499,
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

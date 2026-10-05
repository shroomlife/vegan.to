/**
 * Natural life expectancy per species in years: how long the animal could live
 * if nobody killed it. Shown as "38 Tage gelebt, bis zu 7 Jahre möglich".
 *
 * Values are the upper end of what the cited source states as reachable ('bis zu'),
 * shown as 'bis zu X Jahre'. Fish figures are maximum recorded ages (FishBase);
 * "Fisch" uses the sprat, the most caught species.
 * Sources: see the "Lebenserwartung" group in sources.ts.
 */
export const lifespanYearsBySpecies: Readonly<Partial<Record<string, number>>> = {
  Huhn: 7, // BZL: "manche schaffen sogar sieben Jahre"
  Schwein: 10, // BZL: "etwa acht bis zehn Jahren"; Vier Pfoten: "problemlos 10 Jahre"
  Rind: 25, // BZL: "Rinder können ein Alter von bis zu 25 Jahren erreichen"; Vier Pfoten: einige erreichen 20, die Kuh Milla wurde 25
  Truthuhn: 10, // Deutscher Tierschutzbund: "bis zu zehn Jahre"
  Ente: 8, // VGT: "6 bis 8 Jahren"
  Schaf: 12, // BZL: "maximal zwölf Jahre"
  Ziege: 12, // BZL: "maximal zwölf Jahre"
  Pferd: 25, // Allianz: "zwischen 20 und 35 Jahren"
  Gans: 15, // Vier Pfoten: "etwa 15 Jahren"
  Fisch: 6, // FishBase, Sprotte: "max. reported age: 6 years"
}

export interface SlaughterAge {
  min: number
  max: number
  unit: 'Tage' | 'Wochen' | 'Monate' | 'Jahre'
}

/**
 * Typical age at slaughter. Source: BZL, landwirtschaft.de
 * "Wie lange leben Rind, Schwein, Schaf und Huhn?" (Mast, not culled dairy animals).
 * Horse and fish have no current reliable source for slaughter age, so they have
 * no entry and no age is shown for them.
 */
export const slaughterAgeBySpecies: Readonly<Partial<Record<string, SlaughterAge>>> = {
  Huhn: { min: 35, max: 49, unit: 'Tage' },
  Schwein: { min: 180, max: 210, unit: 'Tage' },
  Truthuhn: { min: 112, max: 154, unit: 'Tage' },
  Rind: { min: 18, max: 21, unit: 'Monate' },
  Schaf: { min: 4, max: 12, unit: 'Monate' },
  Ente: { min: 49, max: 70, unit: 'Tage' },
  Ziege: { min: 10, max: 15, unit: 'Wochen' },
  Gans: { min: 112, max: 210, unit: 'Tage' },
}

export const DAYS_PER_UNIT: Readonly<Record<SlaughterAge['unit'], number>> = { Tage: 1, Wochen: 7, Monate: 30.4, Jahre: 365 }

/** The unit in the dative, for "mit 35 bis 49 Tagen" and "mit 18 bis 21 Monaten" */
export const DATIVE_UNIT: Readonly<Record<SlaughterAge['unit'], string>> = { Tage: 'Tagen', Wochen: 'Wochen', Monate: 'Monaten', Jahre: 'Jahren' }

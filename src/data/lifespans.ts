/**
 * Natural life expectancy per species in years: how long the animal could live
 * if nobody killed it. Shown as "38 Tage gelebt, bis zu 7 Jahre möglich".
 *
 * Where sources disagree the lower figure is used. Fish figures are maximum
 * recorded ages (FishBase); "Fisch" uses the sprat, the most caught species.
 * Sources: see the "Lebenserwartung" group in sources.ts.
 */
export const lifespanYearsBySpecies: Readonly<Partial<Record<string, number>>> = {
  Huhn: 7, // BZL: "manche schaffen sogar sieben Jahre"
  Schwein: 10, // BZL: "etwa acht bis zehn Jahren"; Vier Pfoten: "problemlos 10 Jahre"
  Rind: 20, // Vier Pfoten: Rinder erreichen 20 Jahre; BZL: bis zu 25
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
 * Pferd: industry sources cite 8 to 10 years on average.
 * Fisch: Sprotte und Hering (Masse des Fangs) 1 bis 3 Jahre, Zuchtforelle 12 bis 18 Monate.
 */
export const slaughterAgeBySpecies: Readonly<Record<string, SlaughterAge>> = {
  Fisch: { min: 1, max: 3, unit: 'Jahre' },
  Huhn: { min: 35, max: 49, unit: 'Tage' },
  Schwein: { min: 180, max: 210, unit: 'Tage' },
  Truthuhn: { min: 112, max: 154, unit: 'Tage' },
  Rind: { min: 18, max: 21, unit: 'Monate' },
  Schaf: { min: 4, max: 12, unit: 'Monate' },
  Ente: { min: 49, max: 70, unit: 'Tage' },
  Ziege: { min: 10, max: 15, unit: 'Wochen' },
  Pferd: { min: 5, max: 10, unit: 'Jahre' },
  Gans: { min: 112, max: 210, unit: 'Tage' },
}

export const DAYS_PER_UNIT: Readonly<Record<SlaughterAge['unit'], number>> = { Tage: 1, Wochen: 7, Monate: 30.4, Jahre: 365 }

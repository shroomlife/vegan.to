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

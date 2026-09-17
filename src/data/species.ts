import type { SourceId } from './sources.ts'

/**
 * One page per species under /tiere/<slug>. Keyed by the singular name used in
 * animals.ts. Only type imports here: vite.config.ts reads the slugs for the
 * sitemap, so this file must not pull the app's runtime modules along.
 */
export interface SpeciesProfile {
  slug: string
  /** Singular name as in animals.ts, e.g. "Huhn" */
  single: string
  /** Where the yearly figure comes from */
  countSources: readonly SourceId[]
  /** Where the age at slaughter and the possible lifespan come from */
  lifeSources: readonly SourceId[]
}

export const speciesProfiles: readonly SpeciesProfile[] = [
  { slug: 'huehner', single: 'Huhn', countSources: ['destatisPoultry'], lifeSources: ['bzlAges'] },
  { slug: 'schweine', single: 'Schwein', countSources: ['destatisSlaughter'], lifeSources: ['bzlAges', 'vierPfotenSchweine'] },
  { slug: 'truthuehner', single: 'Truthuhn', countSources: ['destatisPoultry'], lifeSources: ['bzlAges', 'tierschutzbundPuten'] },
  { slug: 'enten', single: 'Ente', countSources: ['destatisPoultry'], lifeSources: ['bzlAges', 'vgtLebenserwartung'] },
  { slug: 'rinder', single: 'Rind', countSources: ['destatisSlaughter'], lifeSources: ['bzlAges', 'vierPfotenRinder'] },
  { slug: 'schafe', single: 'Schaf', countSources: ['destatisSlaughter'], lifeSources: ['bzlAges'] },
  { slug: 'gaense', single: 'Gans', countSources: ['destatisPoultry'], lifeSources: ['bzlAges', 'vierPfotenGaense'] },
  { slug: 'ziegen', single: 'Ziege', countSources: ['destatisSlaughter'], lifeSources: ['bzlAges'] },
  { slug: 'pferde', single: 'Pferd', countSources: ['destatisSlaughter'], lifeSources: ['allianzPferde'] },
  { slug: 'fische', single: 'Fisch', countSources: ['fishcount', 'destatisAquaculture', 'bleLandings'], lifeSources: ['bzlAges', 'lflCarp', 'fishbaseSprotte'] },
]

export const speciesSlugs: readonly string[] = speciesProfiles.map((profile) => profile.slug)

export function profileBySlug(slug: string): SpeciesProfile | undefined {
  return speciesProfiles.find((profile) => profile.slug === slug)
}

export function slugBySpecies(single: string): string | undefined {
  return speciesProfiles.find((profile) => profile.single === single)?.slug
}

import { animals } from '@/data/animals'
import { POPULATION_DE } from '@/data/population'

/**
 * Slaughter figures per person in Germany and year, land animals and fish apart.
 *
 * Land animals are counted per head by Destatis. Fish are an estimate from
 * tonnage and come from the German catch, so the two must not be added into
 * one "animals per person" figure. Shared by the species pages, the impact
 * chapter and the methodology page, so the number is the same everywhere.
 */
const sumDeaths = (list: readonly { deaths: { year: number } }[]) => list.reduce((sum, a) => sum + a.deaths.year, 0)

export const LAND_ANIMAL_DEATHS_YEAR = sumDeaths(animals.filter((a) => !a.estimate))
export const FISH_DEATHS_YEAR = sumDeaths(animals.filter((a) => a.estimate))

export const LAND_ANIMALS_PER_PERSON_YEAR = LAND_ANIMAL_DEATHS_YEAR / POPULATION_DE
export const FISH_PER_PERSON_YEAR = FISH_DEATHS_YEAR / POPULATION_DE

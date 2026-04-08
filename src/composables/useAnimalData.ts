import { computed } from 'vue'
import { animals as rawAnimals, type Animal, type AnimalChild } from '@/data/animals'
import { formatNumber } from '@/utils/formatNumber'
import { shuffle } from '@/utils/shuffle'

const SECONDS_PER_DAY = 86_400
const SECONDS_PER_YEAR = 365.25 * SECONDS_PER_DAY

function perSec(yearlyCount: number): number {
  return yearlyCount / SECONDS_PER_YEAR
}

export interface ComputedChild {
  name: string
  perDay: number
  perDayFormatted: string
  currentDay: number
  currentDayFormatted: string
  currentYear: number
  currentYearFormatted: string
}

export interface ComputedAnimal {
  names: Animal['names']
  perDay: number
  perSec: number
  currentDay: number
  currentDayFormatted: string
  currentYear: number
  currentYearFormatted: string
  killedSinceStart: number
  killedSinceStartEmojis: string
  children: ComputedChild[]
  childView: boolean
  getNameByCount: (count: number) => string
}

interface Timer {
  secondsSinceStart: { value: number }
  secondsSinceYearStart: { value: number }
  secondsSinceDayStart: { value: number }
}

function computeChild(child: AnimalChild, secYear: number, secDay: number, secStart: number): ComputedChild {
  const rate = perSec(child.deaths.year)
  const currentDay = rate * secDay
  const currentYear = rate * secYear + rate * secStart
  const perDayValue = child.deaths.year / 365.25

  return {
    name: child.name,
    perDay: perDayValue,
    perDayFormatted: formatNumber(perDayValue),
    currentDay: Math.round(currentDay + rate * secStart),
    currentDayFormatted: formatNumber(currentDay + rate * secStart),
    currentYear: Math.round(currentYear),
    currentYearFormatted: formatNumber(currentYear),
  }
}

// Sort by yearly deaths descending
const sortedAnimals = [...rawAnimals].sort((a, b) => b.deaths.year - a.deaths.year)

export function useAnimalData(timer: Timer) {
  const animalData = computed<ComputedAnimal[]>(() => {
    const secYear = timer.secondsSinceYearStart.value
    const secDay = timer.secondsSinceDayStart.value
    const secStart = timer.secondsSinceStart.value

    return sortedAnimals.map((animal) => {
      const rate = perSec(animal.deaths.year)
      const freshKilled = rate * secStart
      const currentDay = rate * secDay + freshKilled
      const currentYear = rate * secYear + freshKilled
      const perDayValue = animal.deaths.year / 365.25
      const killedCount = Math.round(freshKilled)

      const children = (animal.children ?? [])
        .map((child) => computeChild(child, secYear, secDay, secStart))
        .sort((a, b) => b.currentYear - a.currentYear)

      return {
        names: animal.names,
        perDay: perDayValue,
        perSec: rate,
        currentDay: Math.round(currentDay),
        currentDayFormatted: formatNumber(currentDay),
        currentYear: Math.round(currentYear),
        currentYearFormatted: formatNumber(currentYear),
        killedSinceStart: killedCount,
        killedSinceStartEmojis: killedCount > 0
          ? Array(killedCount).fill(animal.names.emoji).join('')
          : '',
        children,
        childView: false,
        getNameByCount: (count: number) =>
          count > 1 ? animal.names.plural : animal.names.single,
      }
    })
  })

  const totalDeathCount = computed(() =>
    animalData.value.reduce((sum, a) => sum + a.killedSinceStart, 0),
  )

  const totalDeathEmojis = computed(() => {
    const emojis: string[] = []
    for (const animal of animalData.value) {
      if (animal.killedSinceStart > 0) {
        emojis.push(...Array(animal.killedSinceStart).fill(animal.names.emoji) as string[])
      }
    }
    return shuffle(emojis).join('')
  })

  return {
    animalData,
    totalDeathCount,
    totalDeathEmojis,
  }
}

import { computed } from 'vue'
import { animals as rawAnimals, type Animal, type AnimalChild } from '@/data/animals'
import { formatNumber } from '@/utils/formatNumber'
import { shuffle } from '@/utils/shuffle'

/** Max emojis rendered per animal card; keeps the DOM small in long sessions */
const EMOJI_RENDER_CAP = 2000

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
  estimate?: Animal['estimate']
  perDay: number
  perSec: number
  currentDay: number
  currentDayFormatted: string
  currentYear: number
  currentYearFormatted: string
  killedSinceStart: number
  killedSinceStartEmojis: string
  /** Kills beyond EMOJI_RENDER_CAP that are not rendered as emojis */
  killedSinceStartHidden: number
  children: ComputedChild[]
  childView: boolean
  getNameByCount: (count: number) => string
}

interface Timer {
  secondsSinceStart: { value: number }
  secondsSinceYearStart: { value: number }
  secondsSinceDayStart: { value: number }
  daysInCurrentYear: { value: number }
  secondsInCurrentYear: { value: number }
}

/** Seconds elapsed in the current year, day, and since page load, plus the year's length */
interface Clock {
  secYear: number
  secDay: number
  secStart: number
  daysInYear: number
  secondsInYear: number
}

/**
 * secDay/secYear are derived from the live clock and therefore already include
 * the time elapsed since page load. Do NOT add secondsSinceStart on top,
 * otherwise the counters run at twice the real rate.
 */
function computeChild(child: AnimalChild, clock: Clock): ComputedChild {
  const rate = child.deaths.year / clock.secondsInYear
  const currentDay = rate * clock.secDay
  const currentYear = rate * clock.secYear
  const perDayValue = child.deaths.year / clock.daysInYear

  return {
    name: child.name,
    perDay: perDayValue,
    perDayFormatted: formatNumber(perDayValue),
    currentDay: Math.round(currentDay),
    currentDayFormatted: formatNumber(currentDay),
    currentYear: Math.round(currentYear),
    currentYearFormatted: formatNumber(currentYear),
  }
}

// Sort by yearly deaths descending
const sortedAnimals = [...rawAnimals].sort((a, b) => b.deaths.year - a.deaths.year)

export function useAnimalData(timer: Timer) {
  const animalData = computed<ComputedAnimal[]>(() => {
    const clock: Clock = {
      secYear: timer.secondsSinceYearStart.value,
      secDay: timer.secondsSinceDayStart.value,
      secStart: timer.secondsSinceStart.value,
      daysInYear: timer.daysInCurrentYear.value,
      secondsInYear: timer.secondsInCurrentYear.value,
    }

    return sortedAnimals.map((animal) => {
      // The yearly figure spread evenly over the current year (365 or 366 days)
      const rate = animal.deaths.year / clock.secondsInYear
      const freshKilled = rate * clock.secStart
      const currentDay = rate * clock.secDay
      const currentYear = rate * clock.secYear
      const perDayValue = animal.deaths.year / clock.daysInYear
      const killedCount = Math.round(freshKilled)

      const children = (animal.children ?? [])
        .map((child) => computeChild(child, clock))
        .sort((a, b) => b.currentYear - a.currentYear)

      return {
        names: animal.names,
        estimate: animal.estimate,
        perDay: perDayValue,
        perSec: rate,
        currentDay: Math.round(currentDay),
        currentDayFormatted: formatNumber(currentDay),
        currentYear: Math.round(currentYear),
        currentYearFormatted: formatNumber(currentYear),
        killedSinceStart: killedCount,
        killedSinceStartEmojis: animal.names.emoji.repeat(Math.min(killedCount, EMOJI_RENDER_CAP)),
        killedSinceStartHidden: Math.max(0, killedCount - EMOJI_RENDER_CAP),
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

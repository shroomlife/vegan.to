import type { SourceId } from '@/data/sources'

/**
 * Editorial content for the start page. Every entry names its sources by id,
 * so the text and the /quellen page can never drift apart.
 * No figure in here is invented; each one is quoted from the linked source.
 */

export interface SpeciesFact {
  emoji: string
  species: string
  text: string
  sources: readonly SourceId[]
}

/** Kapitel 3: what research knows about who these animals are */
export const speciesFacts: readonly SpeciesFact[] = [
  {
    emoji: '🐔',
    species: 'Hühner',
    text: 'Hühner kennen mindestens 24 verschiedene Rufe, erkennen viele Artgenossen am Aussehen und stecken sich gegenseitig mit Gefühlen an.',
    sources: ['marinoChicken'],
  },
  {
    emoji: '🐷',
    species: 'Schweine',
    text: 'Schweine sind kognitiv komplex und teilen viele Eigenschaften mit Tieren, die wir für klug halten. Das ist kein Werbespruch, das ist das Fazit eines Forschungsreviews.',
    sources: ['marinoPigs'],
  },
  {
    emoji: '🐮',
    species: 'Rinder',
    text: 'Kühe haben beste Freundinnen. Von der Herde getrennt schlägt ihr Herz ruhiger, wenn die vertraute Partnerin dabei ist.',
    sources: ['mclennanCattle'],
  },
  {
    emoji: '🦃',
    species: 'Truthühner',
    text: 'Für Puten gibt es in Deutschland keine artspezifischen gesetzlichen Tierschutzvorgaben. Freiwillige Eckwerte erlauben bis zu 52 bis 58 kg Tier pro Quadratmeter.',
    sources: ['assPuten'],
  },
  {
    emoji: '🦆',
    species: 'Enten',
    text: 'Frisch geschlüpfte Entenküken begreifen ohne jedes Training das abstrakte Konzept gleich oder verschieden.',
    sources: ['martinhoDucks'],
  },
  {
    emoji: '🐑',
    species: 'Schafe',
    text: 'Schafe lernen Gesichter von Fotos und erkennen ihren Betreuer darauf wieder, ohne dass es ihnen jemand beigebracht hat.',
    sources: ['knolleSheep'],
  },
  {
    emoji: '🐐',
    species: 'Ziegen',
    text: 'Vor einer Aufgabe, die sie nicht lösen können, suchen Ziegen den Blick des Menschen. Früher und länger, wenn er ihnen zugewandt ist.',
    sources: ['nawrothGoats'],
  },
  {
    emoji: '🐴',
    species: 'Pferde',
    text: 'Pferde lesen menschliche Gesichter. Bei einem wütenden Gesicht steigt ihr Puls schneller, und sie sehen mit dem linken Auge hin.',
    sources: ['smithHorses'],
  },
  {
    emoji: '🪿',
    species: 'Gänse',
    text: 'Graugänse bleiben ein Leben lang zusammen. Zwei Tage Trennung vom Partner reichen, und die Stresshormone steigen.',
    sources: ['klfGeese', 'wascherGeese'],
  },
  {
    emoji: '🐟',
    species: 'Fische',
    text: 'Fische, die etwas Schmerzhaftes erleben, hören auf zu fressen und bewegen sich weniger. Mit einem Schmerzmittel bleibt das aus.',
    sources: ['sneddonFish'],
  },
]

export interface LifeFact {
  /** The big figure, e.g. "39 kg" */
  figure: string
  /** What the figure measures */
  unit: string
  text: string
  sources: readonly SourceId[]
  /** Singular species names (as in animals.ts) this fact belongs to; shown on their pages */
  species: readonly string[]
}

/** Kapitel 4: the conditions, quoted from law texts and documented practice */
export const lifeFacts: readonly LifeFact[] = [
  {
    figure: '39 kg',
    species: ['Huhn'],
    unit: 'Huhn pro Quadratmeter',
    text: 'So viel erlaubt das Gesetz im Maststall. Bei Kurzmast sind das rund 24 Tiere, jedes mit etwas weniger als einem DIN-A5-Blatt plus Bierdeckel.',
    sources: ['tierSchNutztV19', 'assMasthuehner'],
  },
  {
    figure: '32 Tage',
    species: ['Huhn'],
    unit: 'bis 1,8 kg',
    text: 'In den 1950er Jahren brauchte ein Masthuhn dafür 101 Tage. Heute reichen 32. Die Mast endet nach 29 bis 42 Tagen.',
    sources: ['assMasthuehner'],
  },
  {
    figure: '0,75 m²',
    species: ['Schwein'],
    unit: 'pro Mastschwein',
    text: 'So viel Platz steht einem Schwein zwischen 50 und 110 kg zu. 96 Prozent der Mastplätze haben Spaltenboden statt Stroh.',
    sources: ['tierSchNutztV29', 'assMastschweine'],
  },
  {
    figure: '5 Tage',
    species: ['Schwein'],
    unit: 'fixiert um die Geburt',
    text: 'So lange dürfen Sauen künftig noch im Kastenstand stehen, wenn sie Ferkel bekommen. Die Übergangsfrist dafür läuft bis 2036.',
    sources: ['tierSchNutztV30'],
  },
  {
    figure: '20 bis 30 s',
    species: ['Schwein'],
    unit: 'bis zur Wahrnehmungslosigkeit',
    text: 'So lange dauert es in der CO2-Betäubung. 90 Prozent der großen Schlachtbetriebe nutzen sie, für geschätzt 34 Millionen Schweine im Jahr.',
    sources: ['agrarheuteCo2'],
  },
  {
    figure: '1 Minute',
    species: ['Huhn'],
    unit: 'kopfüber bei Bewusstsein',
    text: 'So lange hängen Hühner an den Beinen, bevor sie ins Elektrowasserbad getaucht werden.',
    sources: ['dgsWaterbath'],
  },
  {
    figure: '8 Stunden',
    species: ['Schwein', 'Rind', 'Schaf', 'Pferd'],
    unit: 'Transport als Grundregel',
    text: 'Mit zugelassenen Fahrzeugen dürfen Schweine 24 Stunden unterwegs sein, Rinder 14 Stunden, 1 Stunde Pause, weitere 14 Stunden.',
    sources: ['euTransport'],
  },
  {
    figure: '40 Mio.',
    species: ['Huhn'],
    unit: 'Küken pro Jahr',
    text: 'So viele männliche Küken wurden getötet, bis das Verbot 2022 kam. Die Brüder der Legehennen sind seitdem ein Kostenproblem, kein Müllproblem.',
    sources: ['tierSchG4c', 'bmlehInOvo'],
  },
  {
    figure: '6 bis 7 Wochen',
    species: ['Ente'],
    unit: 'Entenleben',
    text: 'So lange lebt eine Pekingente in der Mast, praktisch ohne Zugang zu Badewasser.',
    sources: ['assEnten'],
  },
]

export interface Faq {
  question: string
  answer: string
  sources: readonly SourceId[]
}

/** Kapitel 7: the questions people ask before they change anything */
export const faqs: readonly Faq[] = [
  {
    question: 'Ist vegan überhaupt gesund?',
    answer:
      'Die Deutsche Gesellschaft für Ernährung sagt seit 2024: Für gesunde Erwachsene kann eine vegane Ernährung gesundheitsfördernd sein, wenn Vitamin B12 ergänzt wird und die Lebensmittelauswahl gut geplant ist. Für Kinder, Schwangere, Stillende und Senior*innen gibt sie wegen der Datenlage keine Empfehlung für oder gegen. Die Academy of Nutrition and Dietetics geht weiter und hält gut geplante vegane Ernährung für alle Lebensphasen geeignet.',
    sources: ['dge2024', 'academyNutrition'],
  },
  {
    question: 'Was hat mein Essen mit dem Klima zu tun?',
    answer:
      'Die deutsche Landwirtschaft hat 2025 rund 53,3 Millionen Tonnen CO2-Äquivalente verursacht, 8,2 Prozent aller Emissionen des Landes. 64,5 Prozent davon kommen direkt aus der Tierhaltung. Das Methan aus der Verdauung stammt zu 93 Prozent von Rindern und Milchkühen.',
    sources: ['ubaAgriculture'],
  },
  {
    question: 'Wofür wird das Land eigentlich gebraucht?',
    answer:
      'Auf 9,2 Millionen Hektar, etwa 55 Prozent der landwirtschaftlichen Fläche Deutschlands, wächst Futter für Tiere. Vom Getreide im Land gingen 2024/25 rund 50 Prozent in den Trog, 23 Prozent auf den Teller.',
    sources: ['bzlFeedArea', 'bleGrain'],
  },
  {
    question: 'Ist Fleisch wirklich ein Gesundheitsrisiko?',
    answer:
      'Die WHO-Krebsforschungsagentur IARC stuft verarbeitetes Fleisch als krebserregend ein (Gruppe 1) und rotes Fleisch als wahrscheinlich krebserregend (Gruppe 2A). Jede Portion von 50 Gramm verarbeitetem Fleisch pro Tag erhöht das Darmkrebsrisiko um etwa 18 Prozent.',
    sources: ['whoMeat'],
  },
  {
    question: 'Was sagt die Forschung, wie wir essen sollten?',
    answer:
      'Die EAT-Lancet-Kommission nennt Ernährung den stärksten einzelnen Hebel für die Gesundheit der Menschen und des Planeten. Ihr Fazit: Obst, Gemüse, Nüsse und Hülsenfrüchte weltweit verdoppeln, rotes Fleisch und Zucker um mehr als die Hälfte reduzieren.',
    sources: ['eatLancet'],
  },
]

export interface Quote {
  text: string
  author: string
  sources: readonly SourceId[]
}

export const schweitzerQuote: Quote = {
  text: 'Ist er von der Ethik der Ehrfurcht vor dem Leben berührt, so schädigt und vernichtet er Leben nur aus Notwendigkeit, der er nicht entrinnen kann, niemals aus Gedankenlosigkeit.',
  author: 'Albert Schweitzer',
  sources: ['schweitzer'],
}

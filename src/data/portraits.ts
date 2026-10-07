/**
 * The species portraits under /img/tiere: ten pictures in one style, one per
 * species page slug (species.ts). They are AI-generated (OpenAI GPT Image 2.5,
 * October 2026) and carry that mark visibly (SpeciesPortrait.vue) and in their
 * XMP metadata (scripts/species-portraits.py), as the EU AI Act asks.
 */
export const PORTRAIT_WIDTHS = [512, 768, 1024] as const

/** Short, visible note next to every portrait */
export const PORTRAIT_NOTE = 'KI-generiert'

/** The longer explanation behind the note, for the title and the sources page */
export const PORTRAIT_NOTE_LONG = 'Dieses Bild ist KI-generiert (OpenAI GPT Image 2.5), kein Foto. Es zeigt kein reales Tier.'

/** What each portrait shows, by species slug */
export const portraitAltBySlug: Readonly<Record<string, string>> = {
  huehner: 'Eine braune Henne sieht aus dem Dunkel heraus in die Kamera, um sie schweben kleine warme Lichter',
  schweine: 'Ein junges rosa Schwein mit aufgestellten Ohren sieht in die Kamera, um es schweben kleine warme Lichter',
  truthuehner: 'Eine weiße Pute mit rotem Kehllappen sieht in die Kamera, um sie schweben kleine warme Lichter',
  enten: 'Eine weiße Pekingente mit orangefarbenem Schnabel sieht in die Kamera, um sie schweben kleine warme Lichter',
  rinder: 'Eine junge schwarz-weiße Holstein-Kuh sieht in die Kamera, um sie schweben kleine warme Lichter',
  schafe: 'Ein weißes Schaf mit wolligem Gesicht sieht in die Kamera, um es schweben kleine warme Lichter',
  gaense: 'Eine Graugans mit orangefarbenem Schnabel sieht in die Kamera, um sie schweben kleine warme Lichter',
  ziegen: 'Eine braune Ziege mit kleinen Hörnern sieht in die Kamera, um sie schweben kleine warme Lichter',
  pferde: 'Ein dunkelbraunes Pferd mit weicher Mähne sieht in die Kamera, um es schweben kleine warme Lichter',
  fische: 'Eine Regenbogenforelle im dunklen Wasser, kleine warme Lichter spiegeln sich auf den Schuppen',
}

export function portraitAlt(slug: string): string {
  return portraitAltBySlug[slug] ?? 'KI-generiertes Tierporträt'
}

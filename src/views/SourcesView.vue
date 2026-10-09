<script setup lang="ts">
import { sourceCategories, sourceList, type SourceCategory } from '@/data/sources'
import { POPULATION_DE } from '@/data/population'
import { formatNumber } from '@/utils/formatNumber'
import { LAND_ANIMALS_PER_PERSON_YEAR, FISH_PER_PERSON_YEAR } from '@/utils/perCapita'
import { SITE_URL } from '@/utils/documentMeta'
import { useJsonLd } from '@/composables/useJsonLd'
import AnchorLink from '@/components/AnchorLink.vue'

/** "Küken und Legehennen" → "kueken-und-legehennen", the anchor of a category */
function categoryId(category: SourceCategory): string {
  return category
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

const grouped = sourceCategories.map((category: SourceCategory) => ({
  category,
  id: categoryId(category),
  sources: sourceList
    .filter((source) => source.category === category)
    .map((source) => ({ ...source, host: new URL(source.url).hostname })),
}))

useJsonLd('page-breadcrumb', {
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'vegan.to', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Quellen', item: `${SITE_URL}/quellen` },
  ],
})
</script>

<template>
  <main class="sources-page">
    <section class="sources-hero">
      <div class="sources-inner">
        <nav class="sources-crumbs" aria-label="Pfad">
          <RouterLink to="/">vegan.to</RouterLink>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Quellen</span>
        </nav>
        <p class="sources-kicker">Transparenz</p>
        <h1 class="sources-title">Quellen und Methodik</h1>
        <p class="sources-lead">
          Jede Zahl auf vegan.to führt auf eine der Quellen unten zurück. Was amtlich nur in Tonnen
          erfasst wird, steht als Schätzung dabei. Und wie aus Jahreswerten ein Zähler pro Sekunde wird,
          steht darunter.
        </p>
        <!-- About forty screens of sources on a phone: the chips jump straight to a topic -->
        <nav class="sources-jump" aria-label="Themen">
          <AnchorLink v-for="group in grouped" :key="group.id" :hash="`#${group.id}`" class="sources-chip">{{ group.category }}</AnchorLink>
          <AnchorLink hash="#methodik" class="sources-chip sources-chip--method">So rechnen wir</AnchorLink>
        </nav>
      </div>
    </section>

    <div class="sources-body">
      <div class="sources-inner">
        <section v-for="group in grouped" :id="group.id" :key="group.category" class="sources-group" :aria-labelledby="`${group.id}-title`">
          <h2 :id="`${group.id}-title`" class="sources-group-title">{{ group.category }}</h2>
          <ul class="sources-list">
            <li v-for="source in group.sources" :key="source.url" class="sources-item">
              <a :href="source.url" target="_blank" rel="noopener" class="sources-item-label">{{ source.label }}</a>
              <span class="sources-item-use">{{ source.usedFor }}</span>
              <span class="sources-item-host">{{ source.host }}</span>
            </li>
          </ul>
        </section>

        <section id="methodik" class="sources-method">
          <h2 class="sources-group-title">So rechnen wir</h2>
          <ol class="sources-steps">
            <li>
              <strong>Vom Jahr zur Sekunde.</strong>
              Der Jahreswert einer Tierart wird durch die Sekunden des laufenden Jahres geteilt,
              365 oder 366 Tage mal 86.400. Für Hühner sind das 660.977.701 geteilt durch 31.536.000,
              also rund 21 pro Sekunde.
            </li>
            <li>
              <strong>Heute, dieses Jahr, seit du hier bist.</strong>
              Die Rate mal die Sekunden seit Mitternacht, seit dem 1. Januar oder seit dem Aufruf der Seite.
              Gerechnet wird in deutscher Zeit, egal von wo du die Seite öffnest. Am 31. Dezember um 24 Uhr
              landet „dieses Jahr“ damit genau auf dem Jahreswert.
            </li>
            <li>
              <strong>Fische sind eine Schätzung.</strong>
              Fische werden amtlich nur in Tonnen erfasst. fishcount.org.uk rechnet die Fangmengen der
              deutschen Fischerei mit Durchschnittsgewichten je Art in Tiere um: im Schnitt der Jahre 2003
              bis 2022 zwischen 3,7 und 5,0 Milliarden. Wir zeigen den Mittelwert, 4,4 Milliarden, plus
              rund 24 Millionen aus deutscher Aquakultur. Beifang und Importe sind nicht enthalten.
            </li>
            <li>
              <strong>Dein Impact.</strong>
              CO2, Land und Wasser pro Tag sind die Differenz zwischen veganer Ernährung und mittlerem
              Fleischkonsum nach Scarborough et al. 2023: 4,57 kg CO2, 6,91 m² und 370 Liter. Die Tierleben
              sind die Schlachtzahlen pro Jahr geteilt durch {{ formatNumber(POPULATION_DE / 1e6, 1) }} Millionen Menschen:
              Auf eine Person entfallen rechnerisch rund {{ formatNumber(LAND_ANIMALS_PER_PERSON_YEAR) }} Landtiere im Jahr,
              dazu rund {{ formatNumber(FISH_PER_PERSON_YEAR) }} Fische aus deutschem Fang (geschätzt). Landtiere und Fische
              stehen getrennt, weil die Fische eine Schätzung aus Tonnen sind.
            </li>
            <li>
              <strong>Veganer*innen in Deutschland.</strong>
              Gezeigt wird der letzte Wert der Allensbacher Markt- und Werbeträgeranalyse, 1,68 Millionen für 2025.
              Die Punkte vor 2018 stammen aus anderen Erhebungen (NVS II, VEBU, SKOPOS) und sind mit den
              Allensbach-Werten nicht direkt vergleichbar.
            </li>
            <li>
              <strong>Der Ticker.</strong>
              Namen, Alter und Orte der vorbeiziehenden Tiere sind erfunden, damit aus Zahlen wieder Einzelne
              werden. Das Alter folgt den üblichen Schlachtaltern nach BZL; für Pferde und Fische wird kein
              Alter angezeigt. Die Orte sind reale Schlachthof- und Fischereistandorte. Die Häufigkeit je Tierart ist gedämpft, sonst wären fast nur Fische
              zu sehen.
            </li>
          </ol>
          <p id="datenstand" class="sources-status">
            Datenstand: Destatis Jahresdaten 2025. Schlachtzahlen und Zeitreihen mit GENESIS-Stand 21. August 2026,
            Tierbestand, Brütereien und Schlachtzahlen nach Monat und Bundesland mit GENESIS-Stand 21. September 2026.
            Alle Quellen zwischen dem 12. September und dem 5. Oktober 2026 geprüft.
          </p>
          <p class="sources-status">
            Daten des Statistischen Bundesamts (Destatis), GENESIS-Online, werden unter der
            <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener">Datenlizenz Deutschland, Namensnennung, Version 2.0</a>
            verwendet und von vegan.to umgerechnet (eigene Berechnungen).
          </p>
        </section>
      </div>
    </div>
  </main>
</template>

<style scoped>
.sources-page {
  background: var(--brand-cream);
  color: var(--brand-green);
}
.sources-inner {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 0 var(--page-gutter);
}
.sources-hero {
  padding: 4.5rem 0 3rem;
  background: var(--brand-mint);
  color: var(--brand-green);
}
.sources-crumbs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.8rem;
  color: var(--brand-faint);
}
/* Inline-block with some padding so each crumb is a tap target of about 32px */
.sources-crumbs a {
  display: inline-block;
  padding-block: 0.35rem;
  color: inherit;
}
.sources-kicker {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}
.sources-title {
  margin: 0 0 1rem;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.75rem, 5vw, 3rem);
  letter-spacing: -0.03em;
  line-height: 1.05;
}
.sources-lead {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--brand-muted);
}
.sources-jump {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 1.75rem;
}
.sources-chip {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  border: 1.5px solid rgba(20, 54, 31, 0.1);
  background: #fff;
  color: var(--brand-green);
  font-size: 0.82rem;
  font-weight: 700;
  line-height: 1.2;
  text-decoration: none;
  transition: border-color 0.15s;
}
.sources-chip:hover,
.sources-chip:focus-visible {
  border-color: var(--brand-accent);
  color: var(--brand-green);
  text-decoration: none;
}
.sources-chip--method {
  background: var(--brand-green);
  border-color: var(--brand-green);
  color: var(--brand-cream);
}
.sources-chip--method:hover,
.sources-chip--method:focus-visible {
  color: var(--brand-cream);
}
.sources-body {
  padding: 3rem 0 4rem;
}
.sources-group {
  margin-bottom: 2.5rem;
}
.sources-group-title {
  margin: 0 0 1rem;
  font-size: 0.8rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--brand-accent-text);
}
/* One card per category, the sources as rows inside it */
.sources-list {
  list-style: none;
  margin: 0;
  padding: 0;
  background: #fff;
  border-radius: 16px;
  border: 1px solid rgba(20, 54, 31, 0.08);
}
.sources-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
}
.sources-item + .sources-item {
  border-top: 1px solid rgba(20, 54, 31, 0.08);
}
.sources-item-label {
  font-weight: 700;
  font-size: 1rem;
  color: var(--brand-green);
  text-decoration: none;
  overflow-wrap: anywhere;
}
.sources-item-label:hover,
.sources-item-label:focus-visible {
  color: var(--brand-accent-text);
  text-decoration: underline;
}
.sources-item-use {
  font-size: 0.9rem;
  color: #4a5a4f;
  line-height: 1.5;
}
.sources-item-host {
  font-size: 0.75rem;
  color: var(--brand-faint);
}
.sources-method {
  margin-top: 1rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(20, 54, 31, 0.12);
}
.sources-steps {
  margin: 0;
  padding-left: 1.4rem;
  display: grid;
  gap: 1rem;
  font-size: 0.98rem;
  line-height: 1.65;
}
.sources-steps strong {
  color: var(--brand-green);
}
.sources-status {
  margin: 2rem 0 0;
  font-size: 0.85rem;
  color: #6b7466;
}
@media (max-width: 767px) {
  .sources-hero {
    padding: 2rem 0 2.25rem;
  }
  .sources-body {
    padding: 2rem 0 3rem;
  }
  .sources-jump {
    gap: 0.35rem;
    margin-top: 1.5rem;
  }
  .sources-chip {
    padding-inline: 0.75rem;
    font-size: 0.78rem;
  }
  .sources-group {
    margin-bottom: 2rem;
  }
  .sources-item {
    padding: 0.85rem 1rem;
  }
  .sources-item-use {
    font-size: 0.86rem;
  }
}
</style>

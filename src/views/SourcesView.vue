<script setup lang="ts">
import { sourceCategories, sourceList, type SourceCategory } from '@/data/sources'

const grouped = sourceCategories.map((category: SourceCategory) => ({
  category,
  sources: sourceList
    .filter((source) => source.category === category)
    .map((source) => ({ ...source, host: new URL(source.url).hostname })),
}))
</script>

<template>
  <main class="sources-page">
    <section class="sources-hero">
      <div class="sources-inner">
        <p class="sources-kicker">Transparenz</p>
        <h1 class="sources-title">Quellen und Methodik</h1>
        <p class="sources-lead">
          Jede Zahl auf vegan.to führt auf eine der Quellen unten zurück. Was amtlich nur in Tonnen
          erfasst wird, steht als Schätzung dabei. Und wie aus Jahreswerten ein Zähler pro Sekunde wird,
          steht darunter.
        </p>
      </div>
    </section>

    <div class="sources-body">
      <div class="sources-inner">
        <section v-for="group in grouped" :key="group.category" class="sources-group">
          <h2 class="sources-group-title">{{ group.category }}</h2>
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
              landet "dieses Jahr" damit genau auf dem Jahreswert.
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
              ergeben sich aus allen Tieren pro Jahr geteilt durch 83,5 Millionen Menschen, rund 62 pro
              Person und Jahr.
            </li>
            <li>
              <strong>Veganer*innen in Deutschland.</strong>
              Der letzte Wert der Allensbacher Markt- und Werbeträgeranalyse, 1,68 Millionen für 2025, wird
              ab Jahresmitte 2025 mit dem Trend der Erhebungen 2022 bis 2025 fortgeschrieben, rund 33.000
              pro Jahr. Eine Hochrechnung, kein Messwert.
            </li>
            <li>
              <strong>Der Ticker.</strong>
              Namen, Alter und Orte der vorbeiziehenden Tiere sind erfunden, damit aus Zahlen wieder Einzelne
              werden. Das Alter folgt den üblichen Schlachtaltern nach BZL, die Orte sind reale Schlachthof-
              und Fischereistandorte. Die Häufigkeit je Tierart ist gedämpft, sonst wären fast nur Fische
              zu sehen.
            </li>
          </ol>
          <p id="datenstand" class="sources-status">
            Datenstand: Destatis Jahresdaten 2025, GENESIS-Stand 21. August 2026. Alle Quellen zuletzt am
            12. September 2026 geprüft.
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
  max-width: 880px;
  margin: 0 auto;
  padding: 0 24px;
}
.sources-hero {
  padding: 4.5rem 0 3rem;
  background: var(--brand-mint);
  color: var(--brand-green);
}
.sources-kicker {
  margin: 0 0 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-accent);
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
  max-width: 620px;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--brand-muted);
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
  color: var(--brand-accent);
}
.sources-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
}
.sources-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border-radius: 14px;
  border: 1px solid rgba(20, 54, 31, 0.08);
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
  color: var(--brand-accent);
  text-decoration: underline;
}
.sources-item-use {
  font-size: 0.9rem;
  color: #4a5a4f;
  line-height: 1.5;
}
.sources-item-host {
  font-size: 0.75rem;
  color: #8d8474;
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
    padding: 3rem 0 2.25rem;
  }
  .sources-body {
    padding: 2rem 0 3rem;
  }
}
</style>

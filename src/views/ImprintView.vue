<script setup lang="ts">
import ContentPage from '@/components/ContentPage.vue'
import { operator } from '@/data/legal'
</script>

<template>
  <ContentPage kicker="Rechtliches" title="Impressum">
    <h2>Angaben gemäß § 5 DDG</h2>
    <address>
      {{ operator.name }}<br>
      {{ operator.street }}<br>
      {{ operator.city }}<br>
      {{ operator.country }}
    </address>

    <h2>Kontakt</h2>
    <p>E-Mail: <a :href="`mailto:${operator.email}`">{{ operator.email }}</a></p>

    <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
    <p>{{ operator.name }}, Anschrift wie oben.</p>

    <h2>Zu den Zahlen</h2>
    <p>
      Alle Zahlen auf vegan.to stammen aus öffentlichen Quellen, die jeweils direkt daneben verlinkt sind.
      Die vollständige Liste und die Rechenwege stehen unter <RouterLink to="/quellen">Quellen und Methodik</RouterLink>.
      Daten des Statistischen Bundesamts (Destatis), GENESIS-Online, werden unter der
      <a href="https://www.govdata.de/dl-de/by-2-0" target="_blank" rel="noopener">Datenlizenz Deutschland, Namensnennung, Version 2.0</a>
      verwendet und von vegan.to umgerechnet (eigene Berechnungen).
    </p>

    <h2>Links zu anderen Seiten</h2>
    <p>
      vegan.to verlinkt auf Seiten anderer Anbieter. Für ihre Inhalte sind allein die jeweiligen Betreiber verantwortlich.
      Zum Zeitpunkt der Verlinkung waren keine Rechtsverstöße erkennbar. Wird ein Verstoß bekannt, wird der Link entfernt.
    </p>
  </ContentPage>
</template>

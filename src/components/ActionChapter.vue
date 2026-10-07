<script setup lang="ts">
import { coreQuestions, entrySteps, actionCategories } from '@/data/actions'
import ClipVideo from '@/components/ClipVideo.vue'
</script>

<template>
  <section id="mitmachen" class="action chapter-section">
    <div class="container">
      <span class="chapter">Mach mit</span>
      <div class="action-head">
        <h2
          v-reveal="{ y: 24, duration: 0.5 }"
          class="chapter-title action-title"
        >
          Deine nächste Mahlzeit zählt mit.
        </h2>
        <div
          v-reveal="{ y: 16, duration: 0.5, delay: 0.1 }"
          class="action-intro"
        >
          <p>
            Die Zahlen sind groß, dein Teller ist klein. Aber er ist deiner. Jede pflanzliche Mahlzeit
            nimmt ein Stück Nachfrage aus dieser Rechnung.
          </p>
          <p>
            Pflanzliche Alternativen gibt es inzwischen für fast alles, im Supermarkt genauso wie im
            Restaurant oder in der Bäckerei um die Ecke. Vieles schmeckt anders, manches besser, manches
            fehlt erst mal. Probier eine Woche.
          </p>
        </div>
      </div>
      <figure v-reveal="{ y: 24, duration: 0.6, amount: 0.3 }" class="action-figure">
        <ClipVideo folder="start" name="mahlzeit" :widths="[1168, 720]" label="Zwei Hände halten ein gelbes Küken im Abendlicht, KI-generiert" note="KI-generiert" class="action-clip" />
        <figcaption>Es liegt in deiner Hand. Jede Mahlzeit.</figcaption>
      </figure>

      <!-- The three core questions: why, how, with whom -->
      <div class="why-how">
        <a
          v-for="(question, index) in coreQuestions"
          :key="question.key"
          v-reveal="{ y: 24, duration: 0.45, delay: index * 0.08, amount: 0.3 }"
          :href="question.url"
          target="_blank"
          rel="noopener"
          class="why-how-card"
          :class="`why-how-card--${question.key}`"
        >
          <span class="why-how-kicker">{{ question.kicker }}</span>
          <span class="why-how-title">{{ question.title }}</span>
          <span class="why-how-desc">{{ question.description }}</span>
          <span class="why-how-domain">{{ question.domain }} <span aria-hidden="true">↗</span></span>
        </a>
      </div>

      <a
        v-reveal="{ scale: 0.95, duration: 0.4, delay: 0.1, y: 0 }"
        href="https://veganuary.com/de/"
        class="cta-button"
        target="_blank"
        rel="noopener"
      >
        <span class="cta-text">#GoVegan</span>
        <span class="cta-sub">Heute anfangen, mit Veganuary</span>
      </a>

      <div class="motivation">
        <div class="motivation-fact">
          <span class="motivation-number">365</span>
          <span class="motivation-label">Tage im Jahr, an denen du etwas bewirken kannst</span>
        </div>
        <div class="motivation-fact">
          <span class="motivation-number">3×</span>
          <span class="motivation-label">am Tag entscheidest du, was auf den Teller kommt</span>
        </div>
        <div class="motivation-fact">
          <span class="motivation-number">1</span>
          <span class="motivation-label">Mensch reicht für den Anfang. Du.</span>
        </div>
      </div>

      <!-- Four sizes of a first step, smallest first -->
      <ol class="entry-steps" aria-label="Einstiege, vom kleinsten zum größten Schritt">
        <li v-for="(step, index) in entrySteps" :key="step.label" class="entry-step">
          <span class="entry-step-index" aria-hidden="true">{{ index + 1 }}</span>
          <component
            :is="step.url ? 'a' : 'span'"
            :href="step.url"
            :target="step.url ? '_blank' : undefined"
            :rel="step.url ? 'noopener' : undefined"
            class="entry-step-label"
          >
            {{ step.label }}<span v-if="step.url" aria-hidden="true"> ↗</span>
          </component>
          <span class="entry-step-hint">{{ step.hint }}</span>
        </li>
      </ol>

      <div class="action-grid">
        <article
          v-for="(category, index) in actionCategories"
          :key="category.title"
          v-reveal="{ y: 24, duration: 0.45, delay: index * 0.07, amount: 0.2 }"
          class="action-category"
        >
          <h3 class="action-category-title">
            <span aria-hidden="true">{{ category.emoji }}</span> {{ category.title }}
          </h3>
          <p class="action-category-desc">{{ category.description }}</p>
          <div class="action-links">
            <a
              v-for="link in category.links"
              :key="link.url"
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="action-link"
            >
              <span class="action-link-name">{{ link.name }}</span>
              <span class="action-link-desc">{{ link.description }}</span>
            </a>
          </div>
        </article>
      </div>

      <p class="action-closing">Jede Mahlzeit ist eine neue Chance. Die nächste kommt bald.</p>
    </div>
  </section>
</template>

<style scoped>
.action {
  background: var(--brand-cream);
  color: var(--brand-ink);
}
.action-head {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 2.5rem;
  align-items: end;
  margin-bottom: 2.25rem;
}
.action-title {
  margin: 0;
}
.action-figure {
  position: relative;
  margin: 0 0 2.5rem;
  border-radius: 24px;
  overflow: hidden;
  background: var(--brand-night);
}
.action-clip {
  width: 100%;
  aspect-ratio: 21 / 9;
}
.action-clip :deep(video) {
  object-position: 50% 45%;
}
.action-figure figcaption {
  position: absolute;
  left: 1.25rem;
  bottom: 1rem;
  font-family: var(--font-display);
  font-size: clamp(1.1rem, 2vw, 1.5rem);
  letter-spacing: -0.02em;
  color: var(--brand-cream);
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.5);
}
.action-intro p {
  margin: 0 0 0.6rem;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--brand-muted);
}
.action-intro p:last-child {
  margin-bottom: 0;
}
.why-how {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}
.why-how-card {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 1.5rem 1.5rem 1.3rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
  color: var(--brand-ink);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
}
.why-how-card:hover,
.why-how-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--brand-accent);
  box-shadow: 0 16px 40px rgba(20, 54, 31, 0.1);
  color: var(--brand-ink);
  text-decoration: none;
}
.why-how-kicker {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--brand-faint);
}
.why-how-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
  color: var(--brand-green);
}
.why-how-desc {
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--brand-muted);
}
.why-how-domain {
  margin-top: auto;
  padding-top: 0.8rem;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--brand-accent-text);
}
.cta-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  max-width: 520px;
  margin: 2rem auto 0;
  padding: 1.35rem 2rem;
  border-radius: 999px;
  background: var(--brand-accent);
  color: var(--brand-green);
  text-decoration: none;
  transition: transform 0.15s, box-shadow 0.15s;
}
.cta-button:hover,
.cta-button:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 14px 40px rgba(255, 106, 61, 0.35);
  color: var(--brand-green);
  text-decoration: none;
}
.cta-text {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 4vw, 2.1rem);
  letter-spacing: -0.03em;
  line-height: 1;
}
.cta-sub {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  opacity: 0.8;
}
.motivation {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
  max-width: 820px;
  margin: 2.5rem auto;
}
.motivation-fact {
  text-align: center;
}
.motivation-number {
  display: block;
  font-family: var(--font-display);
  font-size: 2.2rem;
  letter-spacing: -0.03em;
  line-height: 1;
  color: var(--brand-green);
  margin-bottom: 0.4rem;
}
.motivation-label {
  display: block;
  font-size: 0.88rem;
  line-height: 1.45;
  color: var(--brand-muted);
}
.entry-steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.6rem;
  margin: 0 0 1.5rem;
  padding: 0;
}
.entry-step {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  grid-template-rows: auto auto;
  column-gap: 0.65rem;
  row-gap: 0.15rem;
  padding: 0.85rem 1rem;
  border-radius: 14px;
  background: var(--brand-mint);
}
.entry-step-index {
  grid-row: 1 / span 2;
  align-self: start;
  width: 1.6rem;
  height: 1.6rem;
  border-radius: 50%;
  background: var(--brand-green);
  color: var(--brand-cream);
  font-family: var(--font-display);
  font-size: 0.78rem;
  line-height: 1.6rem;
  text-align: center;
}
.entry-step-label {
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-green);
  text-decoration: none;
}
a.entry-step-label:hover,
a.entry-step-label:focus-visible {
  color: var(--brand-accent-text);
  text-decoration: underline;
}
.entry-step-hint {
  font-size: 0.8rem;
  line-height: 1.4;
  color: var(--brand-muted);
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.9rem;
}
.action-category {
  padding: 1.35rem 1.35rem 1.1rem;
  border-radius: 20px;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  background: #fff;
}
.action-category-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: var(--brand-green);
}
.action-category-desc {
  margin: 0 0 0.9rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #f1f3f5;
  font-size: 0.86rem;
  line-height: 1.5;
  color: var(--brand-muted);
}
.action-links {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
.action-link {
  display: block;
  margin: 0 -0.6rem;
  padding: 0.55rem 0.6rem;
  border-radius: 10px;
  color: var(--brand-ink);
  text-decoration: none;
  transition: background 0.15s;
}
.action-link:hover,
.action-link:focus-visible {
  background: var(--brand-mint);
  color: var(--brand-ink);
  text-decoration: none;
}
.action-link-name {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-green);
}
.action-link-desc {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.8rem;
  line-height: 1.35;
  color: var(--brand-muted);
}
.action-closing {
  margin: 3rem auto 0;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.15rem;
  letter-spacing: -0.02em;
  color: var(--brand-green);
}

@media (max-width: 991px) {
  .action-head {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .action-grid,
  .entry-steps {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .why-how,
  .action-grid,
  .entry-steps,
  .motivation {
    grid-template-columns: 1fr;
  }
  .motivation {
    gap: 1.25rem;
  }
  .cta-button {
    padding: 1.1rem 1.5rem;
  }
}
</style>

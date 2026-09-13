<script setup lang="ts">
import { Motion } from 'motion-v'
import { useLiveState } from '@/composables/useLiveState'
import { coreQuestions, actionCategories } from '@/data/actions'

const { latest } = useLiveState()
</script>

<template>
  <section id="mitmachen" class="action">
    <div class="container">
      <span class="chapter chapter--on-dark">Kapitel 8 &middot; Mach mit</span>
      <div class="action-head">
        <Motion
          as="h2"
          class="action-title"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5 }"
          :inViewOptions="{ once: true }"
        >
          Deine nächste Mahlzeit entscheidet, ob es {{ latest.name }} trifft.
        </Motion>
        <Motion
          as="div"
          class="action-intro"
          :initial="{ opacity: 0, y: 16 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.5, delay: 0.1 }"
          :inViewOptions="{ once: true }"
        >
          <p>
            Die Zahlen sind erschreckend. Aber du bist nicht machtlos. Mit jeder Mahlzeit
            entscheidest du mit, und jede dieser Entscheidungen kann ein Leben retten.
          </p>
          <p>
            Pflanzliche Alternativen gibt es inzwischen für alles, im Supermarkt genauso wie im
            Restaurant oder in der Bäckerei um die Ecke. Du verzichtest auf nichts. Du entscheidest dich nur anders.
          </p>
        </Motion>
      </div>

      <!-- The three core questions: why, how, with whom -->
      <div class="why-how">
        <Motion
          v-for="(question, index) in coreQuestions"
          :key="question.key"
          as="a"
          :href="question.url"
          target="_blank"
          rel="noopener"
          class="why-how-card"
          :class="`why-how-card--${question.key}`"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, delay: index * 0.08 }"
          :inViewOptions="{ once: true, amount: 0.3 }"
        >
          <span class="why-how-kicker">{{ question.kicker }}</span>
          <span class="why-how-title">{{ question.title }}</span>
          <span class="why-how-desc">{{ question.description }}</span>
          <span class="why-how-domain">{{ question.domain }} <span aria-hidden="true">↗</span></span>
        </Motion>
      </div>

      <Motion
        as="a"
        href="https://veganuary.com/de/"
        class="cta-button"
        target="_blank"
        rel="noopener"
        :initial="{ opacity: 0, scale: 0.95 }"
        :whileInView="{ opacity: 1, scale: 1 }"
        :transition="{ duration: 0.4, delay: 0.1 }"
        :inViewOptions="{ once: true }"
      >
        <span class="cta-text">#GoVegan</span>
        <span class="cta-sub">Heute anfangen, mit Veganuary</span>
      </Motion>

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

      <div class="action-grid">
        <Motion
          v-for="(category, index) in actionCategories"
          :key="category.title"
          as="article"
          class="action-category"
          :initial="{ opacity: 0, y: 24 }"
          :whileInView="{ opacity: 1, y: 0 }"
          :transition="{ duration: 0.45, delay: index * 0.07 }"
          :inViewOptions="{ once: true, amount: 0.2 }"
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
        </Motion>
      </div>

      <p class="action-closing">Jede Mahlzeit ist eine Chance. Nimm sie.</p>
    </div>
  </section>
</template>

<style scoped>
.action {
  padding: 3.5rem 0 3rem;
  background: var(--brand-night);
  color: var(--brand-cream);
}
.action-head {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  gap: 2rem;
  align-items: end;
  margin-bottom: 2rem;
}
.action-title {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.2vw, 2.4rem);
  letter-spacing: -0.03em;
  line-height: 1.15;
  color: var(--brand-cream);
}
.action-intro p {
  margin: 0 0 0.6rem;
  font-size: 0.98rem;
  line-height: 1.65;
  color: rgba(246, 241, 231, 0.72);
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
  padding: 1.4rem 1.4rem 1.2rem;
  border-radius: 20px;
  border: 1px solid rgba(246, 241, 231, 0.12);
  border-top-color: rgba(246, 241, 231, 0.22);
  background: rgba(246, 241, 231, 0.045);
  color: var(--brand-cream);
  text-decoration: none;
  transition: transform 0.2s, border-color 0.2s, background 0.2s;
}
.why-how-card:hover,
.why-how-card:focus-visible {
  transform: translateY(-3px);
  border-color: var(--brand-accent);
  background: rgba(246, 241, 231, 0.07);
  color: var(--brand-cream);
  text-decoration: none;
}
.why-how-kicker {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #7fe0a5;
}
.why-how-title {
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.02em;
  line-height: 1.15;
}
.why-how-desc {
  font-size: 0.9rem;
  line-height: 1.55;
  color: rgba(246, 241, 231, 0.72);
}
.why-how-domain {
  margin-top: auto;
  padding-top: 0.7rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--brand-accent);
}
.cta-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.2rem;
  max-width: 520px;
  margin: 1.5rem auto 0;
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
  margin: 2rem auto;
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
  color: #7fe0a5;
  margin-bottom: 0.4rem;
}
.motivation-label {
  display: block;
  font-size: 0.85rem;
  line-height: 1.45;
  color: rgba(246, 241, 231, 0.65);
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.9rem;
}
.action-category {
  padding: 1.35rem 1.35rem 1.1rem;
  border-radius: 20px;
  border: 1px solid rgba(246, 241, 231, 0.12);
  background: rgba(246, 241, 231, 0.045);
}
.action-category-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: var(--brand-cream);
}
.action-category-desc {
  margin: 0 0 0.9rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid rgba(246, 241, 231, 0.12);
  font-size: 0.85rem;
  line-height: 1.5;
  color: rgba(246, 241, 231, 0.62);
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
  color: var(--brand-cream);
  text-decoration: none;
  transition: background 0.15s;
}
.action-link:hover,
.action-link:focus-visible {
  background: rgba(246, 241, 231, 0.08);
  color: var(--brand-cream);
  text-decoration: none;
}
.action-link-name {
  display: block;
  font-size: 0.92rem;
  font-weight: 700;
}
.action-link-desc {
  display: block;
  margin-top: 0.1rem;
  font-size: 0.78rem;
  line-height: 1.35;
  color: rgba(246, 241, 231, 0.6);
}
.action-closing {
  margin: 2.5rem auto 0;
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.1rem;
  letter-spacing: -0.02em;
  color: #7fe0a5;
}

@media (max-width: 991px) {
  .action-head {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .action-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
@media (max-width: 767px) {
  .action {
    padding: 2.5rem 0 2rem;
  }
  .why-how,
  .action-grid,
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

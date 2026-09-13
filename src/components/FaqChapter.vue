<script setup lang="ts">
import { faqs } from '@/data/facts'
import SourceLinks from '@/components/SourceLinks.vue'
</script>

<template>
  <section id="fragen" class="faq">
    <div class="container">
      <span class="chapter chapter--center">Kapitel 7 &middot; Die Fragen davor</span>
      <h2 class="faq-title">Was Menschen fragen, bevor sie etwas ändern</h2>
      <p class="faq-lead">
        Kurze Antworten, keine Meinungen. Unter jeder steht, wo sie herkommt.
      </p>
      <div class="faq-list">
        <details v-for="faq in faqs" :key="faq.question" class="faq-item">
          <summary class="faq-question">
            <span>{{ faq.question }}</span>
            <span class="faq-toggle" aria-hidden="true"></span>
          </summary>
          <div class="faq-answer">
            <p>{{ faq.answer }}</p>
            <SourceLinks :ids="faq.sources" />
          </div>
        </details>
      </div>
    </div>
  </section>
</template>

<style scoped>
.faq {
  padding: 3.5rem 0 3rem;
  background: var(--brand-cream);
}
.faq-title {
  margin: 0 0 0.6rem;
  text-align: center;
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 3vw, 2rem);
  letter-spacing: -0.03em;
  color: var(--brand-green);
}
.faq-lead {
  max-width: 560px;
  margin: 0 auto 1.75rem;
  text-align: center;
  font-size: 1rem;
  line-height: 1.6;
  color: #4a5a4f;
}
.faq-list {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}
.faq-item {
  background: #fff;
  border: 1.5px solid rgba(20, 54, 31, 0.08);
  border-radius: 16px;
  overflow: hidden;
}
.faq-question {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  list-style: none;
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: -0.02em;
  color: var(--brand-green);
}
.faq-question::-webkit-details-marker {
  display: none;
}
.faq-question:focus-visible {
  outline: 2px solid var(--brand-accent);
  outline-offset: -2px;
}
.faq-toggle {
  position: relative;
  flex: 0 0 auto;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(20, 54, 31, 0.06);
}
.faq-toggle::before,
.faq-toggle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 10px;
  height: 2px;
  background: var(--brand-green);
  transform: translate(-50%, -50%);
  transition: transform 0.2s;
}
.faq-toggle::after {
  transform: translate(-50%, -50%) rotate(90deg);
}
.faq-item[open] .faq-toggle::after {
  transform: translate(-50%, -50%) rotate(0deg);
}
.faq-answer {
  padding: 0 1.25rem 1.1rem;
}
.faq-answer p {
  margin: 0 0 0.6rem;
  font-size: 0.98rem;
  line-height: 1.65;
  color: #2f3b33;
}

@media (max-width: 767px) {
  .faq {
    padding: 2.5rem 0 2rem;
  }
  .faq-question {
    font-size: 0.95rem;
    padding: 0.9rem 1rem;
  }
  .faq-answer {
    padding: 0 1rem 1rem;
  }
}
</style>

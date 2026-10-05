<script setup lang="ts">
/**
 * The hand-off at the end of every topic page: one sentence, two doors.
 * Internal door to the action chapter, external door to the practical guides.
 */
</script>

<template>
  <aside class="next-step" aria-labelledby="next-step-title">
    <h2 id="next-step-title" class="next-step-title">Und jetzt?</h2>
    <p class="next-step-text">Zahlen allein ändern nichts. Eine Mahlzeit schon.</p>
    <div class="next-step-links">
      <RouterLink to="/#mitmachen" class="next-step-link next-step-link--primary">Mach den ersten Schritt</RouterLink>
      <a href="https://wie-vegan.com/" target="_blank" rel="noopener" class="next-step-link">
        Wie vegan? Guides für Einkauf und Küche <span aria-hidden="true">↗</span>
      </a>
    </div>
  </aside>
</template>

<style scoped>
.next-step {
  margin-top: 3rem;
  padding: 1.75rem 1.5rem;
  border-radius: 24px;
  background: var(--brand-green);
  color: var(--brand-cream);
}
.next-step-title {
  margin: 0 0 0.4rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: -0.025em;
  line-height: 1.2;
  color: var(--brand-cream);
}
.next-step-text {
  margin: 0 0 1.25rem;
  max-width: 48ch;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(246, 241, 231, 0.82);
}
.next-step-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
}
.next-step-link {
  display: inline-block;
  padding: 0.7rem 1.15rem;
  border-radius: 999px;
  border: 1.5px solid rgba(246, 241, 231, 0.35);
  font-size: 0.92rem;
  font-weight: 700;
  color: var(--brand-cream);
  text-decoration: none;
  transition: border-color 0.15s, background 0.15s;
}
.next-step-link:hover,
.next-step-link:focus-visible {
  border-color: var(--brand-accent);
  color: var(--brand-cream);
  text-decoration: none;
}
.next-step-link--primary {
  background: var(--brand-accent);
  border-color: var(--brand-accent);
  color: var(--brand-green);
}
.next-step-link--primary:hover,
.next-step-link--primary:focus-visible {
  background: #ff7f58;
  border-color: #ff7f58;
  color: var(--brand-green);
}
@media (max-width: 767px) {
  .next-step {
    padding: 1.35rem 1.1rem;
    border-radius: 20px;
  }
  .next-step-link {
    width: 100%;
    text-align: center;
  }
}
</style>

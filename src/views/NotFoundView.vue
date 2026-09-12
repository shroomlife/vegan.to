<template>
  <main class="not-found">
    <div class="not-found-inner">
      <p class="not-found-kicker">404</p>
      <h1 class="not-found-title">Diese Seite gibt es nicht.</h1>
      <p class="not-found-text">
        Der Zähler läuft trotzdem weiter. Zurück zur Startseite oder direkt zu den Quellen.
      </p>
      <div class="not-found-actions">
        <RouterLink to="/" class="not-found-btn not-found-btn--primary">Zur Startseite</RouterLink>
        <RouterLink to="/quellen" class="not-found-btn">Quellen und Methodik</RouterLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.not-found {
  min-height: calc(100svh - var(--header-height));
  display: flex;
  align-items: center;
  background: var(--brand-cream);
  color: var(--brand-green);
  padding: 3rem 1.5rem;
}
.not-found-inner {
  max-width: 560px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}
.not-found-kicker {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 4rem;
  letter-spacing: -0.04em;
  line-height: 1;
  color: var(--brand-accent);
}
.not-found-title {
  margin: 0;
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.4rem, 4vw, 2rem);
  letter-spacing: -0.03em;
}
.not-found-text {
  margin: 0;
  font-size: 1.05rem;
  line-height: 1.6;
  color: #4a5a4f;
}
.not-found-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}
.not-found-btn {
  padding: 0.75rem 1.4rem;
  border-radius: 999px;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  text-decoration: none;
  color: var(--brand-green);
  border: 2px solid var(--brand-green);
}
.not-found-btn--primary {
  background: var(--brand-green);
  color: var(--brand-cream);
}
.not-found-btn:hover,
.not-found-btn:focus-visible {
  text-decoration: none;
  border-color: var(--brand-accent);
  color: var(--brand-green);
}
.not-found-btn--primary:hover,
.not-found-btn--primary:focus-visible {
  background: var(--brand-accent);
}
</style>

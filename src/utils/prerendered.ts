/**
 * Whether the page the visitor sees came from a prerendered snapshot
 * (scripts/prerender.ts). Read once, before the app mounts and replaces
 * that markup: a route that was already on screen at the first paint must
 * not play its entrance animation a second time.
 */
export const startedFromSnapshot = (document.getElementById('app')?.childElementCount ?? 0) > 0

let firstRouteShown = false

/** Called by the app once the first route is mounted; later routes animate in as usual */
export function markFirstRouteShown(): void {
  firstRouteShown = true
}

/** True for the view that replaces the snapshot, so its entrance animations are skipped */
export function replacesSnapshot(): boolean {
  return startedFromSnapshot && !firstRouteShown
}

/**
 * Service Worker registration utility.
 * Call once from a client component that mounts on every page (e.g. layout).
 *
 * Registration is deferred until after the window "load" event so it never
 * competes with critical rendering resources.
 */
export function registerServiceWorker(): void {
  if (
    typeof window === 'undefined' ||
    !('serviceWorker' in navigator) ||
    process.env.NODE_ENV === 'development'
  ) {
    return;
  }

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err: unknown) => {
      // Silently swallow — the site works fine without a SW.
      console.warn('[FormReady] SW registration failed:', err);
    });
  });
}

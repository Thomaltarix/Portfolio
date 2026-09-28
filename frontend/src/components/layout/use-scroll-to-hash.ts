import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// How long to keep the target aligned while sections above it finish loading.
const SETTLE_WINDOW_MS = 2000;
const USER_SCROLL_EVENTS = ['wheel', 'touchstart', 'keydown', 'pointerdown'] as const;

/**
 * BrowserRouter neither resets the scroll position nor follows a hash on client-side navigation: a legal page
 * would open scrolled to its bottom, and "/#contact" from another page would land on the hero. This does both,
 * keyed on the location so clicking the same section link twice still scrolls back to it.
 *
 * Sections above the target can still grow after the first scroll (the project cards arrive from the API), which
 * pushed "/#contact" several hundred pixels off. So for a short window the target is re-aligned whenever the page
 * resizes, until the visitor scrolls themselves.
 */
export function useScrollToHash(): void {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;

    const align = () => target.scrollIntoView();
    align();

    const observer = new ResizeObserver(align);
    observer.observe(document.body);
    const stop = () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      USER_SCROLL_EVENTS.forEach((event) => window.removeEventListener(event, stop));
    };
    const timeout = window.setTimeout(stop, SETTLE_WINDOW_MS);
    USER_SCROLL_EVENTS.forEach((event) => window.addEventListener(event, stop, { passive: true }));

    return stop;
  }, [pathname, hash, key]);
}

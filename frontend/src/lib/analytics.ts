const SCRIPT_URL = import.meta.env.VITE_ANALYTICS_SCRIPT_URL as string | undefined;
const SITE_ID = import.meta.env.VITE_ANALYTICS_SITE_ID as string | undefined;

/**
 * No-op unless both env vars are set at build time, so the app works vendor-free by default.
 * Compatible with any script-tag-based provider (Plausible, Umami, etc.) without hardcoding one.
 */
export function initAnalytics(): void {
  if (!SCRIPT_URL || !SITE_ID) return;

  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  script.defer = true;
  script.setAttribute('data-site-id', SITE_ID);
  document.head.appendChild(script);
}

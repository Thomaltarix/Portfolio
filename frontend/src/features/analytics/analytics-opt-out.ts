const STORAGE_KEY = 'portfolio-analytics-opt-out';

// The opt-out lives in localStorage: it is a preference the visitor explicitly
// asked for, so it is exempt from consent, and the beacon reads it before firing.
export function isAnalyticsOptedOut(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setAnalyticsOptOut(optedOut: boolean): void {
  try {
    if (optedOut) {
      window.localStorage.setItem(STORAGE_KEY, 'true');
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Storage unavailable (private mode, blocked): nothing to persist.
  }
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../api/analytics.api';
import { isAnalyticsOptedOut } from '../analytics-opt-out';

const ADMIN_PATH_PREFIX = '/admin';

// Skips the owner's own visits to /admin/* so they don't skew the stats
// they're looking at.
export function useTrackPageView(): void {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.startsWith(ADMIN_PATH_PREFIX)) return;
    if (isAnalyticsOptedOut()) return;

    trackPageView(location.pathname, document.referrer || undefined).catch(() => {
      // Best-effort beacon — a failed request must never affect the visitor.
    });
  }, [location.pathname]);
}

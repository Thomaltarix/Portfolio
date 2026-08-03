import { useTrackPageView } from '../hooks/use-track-page-view';

// Rendered once near the router root — has no UI, just fires the beacon.
export function PageViewTracker() {
  useTrackPageView();
  return null;
}

import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import '@/lib/i18n';

afterEach(() => {
  cleanup();
});

// jsdom doesn't implement IntersectionObserver, which framer-motion's
// `whileInView` (used by the FadeIn component) needs to mount.
class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverStub);

import { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { Footer } from './Footer';
import { Header } from './Header';
import { useScrollToHash } from './use-scroll-to-hash';

export function RootLayout() {
  const { t } = useTranslation('common');
  useScrollToHash();

  return (
    <div id="top" className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:ring-2 focus:ring-accent"
      >
        {t('skipToContent')}
      </a>
      <Header />
      <main id="main" className="flex-1">
        {/* Reserves the height while a lazy page loads, so the footer does not jump up. */}
        <Suspense fallback={<div className="min-h-[70vh]" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

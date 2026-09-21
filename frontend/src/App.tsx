import { RootLayout } from '@/components/layout/RootLayout';
import { PageViewTracker } from '@/features/analytics/components/PageViewTracker';
import { QueryClientProvider } from '@tanstack/react-query';
import { lazy, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { queryClient } from './lib/query-client';
import { ThemeProvider } from './lib/theme-provider';
import { HomePage } from './routes/HomePage';
import { NotFoundPage } from './routes/NotFoundPage';

// Everything except the home page is loaded on demand. The admin and the project page
// (which pulls in the markdown renderer) are the two heavy ones; the legal pages are rarely
// opened. Pages use named exports, hence the `.then` to satisfy React.lazy's default export.
const AdminRoutes = lazy(() => import('./routes/admin/AdminRoutes').then((m) => ({ default: m.AdminRoutes })));
const ProjectDetailPage = lazy(() =>
  import('./routes/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage })),
);
const LegalNoticePage = lazy(() =>
  import('@/features/legal/components/LegalNoticePage').then((m) => ({ default: m.LegalNoticePage })),
);
const PrivacyPolicyPage = lazy(() =>
  import('@/features/legal/components/PrivacyPolicyPage').then((m) => ({ default: m.PrivacyPolicyPage })),
);

// Admin is French-only by design (see claude/frontend.md), so its fallback is too.
function AdminFallback() {
  return (
    <p role="status" className="p-6 text-sm text-muted-foreground">
      Chargement...
    </p>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <ThemeProvider>
          <BrowserRouter>
            <PageViewTracker />
            <Routes>
              <Route element={<RootLayout />}>
                <Route index element={<HomePage />} />
                <Route path="projects/:slug" element={<ProjectDetailPage />} />
                <Route path="mentions-legales" element={<LegalNoticePage />} />
                <Route path="confidentialite" element={<PrivacyPolicyPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route
                path="admin/*"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminRoutes />
                  </Suspense>
                }
              />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

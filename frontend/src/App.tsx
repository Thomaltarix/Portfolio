import { RootLayout } from '@/components/layout/RootLayout';
import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute';
import { PageViewTracker } from '@/features/analytics/components/PageViewTracker';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { queryClient } from './lib/query-client';
import { ThemeProvider } from './lib/theme-provider';
import { AdminLoginPage } from './routes/AdminLoginPage';
import { DashboardPage } from './routes/admin/DashboardPage';
import { MessagesPage } from './routes/admin/MessagesPage';
import { ProjectsPage } from './routes/admin/ProjectsPage';
import { HomePage } from './routes/HomePage';
import { NotFoundPage } from './routes/NotFoundPage';
import { ProjectDetailPage } from './routes/ProjectDetailPage';

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
                <Route path="*" element={<NotFoundPage />} />
              </Route>

              <Route path="admin/login" element={<AdminLoginPage />} />
              <Route path="admin" element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="projects" element={<ProjectsPage />} />
                  <Route path="messages" element={<MessagesPage />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

import { AdminLayout } from '@/features/admin/components/AdminLayout';
import { ProtectedRoute } from '@/features/admin/components/ProtectedRoute';
import { Navigate, Route, Routes } from 'react-router-dom';
import { AdminLoginPage } from '../AdminLoginPage';
import { DashboardPage } from './DashboardPage';
import { MessagesPage } from './MessagesPage';
import { ProjectsPage } from './ProjectsPage';

// The whole admin lives behind one lazy import (see App.tsx), so visitors of the public
// site never download it: this module is the only static entry into everything under /admin.
// Paths here are relative to the `admin/*` route that mounts it.
export function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="messages" element={<MessagesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

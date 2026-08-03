import { useMe } from '@/features/auth/hooks/use-auth';
import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
  const { data, isLoading, isError } = useMe();

  if (isLoading) return null;
  if (isError || !data) return <Navigate to="/admin/login" replace />;

  return <Outlet />;
}

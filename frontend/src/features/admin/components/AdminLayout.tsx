import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/admin/dashboard', label: 'Dashboard' },
  { to: '/admin/projects', label: 'Projets' },
  { to: '/admin/messages', label: 'Messages' },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/admin/login', { replace: true }),
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-border px-6 py-4">
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-surface',
                  isActive && 'bg-surface text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button variant="outline" size="sm" onClick={handleLogout}>
          Se déconnecter
        </Button>
      </header>
      <main className="flex-1 px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

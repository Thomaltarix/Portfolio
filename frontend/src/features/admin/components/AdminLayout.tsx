import { Button } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { useLogout } from '@/features/auth/hooks/use-auth';
import { LogOut } from 'lucide-react';
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
      <header className="flex items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6 sm:py-4">
        <nav className="-mx-1 flex min-w-0 items-center gap-1 overflow-x-auto px-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-2.5 py-2.5 text-sm sm:px-3 font-medium transition-colors hover:bg-surface',
                  isActive && 'bg-surface text-foreground',
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          aria-label="Se déconnecter"
          className="shrink-0 px-0 max-sm:w-11 sm:px-4"
        >
          <LogOut className="size-4 sm:hidden" aria-hidden="true" />
          <span className="hidden sm:inline">Se déconnecter</span>
        </Button>
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Outlet />
      </main>
    </div>
  );
}

import { LoginForm } from '@/features/admin/components/LoginForm';

export function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-xl font-semibold tracking-tight">Administration</h1>
        <LoginForm />
      </div>
    </div>
  );
}

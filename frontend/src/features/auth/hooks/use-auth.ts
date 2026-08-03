import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchMe, login, logout } from '../api/auth.api';
import type { AdminProfile } from '../types';

export const ME_QUERY_KEY = ['auth', 'me'];

export function useMe() {
  return useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    // A 401 here means "not logged in", not a transient failure — retrying
    // would just delay the redirect to /admin/login.
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (admin: AdminProfile) => {
      queryClient.setQueryData(ME_QUERY_KEY, admin);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(ME_QUERY_KEY, null);
    },
  });
}

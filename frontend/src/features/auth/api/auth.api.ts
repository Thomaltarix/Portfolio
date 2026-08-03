import { apiFetch } from '@/lib/api-client';
import type { AdminProfile } from '../types';

export function login(email: string, password: string): Promise<AdminProfile> {
  return apiFetch<AdminProfile>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logout(): Promise<{ success: true }> {
  return apiFetch<{ success: true }>('/auth/logout', { method: 'POST' });
}

export function fetchMe(): Promise<AdminProfile> {
  return apiFetch<AdminProfile>('/auth/me');
}

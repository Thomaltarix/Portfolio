import { apiFetch } from '@/lib/api-client';
import type { ContactFormValues } from '../schema';
import type { ContactMessage } from '../types';

export function submitContactForm(values: ContactFormValues): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

export function fetchContactMessages(): Promise<ContactMessage[]> {
  return apiFetch<ContactMessage[]>('/contact');
}

export function markContactMessageRead(id: string): Promise<ContactMessage> {
  return apiFetch<ContactMessage>(`/contact/${id}/read`, { method: 'PATCH' });
}

export function deleteContactMessage(id: string): Promise<void> {
  return apiFetch<void>(`/contact/${id}`, { method: 'DELETE' });
}

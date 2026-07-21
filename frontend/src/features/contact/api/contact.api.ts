import { apiFetch } from '@/lib/api-client';
import type { ContactFormValues } from '../schema';

export function submitContactForm(values: ContactFormValues): Promise<{ id: string }> {
  return apiFetch<{ id: string }>('/contact', {
    method: 'POST',
    body: JSON.stringify(values),
  });
}

import { useQuery } from '@tanstack/react-query';
import { fetchContactMessages } from '../api/contact.api';

export function useContactMessages() {
  return useQuery({
    queryKey: ['contact', 'messages'],
    queryFn: fetchContactMessages,
  });
}

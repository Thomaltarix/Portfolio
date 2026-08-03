import { useMutation, useQueryClient } from '@tanstack/react-query';
import { markContactMessageRead } from '../api/contact.api';

export function useMarkMessageRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markContactMessageRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', 'messages'] });
    },
  });
}

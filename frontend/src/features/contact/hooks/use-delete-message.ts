import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteContactMessage } from '../api/contact.api';

export function useDeleteMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteContactMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact', 'messages'] });
    },
  });
}

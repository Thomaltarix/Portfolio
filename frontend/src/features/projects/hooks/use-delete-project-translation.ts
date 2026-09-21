import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteProjectTranslation } from '../api/projects.api';
import type { TranslationLanguage } from '../types/project.types';

export function useDeleteProjectTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, language }: { id: string; language: TranslationLanguage }) =>
      deleteProjectTranslation(id, language),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

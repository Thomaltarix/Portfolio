import { useMutation, useQueryClient } from '@tanstack/react-query';
import { upsertProjectTranslation } from '../api/projects.api';
import type { ProjectTranslationInput, TranslationLanguage } from '../types/project.types';

export function useSaveProjectTranslation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      language,
      input,
    }: {
      id: string;
      language: TranslationLanguage;
      input: ProjectTranslationInput;
    }) => upsertProjectTranslation(id, language, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
}

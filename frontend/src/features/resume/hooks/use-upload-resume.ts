import type { SupportedLanguage } from '@/lib/i18n';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadResume } from '../api/resume.api';
import { RESUME_SUMMARIES_QUERY_KEY } from './use-resume-summaries';

interface UploadResumeVariables {
  readonly locale: SupportedLanguage;
  readonly file: File;
}

export function useUploadResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ locale, file }: UploadResumeVariables) => uploadResume(locale, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUME_SUMMARIES_QUERY_KEY });
    },
  });
}

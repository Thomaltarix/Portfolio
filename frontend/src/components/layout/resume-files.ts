import { resumeDownloadUrl } from '@/features/resume/api/resume.api';

// Served by the API so a résumé replaced from the admin is live without a redeploy.
export const RESUME_FILES = {
  en: resumeDownloadUrl('en'),
  fr: resumeDownloadUrl('fr'),
} as const;

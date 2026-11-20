import { Button, buttonVariants } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { resumeDownloadUrl } from '@/features/resume/api/resume.api';
import { useUploadResume } from '@/features/resume/hooks/use-upload-resume';
import type { ResumeSummary } from '@/features/resume/types';
import { ApiError } from '@/lib/api-client';
import type { SupportedLanguage } from '@/lib/i18n';
import { type ChangeEvent, useRef } from 'react';

const LANGUAGE_LABELS: Readonly<Record<SupportedLanguage, string>> = {
  en: 'CV anglais',
  fr: 'CV français',
};

const HTTP_PAYLOAD_TOO_LARGE = 413;
const HTTP_UNSUPPORTED_MEDIA_TYPE = 415;

interface ResumeUploadCardProps {
  readonly locale: SupportedLanguage;
  readonly summary: ResumeSummary | undefined;
}

export function ResumeUploadCard({ locale, summary }: ResumeUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadResume();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Cleared so picking the same file again after an error still fires onChange.
    event.target.value = '';
    if (file) upload.mutate({ locale, file });
  };

  return (
    <Card className="space-y-4 p-4 sm:p-6">
      <div className="space-y-1">
        <h2 className="font-medium">{LANGUAGE_LABELS[locale]}</h2>
        <p className="text-sm text-muted-foreground">
          {summary ? describeSummary(summary) : 'Aucun CV en ligne.'}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={handleFileChange}
        />
        <Button size="sm" disabled={upload.isPending} onClick={() => inputRef.current?.click()}>
          {upload.isPending ? 'Envoi...' : summary ? 'Remplacer le PDF' : 'Envoyer un PDF'}
        </Button>
        {summary && (
          <a
            href={resumeDownloadUrl(locale)}
            className={buttonVariants({ variant: 'outline', size: 'sm' })}
          >
            Télécharger
          </a>
        )}
      </div>

      <p role="status" className="text-sm">
        {upload.isSuccess && <span className="text-muted-foreground">CV mis à jour.</span>}
        {upload.isError && (
          <span className="text-red-700 dark:text-red-400">{describeError(upload.error)}</span>
        )}
      </p>
    </Card>
  );
}

function describeSummary({ updatedAt, sizeBytes }: ResumeSummary): string {
  const date = new Date(updatedAt).toLocaleString('fr-FR', {
    dateStyle: 'long',
    timeStyle: 'short',
  });
  return `Mis à jour le ${date} · ${Math.ceil(sizeBytes / 1024)} Ko`;
}

function describeError(error: Error): string {
  if (error instanceof ApiError && error.status === HTTP_PAYLOAD_TOO_LARGE) {
    return 'Le fichier dépasse 5 Mo.';
  }
  if (error instanceof ApiError && error.status === HTTP_UNSUPPORTED_MEDIA_TYPE) {
    return "Ce fichier n'est pas un PDF.";
  }
  return "L'envoi a échoué. Réessaie.";
}

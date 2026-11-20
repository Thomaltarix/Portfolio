import { useResumeSummaries } from '@/features/resume/hooks/use-resume-summaries';
import { SUPPORTED_LANGUAGES } from '@/lib/i18n';
import { ResumeUploadCard } from './ResumeUploadCard';

export function ResumeAdmin() {
  const { data: summaries, isLoading, isError } = useResumeSummaries();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold tracking-tight">CV</h1>
        <p className="text-sm text-muted-foreground">
          Le PDF envoyé ici est celui que le site propose au téléchargement, sans redéploiement.
        </p>
      </div>

      {isLoading && <p className="text-sm text-muted-foreground">Chargement...</p>}
      {isError && (
        <p className="text-sm text-red-700 dark:text-red-400">Impossible de charger les CV.</p>
      )}
      {summaries && (
        <div className="grid gap-4 md:grid-cols-2">
          {SUPPORTED_LANGUAGES.map((locale) => (
            <ResumeUploadCard
              key={locale}
              locale={locale}
              summary={summaries.find((summary) => summary.locale === locale)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDeleteProjectTranslation } from '@/features/projects/hooks/use-delete-project-translation';
import { useProject } from '@/features/projects/hooks/use-project';
import { useSaveProjectTranslation } from '@/features/projects/hooks/use-save-project-translation';
import type { ProjectDetail, TranslationLanguage } from '@/features/projects/types/project.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProjectTextFields } from './ProjectTextFields';

const translationSchema = z.object({
  title: z.string().min(1, 'Titre requis'),
  summary: z.string().min(1, 'Résumé requis'),
  content: z.string().min(1, 'Contenu requis'),
});

type TranslationFormValues = z.infer<typeof translationSchema>;

const EMPTY_VALUES: TranslationFormValues = { title: '', summary: '', content: '' };

const LANGUAGE_LABELS: Record<TranslationLanguage, string> = { fr: 'français' };

interface ProjectTranslationFormProps {
  // The project in its default language (English), used as the reference to translate from.
  readonly project: ProjectDetail;
  readonly language: TranslationLanguage;
}

export function ProjectTranslationForm({ project, language }: ProjectTranslationFormProps) {
  const { data: translated } = useProject(project.slug, language);
  const saveTranslation = useSaveProjectTranslation();
  const deleteTranslation = useDeleteProjectTranslation();

  // The API falls back to the default language when no translation exists, and says so in `locale`.
  const hasTranslation = translated?.locale === language;
  const languageLabel = LANGUAGE_LABELS[language];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TranslationFormValues>({
    resolver: zodResolver(translationSchema),
    values: hasTranslation
      ? { title: translated.title, summary: translated.summary, content: translated.content }
      : EMPTY_VALUES,
  });

  const onSubmit = (values: TranslationFormValues) => {
    saveTranslation.mutate({ id: project.id, language, input: values });
  };

  const handleDelete = () => {
    if (!window.confirm(`Supprimer la traduction en ${languageLabel} ?`)) return;
    deleteTranslation.mutate({ id: project.id, language });
  };

  const mutationError = saveTranslation.error ?? deleteTranslation.error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <p className="text-sm text-muted-foreground">
        {hasTranslation
          ? `Traduction en ${languageLabel} publiée sur le site.`
          : `Aucune traduction en ${languageLabel} : le site affiche la version anglaise.`}
      </p>

      {!hasTranslation && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() =>
            reset({ title: project.title, summary: project.summary, content: project.content })
          }
        >
          Pré-remplir avec l'anglais
        </Button>
      )}

      <div className="space-y-2">
        <Label htmlFor={`slug-${language}`}>Slug</Label>
        <Input id={`slug-${language}`} value={project.slug} disabled readOnly />
        <p className="text-sm text-muted-foreground">Commun à toutes les langues, à modifier dans l'onglet Anglais.</p>
      </div>

      <ProjectTextFields
        idPrefix={language}
        fields={{ title: register('title'), summary: register('summary'), content: register('content') }}
        errors={{ title: errors.title?.message, summary: errors.summary?.message, content: errors.content?.message }}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={saveTranslation.isPending} className="w-full sm:w-auto">
          {saveTranslation.isPending ? 'Enregistrement...' : 'Enregistrer la traduction'}
        </Button>
        {hasTranslation && (
          <Button
            type="button"
            variant="outline"
            disabled={deleteTranslation.isPending}
            onClick={handleDelete}
            className="w-full sm:w-auto"
          >
            Supprimer la traduction
          </Button>
        )}
      </div>

      {saveTranslation.isSuccess && (
        <p role="status" className="text-sm text-muted-foreground">
          Traduction enregistrée.
        </p>
      )}
      {mutationError && (
        <p role="alert" className="text-sm text-red-700 dark:text-red-400">
          {mutationError instanceof Error ? mutationError.message : 'Une erreur est survenue.'}
        </p>
      )}
    </form>
  );
}

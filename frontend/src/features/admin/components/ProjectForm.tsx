import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCreateProject } from '@/features/projects/hooks/use-create-project';
import { useUpdateProject } from '@/features/projects/hooks/use-update-project';
import type { ProjectDetail } from '@/features/projects/types/project.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const optionalUrl = z
  .string()
  .optional()
  .refine((value) => !value || /^https?:\/\//.test(value), {
    message: 'URL invalide (doit commencer par http:// ou https://)',
  });

const projectFormSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug requis')
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Minuscules, chiffres et tirets uniquement'),
  title: z.string().min(1, 'Titre requis'),
  summary: z.string().min(1, 'Résumé requis'),
  content: z.string().min(1, 'Contenu requis'),
  techStack: z.string(),
  githubUrl: optionalUrl,
  liveUrl: optionalUrl,
  featured: z.boolean().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface ProjectFormProps {
  project?: ProjectDetail;
  onSaved: () => void;
  onCancel: () => void;
}

export function ProjectForm({ project, onSaved, onCancel }: ProjectFormProps) {
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const isSaving = createProject.isPending || updateProject.isPending;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: project
      ? {
          slug: project.slug,
          title: project.title,
          summary: project.summary,
          content: project.content,
          techStack: project.techStack.join(', '),
          githubUrl: project.githubUrl ?? '',
          liveUrl: project.liveUrl ?? '',
          featured: project.featured,
        }
      : { techStack: '', featured: false },
  });

  const onSubmit = (values: ProjectFormValues) => {
    const input = {
      slug: values.slug,
      title: values.title,
      summary: values.summary,
      content: values.content,
      techStack: values.techStack
        .split(',')
        .map((tech) => tech.trim())
        .filter(Boolean),
      githubUrl: values.githubUrl || undefined,
      liveUrl: values.liveUrl || undefined,
      featured: values.featured ?? false,
    };

    const mutation = project
      ? updateProject.mutateAsync({ id: project.id, input })
      : createProject.mutateAsync(input);

    mutation.then(onSaved).catch(() => {
      // Error state is surfaced below via isError — nothing more to do here.
    });
  };

  const mutationError = project ? updateProject.error : createProject.error;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" {...register('slug')} />
          {errors.slug && <p className="text-sm text-red-400">{errors.slug.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Titre</Label>
          <Input id="title" {...register('title')} />
          {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Résumé</Label>
        <Textarea id="summary" className="min-h-20" {...register('summary')} />
        {errors.summary && <p className="text-sm text-red-400">{errors.summary.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Contenu (markdown)</Label>
        <Textarea id="content" className="min-h-64 font-mono text-xs" {...register('content')} />
        {errors.content && <p className="text-sm text-red-400">{errors.content.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="techStack">Stack technique (séparée par des virgules)</Label>
        <Input id="techStack" placeholder="NestJS, React, PostgreSQL" {...register('techStack')} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="githubUrl">Lien GitHub</Label>
          <Input id="githubUrl" {...register('githubUrl')} />
          {errors.githubUrl && (
            <p className="text-sm text-red-400">{errors.githubUrl.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="liveUrl">Lien démo</Label>
          <Input id="liveUrl" {...register('liveUrl')} />
          {errors.liveUrl && <p className="text-sm text-red-400">{errors.liveUrl.message}</p>}
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="h-4 w-4 rounded border-border" {...register('featured')} />
        Mettre en avant
      </label>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? 'Enregistrement...' : 'Enregistrer'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
      </div>

      {mutationError && (
        <p className="text-sm text-red-400">
          {mutationError instanceof Error ? mutationError.message : 'Une erreur est survenue.'}
        </p>
      )}
    </form>
  );
}

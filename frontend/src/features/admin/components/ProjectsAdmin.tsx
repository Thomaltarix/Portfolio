import { Button } from '@/components/ui/button';
import { useProject } from '@/features/projects/hooks/use-project';
import { DEFAULT_LANGUAGE } from '@/lib/use-site-language';
import { useState } from 'react';
import { ProjectEditor } from './ProjectEditor';
import { ProjectsTable } from './ProjectsTable';

type Mode = { type: 'list' } | { type: 'create' } | { type: 'edit'; slug: string };

export function ProjectsAdmin() {
  const [mode, setMode] = useState<Mode>({ type: 'list' });
  const editingSlug = mode.type === 'edit' ? mode.slug : undefined;
  const { data: editingProject, isLoading } = useProject(editingSlug, DEFAULT_LANGUAGE);
  const backToList = () => setMode({ type: 'list' });

  if (mode.type === 'create') {
    // A new project opens straight in edit mode so its translations can be added right away.
    return (
      <ProjectEditor
        onSaved={(saved) => setMode({ type: 'edit', slug: saved.slug })}
        onClose={backToList}
      />
    );
  }

  if (mode.type === 'edit') {
    if (isLoading || !editingProject) {
      return <p className="text-sm text-muted-foreground">Chargement...</p>;
    }
    return (
      <ProjectEditor
        // Remounts the form when another project is opened, so no stale values leak across.
        key={editingProject.id}
        project={editingProject}
        onSaved={(saved) => setMode({ type: 'edit', slug: saved.slug })}
        onClose={backToList}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">Projets</h1>
        <Button onClick={() => setMode({ type: 'create' })}>Nouveau projet</Button>
      </div>
      <ProjectsTable onEdit={(slug) => setMode({ type: 'edit', slug })} />
    </div>
  );
}

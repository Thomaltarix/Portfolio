import { Button } from '@/components/ui/button';
import { useProject } from '@/features/projects/hooks/use-project';
import { useState } from 'react';
import { ProjectForm } from './ProjectForm';
import { ProjectsTable } from './ProjectsTable';

type Mode = { type: 'list' } | { type: 'create' } | { type: 'edit'; slug: string };

export function ProjectsAdmin() {
  const [mode, setMode] = useState<Mode>({ type: 'list' });
  const editingSlug = mode.type === 'edit' ? mode.slug : undefined;
  const { data: editingProject, isLoading } = useProject(editingSlug);

  if (mode.type === 'create') {
    return (
      <ProjectForm
        onSaved={() => setMode({ type: 'list' })}
        onCancel={() => setMode({ type: 'list' })}
      />
    );
  }

  if (mode.type === 'edit') {
    if (isLoading || !editingProject) {
      return <p className="text-sm text-muted-foreground">Chargement...</p>;
    }
    return (
      <ProjectForm
        project={editingProject}
        onSaved={() => setMode({ type: 'list' })}
        onCancel={() => setMode({ type: 'list' })}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Projets</h1>
        <Button onClick={() => setMode({ type: 'create' })}>Nouveau projet</Button>
      </div>
      <ProjectsTable onEdit={(slug) => setMode({ type: 'edit', slug })} />
    </div>
  );
}

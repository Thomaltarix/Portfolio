import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useDeleteProject } from '@/features/projects/hooks/use-delete-project';
import { useProjects } from '@/features/projects/hooks/use-projects';

interface ProjectsTableProps {
  onEdit: (slug: string) => void;
}

export function ProjectsTable({ onEdit }: ProjectsTableProps) {
  const { data: projects, isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();

  if (isLoading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (isError) return <p className="text-sm text-red-400">Impossible de charger les projets.</p>;
  if (!projects || projects.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun projet pour le moment.</p>;
  }

  const handleDelete = (id: string, title: string) => {
    if (!window.confirm(`Supprimer le projet "${title}" ?`)) return;
    deleteProject.mutate(id);
  };

  return (
    <div className="space-y-3">
      {projects.map((project) => (
        <Card key={project.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <p className="truncate font-medium">
              {project.title}
              {project.featured && (
                <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                  À la une
                </span>
              )}
            </p>
            <p className="truncate text-sm text-muted-foreground">{project.slug}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(project.slug)}>
              Modifier
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDelete(project.id, project.title)}
            >
              Supprimer
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../types/project.types';

interface ProjectCardProps {
  readonly project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/projects/${project.slug}`}>
      <Card className="h-full transition-colors hover:border-accent">
        <CardTitle>{project.title}</CardTitle>
        <CardDescription className="mt-2">{project.summary}</CardDescription>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.techStack.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}

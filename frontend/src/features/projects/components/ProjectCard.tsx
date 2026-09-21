import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ProjectSummary } from '../types/project.types';

interface ProjectCardProps {
  readonly project: ProjectSummary;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      viewTransition
      className="group flex h-full min-h-72 flex-col justify-between gap-12 rounded-lg border border-border bg-surface p-8 transition-colors duration-200 [@media(hover:hover)]:hover:border-accent"
    >
      <div>
        <h3
          style={{ viewTransitionName: `project-${project.slug}` }}
          className="flex items-start justify-between gap-4 text-3xl font-light tracking-tight sm:text-4xl"
        >
          {project.title}
          <ArrowUpRight
            className="mt-1.5 size-6 shrink-0 text-muted-foreground transition-[transform,color] duration-200 ease-out-strong group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent"
            aria-hidden="true"
          />
        </h3>
        <p className="mt-4 max-w-md text-muted-foreground">{project.summary}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {project.techStack.map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
    </Link>
  );
}

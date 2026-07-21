import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { FadeIn } from '@/components/motion/FadeIn';
import { cn } from '@/lib/cn';
import { ProjectMarkdown } from '@/features/projects/components/ProjectMarkdown';
import { useProject } from '@/features/projects/hooks/use-project';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: project, isLoading, isError } = useProject(slug);

  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      {project && (
        <Helmet>
          <title>{project.title} — Portfolio</title>
          <meta name="description" content={project.summary} />
        </Helmet>
      )}

      <Link to="/#projects" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to projects
      </Link>

      {isLoading && <p className="mt-8 text-muted-foreground">Loading…</p>}
      {isError && <p className="mt-8 text-muted-foreground">Project not found.</p>}

      {project && (
        <FadeIn className="mt-6">
          <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{project.summary}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                View source
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
              >
                Live demo
              </a>
            )}
          </div>

          <div className="mt-10">
            <ProjectMarkdown content={project.content} />
          </div>
        </FadeIn>
      )}
    </section>
  );
}

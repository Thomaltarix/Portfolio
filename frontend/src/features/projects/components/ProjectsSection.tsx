import { FadeIn } from '@/components/motion/FadeIn';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsSection() {
  const { t } = useTranslation('projects');
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <h2 className="text-2xl font-semibold tracking-tight">{t('heading')}</h2>
      </FadeIn>

      {isLoading && <p className="mt-10 text-muted-foreground">{t('loading')}</p>}
      {isError && <p className="mt-10 text-muted-foreground">{t('loadError')}</p>}

      {projects && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {projects.map((project, index) => (
            <FadeIn key={project.id} delay={index * 0.05}>
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      )}
    </section>
  );
}

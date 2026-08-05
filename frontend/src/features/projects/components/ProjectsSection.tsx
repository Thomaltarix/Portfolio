import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { useTranslation } from 'react-i18next';
import { useProjects } from '../hooks/use-projects';
import { ProjectCard } from './ProjectCard';

export function ProjectsSection() {
  const { t } = useTranslation('projects');
  const { data: projects, isLoading, isError } = useProjects();

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
      </FadeIn>

      {isLoading && <p className="mt-10 text-muted-foreground">{t('loading')}</p>}
      {isError && <p className="mt-10 text-muted-foreground">{t('loadError')}</p>}

      {projects && projects.length === 0 && (
        <FadeIn>
          <Card className="mt-10">
            <CardTitle>{t('comingSoonTitle')}</CardTitle>
            <CardDescription className="mt-2">{t('comingSoonDescription')}</CardDescription>
          </Card>
        </FadeIn>
      )}

      {projects && projects.length > 0 && (
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

import { AboutSection } from '@/features/about/components/AboutSection';
import { ContactSection } from '@/features/contact/components/ContactSection';
import { ExperienceSection } from '@/features/experience/components/ExperienceSection';
import { HeroSection } from '@/features/hero/components/HeroSection';
import { PlaygroundSection } from '@/features/playground/components/PlaygroundSection';
import { ProjectsSection } from '@/features/projects/components/ProjectsSection';
import { SkillsSection } from '@/features/skills/components/SkillsSection';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation('common');

  return (
    <>
      <Helmet>
        <title>{t('meta.title')}</title>
        <meta name="description" content={t('meta.description')} />
      </Helmet>

      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <PlaygroundSection />
      <ContactSection />
    </>
  );
}

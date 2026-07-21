import { AboutSection } from '@/features/about/components/AboutSection';
import { ContactSection } from '@/features/contact/components/ContactSection';
import { ExperienceSection } from '@/features/experience/components/ExperienceSection';
import { HeroSection } from '@/features/hero/components/HeroSection';
import { PlaygroundSection } from '@/features/playground/components/PlaygroundSection';
import { ProjectsSection } from '@/features/projects/components/ProjectsSection';
import { SkillsSection } from '@/features/skills/components/SkillsSection';
import { Helmet } from 'react-helmet-async';

export function HomePage() {
  return (
    <>
      <Helmet>
        <title>Portfolio — Backend & Software Engineer</title>
        <meta
          name="description"
          content="Backend & software engineer building production-ready systems, clean APIs, and pragmatic architecture."
        />
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

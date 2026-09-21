import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// The band is a thin strip a bit above the viewport middle: a section becomes
// active when its content crosses it, which matches where the reader is looking.
const OBSERVER_ROOT_MARGIN = '-40% 0px -55% 0px';

export function useActiveSection(sectionIds: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);
  // The header outlives route changes, so re-observe when the page underneath changes.
  const { pathname } = useLocation();

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          } else {
            setActiveId((current) => (current === entry.target.id ? null : current));
          }
        }
      },
      { rootMargin: OBSERVER_ROOT_MARGIN },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      setActiveId(null);
    };
  }, [sectionIds, pathname]);

  return activeId;
}

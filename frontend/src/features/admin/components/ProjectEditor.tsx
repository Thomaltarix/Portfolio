import { Button } from '@/components/ui/button';
import type { ProjectDetail } from '@/features/projects/types/project.types';
import { cn } from '@/lib/cn';
import { useState } from 'react';
import { ProjectForm } from './ProjectForm';
import { ProjectTranslationForm } from './ProjectTranslationForm';

type EditorTab = 'en' | 'fr';

const TABS: readonly { readonly id: EditorTab; readonly label: string }[] = [
  { id: 'en', label: 'Anglais' },
  { id: 'fr', label: 'Français' },
];

interface ProjectEditorProps {
  readonly project?: ProjectDetail;
  readonly onSaved: (project: ProjectDetail) => void;
  readonly onClose: () => void;
}

// English is the default language and holds the fields shared by every language (slug, stack,
// links, featured). Other languages only hold text, so they need an existing project to attach to.
export function ProjectEditor({ project, onSaved, onClose }: ProjectEditorProps) {
  const [activeTab, setActiveTab] = useState<EditorTab>('en');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="min-w-0 truncate text-xl font-semibold tracking-tight">
          {project ? project.title : 'Nouveau projet'}
        </h1>
        <Button variant="outline" size="sm" onClick={onClose} className="shrink-0">
          Retour
        </Button>
      </div>

      <div className="space-y-2">
        <div role="tablist" aria-label="Langue" className="grid grid-cols-2 gap-1 rounded-full border border-border p-1 sm:inline-grid sm:w-72">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              // A translation needs an existing project to attach to.
              disabled={tab.id !== 'en' && !project}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'h-10 rounded-full text-sm font-medium transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
                activeTab === tab.id
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground [@media(hover:hover)]:hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {!project && (
          <p className="text-sm text-muted-foreground">
            Enregistre d'abord le projet en anglais : l'onglet Français s'ouvre ensuite.
          </p>
        )}
      </div>

      {/* Both panes stay mounted so switching tabs never loses unsaved edits. */}
      <div role="tabpanel" id="panel-en" aria-labelledby="tab-en" hidden={activeTab !== 'en'}>
        <ProjectForm project={project} onSaved={onSaved} onCancel={onClose} />
      </div>
      {project && (
        <div role="tabpanel" id="panel-fr" aria-labelledby="tab-fr" hidden={activeTab !== 'fr'}>
          <ProjectTranslationForm project={project} language="fr" />
        </div>
      )}
    </div>
  );
}

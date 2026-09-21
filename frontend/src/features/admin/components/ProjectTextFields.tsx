import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { UseFormRegisterReturn } from 'react-hook-form';

interface ProjectTextFieldsProps {
  // Makes the input ids unique when several language forms are mounted at once (e.g. "en", "fr").
  readonly idPrefix: string;
  readonly fields: {
    readonly title: UseFormRegisterReturn;
    readonly summary: UseFormRegisterReturn;
    readonly content: UseFormRegisterReturn;
  };
  readonly errors: {
    readonly title?: string;
    readonly summary?: string;
    readonly content?: string;
  };
}

const ERROR_CLASS = 'text-sm text-red-700 dark:text-red-400';

// The text of a project (title, summary, markdown write-up), identical in every language.
// Both the English form and the translation forms render this component, so the two can never
// drift apart in field order, labels or sizes.
export function ProjectTextFields({ idPrefix, fields, errors }: ProjectTextFieldsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-title`}>Titre</Label>
        <Input id={`${idPrefix}-title`} {...fields.title} />
        {errors.title && <p className={ERROR_CLASS}>{errors.title}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-summary`}>Résumé</Label>
        <Textarea id={`${idPrefix}-summary`} className="min-h-24" {...fields.summary} />
        {errors.summary && <p className={ERROR_CLASS}>{errors.summary}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}-content`}>Contenu (markdown)</Label>
        <Textarea
          id={`${idPrefix}-content`}
          className="min-h-64 font-mono text-sm sm:text-xs"
          {...fields.content}
        />
        {errors.content && <p className={ERROR_CLASS}>{errors.content}</p>}
      </div>
    </>
  );
}

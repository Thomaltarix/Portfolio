import type { TFunction } from 'i18next';
import { z } from 'zod';

export function buildContactFormSchema(t: TFunction<'contact'>) {
  return z.object({
    name: z
      .string()
      .min(2, t('validation.nameMin'))
      .max(100, t('validation.nameMax')),
    email: z.email(t('validation.emailInvalid')),
    message: z
      .string()
      .min(10, t('validation.messageMin'))
      .max(2000, t('validation.messageMax')),
  });
}

export type ContactFormValues = z.infer<ReturnType<typeof buildContactFormSchema>>;

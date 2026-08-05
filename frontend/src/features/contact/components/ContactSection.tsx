import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FadeIn } from '@/components/motion/FadeIn';
import { SectionHeading } from '@/components/ui/section-heading';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSubmitContact } from '../hooks/use-submit-contact';
import { buildContactFormSchema, type ContactFormValues } from '../schema';

export function ContactSection() {
  const { t } = useTranslation('contact');
  const contactFormSchema = useMemo(() => buildContactFormSchema(t), [t]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({ resolver: zodResolver(contactFormSchema) });
  const submitContact = useSubmitContact();

  const onSubmit = (values: ContactFormValues) => {
    submitContact.mutate(values, { onSuccess: () => reset() });
  };

  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-24">
      <FadeIn>
        <SectionHeading>{t('heading')}</SectionHeading>
        <p className="mt-3 max-w-xl text-muted-foreground">{t('description')}</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-lg space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">{t('fields.name')}</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('fields.email')}</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('fields.message')}</Label>
            <Textarea id="message" {...register('message')} />
            {errors.message && <p className="text-sm text-red-400">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={submitContact.isPending}>
            {submitContact.isPending ? t('sending') : t('submit')}
          </Button>

          {submitContact.isSuccess && (
            <p className="text-sm text-muted-foreground">{t('success')}</p>
          )}
          {submitContact.isError && <p className="text-sm text-red-400">{t('error')}</p>}
        </form>
      </FadeIn>
    </section>
  );
}

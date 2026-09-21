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
import { Link } from 'react-router-dom';
import { useSubmitContact } from '../hooks/use-submit-contact';
import { CONTACT_LINKS } from '../contact-links';
import { buildContactFormSchema, type ContactFormValues } from '../schema';

// The summit: the copy sits on a dark scrim over the photo, so it uses fixed light
// colours in both themes; the form lives in a themed panel where inputs stay legible.
// inline-block + vertical padding gives the link a 44px-tall touch target without changing how it looks.
const LINK_CLASS =
  'inline-block py-3 underline decoration-white/40 hover:text-[#f0906a] hover:decoration-[#f0906a]';

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
    <section id="contact" className="relative isolate overflow-hidden">
      <img
        src="/images/fuji-reflection-1600.webp"
        srcSet="/images/fuji-reflection-1600.webp 1600w, /images/fuji-reflection-2560.webp 2560w"
        sizes="100vw"
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-[#0d1116]/75" />

      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:py-32 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-20">
        <FadeIn className="text-[#eceae4]">
          <SectionHeading>{t('heading')}</SectionHeading>
          <p className="mt-6 max-w-md text-lg text-[#d3d8df]">{t('description')}</p>

          <ul className="mt-6 flex flex-col font-mono text-sm md:mt-8">
            <li>
              <a href={`mailto:${CONTACT_LINKS.email}`} className={LINK_CLASS}>
                {CONTACT_LINKS.email}
              </a>
            </li>
            <li>
              <a href={CONTACT_LINKS.linkedinUrl} rel="noopener noreferrer" className={LINK_CLASS}>
                LinkedIn
              </a>
            </li>
            <li>
              <a href={CONTACT_LINKS.githubUrl} rel="noopener noreferrer" className={LINK_CLASS}>
                GitHub
              </a>
            </li>
          </ul>
        </FadeIn>

        <FadeIn delay={0.1}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-lg border border-border bg-background p-5 text-foreground sm:p-8"
          >
            <p className="text-sm text-muted-foreground">{t('allRequired')}</p>

            <div className="space-y-2">
              <Label htmlFor="name">{t('fields.name')}</Label>
              <Input id="name" autoComplete="name" aria-required="true" {...register('name')} />
              {errors.name && <p className="text-sm text-red-700 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t('fields.email')}</Label>
              <Input id="email" type="email" autoComplete="email" aria-required="true" {...register('email')} />
              {errors.email && <p className="text-sm text-red-700 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">{t('fields.message')}</Label>
              <Textarea id="message" aria-required="true" {...register('message')} />
              {errors.message && <p className="text-sm text-red-700 dark:text-red-400">{errors.message.message}</p>}
            </div>

            <p className="text-xs text-muted-foreground">
              {t('privacyNotice')}
              <Link to="/confidentialite" className="underline hover:text-foreground">
                {t('privacyLink')}
              </Link>
              .
            </p>

            <Button type="submit" disabled={submitContact.isPending}>
              {submitContact.isPending ? t('sending') : t('submit')}
            </Button>

            {submitContact.isSuccess && <p className="text-sm text-muted-foreground">{t('success')}</p>}
            {submitContact.isError && <p className="text-sm text-red-700 dark:text-red-400">{t('error')}</p>}
          </form>
        </FadeIn>
      </div>
    </section>
  );
}

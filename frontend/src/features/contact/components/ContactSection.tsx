import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FadeIn } from '@/components/motion/FadeIn';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSubmitContact } from '../hooks/use-submit-contact';
import { contactFormSchema, type ContactFormValues } from '../schema';

export function ContactSection() {
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
        <h2 className="text-2xl font-semibold tracking-tight">Contact</h2>
        <p className="mt-3 max-w-xl text-muted-foreground">
          Have a role, a project, or a question? Send a message and I'll get back to you.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 max-w-lg space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register('name')} />
            {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register('email')} />
            {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" {...register('message')} />
            {errors.message && <p className="text-sm text-red-400">{errors.message.message}</p>}
          </div>

          <Button type="submit" disabled={submitContact.isPending}>
            {submitContact.isPending ? 'Sending…' : 'Send message'}
          </Button>

          {submitContact.isSuccess && (
            <p className="text-sm text-muted-foreground">Thanks — your message was sent.</p>
          )}
          {submitContact.isError && (
            <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
          )}
        </form>
      </FadeIn>
    </section>
  );
}

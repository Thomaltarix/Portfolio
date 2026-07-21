import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/cn';
import { motion } from 'framer-motion';

export function HeroSection() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-6 py-28 sm:py-36">
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-sm font-medium text-accent"
      >
        Backend & Software Engineer
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl"
      >
        I build systems that stay reliable long after the demo ends.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="max-w-xl text-lg text-muted-foreground"
      >
        I design APIs, data models, and infrastructure with the same care most people reserve
        for user interfaces — clean, typed, and built to be maintained by someone else in five
        years.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="flex gap-3 pt-2"
      >
        <a href="#projects" className={cn(buttonVariants({ size: 'lg' }))}>
          View projects
        </a>
        <a href="#contact" className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}>
          Get in touch
        </a>
      </motion.div>
    </section>
  );
}

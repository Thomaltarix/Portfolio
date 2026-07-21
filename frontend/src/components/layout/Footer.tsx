export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-6 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()}. Built with React, NestJS, and Postgres.</p>
        <a href="#top" className="hover:text-foreground">
          Back to top
        </a>
      </div>
    </footer>
  );
}

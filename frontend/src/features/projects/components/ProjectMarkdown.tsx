import ReactMarkdown from 'react-markdown';

interface ProjectMarkdownProps {
  readonly content: string;
}

export function ProjectMarkdown({ content }: ProjectMarkdownProps) {
  return (
    <div
      className="max-w-none space-y-4 text-muted-foreground
        [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2
        [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-foreground
        [&_h3]:mt-6 [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-foreground
        [&_li]:ml-1 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-6"
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

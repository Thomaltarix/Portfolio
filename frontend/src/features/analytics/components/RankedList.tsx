import type { LabeledCount } from '../types';

interface RankedListProps {
  items: readonly LabeledCount[];
  emptyLabel?: string;
}

// A ranked bar-list rather than a pie/donut chart — magnitude by category
// only needs one hue (the design system's single accent), no categorical
// palette to introduce or validate (see claude/design-system.md).
export function RankedList({ items, emptyLabel = 'Aucune donnée' }: RankedListProps) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  const max = Math.max(...items.map((item) => item.count));

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3">
          <span
            className="w-36 shrink-0 truncate text-sm text-muted-foreground"
            title={item.label}
          >
            {item.label}
          </span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
            <span
              className="block h-full rounded-full bg-accent"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </span>
          <span className="w-10 shrink-0 text-right text-sm tabular-nums">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}

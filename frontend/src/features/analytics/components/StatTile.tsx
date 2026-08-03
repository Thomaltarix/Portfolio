import { Card } from '@/components/ui/card';

interface StatTileProps {
  label: string;
  value: string | number;
}

export function StatTile({ label, value }: StatTileProps) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">{value}</p>
    </Card>
  );
}

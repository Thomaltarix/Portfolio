import { Button } from '@/components/ui/button';
import { Card, CardTitle } from '@/components/ui/card';
import { RankedList } from '@/features/analytics/components/RankedList';
import { StatTile } from '@/features/analytics/components/StatTile';
import { TimeSeriesChart } from '@/features/analytics/components/TimeSeriesChart';
import { useAnalyticsStats } from '@/features/analytics/hooks/use-analytics-stats';
import { cn } from '@/lib/cn';
import { useState } from 'react';

const PERIODS = [7, 30] as const;

export function DashboardOverview() {
  const [days, setDays] = useState<(typeof PERIODS)[number]>(7);
  const { data, isLoading, isError } = useAnalyticsStats(days);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <div className="flex gap-1">
          {PERIODS.map((period) => (
            <Button
              key={period}
              size="sm"
              variant={period === days ? 'default' : 'outline'}
              onClick={() => setDays(period)}
            >
              {period} jours
            </Button>
          ))}
        </div>
      </div>

      {isError && (
        <p className="text-sm text-red-400">Impossible de charger les statistiques.</p>
      )}

      {!isError && (
        <>
          <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-2', isLoading && 'opacity-50')}>
            <StatTile label="Vues" value={data?.totalViews ?? '—'} />
            <StatTile label="Visiteurs uniques (approx.)" value={data?.uniqueVisitors ?? '—'} />
          </div>

          <Card className="p-5">
            <CardTitle className="mb-4">Trafic</CardTitle>
            <TimeSeriesChart data={data?.timeSeries ?? []} />
          </Card>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Card className="p-5">
              <CardTitle className="mb-4">Pages les plus vues</CardTitle>
              <RankedList items={data?.topPages ?? []} />
            </Card>
            <Card className="p-5">
              <CardTitle className="mb-4">Provenance</CardTitle>
              <RankedList items={data?.topReferrers ?? []} />
            </Card>
            <Card className="p-5">
              <CardTitle className="mb-4">Appareils</CardTitle>
              <RankedList items={data?.deviceBreakdown ?? []} />
            </Card>
            <Card className="p-5">
              <CardTitle className="mb-4">Pays</CardTitle>
              <RankedList items={data?.countryBreakdown ?? []} />
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

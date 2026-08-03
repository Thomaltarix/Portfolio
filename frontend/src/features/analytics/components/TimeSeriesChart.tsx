import { useMemo, useState } from 'react';
import type { MouseEvent } from 'react';
import type { DailyCount } from '../types';

interface TimeSeriesChartProps {
  data: readonly DailyCount[];
}

const WIDTH = 640;
const HEIGHT = 220;
const PADDING = { top: 16, right: 12, bottom: 28, left: 12 };

type Point = readonly [number, number];

export function TimeSeriesChart({ data }: TimeSeriesChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plot = useMemo(() => {
    const innerWidth = WIDTH - PADDING.left - PADDING.right;
    const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const maxValue = Math.max(1, ...data.map((d) => Math.max(d.views, d.uniqueVisitors)));
    const stepX = data.length > 1 ? innerWidth / (data.length - 1) : 0;

    const x = (index: number) => PADDING.left + index * stepX;
    const y = (value: number) => PADDING.top + innerHeight - (value / maxValue) * innerHeight;

    return {
      innerWidth,
      innerHeight,
      stepX,
      x,
      y,
      viewsPath: toPath(data.map((d, i): Point => [x(i), y(d.views)])),
      visitorsPath: toPath(data.map((d, i): Point => [x(i), y(d.uniqueVisitors)])),
    };
  }, [data]);

  if (data.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune donnée pour cette période.</p>;
  }

  const handleMove = (event: MouseEvent<SVGRectElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const relativeX = ((event.clientX - bounds.left) / bounds.width) * WIDTH - PADDING.left;
    const index = plot.stepX > 0 ? Math.round(relativeX / plot.stepX) : 0;
    setHoverIndex(Math.min(Math.max(index, 0), data.length - 1));
  };

  const hovered = hoverIndex !== null ? data[hoverIndex] : null;
  const hoverX = hoverIndex !== null ? plot.x(hoverIndex) : null;
  const axisIndices = [...new Set([0, Math.floor((data.length - 1) / 2), data.length - 1])];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-sm">
        <Legend swatchClassName="bg-accent" label="Vues" />
        <Legend swatchClassName="bg-muted-foreground" label="Visiteurs uniques" />
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          role="img"
          aria-label="Vues et visiteurs uniques par jour"
        >
          {[0, 0.5, 1].map((fraction) => (
            <line
              key={fraction}
              x1={PADDING.left}
              x2={WIDTH - PADDING.right}
              y1={PADDING.top + plot.innerHeight * (1 - fraction)}
              y2={PADDING.top + plot.innerHeight * (1 - fraction)}
              className="stroke-border"
              strokeWidth={1}
            />
          ))}

          <path
            d={plot.visitorsPath}
            fill="none"
            className="stroke-muted-foreground"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={plot.viewsPath}
            fill="none"
            className="stroke-accent"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {hoverX !== null && (
            <line
              x1={hoverX}
              x2={hoverX}
              y1={PADDING.top}
              y2={HEIGHT - PADDING.bottom}
              className="stroke-border"
              strokeWidth={1}
            />
          )}
          {hoverX !== null && hovered && (
            <>
              <circle cx={hoverX} cy={plot.y(hovered.views)} r={4} className="fill-accent" />
              <circle
                cx={hoverX}
                cy={plot.y(hovered.uniqueVisitors)}
                r={4}
                className="fill-muted-foreground"
              />
            </>
          )}

          {axisIndices.map((index) => (
            <text
              key={index}
              x={plot.x(index)}
              y={HEIGHT - 8}
              textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}
              className="fill-muted-foreground text-[10px]"
            >
              {formatShortDate(data[index].date)}
            </text>
          ))}

          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={plot.innerWidth}
            height={plot.innerHeight}
            fill="transparent"
            onMouseMove={handleMove}
            onMouseLeave={() => setHoverIndex(null)}
          />
        </svg>

        {hovered && hoverX !== null && (
          <div
            className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-md border border-border bg-surface px-3 py-2 text-xs shadow-sm"
            style={{ left: `${(hoverX / WIDTH) * 100}%` }}
          >
            <p className="font-medium">{formatShortDate(hovered.date)}</p>
            <p className="text-accent">Vues : {hovered.views}</p>
            <p className="text-muted-foreground">Visiteurs uniques : {hovered.uniqueVisitors}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function toPath(points: readonly Point[]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
}

function formatShortDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  });
}

function Legend({ swatchClassName, label }: { swatchClassName: string; label: string }) {
  return (
    <span className="flex items-center gap-2 text-muted-foreground">
      <span className={`h-2 w-2 rounded-full ${swatchClassName}`} />
      {label}
    </span>
  );
}

export interface DailyCount {
  readonly date: string;
  readonly views: number;
  readonly uniqueVisitors: number;
}

export interface LabeledCount {
  readonly label: string;
  readonly count: number;
}

export interface AnalyticsStats {
  readonly days: number;
  readonly totalViews: number;
  readonly uniqueVisitors: number;
  readonly timeSeries: readonly DailyCount[];
  readonly topPages: readonly LabeledCount[];
  readonly topReferrers: readonly LabeledCount[];
  readonly deviceBreakdown: readonly LabeledCount[];
  readonly countryBreakdown: readonly LabeledCount[];
}

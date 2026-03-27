import { supabase } from "../lib/supabaseClient";
import { DateRange } from "../lib/dateUtils";
import { MetricDataPoint } from "../types/metrics";

// Low-level metric fetching - avoid using directly in components if possible
// Prefer aggregated data from dashboard, platform, or campaign services

export const getMetricsByDateRange = async (workspaceId: string, dateRange: DateRange, campaignIds?: string[]): Promise<MetricDataPoint[]> => {
  const fromStr = dateRange.from.toISOString().split("T")[0];
  const toStr = dateRange.to.toISOString().split("T")[0];

  try {
    let query = supabase
      .from('metrics_daily')
      .select('campaign_id, date, spend, revenue, clicks, impressions, conversions')
      .eq('workspace_id', workspaceId)
      .gte('date', fromStr)
      .lte('date', toStr);

    if (campaignIds && campaignIds.length > 0) {
      query = query.in('campaign_id', campaignIds);
    }

    const { data, error } = await query;
    if (error) throw error;

    return (data || []).map(d => ({
      campaignId: d.campaign_id,
      date: new Date(d.date),
      spend: Number(d.spend ?? 0),
      revenue: Number(d.revenue ?? 0),
      clicks: Number(d.clicks ?? 0),
      impressions: Number(d.impressions ?? 0),
      conversions: Number(d.conversions ?? 0)
    }));
  } catch (err) {
    console.error('Error fetching raw metrics:', err);
    return [];
  }
};

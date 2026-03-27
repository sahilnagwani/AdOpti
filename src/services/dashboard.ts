import { supabase } from "../lib/supabaseClient";
import { DateRange } from '../lib/dateUtils';
import { KPIData, TrendPoint, CampaignRow, AIInsight } from '../types/dashboard';
import { safeROAS, safeCTR, safeCPA } from '../lib/formatters';

const formatDate = (date: Date) => date.toISOString().split('T')[0];

// Task 1.2: Explicit column selection
const kpiSelect = 'spend, revenue, conversions, clicks, impressions';
const trendSelect = 'date, spend, revenue, clicks, conversions, impressions';
const campaignSelect = `campaign_id, spend, revenue, conversions, clicks, impressions, campaigns (id, name, platform)`;

export async function getDashboardKPIs(
  workspaceId: string,
  dateRange: DateRange
): Promise<KPIData> {
  try {
    const { data, error } = await supabase
      .from('metrics_daily')
      .select(kpiSelect) // Use explicit columns
      .eq('workspace_id', workspaceId)
      .gte('date', formatDate(dateRange.from))
      .lte('date', formatDate(dateRange.to));

    if (error) throw error;

    const totals = (data || []).reduce(
      (acc, row) => {
        acc.totalSpend += Number(row.spend ?? 0);
        acc.totalRevenue += Number(row.revenue ?? 0);
        acc.totalConversions += Number(row.conversions ?? 0);
        acc.totalClicks += Number(row.clicks ?? 0);
        acc.totalImpressions += Number(row.impressions ?? 0);
        return acc;
      },
      {
        totalSpend: 0,
        totalRevenue: 0,
        totalConversions: 0,
        totalClicks: 0,
        totalImpressions: 0,
      }
    );

    return {
      ...totals,
      roas: safeROAS(totals.totalRevenue, totals.totalSpend),
      ctr: safeCTR(totals.totalClicks, totals.totalImpressions),
      cpa: safeCPA(totals.totalSpend, totals.totalConversions),
    };
  } catch (error) {
    console.error('[getDashboardKPIs] Error:', error);
    // Task 2.2: Return fallback on error
    return { totalSpend: 0, totalRevenue: 0, totalConversions: 0, totalClicks: 0, totalImpressions: 0, roas: 0, ctr: 0, cpa: 0 };
  }
}

export async function getSpendRevenueTrend(workspaceId: string, dateRange: DateRange): Promise<TrendPoint[]> {
  try {
    const { data, error } = await supabase
      .from('metrics_daily')
      .select(trendSelect) // Use explicit columns
      .eq('workspace_id', workspaceId)
      .gte('date', formatDate(dateRange.from))
      .lte('date', formatDate(dateRange.to));

    if (error) throw error;

    const aggregated = (data || []).reduce((acc: Record<string, TrendPoint>, row) => {
      const d = row.date;
      if (!acc[d]) {
        acc[d] = { date: d, spend: 0, revenue: 0, clicks: 0, conversions: 0 };
      }
      acc[d].spend += Number(row.spend ?? 0);
      acc[d].revenue += Number(row.revenue ?? 0);
      acc[d].clicks += Number(row.clicks ?? 0);
      acc[d].conversions += Number(row.conversions ?? 0);
      return acc;
    }, {});

    return Object.values(aggregated)
      .map(r => ({ // Task 1.4: Apply safe math guards
        ...r,
        roas: safeROAS(r.revenue!, r.spend!),
        ctr: safeCTR(r.clicks!, r.impressions!),
        cpa: safeCPA(r.spend!, r.conversions!)
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (error) {
    console.error('[getSpendRevenueTrend] Error:', error);
    // Task 2.2: Return fallback on error
    return [];
  }
}

// Reusing getSpendRevenueTrend data, but could fetch specific fields if needed
export async function getClicksConversionsTrend(workspaceId: string, dateRange: DateRange): Promise<TrendPoint[]> {
  try {
    const trendData = await getSpendRevenueTrend(workspaceId, dateRange);
    // We already have clicks and conversions in the TrendPoint, so no need for new fetch
    return trendData;
  } catch (error) {
    console.error('[getClicksConversionsTrend] Error:', error);
    // Task 2.2: Return fallback on error
    return [];
  }
}

export async function getTopCampaigns(workspaceId: string, dateRange: DateRange, limit = 5): Promise<CampaignRow[]> {
  try {
    const { data, error } = await supabase
      .from('metrics_daily')
      .select(campaignSelect) // Use explicit columns
      .eq('workspace_id', workspaceId)
      .gte('date', formatDate(dateRange.from))
      .lte('date', formatDate(dateRange.to));

    if (error) throw error;

    // Ensure campaigns are fetched and not null
    const validData = data?.filter(row => row.campaigns && row.campaign_id) || [];

    const campaignStats: Record<string, Partial<CampaignRow> & { id: string; name: string; platform: string; }> = {};

    validData.forEach((row) => {
      const cid = row.campaign_id as string;
      const campaignInfo = Array.isArray(row.campaigns) ? row.campaigns[0] : row.campaigns;

      if (!campaignStats[cid]) {
        campaignStats[cid] = {
          id: cid,
          name: campaignInfo?.name || 'Unknown Campaign',
          platform: campaignInfo?.platform || 'Unknown Platform',
          spend: 0, revenue: 0, conversions: 0, clicks: 0, impressions: 0,
        };
      }
      campaignStats[cid].spend! += Number(row.spend ?? 0);
      campaignStats[cid].revenue! += Number(row.revenue ?? 0);
      campaignStats[cid].conversions! += Number(row.conversions ?? 0);
      campaignStats[cid].clicks! += Number(row.clicks ?? 0);
      campaignStats[cid].impressions! += Number(row.impressions || 0);
    });

    const results = Object.values(campaignStats).map(c => ({
      ...c,
      roas: safeROAS(c.revenue!, c.spend!),
      ctr: safeCTR(c.clicks!, c.impressions!),
      cpa: safeCPA(c.spend!, c.conversions!),
    })) as CampaignRow[];

    // Sort by ROAS descending, then slice
    return results.sort((a, b) => b.roas - a.roas).slice(0, limit);
  } catch (error) {
    console.error('[getTopCampaigns] Error:', error);
    // Task 2.2: Return fallback on error
    return [];
  }
}

type CampaignMetricData = {
  spend: number;
  revenue: number;
  conversions: number;
  clicks: number;
  impressions: number;
  campaigns: {
    id: string;
    name: string;
    platform: string;
  } | null;
};

type OpportunityData = {
  title: string;
  estimated_value: number;
  type: string;
};

// Task 1.3: Use Promise.allSettled for AI insights
export async function getAIInsights(workspaceId: string, dateRange: DateRange): Promise<AIInsight | null> {
  try {
    // Fetching multiple independent data points for AI insights
    const results = await Promise.allSettled([
      // Task 1.2: Explicit column selection
      supabase.from('metrics_daily')
        .select('spend, revenue, conversions, clicks, impressions, campaigns(id, name, platform)')
        .eq('workspace_id', workspaceId)
        .gte('date', formatDate(dateRange.from))
        .lte('date', formatDate(dateRange.to))
        .order('revenue', { foreignTable: 'campaigns', ascending: false })
        .limit(1), // Get best campaign data

      supabase.from('metrics_daily')
        .select('spend, revenue, conversions, clicks, impressions, campaigns(id, name, platform)')
        .eq('workspace_id', workspaceId)
        .gte('date', formatDate(dateRange.from))
        .lte('date', formatDate(dateRange.to))
        .order('revenue', { foreignTable: 'campaigns', ascending: true })
        .limit(1), // Get worst campaign data

      // Task 1.2: Explicit column selection
      supabase.from('opportunities')
        .select('title, estimated_value, type')
        .eq('workspace_id', workspaceId)
        .eq('status', 'open')
        .order('estimated_value', { ascending: false })
        .limit(1)
        .single()
    ]);

    let bestCampaignData: CampaignMetricData | null = null;
    let worstCampaignData: CampaignMetricData | null = null;
    let topOpportunityData: OpportunityData | null = null;

    // Process results from Promise.allSettled
    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        if (index === 0 && result.value?.data?.length > 0) {
          bestCampaignData = result.value.data[0] as CampaignMetricData;
        } else if (index === 1 && result.value?.data?.length > 0) {
          worstCampaignData = result.value.data[0] as CampaignMetricData;
        } else if (index === 2 && result.value?.data) {
          topOpportunityData = result.value.data as OpportunityData;
        }
      } else {
        // Log errors from failed promises
        console.error(`[getAIInsights] Fetch failed: ${result.reason}`);
      }
    });

    // Guard against no data
    if (!bestCampaignData && !worstCampaignData && !topOpportunityData) {
      return null;
    }

    // Construct AIInsight object, ensuring all properties are present or undefined
    const insight: AIInsight = {
      // Task 1.4: Use safe guards for calculations
      best: bestCampaignData ? {
        name: bestCampaignData.campaigns?.name || 'Unknown',
        roas: safeROAS(Number(bestCampaignData.revenue || 0), Number(bestCampaignData.spend || 0)),
        platform: bestCampaignData.campaigns?.platform || 'Unknown',
      } : undefined,
      worst: worstCampaignData ? {
        name: worstCampaignData.campaigns?.name || 'Unknown',
        roas: safeROAS(Number(worstCampaignData.revenue || 0), Number(worstCampaignData.spend || 0)),
        platform: worstCampaignData.campaigns?.platform || 'Unknown',
      } : undefined,
      topOpportunity: topOpportunityData ? {
        title: topOpportunityData.title,
        estimatedValue: Number(topOpportunityData.estimated_value || 0),
        type: topOpportunityData.type,
      } : undefined,
    };

    // Return null if no meaningful insights could be generated
    if (!insight.best && !insight.worst && !insight.topOpportunity) {
      return null;
    }

    return insight;

  } catch (error) {
    console.error('[getAIInsights] Error:', error);
    // Task 2.2: Return fallback on error
    return null;
  }
}

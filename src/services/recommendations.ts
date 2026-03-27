import { supabase } from "../lib/supabaseClient";
import { DateRange } from "../lib/dateUtils";
import { calcConfidence } from "../lib/formatters";

type CampaignMetricRow = {
  campaign_id: string;
  spend?: number;
  revenue?: number;
  conversions?: number;
  clicks?: number;
  impressions?: number;
  campaigns?: { id: string; name?: string; platform?: string };
};

type AggregatedCampaignMetric = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  conversions: number;
  clicks: number;
  impressions: number;
  roas: number;
  cpa: number;
  ctr: number;
  days: number;
};

export interface Recommendation {
  id: string;
  type: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'applied' | 'dismissed';
  title: string;
  description: string;
  suggestedAction: string;
  campaign: { id: string; name: string; platform: string };
  metrics: { currentROAS: number; currentCPA: number; currentCTR: number; currentSpend: number; currentConversions: number };
  expectedImpact: { metric: string; direction: 'increase' | 'decrease'; estimatedPctChange: number };
  confidenceScore: number;
  confidenceBasis: string;
  detectedAt: string;
}

const getCampaignMetrics = async (workspaceId: string, dateRange: DateRange) => {
  const { data, error } = await supabase
    .from('metrics_daily')
    .select('campaign_id, spend, revenue, conversions, clicks, impressions, campaigns(id, name, platform)')
    .eq('workspace_id', workspaceId)
    .gte('date', dateRange.from.toISOString().split('T')[0])
    .lte('date', dateRange.to.toISOString().split('T')[0]);

  if (error) throw error;

  const grouped = (data || []).reduce((acc: Record<string, AggregatedCampaignMetric>, row: CampaignMetricRow) => {
    const cid = String(row.campaign_id);
    if (!acc[cid]) {
      acc[cid] = {
        id: cid,
        name: row.campaigns?.name || 'Unknown',
        platform: row.campaigns?.platform || 'Unknown',
        spend: 0,
        revenue: 0,
        conversions: 0,
        clicks: 0,
        impressions: 0,
        roas: 0,
        cpa: 0,
        ctr: 0,
        days: 0
      };
    }

    acc[cid].spend += Number(row.spend ?? 0);
    acc[cid].revenue += Number(row.revenue ?? 0);
    acc[cid].conversions += Number(row.conversions ?? 0);
    acc[cid].clicks += Number(row.clicks ?? 0);
    acc[cid].impressions += Number(row.impressions ?? 0);
    return acc;
  }, {});

  return (Object.values(grouped) as AggregatedCampaignMetric[]).map((c) => ({
    ...c,
    roas: c.spend > 0 ? c.revenue / c.spend : 0,
    cpa: c.conversions > 0 ? c.spend / c.conversions : 0,
    ctr: c.impressions > 0 ? (c.clicks / c.impressions) * 100 : 0,
    days: Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))
  }));
};

export const getRecommendations = async (workspaceId: string, dateRange: DateRange): Promise<Recommendation[]> => {
  if (!workspaceId) {
    throw new Error('workspaceId is required for recommendations');
  }

  if (!dateRange?.from || !dateRange?.to) {
    throw new Error('dateRange is required for recommendations');
  }

  const campaigns = await getCampaignMetrics(workspaceId, dateRange);
  const recommendations: Recommendation[] = [];

  for (const camp of campaigns) {
    const { id, name, platform, spend, revenue, conversions, clicks, impressions, roas, cpa, ctr, days } = camp;

    // Rule 1: scale_budget
    if (roas >= 3.0 && spend > 50000 && days >= 7) {
      recommendations.push({
        id: `scale_budget-${id}`,
        type: 'scale_budget',
        priority: 'high',
        status: 'active',
        title: `Scale ${name} Budget`,
        description: `${name} on ${platform} is generating ${roas.toFixed(2)}x ROAS with ₹${spend.toFixed(0)} spend. This campaign is performing exceptionally well.`,
        suggestedAction: 'Increase daily budget by 50% and monitor performance closely.',
        campaign: { id, name, platform },
        metrics: { currentROAS: roas, currentCPA: cpa, currentCTR: ctr, currentSpend: spend, currentConversions: conversions },
        expectedImpact: { metric: 'Revenue', direction: 'increase', estimatedPctChange: 40 },
        confidenceScore: calcConfidence(days, conversions, spend),
        confidenceBasis: `Based on ${days} days of data with ${conversions} conversions`,
        detectedAt: new Date().toISOString()
      });
    }

    // Rule 2: reduce_spend
    const budgetPriority: Recommendation['priority'] = roas < 1 ? 'critical' : roas < 1.5 ? 'high' : roas < 2 ? 'medium' : 'low';
    if (roas < 2.0 && spend > 20000 && roas > 0) {
      recommendations.push({
        id: `reduce_spend-${id}`,
        type: 'reduce_spend',
        priority: budgetPriority,
        status: 'active',
        title: `Reduce ${name} Spend`,
        description: `${name} on ${platform} is generating ${roas.toFixed(2)}x ROAS with ₹${spend.toFixed(0)} spend, below the acceptable threshold.`,
        suggestedAction: budgetPriority === 'critical' ? 'Pause campaign immediately and review targeting.' : 'Reduce budget by 30% and optimize creatives.',
        campaign: { id, name, platform },
        metrics: { currentROAS: roas, currentCPA: cpa, currentCTR: ctr, currentSpend: spend, currentConversions: conversions },
        expectedImpact: { metric: 'Loss', direction: 'decrease', estimatedPctChange: 25 },
        confidenceScore: calcConfidence(days, conversions, spend),
        confidenceBasis: `Based on ${days} days of data with ${conversions} conversions`,
        detectedAt: new Date().toISOString()
      });
    }

    // Rule 3: optimize_targeting
    if (cpa > 500 && conversions > 0 && spend > 10000) {
      recommendations.push({
        id: `optimize_targeting-${id}`,
        type: 'optimize_targeting',
        priority: 'high',
        status: 'active',
        title: `Optimize ${name} Targeting`,
        description: `${name} on ${platform} has a CPA of ₹${cpa.toFixed(0)} with ${conversions} conversions, indicating inefficient targeting.`,
        suggestedAction: 'Review audience segments, add negative keywords, and test new ad sets.',
        campaign: { id, name, platform },
        metrics: { currentROAS: roas, currentCPA: cpa, currentCTR: ctr, currentSpend: spend, currentConversions: conversions },
        expectedImpact: { metric: 'CPA', direction: 'decrease', estimatedPctChange: 30 },
        confidenceScore: calcConfidence(days, conversions, spend),
        confidenceBasis: `Based on ${days} days of data with ${conversions} conversions`,
        detectedAt: new Date().toISOString()
      });
    }

    // Rule 4: improve_creative
    if (ctr > 3 && ctr > 0 && conversions / clicks < 0.02 && clicks > 100) {
      recommendations.push({
        id: `improve_creative-${id}`,
        type: 'improve_creative',
        priority: 'medium',
        status: 'active',
        title: `Improve ${name} Creatives`,
        description: `${name} on ${platform} has ${ctr.toFixed(2)}% CTR but only ${(conversions / clicks * 100).toFixed(2)}% conversion rate, suggesting creative issues.`,
        suggestedAction: 'Test new ad copy, images, and call-to-action buttons.',
        campaign: { id, name, platform },
        metrics: { currentROAS: roas, currentCPA: cpa, currentCTR: ctr, currentSpend: spend, currentConversions: conversions },
        expectedImpact: { metric: 'Conversions', direction: 'increase', estimatedPctChange: 25 },
        confidenceScore: calcConfidence(days, conversions, spend),
        confidenceBasis: `Based on ${days} days of data with ${conversions} conversions`,
        detectedAt: new Date().toISOString()
      });
    }

    // Rule 5: pause_campaign
    if (conversions === 0 && spend > 30000 && days >= 7) {
      recommendations.push({
        id: `pause_campaign-${id}`,
        type: 'pause_campaign',
        priority: 'critical',
        status: 'active',
        title: `Pause ${name} Campaign`,
        description: `${name} on ${platform} has spent ₹${spend.toFixed(0)} over ${days} days with 0 conversions, indicating fundamental issues.`,
        suggestedAction: 'Pause campaign immediately and conduct a full audit of setup and targeting.',
        campaign: { id, name, platform },
        metrics: { currentROAS: roas, currentCPA: cpa, currentCTR: ctr, currentSpend: spend, currentConversions: conversions },
        expectedImpact: { metric: 'Loss', direction: 'decrease', estimatedPctChange: 100 },
        confidenceScore: calcConfidence(days, conversions, spend),
        confidenceBasis: `Based on ${days} days of data with ${conversions} conversions`,
        detectedAt: new Date().toISOString()
      });
    }
  }

  // Rule 6: reallocate_budget (portfolio-level)
  const highPerformers = campaigns.filter(c => c.roas >= 3);
  const lowPerformers = campaigns.filter(c => c.roas < 1.5 && c.roas > 0);
  if (highPerformers.length >= 1 && lowPerformers.length >= 1) {
    recommendations.push({
      id: `reallocate_budget-${Date.now()}`,
      type: 'reallocate_budget',
      priority: 'high',
      status: 'active',
      title: 'Reallocate Budget Across Portfolio',
      description: `Your portfolio has ${highPerformers.length} high-ROAS campaigns and ${lowPerformers.length} underperforming ones. Reallocating budget could improve overall performance.`,
      suggestedAction: 'Move 20% of budget from underperforming campaigns to top performers.',
      campaign: { id: '', name: 'Portfolio', platform: 'All' },
      metrics: { currentROAS: 0, currentCPA: 0, currentCTR: 0, currentSpend: 0, currentConversions: 0 },
      expectedImpact: { metric: 'Revenue', direction: 'increase', estimatedPctChange: 15 },
      confidenceScore: 80,
      confidenceBasis: 'Based on portfolio analysis',
      detectedAt: new Date().toISOString()
    });
  }

  return recommendations;
};
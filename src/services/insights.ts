import { supabase } from "../lib/supabaseClient";
import { Insight, InsightsSummary } from "../types/insights";
import { DateRange } from "../types/shared";
import { calcROAS, calcCPA } from "../lib/formatters";
import { calcConfidence } from "../lib/formatters";

// Type Definitions
type MetricRow = {
  campaign_id: string;
  date: string;
  spend: number;
  revenue: number;
  conversions: number;
  clicks: number;
  campaigns: {
    id: string;
    name: string;
    platform: string;
    status: string;
  } | null;
};

type CampaignPerformanceData = {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  conversions: number;
  days: number;
  avgRoas: number;
  dailyRoas: { date: string; roas: number }[];
};

const getPriorDateRange = (dateRange: DateRange): DateRange => {
  const diffInTime = dateRange.to.getTime() - dateRange.from.getTime();
  const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
  const priorTo = new Date(dateRange.from);
  priorTo.setDate(priorTo.getDate() - 1);
  const priorFrom = new Date(priorTo);
  priorFrom.setDate(priorFrom.getDate() - diffInDays);
  return { from: priorFrom, to: priorTo };
};

const processCampaignMetrics = (data: MetricRow[]): CampaignPerformanceData[] => {
  const grouped = data.reduce((acc: Record<string, any>, row) => {
    if (!row.campaigns) return acc;
    const cid = row.campaign_id;
    if (!acc[cid]) {
      acc[cid] = { ...row.campaigns, spend: 0, revenue: 0, conversions: 0, days: 0, dailyRoas: [] };
    }
    const r = Number(row.revenue ?? 0);
    const s = Number(row.spend ?? 0);
    acc[cid].spend += s;
    acc[cid].revenue += r;
    acc[cid].conversions += Number(row.conversions ?? 0);
    acc[cid].days += 1;
    acc[cid].dailyRoas.push({ date: row.date, roas: calcROAS(r, s) });
    return acc;
  }, {});

  return Object.values(grouped).map((c: any) => ({
    ...c,
    avgRoas: calcROAS(c.revenue, c.spend),
  }));
};

export const getBestCampaign = async (workspaceId: string, dateRange: DateRange): Promise<Insight | null> => {
  const { data, error } = await supabase
    .from("metrics_daily")
    .select("campaign_id, date, spend, revenue, campaigns!inner(id, name, platform)")
    .eq("workspace_id", workspaceId)
    .gte("date", dateRange.from.toISOString().split("T")[0])
    .lte("date", dateRange.to.toISOString().split("T")[0]);

  if (error || !data) return null;

  const campaigns = processCampaignMetrics(data as MetricRow[]);
  const sorted = campaigns.sort((a, b) => b.avgRoas - a.avgRoas);

  if (!sorted.length || sorted[0].avgRoas === 0) return null;
  const best = sorted[0];

  const sortedDaily = best.dailyRoas.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return {
    id: `best-${best.id}`,
    category: "performance",
    severity: "positive",
    title: "Top Performing Campaign",
    description: `${best.name} on ${best.platform} is generating ${best.avgRoas.toFixed(2)}x ROAS over the last ${best.days} days, significantly above the 3x healthy threshold.`,
    metric: { label: "Avg ROAS", value: `${best.avgRoas.toFixed(2)}x`, raw: best.avgRoas },
    campaign: { id: best.id, name: best.name, platform: best.platform },
    recommendation: "Consider increasing budget allocation to this campaign by 20%.",
    confidenceScore: calcConfidence(best.days, best.conversions, best.spend),
    detectedAt: new Date().toISOString(),
    sparkline: sortedDaily.map(d => d.roas)
  };
};

export const getWorstCampaign = async (workspaceId: string, dateRange: DateRange): Promise<Insight | null> => {
    const { data, error } = await supabase
        .from("metrics_daily")
        .select("campaign_id, date, spend, revenue, campaigns!inner(id, name, platform)")
        .eq("workspace_id", workspaceId)
        .gte("date", dateRange.from.toISOString().split("T")[0])
        .lte("date", dateRange.to.toISOString().split("T")[0]);

    if (error || !data) return null;

    const campaigns = processCampaignMetrics(data as MetricRow[]);
    const sorted = campaigns
        .filter(c => c.days >= 3 && c.spend >= 1000)
        .sort((a, b) => a.avgRoas - b.avgRoas);

    if (!sorted.length || sorted[0].avgRoas >= 2) return null;
    const worst = sorted[0];

    const sortedDaily = worst.dailyRoas.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return {
        id: `worst-${worst.id}`,
        category: "performance",
        severity: worst.avgRoas < 1 ? "critical" : "warning",
        title: "Lowest Performing Campaign",
        description: `${worst.name} on ${worst.platform} is generating ${worst.avgRoas.toFixed(2)}x ROAS over the last ${worst.days} days, below the 1x break-even threshold.`,
        metric: { label: "Avg ROAS", value: `${worst.avgRoas.toFixed(2)}x`, raw: worst.avgRoas },
        campaign: { id: worst.id, name: worst.name, platform: worst.platform },
        recommendation: "Pause this campaign and audit targeting settings.",
        confidenceScore: calcConfidence(worst.days, worst.conversions, worst.spend),
        detectedAt: new Date().toISOString(),
        sparkline: sortedDaily.map(d => d.roas)
    };
};

export const getHighestConversionsCampaign = async (workspaceId: string, dateRange: DateRange): Promise<Insight | null> => {
    const { data, error } = await supabase
      .from("metrics_daily")
      .select("campaign_id, date, conversions, campaigns!inner(id, name, platform)")
      .eq("workspace_id", workspaceId)
      .gte("date", dateRange.from.toISOString().split("T")[0])
      .lte("date", dateRange.to.toISOString().split("T")[0]);
  
    if (error || !data) return null;
  
    const campaigns = processCampaignMetrics(data as MetricRow[]);
    const sorted = campaigns.sort((a, b) => b.conversions - a.conversions);
  
    if (!sorted.length || sorted[0].conversions === 0) return null;
    const bestConv = sorted[0];
  
    return {
      id: `conv-${bestConv.id}`,
      category: "performance",
      severity: "positive",
      title: "Volume Leader",
      description: `${bestConv.name} on ${bestConv.platform} generated ${bestConv.conversions} conversions over the last ${bestConv.days} days, leading all campaigns.`,
      metric: { label: "Conversions", value: bestConv.conversions.toString(), raw: bestConv.conversions },
      campaign: { id: bestConv.id, name: bestConv.name, platform: bestConv.platform },
      recommendation: "Ensure this campaign has adequate budget avoiding early capping.",
      confidenceScore: calcConfidence(bestConv.days, bestConv.conversions, bestConv.spend),
      detectedAt: new Date().toISOString()
    };
  };

export const getTrendInsights = async (workspaceId: string, dateRange: DateRange): Promise<Insight[]> => {
  const priorRange = getPriorDateRange(dateRange);
  
  type TrendMetric = { spend: number; revenue: number; conversions: number };

  const fetchMetrics = async (range: DateRange): Promise<TrendMetric> => {
    const { data, error } = await supabase.from("metrics_daily")
      .select("spend, revenue, conversions")
      .eq("workspace_id", workspaceId)
      .gte("date", range.from.toISOString().split("T")[0])
      .lte("date", range.to.toISOString().split("T")[0]);
    
    if (error || !data) throw new Error(error?.message || "Failed to fetch trend data");
    
    return data.reduce((acc, row) => ({
      s: acc.s + Number(row.spend ?? 0),
      r: acc.r + Number(row.revenue ?? 0),
      c: acc.c + Number(row.conversions ?? 0),
    }), { s: 0, r: 0, c: 0 });
  }

  try {
    const [c, p] = await Promise.all([fetchMetrics(dateRange), fetchMetrics(priorRange)]);
    
    const cRoas = calcROAS(c.r, c.s), pRoas = calcROAS(p.r, p.s);
    const cCpa = calcCPA(c.s, c.c), pCpa = calcCPA(p.s, p.c);
    
    const pct = (a: number, b: number) => b > 0 ? ((a - b) / b) * 100 : 0;
    
    const roasPct = pct(cRoas, pRoas);
    const cpaPct = pct(cCpa, pCpa);
    const insights: Insight[] = [];

    if (Math.abs(roasPct) >= 10 && pRoas > 0) {
        insights.push({
          id: `trend-roas`, category: "trend", severity: roasPct > 0 ? "positive" : "warning",
          title: "ROAS Trend", description: `Overall ROAS is ${roasPct > 0 ? "up" : "down"} by ${Math.abs(roasPct).toFixed(1)}% vs previous period.`,
          metric: { label: "ROAS Change", value: `${roasPct > 0 ? "↑" : "↓"} ${Math.abs(roasPct).toFixed(1)}%`, raw: roasPct },
          recommendation: roasPct > 0 ? "Scale successful creatives cautiously." : "Investigate platform-level decay.",
          confidenceScore: 85, detectedAt: new Date().toISOString()
        });
      }
    
      if (Math.abs(cpaPct) >= 15 && pCpa > 0) {
        insights.push({
          id: `trend-cpa`, category: "trend", severity: cpaPct < 0 ? "positive" : cpaPct > 30 ? "critical" : "warning",
          title: "CPA Trend", description: `Overall CPA is ${cpaPct > 0 ? "up" : "down"} by ${Math.abs(cpaPct).toFixed(1)}% vs previous period.`,
          metric: { label: "CPA Change", value: `${cpaPct > 0 ? "↑" : "↓"} ${Math.abs(cpaPct).toFixed(1)}%`, raw: cpaPct },
          recommendation: cpaPct > 0 ? "Review search terms and exclusions." : "Maintain current trajectory.",
          confidenceScore: 85, detectedAt: new Date().toISOString()
        });
      }

    return insights;
  } catch (error) {
    console.error("Error in getTrendInsights:", error);
    return [];
  }
};

export const getAnomalyInsights = async (workspaceId: string, dateRange: DateRange): Promise<Insight[]> => {
    const toDate = new Date();
    const from7d = new Date(); from7d.setDate(toDate.getDate() - 7);

    const { data, error } = await supabase
        .from("metrics_daily")
        .select("campaign_id, date, spend, conversions, clicks, revenue, campaigns!inner(id, name, platform, status)")
        .eq("workspace_id", workspaceId)
        .gte("date", from7d.toISOString().split("T")[0]);

    if (error || !data) return [];

    type AnomalyCampaign = {
        id: string;
        name: string;
        platform: string;
        status: string;
        daily: MetricRow[];
    };

    const grouped = (data as MetricRow[]).reduce((acc: Record<string, AnomalyCampaign>, row) => {
        if (!row.campaigns) return acc;
        const cid = row.campaign_id;
        if (!acc[cid]) acc[cid] = { ...row.campaigns, daily: [] };
        acc[cid].daily.push(row);
        return acc;
    }, {});

    const anomalies: Insight[] = [];

    Object.values(grouped).forEach((camp) => {
        if (camp.status === "active") {
            const totSpend = camp.daily.reduce((sum, r) => sum + Number(r.spend ?? 0), 0);
            const totClicks = camp.daily.reduce((sum, r) => sum + Number(r.clicks ?? 0), 0);
            if (totSpend > 0 && totClicks === 0) {
                anomalies.push({
                    id: `anomaly-zero-${camp.id}`, category: "anomaly", severity: "warning",
                    title: "Zero-Click Campaign", description: `${camp.name} on ${camp.platform} had ₹${totSpend.toFixed(0)} spend but 0 clicks in the last 7 days.`,
                    metric: { label: "Clicks", value: "0", raw: 0 },
                    campaign: { id: camp.id, name: camp.name, platform: camp.platform },
                    recommendation: "Check ad creatives and bidding strategy for this campaign.",
                    confidenceScore: 90, detectedAt: new Date().toISOString()
                });
            }
        }
    });

    return anomalies;
};

export const getAllInsights = async (workspaceId: string, dateRange: DateRange): Promise<{ insights: Insight[]; summary: InsightsSummary }> => {
    const results = await Promise.allSettled([
        getBestCampaign(workspaceId, dateRange),
        getWorstCampaign(workspaceId, dateRange),
        getHighestConversionsCampaign(workspaceId, dateRange),
        getTrendInsights(workspaceId, dateRange),
        getAnomalyInsights(workspaceId, dateRange)
    ]);

    let insights: Insight[] = [];
    results.forEach(res => {
        if (res.status === "fulfilled" && res.value) {
            if (Array.isArray(res.value)) insights.push(...res.value);
            else insights.push(res.value as Insight);
        }
    });

    insights = Array.from(new Map(insights.map(item => [item.id, item])).values());
    const categoryOrder: Record<string, number> = { "performance": 0, "trend": 1, "anomaly": 2 };
    const severityOrder: Record<string, number> = { "critical": 0, "warning": 1, "positive": 2, "neutral": 3 };
    insights.sort((a, b) => {
        const catDiff = categoryOrder[a.category] - categoryOrder[b.category];
        if (catDiff !== 0) return catDiff;
        return severityOrder[a.severity] - severityOrder[b.severity];
    });

    const summary: InsightsSummary = {
        totalInsights: insights.length,
        criticalCount: insights.filter(i => i.severity === "critical").length,
        warningCount: insights.filter(i => i.severity === "warning").length,
        positiveCount: insights.filter(i => i.severity === "positive").length,
        generatedAt: new Date().toISOString()
    };

    return { insights, summary };
};

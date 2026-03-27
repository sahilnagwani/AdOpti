import { supabase } from "../lib/supabaseClient";
import { DateRange } from "../lib/dateUtils";
import { PlatformKPIs } from "../types/platform";
import { TrendPoint, CampaignRow } from "../types/shared";
import { safeROAS, safeCTR, safeCPA } from "../lib/formatters";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

// Task 1.2: Explicit column selection for platform queries
const platformKPISelect = "spend, revenue, conversions, clicks, impressions, campaigns(platform)";
const platformTrendSelect = "date, spend, revenue, clicks, impressions, conversions, campaigns(platform)";
const platformCampaignSelect = "campaign_id, spend, revenue, clicks, impressions, conversions, campaigns(id, name, status, platform)";

type PlatformTrendRow = {
  date: string;
  spend: number | null;
  revenue: number | null;
  clicks: number | null;
  impressions: number | null;
  conversions: number | null;
  campaigns: { platform: string } | null;
};

type PlatformCampaignRow = {
  campaign_id: string;
  spend: number | null;
  revenue: number | null;
  clicks: number | null;
  impressions: number | null;
  conversions: number | null;
  campaigns: { id: string; name: string; status: string; platform: string } | null;
};

export const getPlatformKPIs = async (
  workspaceId: string,
  platform: string,
  dateRange: DateRange,
  campaignId?: string
): Promise<PlatformKPIs> => {
  const fromStr = formatDate(dateRange.from);
  const toStr = formatDate(dateRange.to);

  try {
    // Task 1.3: Use Promise.all for parallel fetches
    const [
      { data: metricsData, error: metricsError },
      { data: integrationData, error: integrationError } // Renamed for clarity
    ] = await Promise.all([
      supabase
        .from("metrics_daily")
        .select(platformKPISelect) // Explicit columns
        .eq("workspace_id", workspaceId)
        .eq("campaigns.platform", platform)
        .gte("date", fromStr)
        .lte("date", toStr),
      supabase
        .from("integrations")
        .select("status, last_synced_at")
        .eq("workspace_id", workspaceId)
        .eq("platform", platform)
        .limit(1)
        .single(),
    ]);

    if (metricsError) throw metricsError;
    // Handle not found integration gracefully, but throw other errors
    if (integrationError && integrationError.code !== 'PGRST116') throw integrationError;

    // Task 1.4: Safe math guards
    const totals = (metricsData || []).reduce((acc, row) => {
        acc.totalSpend += Number(row.spend ?? 0);
        acc.totalRevenue += Number(row.revenue ?? 0);
        acc.totalClicks += Number(row.clicks ?? 0);
        acc.totalImpressions += Number(row.impressions ?? 0);
        acc.totalConversions += Number(row.conversions ?? 0);
        return acc;
    }, { totalSpend: 0, totalRevenue: 0, totalClicks: 0, totalImpressions: 0, totalConversions: 0 });

    return {
      ...totals,
      roas: safeROAS(totals.totalRevenue, totals.totalSpend),
      ctr: safeCTR(totals.totalClicks, totals.totalImpressions),
      cpa: safeCPA(totals.totalSpend, totals.totalConversions),
      // Use integration data, default to 'not_connected' if not found or error
      integrationStatus: integrationData?.status || (integrationError ? "error" : "not_connected"), 
      lastSyncedAt: integrationData?.last_synced_at ? new Date(integrationData.last_synced_at) : null,
    };
  } catch (err) {
    console.error("[getPlatformKPIs] Error:", err);
    // Task 2.2: Return fallback on error
    return {
      totalSpend: 0, totalRevenue: 0, totalClicks: 0, totalImpressions: 0, totalConversions: 0,
      roas: 0, ctr: 0, cpa: 0, integrationStatus: "error", lastSyncedAt: null,
    };
  }
};

export const getPlatformTrends = async (
  workspaceId: string,
  platform: string,
  dateRange: DateRange,
  campaignId?: string
): Promise<TrendPoint[]> => {
  const fromStr = formatDate(dateRange.from);
  const toStr = formatDate(dateRange.to);

  try {
    let query = supabase
      .from("metrics_daily")
      .select(platformTrendSelect) // Explicit columns
      .eq("workspace_id", workspaceId)
      .eq("campaigns.platform", platform)
      .gte("date", fromStr)
      .lte("date", toStr);

    if (campaignId) {
      query = query.eq('campaign_id', campaignId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const grouped = (data || []).reduce((acc: Record<string, Omit<TrendPoint, 'roas' | 'ctr' | 'cpa'>>, row: PlatformTrendRow) => {
      const d = row.date;
      if (!acc[d]) {
        acc[d] = { date: d, spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0 };
      }
      acc[d].spend += Number(row.spend ?? 0);
      acc[d].revenue += Number(row.revenue ?? 0);
      acc[d].clicks += Number(row.clicks ?? 0);
      acc[d].impressions += Number(row.impressions ?? 0);
      acc[d].conversions += Number(row.conversions ?? 0);
      return acc;
    }, {});

    return Object.values(grouped).map((r) => ({
      ...r,
      // Task 1.4: Safe math guards
      roas: safeROAS(r.revenue!, r.spend!),
      ctr: safeCTR(r.clicks!, r.impressions!),
      cpa: safeCPA(r.spend!, r.conversions!)
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  } catch (err) {
    console.error("[getPlatformTrends] Error:", err);
    // Task 2.2: Return fallback on error
    return [];
  }
};

export const getPlatformCampaigns = async (
  workspaceId: string,
  platform: string,
  dateRange: DateRange
): Promise<CampaignRow[]> => {
  const fromStr = formatDate(dateRange.from);
  const toStr = formatDate(dateRange.to);

  try {
    const { data, error } = await supabase
      .from("metrics_daily")
      .select(platformCampaignSelect) // Explicit columns
      .eq("workspace_id", workspaceId)
      .eq("campaigns.platform", platform)
      .gte("date", fromStr)
      .lte("date", toStr);

    if (error) throw error;

    const grouped = (data || []).reduce((acc: Record<string, Omit<CampaignRow, 'roas' | 'ctr' | 'cpa'>>, row: PlatformCampaignRow) => {
      if(!row.campaigns || !row.campaign_id) return acc;

      const cid = row.campaign_id;
      if (!acc[cid]) {
        acc[cid] = {
          id: cid,
          name: row.campaigns.name,
          platform: row.campaigns.platform,
          status: row.campaigns.status,
          spend: 0, revenue: 0, clicks: 0, impressions: 0, conversions: 0,
          roas: 0, ctr: 0, cpa: 0
        };
      }
      acc[cid].spend += Number(row.spend ?? 0);
      acc[cid].revenue += Number(row.revenue ?? 0);
      acc[cid].clicks += Number(row.clicks ?? 0);
      acc[cid].impressions += Number(row.impressions ?? 0);
      acc[cid].conversions += Number(row.conversions ?? 0);
      return acc;
    }, {});

    return Object.values(grouped).map((c) => ({
      ...c,
      // Task 1.4: Safe math guards
      roas: safeROAS(c.revenue, c.spend),
      ctr: safeCTR(c.clicks, c.impressions),
      cpa: safeCPA(c.spend, c.conversions)
    })).sort((a, b) => b.roas - a.roas);
  } catch (err) {
    console.error("[getPlatformCampaigns] Error:", err);
    // Task 2.2: Return fallback on error
    return [];
  }
};

// Task 1.2: Moved campaign list fetching to campaigns.ts service
export const getPlatformCampaignList = async (workspaceId: string, platform: string): Promise<Array<{id: string; name: string}>> => {
  try {
    const { data, error } = await supabase
      .from("campaigns")
      .select("id, name") // Explicit columns
      .eq("workspace_id", workspaceId)
      .eq("platform", platform);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error("[getPlatformCampaignList] Error:", err);
    // Task 2.2: Return fallback on error
    return [];
  }
};

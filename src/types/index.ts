export type Platform = 'google_ads' | 'meta_ads';
export type Severity = 'critical' | 'warning' | 'info';
export type OpportunityType = 'budget_scale' | 'budget_cap' | 'pause_campaign' | 'creative_fatigue' | 'cpa_spike' | 'roas_drop' | 'ctr_drop';
export type CampaignStatus = 'active' | 'paused' | 'ended' | 'draft';
export type ReportStatus = 'pending' | 'generating' | 'ready' | 'failed';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  plan: 'starter' | 'agency' | 'agency_pro';
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'analyst' | 'client';
}

export interface Client {
  id: string;
  workspace_id: string;
  name: string;
  logo_url?: string;
  monthly_budget?: number;
}

export interface Integration {
  id: string;
  workspace_id: string;
  client_id?: string;
  platform: Platform;
  account_id: string;
  account_name: string;
  status: 'active' | 'expired' | 'error';
  last_synced_at?: string;
}

export interface Campaign {
  id: string;
  workspace_id: string;
  integration_id: string;
  platform_campaign_id: string;
  name: string;
  platform: Platform;
  status: CampaignStatus;
  objective?: string;
  budget_daily?: number;
  budget_total?: number;
  start_date?: string;
  end_date?: string;
}

export interface MetricDaily {
  id: string;
  workspace_id: string;
  campaign_id: string;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpa: number;
  roas: number;
}

export interface Opportunity {
  id: string;
  workspace_id: string;
  campaign_id: string;
  type: OpportunityType;
  severity: Severity;
  title: string;
  description: string;
  ai_narrative?: string;
  metric_value?: number;
  metric_delta?: number;
  status: 'open' | 'actioned' | 'dismissed';
  detected_at: string;
  campaign?: Campaign;
}

export interface Report {
  id: string;
  workspace_id: string;
  client_id?: string;
  title: string;
  type: 'performance' | 'platform' | 'campaign' | 'weekly';
  period_start: string;
  period_end: string;
  file_url?: string;
  status: ReportStatus;
  created_at: string;
}

export interface KPIMetrics {
  totalSpend: number;
  totalRevenue: number;
  blendedROAS: number;
  totalConversions: number;
  spendDelta: number;
  revenueDelta: number;
  roasDelta: number;
  conversionsDelta: number;
}

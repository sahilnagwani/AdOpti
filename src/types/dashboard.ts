export interface DateRange {
  from: Date;
  to: Date;
}

export interface KPIData {
  totalSpend: number;
  totalRevenue: number;
  totalConversions: number;
  totalClicks: number;
  roas: number;
  roasChange?: number;
}

export interface TrendPoint {
  date: string;
  spend: number;
  revenue: number;
  clicks: number;
  conversions: number;
}

export interface CampaignRow {
  id: string;
  name: string;
  platform: string;
  spend: number;
  revenue: number;
  conversions: number;
  roas: number;
}

export interface AIInsight {
  best: { name: string; roas: number; platform: string };
  worst: { name: string; roas: number; platform: string };
  topOpportunity?: { title: string; estimatedValue: number; type: string };
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface TrendPoint {
  date: string;
  spend: number;
  revenue: number;
  clicks: number;
  impressions: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpa: number;
}

export interface CampaignRow {
  id: string;
  name: string;
  platform: string;
  status: string;
  spend: number;
  revenue: number;
  clicks: number;
  impressions: number;
  conversions: number;
  roas: number;
  ctr: number;
  cpa: number;
}

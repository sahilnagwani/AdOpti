import { DateRange } from "./shared";

export interface PlatformKPIs {
  totalSpend: number;
  totalRevenue: number;
  totalClicks: number;
  totalImpressions: number;
  totalConversions: number;
  roas: number;
  ctr: number;
  cpa: number;
  integrationStatus: "connected" | "disconnected" | "unknown";
  lastSyncedAt: string | null;
}

export interface PlatformFilters {
  dateRange: DateRange;
  campaignId?: string;
}

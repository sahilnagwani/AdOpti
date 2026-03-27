export type InsightSeverity = "positive" | "warning" | "critical" | "neutral";
export type InsightCategory = "performance" | "trend" | "anomaly" | "opportunity";

export interface Insight {
  id: string;
  category: InsightCategory;
  severity: InsightSeverity;
  title: string;
  description: string;
  metric: {
    label: string;
    value: string;
    raw: number;
  };
  campaign?: {
    id: string;
    name: string;
    platform: string;
  };
  recommendation: string;
  confidenceScore: number;
  detectedAt: string;
  sparkline?: number[];
}

export interface InsightsSummary {
  totalInsights: number;
  criticalCount: number;
  warningCount: number;
  positiveCount: number;
  generatedAt: string;
}

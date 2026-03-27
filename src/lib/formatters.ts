export const safeROAS = (revenue: number, spend: number): number =>
  spend > 0 ? parseFloat((revenue / spend).toFixed(2)) : 0;

export const safeCTR = (clicks: number, impressions: number): number =>
  impressions > 0 ? parseFloat(((clicks / impressions) * 100).toFixed(2)) : 0;

export const safeCPA = (spend: number, conversions: number): number =>
  conversions > 0 ? parseFloat((spend / conversions).toFixed(2)) : 0;

export const safePctChange = (current: number, previous: number): number =>
  previous > 0 ? parseFloat((((current - previous) / previous) * 100).toFixed(1)) : 0;

// Standard INR format: ₹12,400
export const formatINR = (value: number): string =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);

// Compact INR: ₹1.2L, ₹3.5Cr (for KPI cards where space is limited)
export const formatINRCompact = (value: number): string => {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000)    return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000)       return `₹${(value / 1_000).toFixed(1)}K`;
  return `₹${value.toFixed(0)}`;
};

// ROAS: always show as "3.2x"
export const formatROAS = (value: number): string => `${value.toFixed(2)}x`;

// CTR/CVR: always show as "2.4%"
export const formatPct = (value: number): string => `${value.toFixed(2)}%`;

// Large numbers: 12,400 (no currency symbol)
export const formatNumber = (value: number): string =>
  new Intl.NumberFormat("en-IN").format(value);

// Confidence score calculation
export const calcConfidence = (dayCount: number, conversions: number, spend: number): number => {
  let score = 0;
  if (dayCount >= 21) score += 50;
  else if (dayCount >= 14) score += 40;
  else if (dayCount >= 7) score += 30;
  else score += 15;

  if (conversions > 50) score += 20;
  else if (conversions > 20) score += 10;
  else if (conversions > 5) score += 5;

  if (spend > 100000) score += 20;
  else if (spend > 10000) score += 10;

  return Math.min(score, 95);
};

// Format date for chart X-axis
export const fmtChartDate = (dateStr: string): string =>
  new Date(dateStr).toLocaleDateString("en-IN", { month: "short", day: "numeric" });

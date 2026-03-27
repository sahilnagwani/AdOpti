import React from "react";
import { PlatformKPIs } from "../../types/platform";
import { formatINR, formatROAS, formatPct } from "../../lib/formatters";

interface Props {
  data: PlatformKPIs | null;
  isLoading: boolean;
}

export const PlatformKPICards: React.FC<Props> = ({ data, isLoading }) => {
  const kpis = [
    { label: "Total Spend", val: data ? formatINR(data.totalSpend) : "-", color: "text-gray-900" },
    { label: "Total Revenue", val: data ? formatINR(data.totalRevenue) : "-", color: "text-gray-900" },
    { label: "Total Clicks", val: data ? data.totalClicks.toLocaleString("en-IN") : "-", color: "text-indigo-600" },
    { label: "Total Conversions", val: data ? data.totalConversions.toLocaleString("en-IN") : "-", color: "text-violet-600" },
    { label: "ROAS", val: data ? formatROAS(data.roas) : "-", color: data && data.roas >= 3 ? "text-emerald-500" : data && data.roas >= 1 ? "text-amber-500" : "text-red-500" },
    { label: "CTR", val: data ? formatPct(data.ctr) : "-", color: "text-sky-500" },
    { label: "CPA", val: data ? formatINR(data.cpa) : "-", color: "text-gray-900" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-8">
      {kpis.map((k, i) => (
        <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex flex-col justify-center">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">{k.label}</span>
          {isLoading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-3/4 rounded-md"></div>
          ) : (
            <span className={`text-2xl font-mono font-bold tracking-tight ${k.color}`}>{k.val}</span>
          )}
        </div>
      ))}
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { PlatformFilters as FilterType } from "../../types/platform";
import { DateRange } from "../../types/shared";

interface PlatformFiltersProps {
  filters: FilterType;
  onFiltersChange: (f: FilterType) => void;
  campaigns: Array<{ id: string; name: string }>;
}

const getPresets = () => {
  const t = new Date();
  const d7 = new Date(t); d7.setDate(t.getDate() - 7);
  const d30 = new Date(t); d30.setDate(t.getDate() - 30);
  const d90 = new Date(t); d90.setDate(t.getDate() - 90);
  return {
    "Last 7 Days": { from: d7, to: t },
    "Last 30 Days": { from: d30, to: t },
    "Last 90 Days": { from: d90, to: t },
  };
};

export const PlatformFilters: React.FC<PlatformFiltersProps> = ({ filters, onFiltersChange, campaigns }) => {
  const presets = getPresets();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const [dateRange, setDateRange] = useState<DateRange>(filters.dateRange);
  const [campaignId, setCampaignId] = useState<string>(filters.campaignId || "");

  useEffect(() => {
    const handler = setTimeout(() => {
      onFiltersChange({
        ...filters,
        dateRange,
        campaignId: campaignId === "all" || !campaignId ? undefined : campaignId,
      });
    }, 300);
    return () => clearTimeout(handler);
  }, [dateRange, campaignId]);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
      <div className="flex gap-2">
        {Object.entries(presets).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setDateRange(v)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              fmt(dateRange.from) === fmt(v.from) && fmt(dateRange.to) === fmt(v.to)
                ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {k}
          </button>
        ))}
        <div className="flex items-center space-x-2 bg-gray-50 border border-gray-200 rounded-md px-2 py-1 ml-2">
          <input type="date" value={fmt(dateRange.from)} onChange={e => setDateRange({ ...dateRange, from: new Date(e.target.value) })} className="bg-transparent text-sm text-gray-700 border-none outline-none" />
          <span className="text-gray-400">to</span>
          <input type="date" value={fmt(dateRange.to)} onChange={e => setDateRange({ ...dateRange, to: new Date(e.target.value) })} className="bg-transparent text-sm text-gray-700 border-none outline-none" />
        </div>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600">Campaigns:</label>
        <select 
          value={campaignId || "all"} 
          onChange={e => setCampaignId(e.target.value)}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="all">All Campaigns</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
    </div>
  );
};

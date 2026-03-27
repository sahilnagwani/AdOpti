import React from "react";
import { InsightsSummary } from "../../types/insights";
import { DateRange } from "../../types/shared";

interface Props {
  summary: InsightsSummary | null;
  isLoading: boolean;
  dateRange: DateRange;
  onDateRangeChange: (d: DateRange) => void;
  onRefresh: () => void;
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

export const InsightsHeader: React.FC<Props> = ({ summary, isLoading, dateRange, onDateRangeChange, onRefresh }) => {
  const presets = getPresets();
  const fmt = (d: Date) => d.toISOString().split('T')[0];

  return (
    <div className="space-y-6 mb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 border-none m-0 shadow-none">AI Insights Hub</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">Smart diagnosis of account performance</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onRefresh} 
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-md transition-colors disabled:opacity-50"
          >
            <svg className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
          
          <div className="flex bg-white items-center gap-2 p-1 border border-gray-200 rounded-md ml-auto">
             <div className="flex gap-1 pl-1">
               {Object.entries(presets).map(([k, v]) => (
                 <button
                   key={k}
                   onClick={() => onDateRangeChange(v)}
                   className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                     fmt(dateRange.from) === fmt(v.from) && fmt(dateRange.to) === fmt(v.to)
                       ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800'
                   }`}
                 >
                   {k.split(" ")[1]}d
                 </button>
               ))}
             </div>
             <div className="px-2 border-l border-gray-100 flex items-center space-x-1">
               <input type="date" value={fmt(dateRange.from)} onChange={e => onDateRangeChange({ ...dateRange, from: new Date(e.target.value) })} className="bg-transparent text-xs font-medium text-gray-700 border-none outline-none focus:ring-0 p-0" />
               <span className="text-gray-300 text-xs">-</span>
               <input type="date" value={fmt(dateRange.to)} onChange={e => onDateRangeChange({ ...dateRange, to: new Date(e.target.value) })} className="bg-transparent text-xs font-medium text-gray-700 border-none outline-none focus:ring-0 p-0" />
             </div>
          </div>
        </div>
      </div>

      {summary && !isLoading && (
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 shadow-sm">
             <span className="font-mono">{summary.totalInsights}</span> Total
           </div>
           
           <div className="w-px h-4 bg-gray-200 mx-1"></div>

           <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full text-xs font-semibold shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
             <span className="font-mono">{summary.criticalCount}</span> Critical
           </div>

           <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-100 text-amber-700 rounded-full text-xs font-semibold shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
             <span className="font-mono">{summary.warningCount}</span> Warning
           </div>

           <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-full text-xs font-semibold shadow-sm">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
             <span className="font-mono">{summary.positiveCount}</span> Positive
           </div>

           <div className="ml-auto text-[10px] uppercase font-semibold tracking-wider text-gray-400">
             Last Refreshed: {new Date(summary.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
           </div>
        </div>
      )}
    </div>
  );
};

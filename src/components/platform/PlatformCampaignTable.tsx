import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CampaignRow } from "../../types/shared";
import { formatINR, formatROAS } from "../../lib/formatters";

interface Props {
  data: CampaignRow[];
  isLoading: boolean;
}

export const PlatformCampaignTable: React.FC<Props> = ({ data, isLoading }) => {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<keyof CampaignRow>("roas");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  const handleSort = (key: keyof CampaignRow) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];
      if (typeof aVal === "string") aVal = aVal.toLowerCase();
      if (typeof bVal === "string") bVal = bVal.toLowerCase();
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortOrder]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [sortedData, page]);

  const thClass = "text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4 cursor-pointer hover:bg-gray-50 transition-colors";

  const getRoasBadge = (roas: number) => {
    if (roas >= 3) return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded inline-flex font-mono text-xs font-semibold">{formatROAS(roas)}</span>;
    if (roas >= 1) return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded inline-flex font-mono text-xs font-semibold">{formatROAS(roas)}</span>;
    return <span className="bg-red-100 text-red-700 px-2 py-1 rounded inline-flex font-mono text-xs font-semibold">{formatROAS(roas)}</span>;
  };

  const getStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === "active") return <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500"/>Active</span>;
    if (s === "paused") return <span className="flex items-center gap-1.5 text-xs font-medium text-amber-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500"/>Paused</span>;
    return <span className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><div className="w-1.5 h-1.5 rounded-full bg-gray-400"/>Completed</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {Array.from({length: 5}).map((_, i) => (
          <div key={i} className="animate-pulse flex border-b border-gray-100 p-4 gap-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/6"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500 flex flex-col items-center">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
        <span className="text-lg font-medium text-gray-900">No campaigns found</span>
        <span className="text-sm mt-1">No campaign data matching your filters for this period.</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
      <div className="overflow-x-auto w-full">
        <table className="w-full text-sm whitespace-nowrap">
          <thead className="bg-white border-b border-gray-200">
            <tr>
              <th className={thClass} onClick={() => handleSort("name")}>Campaign Name</th>
              <th className={thClass} onClick={() => handleSort("status")}>Status</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("spend")}>Spend</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("revenue")}>Revenue</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("clicks")}>Clicks</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("conversions")}>Conv.</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("ctr")}>CTR</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("cpa")}>CPA</th>
              <th className={`${thClass} text-right`} onClick={() => handleSort("roas")}>ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/campaign/${row.id}`)}
              >
                <td className="py-3 px-4 text-gray-900 font-medium max-w-[200px] truncate" title={row.name}>{row.name}</td>
                <td className="py-3 px-4">{getStatusBadge(row.status)}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-mono">{formatINR(row.spend)}</td>
                <td className="py-3 px-4 text-right text-emerald-600 font-mono font-medium">{formatINR(row.revenue)}</td>
                <td className="py-3 px-4 text-right text-sky-600 font-mono">{row.clicks.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-violet-600 font-mono">{row.conversions.toLocaleString("en-IN")}</td>
                <td className="py-3 px-4 text-right text-gray-700 font-mono">{row.ctr.toFixed(2)}%</td>
                <td className="py-3 px-4 text-right text-gray-700 font-mono">{formatINR(row.cpa)}</td>
                <td className="py-3 px-4 text-right">{getRoasBadge(row.roas)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length > rowsPerPage && (
        <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 bg-gray-50/50">
          <span className="text-xs text-gray-500 font-medium">
            Showing {page * rowsPerPage + 1} to {Math.min((page + 1) * rowsPerPage, sortedData.length)} of {sortedData.length} records
          </span>
          <div className="flex gap-2">
            <button 
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="px-3 py-1 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button 
              disabled={(page + 1) * rowsPerPage >= sortedData.length}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 bg-white border border-gray-200 text-xs font-medium text-gray-700 rounded shadow-sm hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

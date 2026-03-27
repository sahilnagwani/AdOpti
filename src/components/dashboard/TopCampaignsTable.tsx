import React from 'react';
import { useRouter } from 'next/navigation';
import { CampaignRow } from '../../types/dashboard';
import { LoadingSkeleton } from './LoadingSkeleton';

interface TopCampaignsTableProps {
  data: CampaignRow[];
  isLoading: boolean;
}

const formatINR = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

export const TopCampaignsTable: React.FC<TopCampaignsTableProps> = ({ data, isLoading }) => {
  const router = useRouter();
  const getRoasColor = (roas: number) => {
    if (roas >= 3) return 'text-emerald-600 bg-emerald-50';
    if (roas >= 1) return 'text-amber-600 bg-amber-50';
    return 'text-red-600 bg-red-50';
  };

  const downloadCSV = () => {
    if (!data.length) return;

    const headers = ['Campaign Name', 'Platform', 'Spend', 'Revenue', 'Conversions', 'ROAS'];
    const rows = data.map(row => [
      `"${row.name}"`, 
      row.platform, 
      row.spend.toString(), 
      row.revenue.toString(), 
      row.conversions.toString(), 
      row.roas.toFixed(2)
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'campaign_performance_export.csv';
    link.click();
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Top Campaigns by ROAS</h3>
        <LoadingSkeleton height="200px" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 col-span-full overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Top Campaigns by ROAS</h3>
        <button 
          onClick={downloadCSV}
          disabled={data.length === 0}
          className="text-sm px-3 py-1.5 font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors disabled:opacity-50"
        >
          Export CSV
        </button>
      </div>

      {data.length === 0 ? (
        <div className="py-12 text-center text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          No campaign data for the selected period.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 text-sm text-gray-500">
                <th className="pb-3 pt-2 font-medium">Campaign Name</th>
                <th className="pb-3 pt-2 font-medium">Platform</th>
                <th className="pb-3 pt-2 font-medium text-right">Spend</th>
                <th className="pb-3 pt-2 font-medium text-right">Revenue</th>
                <th className="pb-3 pt-2 font-medium text-right">Conversions</th>
                <th className="pb-3 pt-2 font-medium text-right">ROAS</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition-colors cursor-pointer"
                  onClick={() => router.push(`/campaign/${row.id}`)}
                >
                  <td className="py-3 font-medium text-gray-800 max-w-[200px] truncate" title={row.name}>{row.name}</td>
                  <td className="py-3">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-semibold tracking-wide uppercase">
                      {row.platform}
                    </span>
                  </td>
                  <td className="py-3 text-right text-gray-600">{formatINR(row.spend)}</td>
                  <td className="py-3 text-right font-medium text-gray-900">{formatINR(row.revenue)}</td>
                  <td className="py-3 text-right text-gray-600">{row.conversions.toLocaleString()}</td>
                  <td className="py-3 text-right">
                    <span className={`px-2.5 py-1 rounded-md font-semibold text-xs ${getRoasColor(row.roas)}`}>
                      {row.roas.toFixed(2)}x
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

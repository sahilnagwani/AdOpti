import React from 'react';
import { DateRangeFilter } from '../dashboard/DateRangeFilter';
import { useAppStore } from '../../store/useAppStore';

export const GlobalDateFilter: React.FC = () => {
  const { dateRange, setDateRange } = useAppStore();

  return (
    <div className="bg-[#070b14]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-[#d1d5db]">Date Range:</span>
          <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
        </div>
      </div>
    </div>
  );
};
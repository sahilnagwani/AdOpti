import React from 'react';
import { DateRange } from '../../types/dashboard';

interface DateRangeFilterProps {
  dateRange: DateRange;
  onChange: (range: DateRange) => void;
}

const getPresets = () => {
  const today = new Date();
  
  const last7Days = new Date(today);
  last7Days.setDate(today.getDate() - 7);
  
  const last30Days = new Date(today);
  last30Days.setDate(today.getDate() - 30);
  
  const last90Days = new Date(today);
  last90Days.setDate(today.getDate() - 90);

  return {
    'Last 7 Days': { from: last7Days, to: today },
    'Last 30 Days': { from: last30Days, to: today },
    'Last 90 Days': { from: last90Days, to: today },
  };
};

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ dateRange, onChange }) => {
  const presets = getPresets();

  const handlePresetClick = (range: DateRange) => {
    onChange(range);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {Object.entries(presets).map(([label, range]) => (
        <button
          key={label}
          onClick={() => handlePresetClick(range)}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
            formatDate(dateRange.from) === formatDate(range.from) &&
            formatDate(dateRange.to) === formatDate(range.to)
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {label}
        </button>
      ))}

      <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-md px-3 py-1.5 ml-2">
        <input
          type="date"
          value={formatDate(dateRange.from)}
          onChange={(e) => onChange({ ...dateRange, from: new Date(e.target.value) })}
          className="text-sm bg-transparent border-none focus:ring-0 text-gray-700"
        />
        <span className="text-gray-400">to</span>
        <input
          type="date"
          value={formatDate(dateRange.to)}
          onChange={(e) => onChange({ ...dateRange, to: new Date(e.target.value) })}
          className="text-sm bg-transparent border-none focus:ring-0 text-gray-700"
        />
      </div>
    </div>
  );
};

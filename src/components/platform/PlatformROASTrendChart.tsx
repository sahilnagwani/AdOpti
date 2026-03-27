import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { TrendPoint } from "../../types/shared";
import { fmtChartDate } from "../../lib/formatters";

interface Props {
  data: TrendPoint[];
  isLoading: boolean;
}

export const PlatformROASTrendChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px] h-full flex items-center justify-center"><div className="animate-pulse bg-gray-200 w-full h-full rounded-md" /></div>;
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px] h-full flex flex-col items-center justify-center text-gray-400">
        <span className="text-sm font-medium">No ROAS data for this period</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[340px] w-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">ROAS Trend (Return on Ad Spend)</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRoas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tickFormatter={fmtChartDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
            <YAxis tickFormatter={(val) => `${val}x`} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dx={-10} />
            <Tooltip 
              formatter={(val: any) => `${Number(val || 0).toFixed(2)}x`}
              labelFormatter={(label) => fmtChartDate(label)}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            {/* Break-even line */}
            <ReferenceLine y={1.0} stroke="#EF4444" strokeDasharray="3 3" />
            {/* Healthy line */}
            <ReferenceLine y={3.0} stroke="#10B981" strokeDasharray="3 3" />
            <Area type="monotone" dataKey="roas" name="ROAS" stroke="#10B981" fillOpacity={1} fill="url(#colorRoas)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

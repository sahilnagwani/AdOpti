import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendPoint } from "../../types/shared";
import { fmtChartDate, formatINR } from "../../lib/formatters";

interface Props {
  data: TrendPoint[];
  isLoading: boolean;
}

const formatAxisY = (val: number) => {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
  return `₹${val}`;
};

export const PlatformSpendRevenueChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[280px] h-full flex items-center justify-center"><div className="animate-pulse bg-gray-200 w-full h-full rounded-md" /></div>;
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[280px] h-full flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd"/></svg>
        <span className="text-sm font-medium">No spend/revenue data for this period</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-full flex flex-col min-h-[320px]">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Spend vs Revenue</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tickFormatter={fmtChartDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
            <YAxis tickFormatter={formatAxisY} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dx={-10} />
            <Tooltip 
              formatter={(val: any) => formatINR(Number(val || 0))}
              labelFormatter={(label) => fmtChartDate(label)}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} iconType="circle" />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#34D399" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="spend" name="Spend" stroke="#F87171" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

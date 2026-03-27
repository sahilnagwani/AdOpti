import React from "react";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendPoint } from "../../types/shared";
import { fmtChartDate, formatINR } from "../../lib/formatters";

interface Props {
  data: TrendPoint[];
  isLoading: boolean;
}

export const PlatformClicksConversionsChart: React.FC<Props> = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[280px] h-full flex items-center justify-center"><div className="animate-pulse bg-gray-200 w-full h-full rounded-md" /></div>;
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[280px] h-full flex flex-col items-center justify-center text-gray-400">
        <svg className="w-12 h-12 mb-3 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" clipRule="evenodd"/></svg>
        <span className="text-sm font-medium">No clicks & conversions data here</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col min-h-[320px] h-full">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">Clicks vs Conversions</h3>
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" tickFormatter={fmtChartDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dx={-10} tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(1)}k` : v} />
            <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9ca3af" }} dx={10} />
            <Tooltip 
              labelFormatter={(label) => fmtChartDate(label)}
              contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar yAxisId="left" dataKey="clicks" name="Clicks" fill="#38BDF8" maxBarSize={40} radius={[4, 4, 0, 0]} />
            <Line yAxisId="right" type="monotone" dataKey="conversions" name="Conversions" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

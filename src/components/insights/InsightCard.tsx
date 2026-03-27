import React from "react";
import { Insight } from "../../types/insights";
import { LineChart, Line, ResponsiveContainer } from "recharts";

interface Props {
  insight: Insight;
}

const severityColor = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  positive: "bg-emerald-500",
  neutral: "bg-gray-400"
};

const confidenceColor = (score: number) => {
  if (score >= 80) return "text-emerald-700 bg-emerald-50 border-emerald-200";
  if (score >= 60) return "text-amber-700 bg-amber-50 border-amber-200";
  return "text-gray-600 bg-gray-100 border-gray-200";
};

const confidenceBar = (score: number) => {
  const f = Math.round(score / 20);
  return `[${"■".repeat(f)}${"□".repeat(5 - f)}]`;
};

const categoryIcon = {
  performance: "🏆",
  trend: "📉",
  anomaly: "🚨",
  opportunity: "💡"
};

export const InsightCard: React.FC<Props> = ({ insight }) => {
  const colorStrip = severityColor[insight.severity];
  const confStyle = confidenceColor(insight.confidenceScore);

  const sparklineData = insight.sparkline?.map((val, i) => ({ index: i, val }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      <div className={`h-1 w-full ${colorStrip}`} />
      
      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl" title={insight.category}>{categoryIcon[insight.category] || "ℹ️"}</span>
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 pr-2">{insight.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded border ${badgeStyle}`}>
              {insight.severity}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded border ${confidenceColor(insight.confidenceScore)}`}>
              {insight.confidenceScore}% confidence
            </span>
          </div>
        </div>

        <div className="flex items-end gap-4 mb-3">
          <div className="flex-1">
            <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-1">{insight.metric.label}</p>
            <p className="text-3xl font-mono tracking-tight font-black text-gray-900">{insight.metric.value}</p>
          </div>
          {sparklineData && sparklineData.length > 1 && (
            <div className="w-24 h-12 opacity-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sparklineData}>
                  <Line type="monotone" dataKey="val" stroke={insight.severity === 'positive' ? '#10B981' : insight.severity === 'critical' ? '#EF4444' : '#F59E0B'} strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed flex-1">
          {insight.description}
        </p>

        {insight.campaign && (
          <div className="mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
              <svg className="w-3 h-3 mr-1.5 opacity-70" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
              <span className="truncate max-w-[180px]">{insight.campaign.platform} • {insight.campaign.name}</span>
            </span>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-3 mt-auto">
          <div className="mt-0.5">
            <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7zm2.85 11.1l-.85.6V16h-4v-2.3l-.85-.6C7.8 12.16 7 10.63 7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.63-.8 3.16-2.15 4.1z"/></svg>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed font-medium">
            {insight.recommendation}
          </p>
        </div>

        <div className="mt-4 text-[10px] text-gray-400 uppercase tracking-widest font-semibold flex justify-end">
          Detected {new Date(insight.detectedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

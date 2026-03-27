import React from "react";
import { Insight } from "../../types/insights";
import { InsightCard } from "./InsightCard";

interface Props {
  insights: Insight[];
  isLoading: boolean;
}

export const InsightGrid: React.FC<Props> = ({ insights, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-48 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((card) => (
                <div key={card} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[280px] animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-16 bg-gray-200 rounded w-full mb-4"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const grouped = insights.reduce((acc: Record<string, Insight[]>, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const headers: Record<string, string> = {
    performance: "🏆 Performance Insights",
    trend: "📈 Trend Insights",
    anomaly: "⚠️ Anomalies",
    opportunity: "💡 Active Opportunities"
  };

  const cats = ["performance", "anomaly", "trend", "opportunity"];

  return (
    <div className="space-y-10">
      {cats.map((cat) => {
        const group = grouped[cat];
        if (!group || group.length === 0) return null;

        return (
          <div key={cat} className="space-y-4">
            <div className="border-b border-gray-200 pb-2">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">{headers[cat] || cat}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {group.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </div>
          </div>
        );
      })}
      
      {insights.length === 0 && (
         <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center flex flex-col items-center">
            <span className="text-4xl mb-4">✨</span>
            <h3 className="text-lg font-bold text-gray-900 mb-1">All Clear</h3>
            <p className="text-gray-500 text-sm">No significant insights or anomalies detected for this period.</p>
         </div>
      )}
    </div>
  );
};

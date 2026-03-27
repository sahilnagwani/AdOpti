import React from 'react';
import { AIInsight } from '../../types/dashboard';
import { LoadingSkeleton } from './LoadingSkeleton';

interface AIInsightsProps {
  data: AIInsight | null;
  isLoading: boolean;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">✨</span> AI Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
          <LoadingSkeleton height="100px" />
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-xl shadow-sm border border-indigo-100 p-6">
      <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
        <span className="mr-2 text-xl">✨</span> AI Insights
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Best Campaign */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-emerald-100">
          <div className="text-emerald-600 font-semibold mb-1 flex items-center">
            <span className="mr-1">🏆</span> Best Performer
          </div>
          <p className="text-sm font-medium text-gray-800 line-clamp-1" title={data.best.name}>
            {data.best.name}
          </p>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{data.best.roas.toFixed(2)}x</span>
            <span className="ml-2 text-xs text-gray-500 uppercase">{data.best.platform}</span>
          </div>
        </div>

        {/* Worst Campaign */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-red-100">
          <div className="text-red-600 font-semibold mb-1 flex items-center">
            <span className="mr-1">⚠️</span> Needs Attention
          </div>
          <p className="text-sm font-medium text-gray-800 line-clamp-1" title={data.worst.name}>
            {data.worst.name}
          </p>
          <div className="mt-3 flex items-baseline">
            <span className="text-2xl font-bold text-gray-900">{data.worst.roas.toFixed(2)}x</span>
            <span className="ml-2 text-xs text-gray-500 uppercase">{data.worst.platform}</span>
          </div>
        </div>

        {/* Top Opportunity */}
        {data.topOpportunity ? (
          <div className="bg-indigo-600 rounded-lg p-4 text-white shadow-md">
            <div className="font-semibold mb-1 flex items-center text-indigo-100">
              <span className="mr-1">💡</span> Top Opportunity
            </div>
            <p className="text-sm font-medium mb-1">{data.topOpportunity.title}</p>
            <div className="inline-block px-2 py-0.5 mt-1 bg-indigo-500/50 rounded text-xs font-semibold uppercase tracking-wide">
              {data.topOpportunity.type}
            </div>
            <div className="mt-3 text-xl font-bold">
              Est. Value:{' '}
              {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(data.topOpportunity.estimatedValue)}
            </div>
          </div>
        ) : (
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 flex items-center justify-center text-gray-400 text-sm italic">
            No pending opportunities found for this period.
          </div>
        )}
      </div>
    </div>
  );
};

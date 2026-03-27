import React from 'react';
import { Recommendation } from '../../services/recommendations';
import { formatINR, formatROAS, formatPct } from '../../lib/formatters';

interface Props {
  recommendation: Recommendation;
  onApply?: () => void;
  onDismiss?: () => void;
}

const priorityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-amber-500',
  low: 'bg-blue-500'
};

const priorityBadge = {
  critical: 'bg-red-100 text-red-800',
  high: 'bg-orange-100 text-orange-800',
  medium: 'bg-amber-100 text-amber-800',
  low: 'bg-blue-100 text-blue-800'
};

export const RecommendationCard: React.FC<Props> = ({ recommendation, onApply, onDismiss }) => {
  const { metrics, expectedImpact } = recommendation;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden">
      <div className={`h-1 w-full ${priorityColors[recommendation.priority]}`} />
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${priorityBadge[recommendation.priority]}`}>
              {recommendation.priority}
            </span>
            <span className="text-sm text-gray-600">{recommendation.type.replace('_', ' ')}</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onDismiss} className="text-gray-400 hover:text-gray-600">×</button>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2">{recommendation.title}</h3>

        <div className="mb-4">
          <span className="inline-flex items-center px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 text-xs font-medium border border-indigo-100">
            {recommendation.campaign.platform} • {recommendation.campaign.name}
          </span>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">ROAS</div>
            <div className="text-sm font-semibold">{formatROAS(metrics.currentROAS)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">CPA</div>
            <div className="text-sm font-semibold">{formatINR(metrics.currentCPA)}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">Spend</div>
            <div className="text-sm font-semibold">{formatINR(metrics.currentSpend)}</div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-3">
          <div className="text-green-600">↗</div>
          <div className="text-sm text-green-800">
            Expected: {expectedImpact.estimatedPctChange}% {expectedImpact.direction === 'increase' ? 'increase' : 'decrease'} in {expectedImpact.metric}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">{recommendation.description}</p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex gap-3">
          <div className="text-blue-600">💡</div>
          <p className="text-sm text-blue-800">{recommendation.suggestedAction}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-16 h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${recommendation.confidenceScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-600">{recommendation.confidenceScore}%</span>
          </div>
          <div className="text-xs text-gray-500">{recommendation.confidenceBasis}</div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="text-xs text-gray-400">
            {new Date(recommendation.detectedAt).toLocaleDateString()}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onApply}
              className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Apply
            </button>
            <button 
              onClick={onDismiss}
              className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
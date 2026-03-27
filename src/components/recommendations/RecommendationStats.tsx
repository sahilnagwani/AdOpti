import React from 'react';
import { Recommendation } from '../../services/recommendations';
import { formatINR } from '../../lib/formatters';

interface Props {
  recommendations: Recommendation[];
}

export const RecommendationStats: React.FC<Props> = ({ recommendations }) => {
  const totalPotentialSavings = recommendations.reduce((sum, rec) => {
    if (rec.expectedImpact.metric === 'spend' && rec.expectedImpact.direction === 'decrease') {
      return sum + (rec.metrics.currentSpend * rec.expectedImpact.estimatedPctChange / 100);
    }
    return sum;
  }, 0);

  const criticalCount = recommendations.filter(r => r.priority === 'critical').length;
  const highCount = recommendations.filter(r => r.priority === 'high').length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-gray-900">{recommendations.length}</div>
        <div className="text-sm text-gray-600">Total Recommendations</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
        <div className="text-sm text-gray-600">Critical Priority</div>
      </div>
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="text-2xl font-bold text-green-600">{formatINR(totalPotentialSavings)}</div>
        <div className="text-sm text-gray-600">Potential Savings</div>
      </div>
    </div>
  );
};
import React from 'react';
import { Recommendation } from '../../services/recommendations';
import { RecommendationCard } from './RecommendationCard';

interface Props {
  recommendations: Recommendation[];
  onApply?: (recommendation: Recommendation) => void;
  onDismiss?: (recommendation: Recommendation) => void;
}

export const RecommendationGrid: React.FC<Props> = ({ recommendations, onApply, onDismiss }) => {
  if (recommendations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🎯</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations available</h3>
        <p className="text-gray-600">All campaigns are performing optimally!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recommendations.map((rec) => (
        <RecommendationCard
          key={rec.id}
          recommendation={rec}
          onApply={() => onApply?.(rec)}
          onDismiss={() => onDismiss?.(rec)}
        />
      ))}
    </div>
  );
};
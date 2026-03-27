import React, { useState, useEffect } from 'react';
import { Recommendation, getRecommendations } from '../services/recommendations';
import { RecommendationGrid } from '../components/recommendations/RecommendationGrid';
import { RecommendationStats } from '../components/recommendations/RecommendationStats';
import { LoadingSkeleton } from '../components/dashboard/LoadingSkeleton';
import { useAppStore } from '../store/useAppStore';
import { useWorkspace } from '../hooks/useWorkspace';

const AIRecommendationsPage: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { appliedRecommendations, dismissedRecommendations, applyRecommendation, dismissRecommendation, dateRange } = useAppStore();
  const { workspaceId, isLoading: workspaceLoading } = useWorkspace();

  useEffect(() => {
    let cancelled = false;

    const fetchRecommendations = async () => {
      if (workspaceLoading) return;
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const data = await getRecommendations(workspaceId, dateRange);
        if (!cancelled) {
          setRecommendations(data);
        }
      } catch (error) {
        console.error('Failed to fetch recommendations:', error);
        if (!cancelled) {
          setRecommendations([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRecommendations();

    return () => {
      cancelled = true;
    };
  }, [workspaceId, workspaceLoading, dateRange]);

  const handleApply = (recommendation: Recommendation) => {
    applyRecommendation(recommendation.id);
    setRecommendations((prev) => prev.filter((r) => r.id !== recommendation.id));
  };

  const handleDismiss = (recommendation: Recommendation) => {
    dismissRecommendation(recommendation.id);
    setRecommendations((prev) => prev.filter((r) => r.id !== recommendation.id));
  };

  const filteredRecommendations = recommendations.filter(
    (rec) => !appliedRecommendations.has(rec.id) && !dismissedRecommendations.has(rec.id)
  );


  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="p-6 text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">AI Recommendations</h1>
        <p className="text-gray-400">Optimize your campaigns with AI-powered insights and actionable recommendations.</p>
      </div>

      <RecommendationStats recommendations={filteredRecommendations} />

      <RecommendationGrid
        recommendations={filteredRecommendations}
        onApply={handleApply}
        onDismiss={handleDismiss}
      />
    </div>
  );
};

export default AIRecommendationsPage;
"use client"

import React, { useState, useEffect, useCallback } from "react";
import { useWorkspace } from "../hooks/useWorkspace";
import { Insight, InsightsSummary } from "../types/insights";
import { DateRange } from "../types/shared";
import { getAllInsights } from "../services/insights";

import { InsightsHeader } from "../components/insights/InsightsHeader";
import { InsightGrid } from "../components/insights/InsightGrid";
import { QueryBoundary } from "../components/ui/QueryBoundary";
import { SkeletonTable } from "../components/ui/SkeletonTable";
import { EmptyState } from "../components/ui/EmptyState";

export default function AIInsightsPage() {
  const { workspaceId, isLoading: isWsLoading } = useWorkspace();

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return { from, to };
  });

  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState<InsightsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInsights = useCallback(async () => {
    if (!workspaceId) return;
    setIsLoading(true);
    setError(null);

    try {
      const res = await getAllInsights(workspaceId, dateRange);
      setInsights(res.insights);
      setSummary(res.summary);
    } catch (err: any) {
      setError("Failed to generate AI insights. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, dateRange]);

  useEffect(() => {
    if (!isWsLoading && workspaceId) {
      fetchInsights();
    }
  }, [workspaceId, isWsLoading, fetchInsights]);

  if (isWsLoading) {
    return <div className="min-h-screen bg-[#05080f] flex items-center justify-center -m-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#05080f] pb-16 font-sans">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <InsightsHeader 
          summary={summary} 
          isLoading={isLoading} 
          dateRange={dateRange} 
          onDateRangeChange={setDateRange}
          onRefresh={fetchInsights}
        />

        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={insights}
          isEmpty={(data) => data.length === 0}
          skeleton={<SkeletonTable rows={5} cols={4} />}
          emptyState={<EmptyState title="No insights found" description="Try adjusting your date range or filters" />}
          onRetry={fetchInsights}
        >
          {(data) => <InsightGrid insights={data} isLoading={false} />}
        </QueryBoundary>
        
      </div>
    </div>
  );
}

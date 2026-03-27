import React, { useState, useEffect, useCallback } from 'react';
import { useWorkspace } from '../hooks/useWorkspace';
import { DateRangeFilter } from '../components/dashboard/DateRangeFilter';
import { KPICards } from '../components/dashboard/KPICards';
import { SpendRevenueChart } from '../components/dashboard/SpendRevenueChart';
import { ClicksConversionsChart } from '../components/dashboard/ClicksConversionsChart';
import { TopCampaignsTable } from '../components/dashboard/TopCampaignsTable';
import { AIInsights } from '../components/dashboard/AIInsights';
import { DateRange, KPIData, TrendPoint, CampaignRow, AIInsight } from '../types/dashboard';
import { QueryBoundary } from '../components/ui/QueryBoundary';
import { SkeletonKPICard } from '../components/ui/SkeletonKPICard';
import { SkeletonChart } from '../components/ui/SkeletonChart';
import { SkeletonTable } from '../components/ui/SkeletonTable';
import { EmptyState } from '../components/ui/EmptyState';

import {
  getDashboardKPIs,
  getSpendRevenueTrend,
  getClicksConversionsTrend,
  getTopCampaigns,
  getAIInsights,
} from '../services/dashboard';

export const DashboardPage: React.FC = () => {
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();

  // Default to Last 30 Days
  const [dateRange, setDateRange] = useState<DateRange>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return { from, to };
  });

  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [spendTrend, setSpendTrend] = useState<TrendPoint[]>([]);
  const [clicksTrend, setClicksTrend] = useState<TrendPoint[]>([]);
  const [topCampaigns, setTopCampaigns] = useState<CampaignRow[]>([]);
  const [insights, setInsights] = useState<AIInsight | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // If we are still resolving the workspace or there is none, fail gracefully
    if (isWorkspaceLoading) return;
    if (!workspaceId) {
      setIsLoading(false);
      setError('No workspace selected or found.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [
        kpiData,
        spendRevData,
        clicksConvData,
        campaignsData,
        insightsData
      ] = await Promise.all([
        getDashboardKPIs(workspaceId, dateRange).catch(e => { console.error(e); return null; }),
        getSpendRevenueTrend(workspaceId, dateRange).catch(e => { console.error(e); return []; }),
        getClicksConversionsTrend(workspaceId, dateRange).catch(e => { console.error(e); return []; }),
        getTopCampaigns(workspaceId, dateRange).catch(e => { console.error(e); return []; }),
        getAIInsights(workspaceId, dateRange).catch(e => { console.error(e); return null; }),
      ]);

      setKpis(kpiData);
      setSpendTrend(spendRevData);
      setClicksTrend(clicksConvData);
      setTopCampaigns(campaignsData);
      setInsights(insightsData);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [workspaceId, dateRange, isWorkspaceLoading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Early return if just waiting for initial context check
  if (isWorkspaceLoading) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f]">
      {/* Header section (Sticky) */}
      <header className="sticky top-0 z-30 bg-[#080d1a] border-b border-[#1f2937] shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Marketing Overview</h1>
            <p className="text-sm text-gray-400 mt-1">
              Workspace ID: {workspaceId ? <span className="font-mono text-xs bg-[#0f172a] px-1 rounded">{workspaceId.substring(0,8)}...</span> : 'None'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <DateRangeFilter dateRange={dateRange} onChange={setDateRange} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={insights}
          isEmpty={(data) => !data}
          skeleton={<SkeletonChart />}
          emptyState={<EmptyState title="No insights available" description="Try adjusting your date range" />}
          onRetry={fetchData}
        >
          {(data) => <AIInsights data={data} isLoading={false} />}
        </QueryBoundary>
        
        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={kpis}
          skeleton={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({length:4}, (_,i) => <SkeletonKPICard key={i} />)}</div>}
          emptyState={<EmptyState title="No KPI data for this period" description="Try adjusting your date range or filters" />}
          onRetry={fetchData}
        >
          {(data) => <KPICards data={data} isLoading={false} />}
        </QueryBoundary>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <QueryBoundary
            isLoading={isLoading}
            error={error}
            data={spendTrend}
            isEmpty={(data) => data.length === 0}
            skeleton={<SkeletonChart />}
            emptyState={<EmptyState title="No data for this period" />}
            onRetry={fetchData}
          >
            {(data) => <SpendRevenueChart data={data} isLoading={false} />}
          </QueryBoundary>
          <QueryBoundary
            isLoading={isLoading}
            error={error}
            data={clicksTrend}
            isEmpty={(data) => data.length === 0}
            skeleton={<SkeletonChart />}
            emptyState={<EmptyState title="No data for this period" />}
            onRetry={fetchData}
          >
            {(data) => <ClicksConversionsChart data={data} isLoading={false} />}
          </QueryBoundary>
        </div>

        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={topCampaigns}
          isEmpty={(data) => data.length === 0}
          skeleton={<SkeletonTable />}
          emptyState={<EmptyState title="No campaigns found" description="Try adjusting your date range or filters" />}
          onRetry={fetchData}
        >
          {(data) => <TopCampaignsTable data={data} isLoading={false} />}
        </QueryBoundary>

      </main>
    </div>
  );
};

export default DashboardPage;

"use client"

import React, { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "../../hooks/useWorkspace";

import { PlatformFilters as FilterType, PlatformKPIs } from "../../types/platform";
import { TrendPoint, CampaignRow, DateRange } from "../../types/shared";

import { PlatformFilters } from "../../components/platform/PlatformFilters";
import { PlatformKPICards } from "../../components/platform/PlatformKPICards";
import { PlatformSpendRevenueChart } from "../../components/platform/PlatformSpendRevenueChart";
import { PlatformClicksConversionsChart } from "../../components/platform/PlatformClicksConversionsChart";
import { PlatformROASTrendChart } from "../../components/platform/PlatformROASTrendChart";
import { PlatformCampaignTable } from "../../components/platform/PlatformCampaignTable";
import { QueryBoundary } from "../../components/ui/QueryBoundary";
import { SkeletonKPICard } from "../../components/ui/SkeletonKPICard";
import { SkeletonChart } from "../../components/ui/SkeletonChart";
import { SkeletonTable } from "../../components/ui/SkeletonTable";
import { EmptyState } from "../../components/ui/EmptyState";

import {
  getPlatformKPIs,
  getPlatformTrends,
  getPlatformCampaigns,
  getPlatformCampaignList
} from "../../services/platform";

const platformMap: Record<string, string> = {
  google: "Google",
  meta: "Meta",
  linkedin: "LinkedIn",
  twitter: "Twitter"
};

export default function PlatformPage() {
  const params = useParams();
  const router = useRouter();
  const rawPlatform = typeof params?.platform === 'string' ? params?.platform : '';
  const platformName = platformMap[rawPlatform?.toLowerCase() || ""];

  useEffect(() => {
    if (!platformName && rawPlatform) {
      router.replace("/404");
    }
  }, [platformName, rawPlatform, router]);

  const { workspaceId, isLoading: isWsLoading } = useWorkspace();

  const [filters, setFilters] = useState<FilterType>(() => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);
    return { dateRange: { from, to }, campaignId: undefined };
  });

  const [campaignList, setCampaignList] = useState<{id:string; name:string}[]>([]);
  const [kpis, setKpis] = useState<PlatformKPIs | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (isWsLoading || !workspaceId || !platformName) return;

    setIsLoading(true);
    setError(null);
    try {
      const { dateRange, campaignId } = filters;
      
      const [kpiData, trendsData, campData, newCampaignList] = await Promise.all([
          getPlatformKPIs(workspaceId, platformName, dateRange, campaignId),
          getPlatformTrends(workspaceId, platformName, dateRange, campaignId),
          getPlatformCampaigns(workspaceId, platformName, dateRange),
          getPlatformCampaignList(workspaceId, platformName)
      ]);

      setKpis(kpiData);
      setTrends(trendsData);
      setCampaigns(campData);
      setCampaignList(newCampaignList);
    } catch (err: any) {
      setError(err.message || "Failed to load platform data.");
    } finally {
      setIsLoading(false);
    }
  }, [filters, workspaceId, platformName, isWsLoading]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  if (isWsLoading || (!platformName && !rawPlatform)) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center -m-4"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">{platformName} Analytics</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-medium text-gray-400">Integration:</span>
              {kpis?.integrationStatus === 'connected' ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Synced
                </span>
              ) : kpis?.integrationStatus === 'disconnected' ? (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Disconnected
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" /> Unknown
                </span>
              )}
              {kpis?.lastSyncedAt && (
                <span className="text-xs text-gray-400 ml-2">
                  Last synced: {new Date(kpis.lastSyncedAt).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>

        <PlatformFilters filters={filters} onFiltersChange={setFilters} campaigns={campaignList} />

        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={kpis}
          skeleton={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">{Array.from({length:4}, (_,i) => <SkeletonKPICard key={i} />)}</div>}
          emptyState={<EmptyState title="No KPI data for this period" description="Try adjusting your date range or filters" />}
          onRetry={fetchAll}
        >
          {(data) => <PlatformKPICards data={data} isLoading={false} />}
        </QueryBoundary>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 w-full">
          <QueryBoundary
            isLoading={isLoading}
            error={error}
            data={trends}
            isEmpty={(data) => data.length === 0}
            skeleton={<SkeletonChart />}
            emptyState={<EmptyState title="No data for this period" />}
            onRetry={fetchAll}
          >
            {(data) => <PlatformSpendRevenueChart data={data} isLoading={false} />}
          </QueryBoundary>
          <QueryBoundary
            isLoading={isLoading}
            error={error}
            data={trends}
            isEmpty={(data) => data.length === 0}
            skeleton={<SkeletonChart />}
            emptyState={<EmptyState title="No data for this period" />}
            onRetry={fetchAll}
          >
            {(data) => <PlatformClicksConversionsChart data={data} isLoading={false} />}
          </QueryBoundary>
        </div>

        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={trends}
          isEmpty={(data) => data.length === 0}
          skeleton={<SkeletonChart />}
          emptyState={<EmptyState title="No data for this period" />}
          onRetry={fetchAll}
        >
          {(data) => <PlatformROASTrendChart data={data} isLoading={false} />}
        </QueryBoundary>

        <QueryBoundary
          isLoading={isLoading}
          error={error}
          data={campaigns}
          isEmpty={(data) => data.length === 0}
          skeleton={<SkeletonTable />}
          emptyState={<EmptyState title="No campaigns found" description="Try adjusting your date range or filters" />}
          onRetry={fetchAll}
        >
          {(data) => <PlatformCampaignTable data={data} isLoading={false} />}
        </QueryBoundary>
        
      </div>
    </div>
  );
}

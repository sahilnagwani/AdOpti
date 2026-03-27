import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useWorkspace } from "../../hooks/useWorkspace";
import { getCampaignDetail } from "../../services/campaigns";
import { formatINR } from "../../lib/formatters";

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = typeof params?.campaignId === 'string' ? params.campaignId : '';
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();
  const [detail, setDetail] = useState<{ id:string; name:string; platform:string; status:string; createdAt: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (isWorkspaceLoading) return;
      if (!workspaceId || !campaignId) return;

      setError(null);
      setIsLoading(true);
      const campaign = await getCampaignDetail(workspaceId, campaignId);

      if (!campaign) {
        setError("Campaign not found.");
        setIsLoading(false);
        return;
      }

      setDetail({
        id: campaign.id,
        name: campaign.name,
        platform: campaign.platform,
        status: campaign.status,
        createdAt: campaign.createdAt.toISOString(),
      });
      setIsLoading(false);
    };

    fetchDetail();
  }, [workspaceId, campaignId, isWorkspaceLoading]);

  if (isWorkspaceLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080f]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="min-h-screen bg-[#05080f] p-6 flex items-center justify-center">
        <div className="bg-[#0f172a] rounded-xl border border-[#1f2937] p-8 text-center">
          <p className="text-gray-400 mb-4">{error || "Campaign details unavailable."}</p>
          <button
            onClick={() => router.push("/campaigns")}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f] p-6 text-white">
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{detail.name}</h1>
            <p className="text-sm text-gray-500">{detail.platform} campaign</p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Campaign ID</p>
            <p className="text-sm font-semibold text-gray-800 break-all">{detail.id}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Status</p>
            <p className="text-sm font-semibold text-gray-800">{detail.status}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-xs uppercase text-gray-500 tracking-wider">Created</p>
            <p className="text-sm font-semibold text-gray-800">{new Date(detail.createdAt).toLocaleString('en-IN')}</p>
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p>This page is a structured placeholder for campaign details; the data sources and actions can be expanded from `campaigns` and performance tables.</p>
        </div>
      </div>
    </div>
  );
}

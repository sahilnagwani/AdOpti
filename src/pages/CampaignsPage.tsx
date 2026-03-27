import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "../hooks/useWorkspace";
import { getCampaignList } from "../services/campaigns";

export default function CampaignsPage() {
  const { workspaceId, isLoading: isWorkspaceLoading } = useWorkspace();
  const [campaigns, setCampaigns] = useState<Array<{id:string; name:string; platform:string}>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCampaigns = async () => {
      if (isWorkspaceLoading) return;
      if (!workspaceId) {
        setError("Workspace not available.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const list = await getCampaignList(workspaceId);
        setCampaigns(list as any);
      } catch (err) {
        setError("Unable to load campaigns. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaigns();
  }, [workspaceId, isWorkspaceLoading]);

  if (isWorkspaceLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#05080f]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05080f] p-6 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Campaigns</h1>
        {error ? (
          <div className="text-red-400 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-lg">{error}</div>
        ) : campaigns.length === 0 ? (
          <div className="text-gray-400 bg-[#0f172a] border border-[#1f2937] rounded-xl p-8 text-center">
            No campaigns found in this workspace.
          </div>
        ) : (
          <div className="bg-[#0f172a] rounded-xl border border-[#1f2937] shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm divide-y divide-[#1f2937]">
              <thead className="bg-[#080d1a] text-gray-400 uppercase tracking-wider text-xs">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {campaigns.map((campaign) => (
                  <tr
                    key={campaign.id}
                    className="cursor-pointer hover:bg-[#1a2332] transition-colors"
                    onClick={() => router.push(`/campaign/${campaign.id}`)}
                  >
                    <td className="p-4 font-medium text-white">{campaign.name}</td>
                    <td className="p-4 text-gray-400 uppercase">{campaign.platform}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

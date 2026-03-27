import { supabase } from "../lib/supabaseClient";
import { DateRange } from "../lib/dateUtils";
import { CampaignDetail } from "../types/campaigns";

export const getCampaignDetail = async (workspaceId: string, campaignId: string): Promise<CampaignDetail | null> => {
  if (!campaignId) return null;

  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('id, name, platform, status, created_at')
      .eq('workspace_id', workspaceId)
      .eq('id', campaignId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        console.warn(`Campaign with ID ${campaignId} not found.`);
        return null;
      }
      throw error;
    }

    return data ? {
      id: data.id,
      name: data.name,
      platform: data.platform,
      status: data.status,
      createdAt: new Date(data.created_at),
    } : null;
  } catch (e) {
    console.error(`Error fetching campaign detail for ${campaignId}:`, e);
    return null;
  }
};

export const getCampaignList = async (workspaceId: string, platform?: string): Promise<Array<{ id: string; name: string }>> => {
  try {
    let query = supabase
      .from('campaigns')
      .select('id, name')
      .eq('workspace_id', workspaceId);

    if (platform) {
      query = query.eq('platform', platform);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data || [];
  } catch (e) {
    console.error('Error fetching campaign list:', e);
    return [];
  }
};

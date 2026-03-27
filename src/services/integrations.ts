import { supabase } from "../lib/supabaseClient";
import { DateRange } from "../lib/dateUtils";
import { IntegrationStatus } from "../types/integrations";

// Task 1.2: Explicit column selection
const integrationSelect = 'platform, status, last_synced_at';

export const getPlatformStatuses = async (workspaceId: string): Promise<IntegrationStatus[]> => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select(integrationSelect) // Use explicit columns
      .eq('workspace_id', workspaceId);

    if (error) throw error;

    // Map data to IntegrationStatus type, handling potential null dates
    return (data || []).map(d => ({
      platform: d.platform,
      status: d.status,
      lastSyncedAt: d.last_synced_at ? new Date(d.last_synced_at) : null
    }));
  } catch (e) {
    console.error('[getPlatformStatuses] Error fetching platform statuses:', e);
    // Task 2.2: Return fallback on error
    return [];
  }
};

export const getIntegrationDetail = async (workspaceId: string, platform: string): Promise<IntegrationStatus | null> => {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select(integrationSelect) // Use explicit columns
      .eq('workspace_id', workspaceId)
      .eq('platform', platform)
      .single();

    if (error) {
       // Task 1.1: Handle 'PGRST116' (no rows found) gracefully
       if (error.code === 'PGRST116') {
         console.warn(`[getIntegrationDetail] Integration details for platform ${platform} not found.`);
         return null; // Return null if not found, as per expected behavior
       }
       throw error; // Throw other errors
    }

    // Ensure data is not null before mapping
    return data ? {
      platform: data.platform,
      status: data.status,
      lastSyncedAt: data.last_synced_at ? new Date(data.last_synced_at) : null
    } : null;
  } catch (e) {
    console.error(`[getIntegrationDetail] Error fetching integration detail for ${platform}:`, e);
    // Task 2.2: Return fallback on error
    return null;
  }
};

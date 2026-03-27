import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useWorkspace } from "./useWorkspace";

export function usePlatformStatuses(): Record<string, "connected" | "disconnected"> {
  const { workspaceId } = useWorkspace();
  const [statuses, setStatuses] = useState<Record<string, "connected" | "disconnected">>({});

  useEffect(() => {
    if (!workspaceId) return;

    let mounted = true;
    const fetchStatuses = async () => {
      const { data, error } = await supabase
        .from("integrations")
        .select("platform, status")
        .eq("workspace_id", workspaceId);

      if (error || !data) return;

      if (mounted) {
        const acc: Record<string, any> = {};
        data.forEach((row: any) => {
          acc[row.platform.toLowerCase()] = row.status === "connected" ? "connected" : "disconnected";
        });
        setStatuses(acc);
      }
    };

    fetchStatuses();
    return () => { mounted = false; };
  }, [workspaceId]);

  return statuses;
}

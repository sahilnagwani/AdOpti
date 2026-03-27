import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";
import { supabase } from "../lib/supabaseClient";
import { AuthContext } from "./AuthContext";

interface WorkspaceContextValue {
  workspaceId: string;
  workspaceName: string;
  plan: "free" | "pro" | "enterprise";
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

export const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Read auth directly from AuthContext (sibling context, no circular hook dependency)
  const authCtx = useContext(AuthContext);
  const user = authCtx?.user ?? null;
  const isAuthenticated = authCtx?.isAuthenticated ?? false;
  const isAuthLoading = authCtx?.isLoading ?? false;

  const [workspaceId, setWorkspaceId] = useState<string>("");
  const [workspaceName, setWorkspaceName] = useState<string>("");
  const [plan, setPlan] = useState<"free" | "pro" | "enterprise">("free");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    let mounted = true;

    const fetchWorkspace = async () => {
      // Wait for auth to finish loading before attempting
      if (isAuthLoading) return;

      if (!isAuthenticated || !user) {
        if (mounted) setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("workspaces")
          .select("id, name, plan")
          // RLS ensures only workspaces for the current user are returned.
          // We order by created_at to deterministically pick the user's first/oldest workspace.
          // A proper workspace switcher would be needed for users with multiple workspaces.
          .order('created_at', { ascending: true })
          .limit(1)
          .single();

        if (mounted) {
          if (!error && data) {
            setWorkspaceId(data.id ?? "");
            setWorkspaceName(data.name ?? "My Workspace");
            setPlan(data.plan ?? "free");
          } else {
            console.error("[WorkspaceContext] Could not load workspace:", error?.message);
            setWorkspaceName("My Workspace");
            setHasError(true);
            setErrorMessage(error?.message || "Unable to load workspace data.");
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("[WorkspaceContext] Unexpected error loading workspace:", err);
        if (mounted) {
          setWorkspaceName("My Workspace");
          setHasError(true);
          setErrorMessage((err as Error)?.message || "Unexpected error loading workspace.");
          setIsLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => { mounted = false; };
  }, [user, isAuthenticated, isAuthLoading]);

  return (
    <WorkspaceContext.Provider value={{ workspaceId, workspaceName, plan, isLoading, hasError, errorMessage }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

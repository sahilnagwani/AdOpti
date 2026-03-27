import { useContext } from "react";
import { WorkspaceContext } from "../context/WorkspaceContext";

const FALLBACK = {
  workspaceId: "",
  workspaceName: "",
  plan: "free" as const,
  isLoading: false,
  hasError: false,
  errorMessage: undefined,
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  // Return safe defaults if used outside provider (e.g., in Next.js layouts without provider yet)
  return context ?? FALLBACK;
};

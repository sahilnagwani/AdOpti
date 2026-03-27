import React, { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { useWorkspace } from "../../hooks/useWorkspace";

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { isLoading: isWsLoading, hasError: isWorkspaceError, errorMessage: workspaceErrorMessage } = useWorkspace();

  if (isAuthLoading || (isAuthenticated && isWsLoading)) {
    return (
      <div className="flex w-screen h-screen items-center justify-center bg-[#05080f]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (isAuthenticated && isWorkspaceError) {
    return (
      <div className="min-h-screen bg-[#05080f] flex items-center justify-center p-4">
        <div className="max-w-md text-center bg-[#0f172a] rounded-xl border border-red-500/30 shadow-lg p-8">
          <h1 className="text-2xl font-bold text-red-500 mb-2">Workspace Load Error</h1>
          <p className="text-gray-400 mb-4">{workspaceErrorMessage ?? "There was an error loading your workspace. Please try again later."}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.replace("/login");
    return null;
  }

  return children;
};

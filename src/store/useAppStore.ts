import { create } from 'zustand'
import { Workspace } from '@/types'
import { DateRange } from '@/types/dashboard'

interface AppState {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  setWorkspaces: (workspaces: Workspace[]) => void
  setCurrentWorkspace: (workspace: Workspace | null) => void
  isSidebarCollapsed: boolean
  setSidebarCollapsed: (collapsed: boolean) => void
  appliedRecommendations: Set<string>
  dismissedRecommendations: Set<string>
  applyRecommendation: (id: string) => void
  dismissRecommendation: (id: string) => void
  dateRange: DateRange
  setDateRange: (range: DateRange) => void
}

const getDefaultDateRange = (): DateRange => {
  const today = new Date();
  const thirtyDaysAgo = new Date(today);
  thirtyDaysAgo.setDate(today.getDate() - 30);
  return { from: thirtyDaysAgo, to: today };
};

export const useAppStore = create<AppState>((set) => ({
  currentWorkspace: null,
  workspaces: [],
  setWorkspaces: (workspaces) => set({ workspaces }),
  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),
  isSidebarCollapsed: false,
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  appliedRecommendations: new Set(),
  dismissedRecommendations: new Set(),
  applyRecommendation: (id) => set((state) => ({
    appliedRecommendations: new Set(state.appliedRecommendations).add(id),
    dismissedRecommendations: new Set(state.dismissedRecommendations).delete(id)
  })),
  dismissRecommendation: (id) => set((state) => ({
    dismissedRecommendations: new Set(state.dismissedRecommendations).add(id),
    appliedRecommendations: new Set(state.appliedRecommendations).delete(id)
  })),
  dateRange: getDefaultDateRange(),
  setDateRange: (range) => set({ dateRange: range }),
}))

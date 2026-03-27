import React from "react";
import { Menu, ChevronLeft, ChevronRight } from "lucide-react";
import { Breadcrumb } from "./Breadcrumb";
import { UserMenu } from "./UserMenu";
import { useWorkspace } from "../../hooks/useWorkspace";
import { SidebarState } from "../../hooks/useSidebarState";

interface TopbarProps {
  sidebarState: SidebarState;
}

export const Topbar: React.FC<TopbarProps> = ({ sidebarState }) => {
  const { workspaceName, plan } = useWorkspace();

  const planBadge =
    plan === "pro"
      ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
      : plan === "enterprise"
      ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
      : "bg-white/5 text-[#6b7280] border border-white/10";

  return (
    <header className="h-14 bg-[#080d1a] border-b border-[#1f2937] flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <button
          onClick={sidebarState.openMobile}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        <button
          onClick={sidebarState.toggle}
          className="hidden md:inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Toggle sidebar"
        >
          {sidebarState.isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        <Breadcrumb />
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2.5 pl-3 border-l border-gray-200">
          <span className="text-sm font-semibold text-gray-700 truncate max-w-[150px]">
            {workspaceName || "My Workspace"}
          </span>
          <span className={`text-xs font-black tracking-widest px-2 py-0.5 rounded-full uppercase ${planBadge}`}>
            {plan}
          </span>
        </div>
        <UserMenu />
      </div>
    </header>
  );
};

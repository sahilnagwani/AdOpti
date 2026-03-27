import React from "react";
import { usePathname } from "next/navigation";
import { SidebarState } from "../../hooks/useSidebarState";
import { NAV_SECTIONS } from "../../config/navigation";
import { SidebarSection } from "./SidebarSection";
import { ChevronLeft, ChevronRight, X, Zap } from "lucide-react";

interface SidebarProps {
  sidebarState: SidebarState;
}

export const Sidebar: React.FC<SidebarProps> = ({ sidebarState }) => {
  const { isCollapsed, isMobileOpen, toggle, closeMobile } = sidebarState;
  const pathname = usePathname() || "/";

  const widthClass = isCollapsed ? "w-[64px]" : "w-[220px]";
  const mobileTransform = isMobileOpen ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-20 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 h-screen z-30 flex flex-col
          bg-[#070b14] border-r border-white/[0.06]
          transition-all duration-200 ease-in-out shrink-0
          ${widthClass} ${mobileTransform} md:translate-x-0
        `}
      >
        {/* Logo Header */}
        <div className={`h-14 flex items-center shrink-0 border-b border-white/[0.06] px-4 ${isCollapsed ? "justify-center" : "justify-between"}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-[0_0_16px_rgba(99,102,241,0.5)] shrink-0">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            {!isCollapsed && (
              <span className="text-white font-black text-base tracking-tight truncate">
                Adopti
              </span>
            )}
          </div>

          <button
            className="md:hidden p-1.5 text-[#4b5563] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            onClick={closeMobile}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-hide">
          {NAV_SECTIONS.map((section) => (
            <SidebarSection
              key={section.title}
              section={section}
              isCollapsed={isCollapsed}
              currentPathname={pathname}
            />
          ))}
        </div>

        {/* Collapse Toggle */}
        <div className="hidden md:flex absolute bottom-5 right-[-13px] z-40">
          <button
            onClick={toggle}
            className="w-6 h-6 bg-[#0d1117] border border-white/10 rounded-full flex items-center justify-center text-[#4b5563] hover:text-indigo-400 hover:border-indigo-500/40 shadow-lg transition-all"
          >
            {isCollapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>
      </aside>
    </>
  );
};

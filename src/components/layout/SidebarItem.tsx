import React from "react";
import Link from "next/link";
import { NavItem } from "../../config/navigation";

interface SidebarItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
}

export const SidebarItem: React.FC<SidebarItemProps> = ({ item, isCollapsed, isActive }) => {
  const Icon = item.icon;

  const base = `
    relative flex items-center gap-3 w-full rounded-xl transition-all duration-150 h-9
    ${isCollapsed ? "justify-center px-2" : "px-3"}
  `;

  const active = isActive
    ? "bg-indigo-500/15 text-indigo-300 font-semibold shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]"
    : "text-[#6b7280] hover:bg-white/5 hover:text-[#d1d5db]";

  if (item.disabled) {
    return (
      <span className={`${base} text-[#374151] cursor-not-allowed opacity-40`} title={item.label}>
        <Icon size={16} className="flex-shrink-0" />
        {!isCollapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
      </span>
    );
  }

  return (
    <Link
      href={item.href}
      className={`${base} ${isActive ? "bg-indigo-50 text-indigo-700 font-semibold shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]" : "text-[#6b7280] hover:bg-white/5 hover:text-[#d1d5db]"}`}
      title={isCollapsed ? item.label : undefined}
    >
      <Icon size={16} className="flex-shrink-0" />
      {!isCollapsed && (
        <React.Fragment>
          <span className="text-sm font-medium tracking-wide truncate">{item.label}</span>
          {item.badge && (
            <span className="ml-auto text-[10px] font-black tracking-widest bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-1.5 py-px rounded-full">
              {item.badge}
            </span>
          )}
        </React.Fragment>
      )}
    </Link>
  );
};

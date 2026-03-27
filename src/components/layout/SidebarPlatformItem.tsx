import React from "react";
import Link from "next/link";
import { NavItem } from "../../config/navigation";
import { usePlatformStatuses } from "../../hooks/usePlatformStatuses";

interface SidebarPlatformItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isActive: boolean;
}

export const SidebarPlatformItem: React.FC<SidebarPlatformItemProps> = ({ item, isCollapsed, isActive }) => {
  const Icon = item.icon;
  const statuses = usePlatformStatuses();

  const platform = item.href.split('/').pop() || "";
  const status = statuses[platform] || "disconnected";
  const isConnected = status === "connected";

  const dotColor = isConnected
    ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"
    : "bg-[#374151]";

  const titleText = isConnected
    ? `${item.label} (Connected)`
    : `${item.label} (Not connected)`;

  const base = `
    relative flex items-center gap-3 w-full rounded-xl transition-all duration-150 h-9
    ${isCollapsed ? "justify-center px-2" : "px-3"}
  `;

  const activeClass = isActive
    ? "bg-indigo-500/15 text-indigo-300 font-semibold shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]"
    : "text-[#6b7280] hover:bg-white/5 hover:text-[#d1d5db]";

  return (
    <Link
      href={item.href}
      className={`${base} ${isActive ? "bg-indigo-500/15 text-indigo-300 font-semibold shadow-[inset_2px_0_0_0_rgba(99,102,241,0.8)]" : "text-[#6b7280] hover:bg-white/5 hover:text-[#d1d5db]"}`}
      title={isCollapsed ? titleText : undefined}
    >
      <div className="relative flex-shrink-0">
        <Icon size={16} />
        <span
          className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#070b14] ${dotColor} transition-all`}
          title={!isCollapsed ? titleText : undefined}
        />
      </div>

      {!isCollapsed && (
        <span className="text-sm font-medium tracking-wide truncate">{item.label}</span>
      )}
    </Link>
  );
};

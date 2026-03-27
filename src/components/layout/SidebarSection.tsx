import React from "react";
import { NavSection } from "../../config/navigation";
import { SidebarItem } from "./SidebarItem";
import { SidebarPlatformItem } from "./SidebarPlatformItem";

interface SidebarSectionProps {
  section: NavSection;
  isCollapsed: boolean;
  currentPathname: string;
}

export const SidebarSection: React.FC<SidebarSectionProps> = ({ section, isCollapsed, currentPathname }) => {
  return (
    <div className="mb-5 px-3">
      {!isCollapsed && (
        <p className="text-[9px] font-black text-[#374151] uppercase tracking-[0.22em] px-3 mb-2">
          {section.title}
        </p>
      )}

      <div className="space-y-0.5">
        {section.items.map((item) => {
          const isActive = item.exact
            ? currentPathname === item.href
            : currentPathname.startsWith(item.href);

          if (section.title === "Platforms") {
            return (
              <SidebarPlatformItem
                key={item.label}
                item={item}
                isCollapsed={isCollapsed}
                isActive={isActive}
              />
            );
          }

          return (
            <SidebarItem
              key={item.label}
              item={item}
              isCollapsed={isCollapsed}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
};

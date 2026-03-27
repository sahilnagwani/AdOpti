import { useState, useEffect } from "react";

export interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggle: () => void;
  openMobile: () => void;
  closeMobile: () => void;
}

export function useSidebarState(): SidebarState {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebar_collapsed");
    if (saved) setIsCollapsed(JSON.parse(saved));
  }, []);

  const toggle = () => {
    setIsCollapsed(prev => {
      const v = !prev;
      localStorage.setItem("sidebar_collapsed", JSON.stringify(v));
      return v;
    });
  };

  const openMobile = () => setIsMobileOpen(true);
  const closeMobile = () => setIsMobileOpen(false);

  return { isCollapsed, isMobileOpen, toggle, openMobile, closeMobile };
}

import React from "react";
import { Sidebar } from "./Sidebar";
import { Topbar as TopBar } from "./TopBar";
import { useSidebarState } from "../../hooks/useSidebarState";

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const sidebarState = useSidebarState();

  return (
    <div className="flex h-screen bg-[#05080f] overflow-hidden font-sans text-white">
      <Sidebar sidebarState={sidebarState} />
      
      <div className="flex-1 flex flex-col min-w-0 h-full relative bg-[#02040b]">
        <TopBar sidebarState={sidebarState} />
        
        <main className="flex-1 overflow-y-auto w-full relative">
          {children}
        </main>
      </div>
    </div>
  );
};

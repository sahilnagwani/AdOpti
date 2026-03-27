"use client"

import React from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar as TopBar } from '@/components/layout/TopBar'
import { GlobalDateFilter } from '@/components/layout/GlobalDateFilter'
import { useAppStore } from '@/store/useAppStore'
import { useSidebarState } from '@/hooks/useSidebarState'
import { ParticleField } from '@/components/three/ParticleField'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { AuthProvider } from '@/context/AuthContext'
import { WorkspaceProvider } from '@/context/WorkspaceContext'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25,0.46,0.45,0.94] } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
} as any

function DashboardShell({ children }: { children: React.ReactNode }) {
  const { isSidebarCollapsed } = useAppStore()
  const sidebarState = useSidebarState()

  return (
    <div className="min-h-screen bg-[#030712] text-white flex overflow-hidden">
      <Sidebar sidebarState={sidebarState} />
      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto no-scrollbar">
        <TopBar sidebarState={sidebarState} />
        <GlobalDateFilter />
        <ParticleField />
        
        <main className={cn(
          "flex-1 pt-24 pb-12 px-8 transition-all duration-300 relative z-10",
          isSidebarCollapsed ? "ml-[64px]" : "ml-[260px]"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
                key="dashboard-content"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
            >
                {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <WorkspaceProvider>
        <DashboardShell>{children}</DashboardShell>
      </WorkspaceProvider>
    </AuthProvider>
  )
}

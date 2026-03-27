"use client"

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { KPICard } from '@/components/dashboard/KPICard'
import { SpendChart } from '@/components/charts/SpendChart'
import { PlatformBreakdown } from '@/components/charts/PlatformBreakdown'
import { CampaignTable } from '@/components/charts/CampaignTable'
import { GlobeWidget } from '@/components/three/GlobeWidget'
import { OpportunityCard } from '@/components/dashboard/OpportunityCard'
import { Button } from '@/components/ui/button'
import { RefreshCw, Calendar, Sparkles, ArrowUpRight } from 'lucide-react'

const containerVariants = {
  animate: { transition: { staggerChildren: 0.08 } }
}

const itemVariant = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } }
}

export default function OverviewPage() {
  return (
    <div className="space-y-10">

      {/* ── Header Section ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        
        {/* Left: Greeting */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
              <RefreshCw size={18} className="animate-spin-slow" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#4b5563] bg-white/5 border border-white/5 px-3 py-1 rounded-full">
                Live Dashboard
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-none">
            Shubh Prabhat, <span className="text-gradient">Sahil</span>.
          </h1>
          <p className="text-[#9ca3af] text-sm font-semibold uppercase tracking-widest opacity-60">
            Your Agency Command Center&nbsp;•&nbsp;Growthify Media AI
          </p>
        </motion.div>

        {/* Right: Globe + Controls — fully separated with enough space */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-center gap-5 shrink-0"
        >
          {/* Globe — its own isolated container, never overlapping */}
          <div className="hidden lg:block relative">
            <div className="w-[120px] h-[120px] overflow-hidden rounded-full border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.15)] bg-[#030712]/60 backdrop-blur-sm">
              <GlobeWidget />
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-[0.2em] text-[#4b5563] whitespace-nowrap">
              Global Reach
            </span>
          </div>

          {/* Vertical divider */}
          <div className="hidden lg:block w-px h-20 bg-white/5" />

          {/* Date + CTA */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.18em] text-[#9ca3af]">
              <Calendar size={13} className="text-[#6366f1] shrink-0" />
              <span>Last 30 Days (Oct 21 – Nov 21)</span>
            </div>
            <Button
              size="sm"
              className="w-full bg-gradient-brand text-white font-black text-[10px] uppercase tracking-[0.2em] h-10 rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-[0_4px_24px_rgba(99,102,241,0.35)] flex items-center justify-center gap-2"
            >
              <RefreshCw size={13} />
              Sync Real-time Data
            </Button>
          </div>
        </motion.div>
      </div>

      {/* ── KPI Stats Row ── */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <motion.div variants={itemVariant}>
          <KPICard title="Total Ad Spend" value={1245678} prefix="₹" delta={+12.4} data={[10, 20, 15, 35, 45, 30, 60]} />
        </motion.div>
        <motion.div variants={itemVariant}>
          <KPICard title="Agency Revenue" value={4523890} prefix="₹" delta={+18.1} data={[60, 80, 70, 90, 110, 130, 150]} />
        </motion.div>
        <motion.div variants={itemVariant}>
          <KPICard title="Blended ROAS" value={3.63} suffix="x" delta={+4.5} data={[2.5, 2.8, 3.1, 2.9, 3.4, 3.8, 3.6]} />
        </motion.div>
        <motion.div variants={itemVariant}>
          <KPICard title="Client Leads" value={12456} delta={-2.1} data={[100, 120, 110, 90, 95, 80, 85]} />
        </motion.div>
      </motion.div>

      {/* ── Main Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[480px]">
        <div className="lg:col-span-8 h-full">
          <SpendChart />
        </div>
        <div className="lg:col-span-4 h-full">
          <PlatformBreakdown />
        </div>
      </div>

      {/* ── Priority AI Opportunities ── */}
      <div className="space-y-6">
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <Sparkles size={15} className="text-[#8b5cf6]" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#6b7280]">Priority AI Opportunities</h3>
            </div>
            <p className="text-[10px] text-[#4b5563] uppercase tracking-widest font-semibold italic ml-6">
              Detected via Adopti Intelligence Engine
            </p>
          </div>
          <Link
            href="/opportunities"
            className="flex items-center gap-1.5 text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] hover:text-white transition-all bg-white/5 hover:bg-white/10 px-4 py-2.5 rounded-xl border border-white/5 hover:border-white/10"
          >
            View Full Report
            <ArrowUpRight size={12} />
          </Link>
        </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-6 no-scrollbar -mx-2 px-2">
            <OpportunityCard opportunity={{
              id: '1',
              workspace_id: 'w1',
              campaign_id: 'c1',
              severity: 'critical',
              type: 'cpa_spike',
              title: 'Tier 2 Lead CPA Spike',
              description: 'CPA increased 32% in the last 48 hours for real estate campaigns across MP and Rajasthan.',
              metric_delta: -32,
              ai_narrative: "Auction competition is spiking on Meta. I recommend shifting 20% budget to Display Network to maintain lead velocity.",
              status: 'open',
              detected_at: new Date().toISOString(),
              campaign: { name: 'Lead Gen MP' } as any
            }} />

            <OpportunityCard opportunity={{
              id: '2',
              workspace_id: 'w1',
              campaign_id: 'c2',
              severity: 'warning',
              type: 'budget_cap',
              title: 'Google Search Capped Early',
              description: 'Your high-ROAS Diwali search campaign is hitting daily budget before 2 PM daily in Mumbai.',
              metric_delta: +22,
              ai_narrative: "You're missing ~15 leads daily. Increasing the budget by ₹3,500/day would capture high-intent evening traffic.",
              status: 'open',
              detected_at: new Date().toISOString(),
              campaign: { name: 'Diwali Keywords' } as any
            }} />

            <OpportunityCard opportunity={{
              id: '3',
              workspace_id: 'w1',
              campaign_id: 'c3',
              severity: 'info',
              type: 'budget_scale',
              title: 'App Install Scaling Op',
              description: 'Meta Ads ROAS > 4.5x for 7 consecutive days in Tier 1 cities. Profitable room to scale.',
              metric_delta: +45,
              ai_narrative: "Performance is stellar in Bengaluru and Delhi. A 15% budget injection for the next 72 hours is highly recommended.",
              status: 'open',
              detected_at: new Date().toISOString(),
              campaign: { name: 'App Growth' } as any
            }} />
          </div>
          {/* Right fade mask */}
          <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-[#030712] to-transparent pointer-events-none z-10" />
        </div>
      </div>

      {/* ── Campaign Performance Table ── */}
      <div className="pb-12">
        <CampaignTable />
      </div>

    </div>
  )
}

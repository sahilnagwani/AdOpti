"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpportunityCard } from '@/components/dashboard/OpportunityCard'
import { Opportunity } from '@/types'

const mockOpportunities: any[] = [
  { 
    id: '1', 
    severity: 'critical', 
    type: 'cpa_spike', 
    title: 'Tier 2 Lead CPA Spike', 
    description: 'CPA increased 32% in the last 48 hours for real estate campaigns across MP and Rajasthan.', 
    metric_delta: -32, 
    ai_narrative: "Auction competition is spiking on Meta. I recommend shifting 20% budget to Display Network to maintain lead velocity.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'Lead Gen MP' } as any
  },
  { 
    id: '2', 
    severity: 'warning', 
    type: 'budget_cap', 
    title: 'Google Search Capped Early', 
    description: 'Your high-ROAS Diwali search campaign is hitting daily budget before 2 PM daily in Mumbai.', 
    metric_delta: +22, 
    ai_narrative: "You're missing ~15 leads daily. Increasing the budget by ₹3,500/day would capture high-intent evening traffic.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'Diwali Keywords' } as any
  },
  { 
    id: '3', 
    severity: 'info', 
    type: 'budget_scale', 
    title: 'App Install Scaling Op', 
    description: 'Meta Ads ROAS > 4.5x for 7 consecutive days in Tier 1 cities. Profitable room to scale.', 
    metric_delta: +45, 
    ai_narrative: "Performance is stellar in Bengaluru and Delhi. A 15% budget injection for the next 72 hours is highly recommended.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'App Growth' } as any
  },
  { 
    id: '4', 
    severity: 'critical', 
    type: 'roas_drop', 
    title: 'ROAS Drop: Brand Campaign', 
    description: 'Brand Search ROAS fell from 8.2 to 4.5 in Delhi NCR region since Monday.', 
    metric_delta: -45, 
    ai_narrative: "A new competitor is bidding on your brand keywords. Increase bid cap by 15% immediately to protect market share.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'Brand Search' } as any
  },
  { 
    id: '5', 
    severity: 'warning', 
    type: 'creative_fatigue', 
    title: 'Retargeting Creative Fatigue', 
    description: 'CTR dropped 25% for "Diwali Banner V2" ad set. Frequency is reaching 4.8.', 
    metric_delta: -15, 
    ai_narrative: "Audience has seen this ad too many times. Swap to 'Winter Collection V1' to restore engagement levels.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'Retargeting' } as any
  },
  { 
    id: '6', 
    severity: 'info', 
    type: 'ctr_drop', 
    title: 'CTR Drop on Display', 
    description: 'Performance in Hyderabad leads has slowed down by 12% in the last week.', 
    metric_delta: -12, 
    ai_narrative: "Click-through rates are dipping. I suggest testing a more 'Regional Language' creative for the Telengana audience.", 
    status: 'open', 
    detected_at: new Date().toISOString(),
    campaign: { name: 'Hyd Leads' } as any
  }
]

export default function OpportunitiesPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' 
    ? mockOpportunities 
    : mockOpportunities.filter(o => o.severity === filter)

  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Sparkles size={24} className="animate-pulse" />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1 uppercase tracking-[0.05em]">AI Analysis</h1>
           </div>
           <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest ml-1 opacity-70 italic font-mono">
             Analysis of 2,400+ data points • Found {mockOpportunities.length} opportunities
           </p>
        </div>

        <Tabs defaultValue="all" className="w-full lg:w-auto" onValueChange={setFilter}>
            <TabsList className="bg-surface/50 p-2 rounded-[2rem] border border-white/5 h-16 w-full md:w-[500px] shadow-2xl backdrop-blur-3xl">
                <TabsTrigger value="all" className="flex-1 rounded-[1.25rem] h-full font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all">All</TabsTrigger>
                <TabsTrigger value="critical" className="flex-1 rounded-[1.25rem] h-full font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-[#ef4444]/20 data-[state=active]:text-[#ef4444] transition-all">Critical</TabsTrigger>
                <TabsTrigger value="warning" className="flex-1 rounded-[1.25rem] h-full font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-[#f59e0b]/20 data-[state=active]:text-[#f59e0b] transition-all">Warnings</TabsTrigger>
                <TabsTrigger value="info" className="flex-1 rounded-[1.25rem] h-full font-black uppercase tracking-[0.2em] text-[10px] data-[state=active]:bg-[#06b6d4]/20 data-[state=active]:text-[#06b6d4] transition-all">Growth</TabsTrigger>
            </TabsList>
        </Tabs>
      </div>

      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
            {filtered.map((o) => (
                <motion.div
                    key={o.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 10 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <OpportunityCard opportunity={o} />
                </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

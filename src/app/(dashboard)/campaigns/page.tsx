"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Chrome, Facebook, Target, ChevronRight, BarChart3, Clock, Zap, MousePointer2, AlertCircle, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from '@/lib/utils'
import { SpendChart } from '@/components/charts/SpendChart'

const mockCampaigns = [
  { id: '1', name: 'Diwali Sale - Google Search', platform: 'google_ads', spend: 450000, roas: 3.25, cpa: 450, status: 'active', budget_daily: 25000, spend_pct: 65, impressions: '1.2M', clicks: '45k' },
  { id: '2', name: 'Real Estate Lead Gen - Meta', platform: 'meta_ads', spend: 285000, roas: 1.82, cpa: 1200, status: 'active', budget_daily: 15000, spend_pct: 85, impressions: '850k', clicks: '12k' },
  { id: '3', name: 'E-commerce Winter Q4', platform: 'google_ads', spend: 1250000, roas: 4.15, cpa: 195, status: 'active', budget_daily: 50000, spend_pct: 45, impressions: '4.5M', clicks: '120k' },
  { id: '4', name: 'Brand Awareness - Pan India', platform: 'meta_ads', spend: 120000, roas: 0.85, cpa: 2500, status: 'paused', budget_daily: 10000, spend_pct: 0, impressions: '2.1M', clicks: '8k' },
  { id: '5', name: 'Mobile App Installs - Tier 2', platform: 'google_ads', spend: 64000, roas: 2.10, cpa: 42, status: 'active', budget_daily: 5000, spend_pct: 95, impressions: '420k', clicks: '28k' },
  { id: '6', name: 'YouTube Brand Lift - Q4', platform: 'google_ads', spend: 320000, roas: 0.00, cpa: 0, status: 'ended', budget_daily: 0, spend_pct: 0, impressions: '10.5M', clicks: '240k' },
]

export function CampaignCard({ campaign }: { campaign: any }) {
    const isHighUtil = campaign.spend_pct > 90

    return (
        <Sheet>
            <SheetTrigger>
                <motion.div
                    whileHover={{ scale: 1.02, y: -4, boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)" }}
                    className="glass-card p-7 rounded-[2.5rem] border border-white/5 cursor-pointer flex flex-col group min-h-[340px]"
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5563] opacity-60">ID: {campaign.id}</span>
                            <h3 className="text-md font-black text-white group-hover:text-gradient transition-all leading-snug">{campaign.name}</h3>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/5 border border-white/5 shadow-inner">
                            {campaign.platform === 'google_ads' ? 
                                <Chrome size={20} className="text-[#06b6d4]" /> : 
                                <Facebook size={20} className="text-[#6366f1]" />
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-10">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.2em]">Spend (₹)</span>
                            <span className="text-md font-bold text-white tabular-nums tracking-tight">
                                {campaign.spend >= 100000 ? `${(campaign.spend/100000).toFixed(2)}L` : campaign.spend.toLocaleString('en-IN')}
                            </span>
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.2em]">Live ROAS</span>
                            <span className={cn(
                                "text-md font-black tabular-nums tracking-tight",
                                campaign.roas > 3 ? "text-[#10b981]" : campaign.roas > 1.5 ? "text-[#f59e0b]" : "text-[#ef4444]"
                            )}>{campaign.roas > 0 ? `${campaign.roas}x` : 'N/A'}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-[0.2em]">
                            <span className="text-[#4b5563]">Daily Budget Util.</span>
                            <span className={cn(isHighUtil ? "text-[#f59e0b]" : "text-white")}>{campaign.spend_pct}%</span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden p-[1px]">
                            <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${campaign.spend_pct}%` }}
                                transition={{ duration: 1.5, ease: "circOut" }}
                                className={cn(
                                    "h-full rounded-full transition-all duration-1000 relative",
                                    isHighUtil ? "bg-[#f59e0b]" : "bg-gradient-brand shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-auto pt-5 border-t border-white/10 group-hover:border-white/20 transition-colors">
                        <div className="flex items-center gap-2.5">
                            <div className={cn("w-2 h-2 rounded-full", campaign.status === 'active' ? "bg-[#10b981] shadow-[0_0_10px_#10b98166]" : "bg-[#4b5563]")} />
                            <span className="text-[10px] font-black text-[#4b5563] uppercase tracking-[0.2em]">{campaign.status}</span>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                            <span className="text-[9px] font-black text-[#6366f1] uppercase tracking-[0.2em]">Deep Dive</span>
                            <ChevronRight size={14} className="text-[#6366f1]" />
                        </div>
                    </div>
                </motion.div>
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#030712]/95 backdrop-blur-3xl border-l border-white/10 text-white p-0 w-full sm:max-w-[540px] shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
                <div className="h-full flex flex-col p-8 overflow-y-auto no-scrollbar">
                    <SheetHeader className="mb-10">
                        <div className="flex items-center gap-3 mb-4">
                            <Badge className="bg-gradient-brand border-none text-[10px] font-black tracking-widest px-3 py-1">REAL-TIME</Badge>
                            <span className="text-[10px] font-bold text-[#4b5563] uppercase tracking-[0.3em]">Campaign Analytics</span>
                        </div>
                        <SheetTitle className="text-3xl font-black text-white tracking-tight mb-2">{campaign.name}</SheetTitle>
                        <SheetDescription className="text-[#9ca3af] text-sm font-medium italic">
                            Full performance history and AI insights for this {campaign.platform === 'google_ads' ? 'Google' : 'Meta'} campaign.
                        </SheetDescription>
                    </SheetHeader>

                    <div className="grid grid-cols-2 gap-4 mb-10">
                        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-widest mb-1">Impressions</span>
                            <span className="text-xl font-bold text-white tracking-tight">{campaign.impressions}</span>
                        </div>
                        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex flex-col gap-1">
                            <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-widest mb-1">Clicks</span>
                            <span className="text-xl font-bold text-white tracking-tight">{campaign.clicks}</span>
                        </div>
                    </div>

                    <div className="h-[280px] mb-10 overflow-hidden rounded-3xl border border-white/5">
                        <SpendChart />
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3 px-2">
                            <Zap size={18} className="text-[#8b5cf6]" />
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#4b5563]">AI Growth Insights</h3>
                        </div>
                        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#1f2937]/50 to-transparent border border-white/5 relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles size={32} className="text-[#8b5cf6]" />
                             </div>
                             <p className="text-sm text-[#f9fafb] italic leading-relaxed font-semibold">
                                "This campaign is delivering high ROAS in Mumbai but seeing CPA spikes in Delhi. I recommend reducing bidding in Northern regions by 12% and reinvesting into Western markets before the weekend peak."
                             </p>
                             <div className="flex gap-4 mt-6">
                                <Button className="flex-1 bg-[#6366f1] text-[10px] font-black tracking-widest uppercase h-11 rounded-xl">Apply Shift</Button>
                                <Button variant="outline" className="flex-1 border-white/10 bg-white/5 text-[10px] font-black tracking-widest uppercase h-11 rounded-xl">Dismiss</Button>
                             </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}

export default function CampaignsPage() {
    return (
        <div className="space-y-12 max-w-7xl mx-auto pb-12">
             <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                            <Target size={24} />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1 uppercase tracking-[0.05em]">Campaign Grid</h1>
                    </div>
                    <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest ml-1 opacity-70 italic font-mono">
                        Managing {mockCampaigns.length} campaigns across 2 platforms
                    </p>
                </div>

                <div className="flex items-center gap-4 w-full lg:w-auto">
                    <div className="relative group flex-1 lg:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={18} />
                        <Input 
                            placeholder="Find campaign by name or ID..." 
                            className="h-14 bg-surface/80 border-white/5 pl-12 rounded-2xl focus:ring-2 focus:ring-[#6366f1]/20 text-white shadow-inner font-bold text-xs tracking-wide" 
                        />
                    </div>
                    <Button variant="outline" className="h-14 w-14 rounded-2xl bg-surface/80 border-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all shadow-xl">
                        <Filter size={20} className="text-[#4b5563]" />
                    </Button>
                </div>
             </div>

             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
             >
                 {mockCampaigns.map((c, i) => (
                    <motion.div
                        key={c.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <CampaignCard campaign={c} />
                    </motion.div>
                 ))}
             </motion.div>
        </div>
    )
}

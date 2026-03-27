"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chrome, Facebook, Target, MousePointer2, TrendingUp, Zap, HelpCircle } from 'lucide-react'
import { KPICard } from '@/components/dashboard/KPICard'
import { SpendChart } from '@/components/charts/SpendChart'
import { CampaignTable } from '@/components/charts/CampaignTable'
import { cn } from '@/lib/utils'

export default function PlatformsPage() {
  const [activeTab, setActiveTab] = useState('google_ads')

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-3">
           <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center text-white shadow-lg">
                  <Target size={22} />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1 uppercase tracking-[0.05em]">Platform Intelligence</h1>
           </div>
           <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest ml-1 opacity-70 italic font-mono">Channel-specific deep dives • Oct 2024</p>
      </div>

      <Tabs defaultValue="google_ads" className="w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <TabsList className="bg-surface/50 p-1.5 rounded-[1.5rem] border border-white/5 h-16 w-full md:w-[460px] shadow-2xl backdrop-blur-3xl">
                <TabsTrigger value="google_ads" className="flex-1 rounded-xl h-full data-[state=active]:bg-gradient-brand data-[state=active]:text-white data-[state=active]:shadow-[0_4px_24px_rgba(99,102,241,0.3)] transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <Chrome size={18} className={activeTab === 'google_ads' ? 'text-white' : 'text-[#4b5563] group-hover:text-white'} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Google Ads</span>
                    </div>
                </TabsTrigger>
                <TabsTrigger value="meta_ads" className="flex-1 rounded-xl h-full data-[state=active]:bg-[#06b6d4] data-[state=active]:text-white data-[state=active]:shadow-[0_4px_24px_rgba(6,182,212,0.3)] transition-all duration-300 group">
                    <div className="flex items-center gap-3">
                        <Facebook size={18} className={activeTab === 'meta_ads' ? 'text-white' : 'text-[#4b5563] group-hover:text-white'} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:tracking-[0.3em] transition-all">Meta Ads</span>
                    </div>
                </TabsTrigger>
            </TabsList>
            
            <div className="flex gap-4">
                <div className="px-5 py-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-center gap-3 cursor-pointer group">
                    <Zap size={14} className="text-[#8b5cf6]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#9ca3af] group-hover:text-white transition-colors">Compare Period</span>
                </div>
            </div>
        </div>

        <TabsContent value="google_ads" className="space-y-12 mt-0 focus-visible:outline-none ring-0">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <KPICard title="Google Spend" value={824560} prefix="₹" delta={+8.4} data={[10, 20, 15, 35, 45, 30, 60]} />
                <KPICard title="Search Revenue" value={2523890} prefix="₹" delta={+12.1} data={[60, 80, 70, 90, 110, 130, 150]} />
                <KPICard title="Google ROAS" value={3.06} suffix="x" delta={+2.5} data={[2.5, 2.8, 3.1, 2.9, 3.4, 3.8, 3.6]} />
                <KPICard title="Search CPA Avg" value={420} prefix="₹" delta={-5.2} data={[100, 120, 110, 90, 95, 80, 85]} />
            </motion.div>
            
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <SpendChart />
            </motion.div>
            
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <CampaignTable />
            </motion.div>
        </TabsContent>

        <TabsContent value="meta_ads" className="space-y-12 mt-0 focus-visible:outline-none ring-0">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
                <KPICard title="Meta Spend" value={421118} prefix="₹" delta={+14.2} data={[20, 30, 25, 45, 60, 40, 80]} />
                <KPICard title="Meta Revenue" value={1823100} prefix="₹" delta={+24.5} data={[40, 60, 50, 80, 100, 120, 160]} />
                <KPICard title="Meta ROAS" value={4.33} suffix="x" delta={+6.8} data={[3.5, 3.2, 4.1, 3.9, 4.5, 4.8, 4.3]} />
                <KPICard title="Meta CPA Avg" value={192} prefix="₹" delta={-12.4} data={[150, 140, 130, 110, 105, 100, 92]} />
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                <SpendChart />
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <CampaignTable />
            </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Chrome, Facebook } from 'lucide-react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { formatINRCompact, formatROAS } from '@/lib/formatters'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

const mockCampaigns = [
  { id: '1', name: 'Diwali Sale - Google Search', platform: 'google_ads', spend: 450000, roas: 3.25, cpa: 450, status: 'active', trend: [20, 45, 30, 75, 55, 95, 85] },
  { id: '2', name: 'Real Estate Lead Gen - Meta', platform: 'meta_ads', spend: 285000, roas: 1.82, cpa: 1200, status: 'active', trend: [85, 75, 95, 65, 45, 55, 35] },
  { id: '3', name: 'E-commerce Winter Q4', platform: 'google_ads', spend: 1250000, roas: 4.15, cpa: 195, status: 'active', trend: [40, 60, 50, 90, 110, 130, 150] },
  { id: '4', name: 'Brand Awareness - Pan India', platform: 'meta_ads', spend: 120000, roas: 0.85, cpa: 2500, status: 'paused', trend: [20, 20, 20, 15, 10, 5, 5] },
  { id: '5', name: 'Mobile App Installs - Tier 2', platform: 'google_ads', spend: 64000, roas: 2.10, cpa: 42, status: 'active', trend: [30, 40, 35, 60, 55, 70, 65] },
]

export function CampaignTable() {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<'spend' | 'roas' | 'cpa'>('spend');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: 'spend' | 'roas' | 'cpa') => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('desc');
    }
  };

  const sortedCampaigns = useMemo(() => {
    return [...mockCampaigns].sort((a, b) => {
      let aVal: any = a[sortKey as keyof typeof a];
      let bVal: any = b[sortKey as keyof typeof b];
      
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortOrder]);
  return (
    <div className="glass-card rounded-[1.5rem] overflow-hidden">
      <div className="px-8 py-6 border-b border-[#1f2937] flex justify-between items-center bg-[#0f1117]/50">
        <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4b5563]">Top Campaigns</h3>
            <p className="text-[10px] text-[#9ca3af] uppercase tracking-widest mt-1 font-medium italic">High volume performers this week</p>
        </div>
        <button className="text-[10px] font-black text-[#6366f1] uppercase tracking-[0.2em] hover:text-[#8b5cf6] transition-all hover:tracking-[0.3em]">
            View Analysis →
        </button>
      </div>
      <div className="overflow-x-auto no-scrollbar">
        <Table>
          <TableHeader className="bg-[#030712]/50 border-[#1f2937]">
            <TableRow className="border-[#1f2937] hover:bg-transparent transition-none">
              <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 pl-8">Campaign Name</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14">Platform</TableHead>
              <TableHead 
                className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 cursor-pointer hover:text-white transition-colors flex items-center gap-1"
                onClick={() => handleSort('spend')}
              >
                Spend (₹)
                {sortKey === 'spend' && (
                  sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                )}
              </TableHead>
              <TableHead 
                className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 text-center cursor-pointer hover:text-white transition-colors flex items-center justify-center gap-1"
                onClick={() => handleSort('roas')}
              >
                ROAS
                {sortKey === 'roas' && (
                  sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                )}
              </TableHead>
              <TableHead 
                className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 cursor-pointer hover:text-white transition-colors flex items-center gap-1"
                onClick={() => handleSort('cpa')}
              >
                CPA (₹)
                {sortKey === 'cpa' && (
                  sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
                )}
              </TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 text-center">Status</TableHead>
              <TableHead className="text-[10px] uppercase font-black tracking-[0.2em] text-[#4b5563] h-14 pr-8">7D Performance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCampaigns.map((c, idx) => (
              <TableRow key={c.id} className="border-[#1f2937] group hover:bg-[#6366f1]/5 transition-all duration-300">
                <TableCell className="font-bold text-white text-sm py-5 pl-8 max-w-[280px] truncate">
                  <button 
                    onClick={() => router.push(`/platform/${c.platform === 'google_ads' ? 'google' : 'meta'}`)}
                    className="hover:text-[#6366f1] transition-colors text-left"
                  >
                    {c.name}
                  </button>
                </TableCell>
                <TableCell>
                  {c.platform === 'google_ads' ? (
                      <button 
                        onClick={() => router.push('/platform/google')}
                        className="flex items-center gap-2 group-hover:scale-105 transition-transform origin-left hover:text-[#06b6d4]"
                      >
                          <Chrome size={16} className="text-[#06b6d4]" />
                          <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider group-hover:text-white transition-colors">Google Ads</span>
                      </button>
                  ) : (
                      <button 
                        onClick={() => router.push('/platform/meta')}
                        className="flex items-center gap-2 group-hover:scale-105 transition-transform origin-left hover:text-[#6366f1]"
                      >
                          <Facebook size={16} className="text-[#6366f1]" />
                          <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider group-hover:text-white transition-colors">Meta Ads</span>
                      </button>
                  )}
                </TableCell>
                <TableCell className="tabular-nums font-bold text-white/90 text-sm">
                    {formatINRCompact(c.spend)}
                </TableCell>
                <TableCell className="text-center">
                  <div className={cn(
                      "inline-flex tabular-nums font-black text-xs px-2.5 py-1 rounded-lg",
                      c.roas > 3 ? "text-[#10b981] bg-[#10b981]/10" : c.roas > 1.5 ? "text-[#f59e0b] bg-[#f59e0b]/10" : "text-[#ef4444] bg-[#ef4444]/10"
                  )}>
                      {formatROAS(c.roas)}
                  </div>
                </TableCell>
                <TableCell className="tabular-nums text-[#9ca3af] group-hover:text-white transition-colors text-xs font-bold font-mono">
                    {formatINRCompact(c.cpa)}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                      <motion.div 
                        animate={c.status === 'active' ? { opacity: [0.4, 1, 0.4] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={cn("w-2 h-2 rounded-full", c.status === 'active' ? 'bg-[#10b981] shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#4b5563]')} 
                    />
                      <span className="text-[9px] font-black text-[#4b5563] uppercase tracking-[0.2em] group-hover:text-[#9ca3af] transition-colors">{c.status}</span>
                  </div>
                </TableCell>
                <TableCell className="w-32 pr-8">
                  <div className="w-20 h-8 opacity-40 group-hover:opacity-100 transition-opacity">
                       <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={c.trend.map(v => ({ v }))}>
                            <Line 
                                type="monotone" 
                                dataKey="v" 
                                stroke={c.roas > 1.5 ? (c.roas > 3 ? "#10b981" : "#f59e0b") : "#ef4444"} 
                                strokeWidth={2.5} 
                                dot={false} 
                            />
                          </LineChart>
                      </ResponsiveContainer>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

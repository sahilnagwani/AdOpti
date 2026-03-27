"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Zap, AlertCircle, Info, TrendingUp, TrendingDown, Clock, MousePointer2, Hammer } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Opportunity } from '@/types'

const iconMap = {
    budget_scale: TrendingUp,
    budget_cap: Clock,
    pause_campaign: AlertCircle,
    creative_fatigue: Info,
    cpa_spike: TrendingDown,
    roas_drop: AlertCircle,
    ctr_drop: MousePointer2,
}

const severityMap = {
    critical: { icon: AlertCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
    warning: { icon: Zap, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    info: { icon: Info, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
}

export function OpportunityCard({ opportunity }: { opportunity: Opportunity }) {
  const { severity, type, title, description, metric_delta, ai_narrative } = opportunity
  const config = severityMap[severity] || severityMap.info
  // @ts-ignore
  const Icon = iconMap[type] || Info

  return (
    <motion.div
      whileHover={{ y: -4, rotate: 0.5, boxShadow: `0 10px 40px -10px ${config.color}33` }}
      animate={severity === 'critical' ? { 
        boxShadow: [
            `0 0 0 1px ${config.color}33`, 
            `0 0 20px 2px ${config.color}44`, 
            `0 0 0 1px ${config.color}33`
        ] 
      } : {}}
      transition={severity === 'critical' ? { duration: 2, repeat: Infinity } : { duration: 0.2 }}
      className="glass-card min-w-[340px] max-w-[400px] p-6 rounded-3xl flex flex-col gap-5 border-t-4 shadow-xl"
      style={{ borderTopColor: config.color }}
    >
        <div className="flex justify-between items-start relative z-10">
            <div className="p-2.5 rounded-2xl shadow-inner border border-white/5" style={{ backgroundColor: config.bg }}>
                <Icon size={22} style={{ color: config.color }} />
            </div>
            {metric_delta && (
                <div className={cn(
                    "text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-[0.1em] shadow-sm",
                    metric_delta > 0 ? "bg-[#10b981]/20 text-[#10b981]" : "bg-[#ef4444]/20 text-[#ef4444]"
                )}>
                    {metric_delta > 0 ? '↑' : '↓'} {Math.abs(metric_delta)}%
                </div>
            )}
        </div>

        <div className="relative z-10">
            <h4 className="text-md font-black text-white mb-2 tracking-tight group-hover:text-gradient">{title}</h4>
            <p className="text-[11px] text-[#9ca3af] leading-[1.6] font-medium">{description}</p>
        </div>

        {ai_narrative && (
            <div className="bg-gradient-to-br from-white/5 to-transparent p-4 rounded-2xl border border-white/[0.03] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-2 opacity-20 transition-opacity group-hover:opacity-40">
                     <Zap size={14} className="text-[#8b5cf6]" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#8b5cf6] bg-[#8b5cf6]/10 px-2 py-0.5 rounded-md">Adopti AI</span>
                </div>
                <p className="text-[10px] text-[#9ca3af] italic leading-relaxed font-semibold">
                    "{ai_narrative}"
                </p>
            </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto relative z-10">
            <div className="flex items-center gap-2 max-w-[120px]">
                <div className="w-1.5 h-1.5 rounded-full bg-[#1f2937]" />
                <span className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.1em] truncate">{opportunity.campaign?.name || 'Diwali Sale'}</span>
            </div>
            <button className="flex items-center gap-2 text-[10px] font-black text-white bg-white/5 px-4 py-2 rounded-xl hover:bg-gradient-brand transition-all uppercase tracking-[0.1em] border border-white/5">
                <Hammer size={12} className="stroke-[3px]" />
                Apply Fix
            </button>
        </div>
    </motion.div>
  )
}

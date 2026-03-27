"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, Download, Clock, Plus, Filter, PieChart, BarChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const reports = [
  { id: '1', title: 'Growthify Performance Weekly', type: 'weekly', date: 'Nov 14 - Nov 21', status: 'ready', size: '2.4 MB' },
  { id: '2', title: 'Google Ads Audit - Diwali Focus', type: 'platform', date: 'Nov 01 - Nov 20', status: 'ready', size: '4.8 MB' },
  { id: '3', title: 'Meta Lead Gen Deep Dive - Q4', type: 'performance', date: 'Nov 01 - Nov 21', status: 'ready', size: '9.2 MB' },
  { id: '4', title: 'Agency Wide Summary Q3', type: 'performance', date: 'Jul 01 - Sep 30', status: 'ready', size: '15.4 MB' },
]

export default function ReportsPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
        <div className="flex flex-col gap-3">
           <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <FileText size={24} />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1 uppercase tracking-[0.05em]">Report Suite</h1>
           </div>
           <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest ml-1 opacity-70 italic font-mono">Automated white-label reporting • {reports.length} ready</p>
        </div>

        <Button className="h-14 px-10 rounded-[1.25rem] bg-gradient-brand text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_8px_32px_rgba(99,102,241,0.3)] hover:scale-105 active:scale-95 transition-all flex gap-4">
            <Plus size={18} className="stroke-[4px]" />
            New Report Build
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 px-4 md:px-0">
          {[
              { title: 'Weekly Recap', icon: PieChart, color: '#6366f1', desc: 'Summary of spend, ROAS, and platform distribution across all clients.' },
              { title: 'Channel Audit', icon: BarChart, color: '#06b6d4', desc: 'Granular platform-level analysis with campaign deep-dives.' },
              { title: 'Custom Export', icon: Filter, color: '#8b5cf6', desc: 'Rule-based metrics export with white-label branding headers.' },
          ].map((template, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8, boxShadow: `0 10px 40px -10px ${template.color}33` }}
                className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col items-center group cursor-pointer transition-all duration-500 shadow-2xl relative overflow-hidden h-[340px]"
              >
                 <div className="w-20 h-20 rounded-[2.5rem] bg-[#030712] border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-inner relative z-10">
                    <template.icon size={36} style={{ color: template.color }} className="group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]" />
                 </div>
                 <h3 className="text-xl font-black text-white mb-3 uppercase tracking-tight tracking-[0.05em] relative z-10">{template.title}</h3>
                 <p className="text-[11px] text-[#4b5563] text-center font-bold uppercase tracking-widest leading-relaxed px-6 opacity-70 group-hover:text-[#9ca3af] transition-colors relative z-10">
                    {template.desc}
                 </p>
                 <div className="mt-auto relative z-10">
                    <span className="text-[10px] font-black text-[#6366f1] underline-offset-[6px] underline decoration-2 decoration-transparent group-hover:decoration-[inherit] group-hover:text-white transition-all uppercase tracking-[0.2em]">Start Template →</span>
                 </div>
              </motion.div>
          ))}
      </div>

      <div className="glass-card rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
          <div className="px-10 py-8 border-b border-white/10 flex justify-between items-center bg-[#0f1117]/60 backdrop-blur-2xl">
              <div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#4b5563]">Recently Generated Archives</h3>
                <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mt-1 opacity-50">Last update: 5 mins ago</p>
              </div>
          </div>
          <div className="overflow-x-auto no-scrollbar">
            <Table>
                <TableHeader className="bg-[#030712]/50 border-b border-white/5">
                <TableRow className="border-none hover:bg-transparent">
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#4b5563] h-16 pl-10">Report Identification</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#4b5563] h-16">Intelligence Type</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#4b5563] h-16">Metrics Interval</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#4b5563] h-16">Vault Status</TableHead>
                    <TableHead className="text-[10px] uppercase font-black tracking-widest text-[#4b5563] h-16 pr-10 text-right">Download Archive</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {reports.map((r, i) => (
                    <TableRow key={r.id} className="border-white/5 group hover:bg-[#6366f1]/5 transition-all duration-300">
                    <TableCell className="font-bold text-white text-sm py-7 pl-10 max-w-[300px] truncate">{r.title}</TableCell>
                    <TableCell>
                        <Badge className="text-[9px] font-black tracking-widest uppercase px-3 py-1.5 bg-white/5 border border-white/10 text-[#9ca3af] group-hover:text-white group-hover:bg-[#6366f1]/20 group-hover:border-[#6366f1]/50 transition-all">
                            {r.type}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold text-[#4b5563] tabular-nums uppercase tracking-[0.1em] group-hover:text-[#9ca3af] transition-colors">{r.date}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.8)]" 
                            />
                            <span className="text-[10px] font-black text-[#10b981] uppercase tracking-[0.2em]">{r.status}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right pr-10">
                        <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-gradient-brand group-hover:text-white group-hover:border-none transition-all duration-300 mb-0 ml-auto flex gap-3 shadow-xl">
                            <Download size={14} className="stroke-[3px]" />
                            <span className="text-[10px] font-black uppercase tracking-[0.15em]">{r.size}</span>
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
          </div>
      </div>
    </div>
  )
}

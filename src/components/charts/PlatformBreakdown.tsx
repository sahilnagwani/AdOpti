"use client"

import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { motion } from 'framer-motion'

const data = [
  { name: 'Google Ads', value: 65, color: '#6366f1' },
  { name: 'Meta Ads', value: 35, color: '#06b6d4' },
]

export function PlatformBreakdown() {
  return (
    <div className="w-full h-full glass-card p-6 rounded-2xl flex flex-col min-h-[420px]">
       <div className="mb-10">
           <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4b5563]">Platform Breakdown</h3>
           <p className="text-xs text-[#9ca3af] mt-1 font-medium italic">Share of total ad spend</p>
       </div>

       <div className="flex-1 w-full relative flex items-center justify-center">
           <ResponsiveContainer width="100%" height={240}>
               <PieChart>
                   <Pie
                       data={data}
                       cx="50%"
                       cy="50%"
                       innerRadius={75}
                       outerRadius={105}
                       paddingAngle={10}
                       dataKey="value"
                       startAngle={90}
                       endAngle={450}
                       animationDuration={1500}
                       animationBegin={200}
                   >
                       {data.map((entry, index) => (
                           <Cell 
                                key={`cell-${index}`} 
                                fill={entry.color} 
                                stroke="transparent"
                                className="hover:opacity-80 transition-opacity cursor-pointer focus:outline-none"
                                strokeWidth={0}
                           />
                       ))}
                   </Pie>
                   <Tooltip 
                       contentStyle={{ 
                            backgroundColor: '#0f1117', 
                            border: '1px solid #1f2937', 
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                        }}
                       itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                   />
               </PieChart>
           </ResponsiveContainer>

           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none flex flex-col items-center">
                <span className="text-4xl font-black text-white tabular-nums tracking-tighter">100%</span>
                <p className="text-[10px] uppercase font-bold text-[#4b5563] tracking-[0.2em] mt-2">Distribution</p>
           </div>
       </div>

       <div className="mt-8 grid grid-cols-1 gap-4">
           {data.map((entry, index) => (
               <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
               >
                   <div className="flex items-center gap-3">
                       <div className="w-3 h-3 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.5)]" style={{ backgroundColor: entry.color }} />
                       <span className="text-xs font-bold text-white tracking-wide uppercase">{entry.name}</span>
                   </div>
                   <div className="flex items-center gap-6">
                        <span className="text-xs font-black text-[#6366f1] tabular-nums">{entry.value}%</span>
                        <div className="w-px h-3 bg-[#1f2937]" />
                        <span className="text-xs font-bold text-white tabular-nums prose prose-invert">₹{(entry.value * 24500).toLocaleString('en-IN')}</span>
                   </div>
               </motion.div>
           ))}
       </div>
    </div>
  )
}

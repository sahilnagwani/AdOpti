"use client"

import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'

interface DataPoint {
  date: string
  spend: number
  revenue: number
}

const mockData: DataPoint[] = [
  { date: '2024-03-01', spend: 12000, revenue: 32000 },
  { date: '2024-03-02', spend: 15000, revenue: 38000 },
  { date: '2024-03-03', spend: 18000, revenue: 45000 },
  { date: '2024-03-04', spend: 14000, revenue: 62000 },
  { date: '2024-03-05', spend: 22000, revenue: 58000 },
  { date: '2024-03-06', spend: 25000, revenue: 84000 },
  { date: '2024-03-07', spend: 30000, revenue: 95000 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0f1117] border border-[#1f2937] p-3 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#4b5563] mb-2">
            {format(new Date(label), 'MMM dd, yyyy')}
        </p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-xs text-[#9ca3af]">{entry.name}:</span>
              </div>
              <span className="text-xs font-bold text-white tabular-nums">
                ₹{entry.value.toLocaleString('en-IN')}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

export function SpendChart() {
  return (
    <div className="w-full h-full glass-card p-6 rounded-2xl flex flex-col min-h-[400px]">
       <div className="flex justify-between items-center mb-10">
           <div className="flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#4b5563]">Performance Trend</h3>
                <p className="text-xs text-[#9ca3af] mt-1 font-medium italic">Ad spend vs revenue (₹)</p>
           </div>
           
           <div className="flex gap-6 items-center">
               <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#6366f1] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                   <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Spend</span>
               </div>
               <div className="flex items-center gap-2">
                   <div className="w-2.5 h-2.5 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                   <span className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider">Revenue</span>
               </div>
           </div>
       </div>
       
       <div className="flex-1 w-full">
         <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" opacity={0.5} />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
                tickFormatter={(val) => format(new Date(val), 'MMM d')}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
                tickFormatter={(val) => val >= 1000 ? `₹${val/1000}k` : `₹${val}`}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                  name="Revenue"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                  strokeWidth={3}
                  animationDuration={2000}
              />
              <Area 
                  name="Spend"
                  type="monotone" 
                  dataKey="spend" 
                  stroke="#6366f1" 
                  fillOpacity={1} 
                  fill="url(#colorSpend)" 
                  strokeWidth={3}
                  animationDuration={2500}
              />
            </AreaChart>
         </ResponsiveContainer>
       </div>
    </div>
  )
}

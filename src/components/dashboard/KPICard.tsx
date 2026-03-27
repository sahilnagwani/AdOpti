"use client"

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { formatINRCompact } from '@/lib/formatters'

interface KPICardProps {
  title: string
  value: number
  prefix?: string
  suffix?: string
  delta: number
  data: number[]
  status?: 'success' | 'warning' | 'danger'
}

function NumberCounter({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness: 40, damping: 20, bounce: 0 })
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    motionValue.set(value)
  }, [value, motionValue])

  useEffect(() => {
    return springValue.on("change", (latest) => {
      setDisplayValue(Math.floor(latest))
    })
  }, [springValue])

  const formatValue = (val: number) => {
    return formatINRCompact(val);
  }

  return (
    <span className="tabular-nums font-bold text-3xl text-white tracking-tight">
      {formatValue(displayValue)}
    </span>
  )
}

export function KPICard({ title, value, prefix, suffix, delta, data }: KPICardProps) {
  const isPositive = delta >= 0
  const chartData = data.map((d, i) => ({ val: d }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, boxShadow: "0 0 0 1px rgba(99,102,241,0.4), 0 8px 32px rgba(99,102,241,0.15)" }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.35 }}
      className="glass-card p-6 rounded-2xl flex flex-col justify-between min-h-[180px] relative overflow-hidden group cursor-pointer"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-brand opacity-[0.03] blur-[40px] rounded-full -mr-16 -mt-16 group-hover:opacity-[0.08] transition-opacity duration-500" />

        <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4b5563] group-hover:text-[#9ca3af] transition-colors duration-300">
                {title}
            </span>
            <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold backdrop-blur-sm",
                isPositive ? "bg-[#10b981]/10 text-[#10b981]" : "bg-[#ef4444]/10 text-[#ef4444]"
            )}>
                {isPositive ? <ArrowUpRight size={12} className="stroke-[3px]" /> : <ArrowDownRight size={12} className="stroke-[3px]" />}
                {Math.abs(delta)}%
            </div>
        </div>

        <div className="flex items-end justify-between gap-4 relative z-10">
            <div className="flex flex-col">
                <NumberCounter value={value} prefix={prefix} suffix={suffix} />
                <span className="text-[10px] text-[#4b5563] mt-1.5 font-bold uppercase tracking-wider">vs last 30 days</span>
            </div>

            <div className="w-24 h-14 opacity-50 group-hover:opacity-100 transition-opacity duration-500">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <Line 
                            type="monotone" 
                            dataKey="val" 
                            stroke={isPositive ? "#10b981" : "#ef4444"} 
                            strokeWidth={2.5} 
                            dot={false}
                            animationDuration={2000}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    </motion.div>
  )
}

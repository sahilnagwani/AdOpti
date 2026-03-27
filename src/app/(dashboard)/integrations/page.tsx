"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Chrome, Facebook, RefreshCw, Zap, ExternalLink, ShieldCheck, Mail, Globe, Box } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const platforms = [
  { 
    id: 'google_ads', 
    name: 'Google Ads', 
    icon: Chrome, 
    color: '#06b6d4', 
    status: 'connected', 
    last_sync: '12 mins ago',
    accounts: 3,
    description: 'Track Search, Display, and YouTube campaigns across India.'
  },
  { 
    id: 'meta_ads', 
    name: 'Meta Ads', 
    icon: Facebook, 
    color: '#6366f1', 
    status: 'connected', 
    last_sync: '45 mins ago',
    accounts: 5,
    description: 'Analyze Facebook & Instagram performance and creative fatigue.'
  },
  { 
    id: 'linkedin_ads', 
    name: 'LinkedIn Ads', 
    icon: ExternalLink, 
    color: '#0077b5', 
    status: 'disconnected', 
    last_sync: null,
    accounts: 0,
    description: 'B2B lead generation analytics for IT and SaaS audiences.'
  },
  { 
    id: 'snapchat_ads', 
    name: 'Snapchat', 
    icon: Zap, 
    color: '#fffc00', 
    status: 'disconnected', 
    last_sync: null,
    accounts: 0,
    description: 'Reach Gen-Z Indian audiences with Video & AR lenses.'
  },
  { 
    id: 'amazon_ads', 
    name: 'Amazon Ads', 
    icon: Box, 
    color: '#ff9900', 
    status: 'disconnected', 
    last_sync: null,
    accounts: 0,
    description: 'Marketplace performance for Indian e-commerce agencies.'
  }
]

export default function IntegrationsPage() {
  return (
    <div className="space-y-12 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col gap-3">
           <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <Zap size={24} />
               </div>
               <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-1 uppercase tracking-[0.05em]">Integrations</h1>
           </div>
           <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest ml-1 opacity-70 italic font-mono">Connect your enterprise ad accounts for AI-first ops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {platforms.map((p, i) => (
              <motion.div 
                key={p.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-10 rounded-[3rem] border border-white/5 flex flex-col items-center text-center group h-[400px] relative overflow-hidden shadow-2xl transition-all duration-500 hover:border-white/10"
              >
                  {/* Glassy Background Flare */}
                  <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-glow opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none" />
                  
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-24 h-24 rounded-[2rem] bg-[#030712] border border-white/5 flex items-center justify-center shadow-inner mb-8 relative z-10"
                  >
                      <p.icon size={44} style={{ color: p.color }} className="group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.3)] transition-all" />
                  </motion.div>

                  <div className="relative z-10 mb-auto">
                    <h3 className="text-2xl font-black text-white mb-3 tracking-tight">{p.name}</h3>
                    <p className="text-xs text-[#9ca3af] leading-[1.6] max-w-[240px] font-medium italic opacity-60 group-hover:opacity-90 transition-opacity">"{p.description}"</p>
                  </div>

                  {p.status === 'connected' ? (
                      <div className="w-full relative z-10 space-y-6 pt-6">
                          <div className="flex flex-col gap-1.5 items-center">
                              <Badge className="bg-[#10b981]/10 text-[#10b981] border-none text-[9px] font-black tracking-[0.2em] px-3 py-1.5 flex gap-2 items-center">
                                  <ShieldCheck size={12} className="stroke-[3px]" />
                                  ACTIVE CONNECTION
                              </Badge>
                              <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.15em] mt-1 italic">Last synchronized: {p.last_sync}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <Button variant="outline" className="h-12 border-white/5 bg-white/5 text-[9px] font-bold tracking-[0.2em] uppercase rounded-xl hover:bg-white/10 transition-all">Accounts ({p.accounts})</Button>
                            <Button className="h-12 bg-gradient-brand text-[9px] font-black tracking-[0.2em] uppercase rounded-xl shadow-lg hover:shadow-[0_8px_24px_rgba(99,102,241,0.4)] transition-all flex gap-2">
                                <RefreshCw size={12} className="stroke-[3px]" />
                                Sync
                            </Button>
                          </div>
                      </div>
                  ) : (
                      <div className="w-full relative z-10 mt-6 pt-6 border-t border-white/5">
                          <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 group-hover:bg-gradient-brand group-hover:border-transparent transition-all duration-300 text-[11px] font-black uppercase tracking-[0.2em] text-white">
                              Connect Experience →
                          </Button>
                      </div>
                  )}
              </motion.div>
          ))}
      </div>
    </div>
  )
}

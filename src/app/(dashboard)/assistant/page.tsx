"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  Zap,
  User,
  Bot,
  Terminal,
  Search,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'


const suggestedPrompts = [
  { text: "Which campaign has best ROAS?", icon: Zap },
  { text: "Why did Meta CPA increase?", icon: Search },
  { text: "Accounts close to budget cap?", icon: Terminal },
  { text: "Performance summary for client X", icon: MessageSquare },
  { text: "Improve CTR for Diwali sale?", icon: Sparkles }
]

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Namaste! I'm your Adopti Analyst. Ask me anything about your current ad performance. I have real-time access to your Mumbai, Delhi, and Bengaluru campaign data." }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = async (text = input) => {
    if (!text.trim()) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsTyping(true)

    // Simulating Real Streaming Flow
    // In actual use: fetch('/api/assistant', { method: 'POST', body: JSON.stringify({ message: text, workspaceId: currentWorkspace.id }) })
    setTimeout(() => {
        setIsTyping(false)
        setMessages(prev => [...prev, { 
            role: 'assistant', 
            content: "Based on my analysis of your Meta Ad accounts in the last 48 hours, your CPA has spiked by 32% in Mumbai. This is likely due to the Diwali auction heat. I recommend shifting ₹12,000 from 'Top-of-Funnel' to 'Retargeting' where conversions are still stable at ₹192 per lead." 
        }])
    }, 2000)
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-140px)] gap-8 overflow-hidden max-w-7xl mx-auto">
      {/* Suggestions Sidebar */}
      <div className="hidden lg:flex flex-col w-[320px] gap-6 overflow-y-auto no-scrollbar pt-2">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-6 rounded-[2rem] border border-white/5 relative overflow-hidden"
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-[#8b5cf6]" />
                </div>
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#4b5563]">Quick Actions</h3>
            </div>
            <div className="space-y-3">
                {suggestedPrompts.map((p, i) => (
                    <button 
                        key={i} 
                        onClick={() => handleSend(p.text)}
                        className="w-full text-left p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-[#6366f1]/40 hover:bg-[#6366f1]/10 transition-all group relative overflow-hidden flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <p className="text-[11px] font-bold text-[#9ca3af] group-hover:text-white transition-colors">{p.text}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#4b5563] group-hover:text-[#6366f1] transition-colors" />
                    </button>
                ))}
            </div>
        </motion.div>

        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 glass-card p-8 rounded-[2rem] border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-glow opacity-30" />
            <div className="w-20 h-20 rounded-full bg-gradient-brand opacity-10 blur-2xl absolute" />
            <Bot size={56} className="text-[#6366f1] mb-6 opacity-30" />
            <h4 className="text-xs font-black text-white uppercase tracking-widest mb-2">Claude 3.5 Powered</h4>
            <p className="text-[10px] font-bold text-[#4b5563] uppercase tracking-[0.15em] leading-relaxed max-w-[200px]">
                Ask for custom metric chips or campaign analysis directly in chat.
            </p>
        </motion.div>
      </div>

      {/* Main Chat Area */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 flex flex-col glass-card rounded-[2.5rem] border border-white/10 relative overflow-hidden shadow-2xl bg-surface/30 backdrop-blur-3xl"
      >
         {/* Chat Header */}
         <div className="px-10 py-7 border-b border-white/10 flex justify-between items-center bg-[#0f1117]/60 backdrop-blur-xl">
             <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-[1.25rem] bg-gradient-brand flex items-center justify-center text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    <Sparkles size={22} className="animate-pulse" />
                 </div>
                 <div className="flex flex-col">
                    <h2 className="text-lg font-black text-white tracking-tight uppercase tracking-[0.05em]">Adopti AI Partner</h2>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                        <span className="text-[9px] font-black text-[#10b981] uppercase tracking-[0.2em]">Contextual Analyst Online</span>
                    </div>
                 </div>
             </div>
             
             <div className="flex items-center gap-3">
                 <Badge className="bg-[#1f2937] text-[#9ca3af] hover:bg-[#1f2937] border-none font-bold text-[9px] px-3">INDIA MARKET MODE</Badge>
             </div>
         </div>

         {/* Messages Scroll Area */}
         <div 
             ref={scrollRef}
             className="flex-1 p-10 overflow-y-auto space-y-8 no-scrollbar scroll-smooth"
         >
            {messages.map((m, i) => (
                <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={cn(
                        "flex items-start gap-5 max-w-[80%]",
                        m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                    )}
                >
                    <div className={cn(
                        "w-11 h-11 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-lg border border-white/5 font-bold text-xs",
                        m.role === 'user' ? "bg-white/5 text-[#9ca3af]" : "bg-gradient-brand text-white"
                    )}>
                        {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                    </div>
                    <div className={cn(
                        "p-6 rounded-[2rem] shadow-xl",
                        m.role === 'user' 
                            ? "bg-[#6366f1] text-white rounded-tr-none font-semibold text-sm leading-relaxed" 
                            : "bg-[#0f1117]/80 border border-white/10 text-white rounded-tl-none font-medium text-[14px] leading-relaxed"
                    )}>
                        <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                </motion.div>
            ))}

            {isTyping && (
                <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-lg text-white">
                        <Bot size={20} />
                    </div>
                    <div className="bg-[#0f1117]/80 border border-white/10 p-6 rounded-[2rem] rounded-tl-none shadow-xl">
                        <div className="flex gap-2">
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0 }} className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-[#6366f1]" />
                        </div>
                    </div>
                </div>
            )}
         </div>

         {/* Chat Input */}
         <div className="px-10 py-10 bg-[#0f1117]/80 border-t border-white/10 backdrop-blur-2xl">
             <form 
                 onSubmit={(e) => { e.preventDefault(); handleSend() }}
                 className="relative group flex items-center h-16"
             >
                <Input 
                    placeholder="Describe a campaign goal or ask for optimization tips..." 
                    className="h-full bg-white/5 border-white/5 pl-8 pr-20 rounded-[1.5rem] focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/20 focus:bg-white/10 transition-all font-bold text-white text-sm placeholder:text-[#4b5563] shadow-inner"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button 
                    disabled={!input.trim()}
                    className="absolute right-3 top-3 bottom-3 w-16 rounded-[1.1rem] bg-gradient-brand flex items-center justify-center hover:scale-105 active:scale-95 transition-all text-white disabled:opacity-20 disabled:grayscale shadow-[0_4px_16px_rgba(99,102,241,0.4)]"
                >
                    <Send size={22} className="stroke-[3px]" />
                </button>
             </form>
             <div className="flex justify-center mt-4">
                 <p className="text-[9px] font-bold text-[#4b5563] uppercase tracking-[0.3em]">Claude 3.5 Sonnet Analysis Engine</p>
             </div>
         </div>
      </motion.div>
    </div>
  )
}

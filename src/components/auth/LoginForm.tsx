"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  XCircle,
  Loader2,
  CheckCircle2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, getValues } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (searchParams?.get('signup') === 'success') {
      setSuccess("Account created successfully. Please sign in.")
      const timer = setTimeout(() => setSuccess(null), 5000)
      return () => clearTimeout(timer)
    }
    if (searchParams?.get('error') === 'oauth_failed') {
      setError("Social authentication failed. Please try again.")
    }
  }, [searchParams])

  const onSubmit = async (data: any) => {
    setError(null)
    
    const { error: supaError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    })

    if (supaError) {
      if (supaError.message.includes('Invalid login credentials')) {
          setError("Incorrect email or password. Please try again.")
      } else if (supaError.message.includes('Email not confirmed')) {
          setError("Please verify your email address before signing in.")
      } else if (supaError.status === 429) {
          setError("Too many login attempts. Please wait a few minutes.")
      } else {
          setError(supaError.message)
      }
    } else {
      router.push('/overview')
    }
  }

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
  }

  const handleForgotPassword = async () => {
    const email = getValues('email')
    if (!email) {
        setError("Please enter your email to reset password.")
        return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
        setError(error.message)
    } else {
        setSuccess("Check your email for a reset link.")
    }
  }

  return (
    <motion.div
        animate={error ? { x: [0, -8, 8, -8, 8, 0] } : {}}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[440px] p-10 rounded-[2rem] flex flex-col shadow-2xl relative overflow-hidden ring-1 ring-white/10"
        style={{ backgroundColor: 'rgba(15, 17, 23, 0.85)', backdropFilter: 'blur(24px)' }}
    >
        {/* Logo Heading */}
        <div className="flex flex-col mb-10">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                    <Sparkles className="text-white" size={20} />
                </div>
                <span className="text-3xl font-black tracking-tighter text-gradient uppercase tracking-widest">ADOPTI</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Welcome back</h1>
            <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest mt-2 opacity-60">Sign in to your agency dashboard</p>
        </div>

        <AnimatePresence>
            {success && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-start gap-4"
                >
                    <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-[11px] font-black uppercase tracking-widest text-emerald-500 leading-relaxed">{success}</p>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Google Button */}
        <Button 
            variant="outline" 
            onClick={handleGoogleLogin}
            className="w-full h-12 rounded-xl bg-white border-[#e5e7eb] text-[#1f2937] hover:bg-white/95 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-4 mb-8"
        >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                <path fill="#1976D2" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            <span className="font-bold text-sm tracking-tight">Continue with Google</span>
        </Button>

        {/* Divider */}
        <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-bold">
                <span className="bg-[#0f1117]/0 px-4 text-[#4b5563] tracking-[0.2em]">or sign in with email</span>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 group">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        type="email"
                        placeholder="you@agency.com" 
                        {...register('email', { required: true })}
                        className="h-12 bg-white/5 border-white/5 pl-10 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner"
                    />
                </div>
            </div>

            <div className="space-y-2 group">
                <div className="flex justify-between items-center px-1">
                    <span className="text-white text-xs opacity-0">Hidden</span>
                    <button 
                        type="button" 
                        onClick={handleForgotPassword}
                        className="text-[10px] font-black uppercase tracking-widest text-[#6366f1] hover:text-[#8b5cf6] transition-colors"
                    >
                        Forgot password?
                    </button>
                </div>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Your password" 
                        {...register('password', { required: true })}
                        className="h-12 bg-white/5 border-white/5 pl-10 pr-12 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner"
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                </div>
            </div>

            <Button 
               type="submit"
               disabled={isSubmitting}
               className="w-full h-12 rounded-xl bg-gradient-brand hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-[0.2em] text-white mt-2 shadow-[0_8px_24px_rgba(99,102,241,0.3)] border-none"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </Button>

            <AnimatePresence>
               {error && (
                   <motion.div 
                     initial={{ opacity: 0, y: -8 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-4"
                   >
                       <XCircle className="text-destructive shrink-0" size={18} />
                       <span className="text-[11px] font-black uppercase tracking-[0.05em] text-destructive leading-relaxed">{error}</span>
                   </motion.div>
               )}
            </AnimatePresence>
        </form>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5563]">
            Don't have an account? <Link href="/signup" className="text-[#6366f1] hover:text-[#8b5cf6] transition-all decoration-2 underline-offset-4 hover:underline">Sign up free →</Link>
        </p>
    </motion.div>
  )
}

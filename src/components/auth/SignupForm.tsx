"use client"

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { 
  Mail, 
  Lock, 
  User, 
  Sparkles, 
  Eye, 
  EyeOff, 
  XCircle,
  Loader2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function SignupForm() {
  const router = useRouter()
  const supabase = createClient()
  
  const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  })

  const [showPassword, setShowPassword] = useState(false)
  const [supaError, setSupaError] = useState<string | null>(null)

  const password = watch('password')
  const confirmPassword = watch('confirmPassword')

  const passwordStrength = useMemo(() => {
    if (!password) return 0
    if (password.length < 8) return 1
    const hasNumber = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    if (hasNumber && hasSpecial) return 3
    return 2
  }, [password])

  const onSubmit = async (data: any) => {
    setSupaError(null)
    
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setSupaError(error.message)
    } else {
      router.push('/login?signup=success')
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

  return (
    <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
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
            <h1 className="text-3xl font-black text-white tracking-tight leading-tight">Create your account</h1>
            <p className="text-[#9ca3af] text-sm font-bold uppercase tracking-widest mt-2 opacity-60">Start optimizing your spend today</p>
        </div>

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
                <span className="bg-[#0f1117] px-4 text-[#4b5563] tracking-[0.2em]">or continue with email</span>
            </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2 group">
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        placeholder="Your full name" 
                        {...register('fullName', { required: "Please enter your full name", minLength: { value: 2, message: "Name too short" } })}
                        className={cn(
                            "h-12 bg-white/5 border-white/5 pl-10 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner",
                            errors.fullName && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                        )}
                    />
                </div>
                <AnimatePresence>
                    {errors.fullName && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1 pl-1 border-l-2 border-destructive">
                            {errors.fullName.message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2 group">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        type="email"
                        placeholder="you@agency.com" 
                        {...register('email', { 
                            required: "Please enter your email address",
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" }
                        })}
                        className={cn(
                            "h-12 bg-white/5 border-white/5 pl-10 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner",
                            errors.email && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                        )}
                    />
                </div>
                <AnimatePresence>
                    {errors.email && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1 pl-1 border-l-2 border-destructive">
                            {errors.email.message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2 group">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password" 
                        {...register('password', { required: "Password must be at least 8 characters", minLength: { value: 8, message: "Password must be at least 8 characters" } })}
                        className={cn(
                            "h-12 bg-white/5 border-white/5 pl-10 pr-12 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner",
                            errors.password && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                        )}
                    />
                    <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4b5563] hover:text-white transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    {/* Password strength indicator */}
                    <div className="flex gap-1.5 mt-2 h-1 px-1">
                        <div className={cn("flex-1 rounded-full transition-all duration-500", passwordStrength >= 1 ? "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]" : "bg-white/5")} />
                        <div className={cn("flex-1 rounded-full transition-all duration-500", passwordStrength >= 2 ? "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "bg-white/5")} />
                        <div className={cn("flex-1 rounded-full transition-all duration-500", passwordStrength >= 3 ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-white/5")} />
                    </div>
                </div>
                <AnimatePresence>
                    {errors.password && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1 pl-1 border-l-2 border-destructive mt-1">
                            {errors.password.message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <div className="space-y-2 group">
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#4b5563] group-focus-within:text-[#6366f1] transition-colors" size={16} />
                    <Input 
                        type={showPassword ? "text" : "password"}
                        placeholder="Confirm your password" 
                        {...register('confirmPassword', { 
                            required: "Please confirm your password",
                            validate: (val) => val === password || "Passwords do not match"
                        })}
                        className={cn(
                            "h-12 bg-white/5 border-white/5 pl-10 focus:ring-2 focus:ring-[#6366f1]/20 focus:border-[#6366f1]/50 transition-all text-sm text-white rounded-xl placeholder:text-[#4b5563] font-medium shadow-inner",
                            errors.confirmPassword && "border-destructive/50 ring-destructive/20 focus:border-destructive"
                        )}
                    />
                </div>
                <AnimatePresence>
                    {errors.confirmPassword && (
                        <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-[10px] text-destructive font-black uppercase tracking-widest ml-1 pl-1 border-l-2 border-destructive">
                            {errors.confirmPassword.message}
                        </motion.p>
                    )}
                </AnimatePresence>
            </div>

            <Button 
               type="submit"
               disabled={isSubmitting}
               className="w-full h-12 rounded-xl bg-gradient-brand hover:scale-[1.02] active:scale-[0.98] transition-all font-black uppercase tracking-[0.2em] text-white mt-4 shadow-[0_8px_24px_rgba(99,102,241,0.3)] border-none"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </Button>

            <AnimatePresence>
               {supaError && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0.95 }}
                     animate={{ opacity: 1, scale: 1 }}
                     className="bg-destructive/10 border border-destructive/20 p-4 rounded-xl flex items-center gap-4 mt-2"
                   >
                       <XCircle className="text-destructive shrink-0" size={18} />
                       <span className="text-[11px] font-black uppercase tracking-[0.05em] text-destructive leading-relaxed">{supaError}</span>
                   </motion.div>
               )}
            </AnimatePresence>
        </form>

        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.2em] text-[#4b5563]">
            Already have an account? <Link href="/login" className="text-[#6366f1] hover:text-[#8b5cf6] transition-all decoration-2 underline-offset-4 hover:underline">Sign in ←</Link>
        </p>
    </motion.div>
  )
}

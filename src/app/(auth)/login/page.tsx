"use client"

import React, { Suspense } from 'react'
import { HeroSceneSafe } from '@/components/three/HeroSceneSafe'
import { LoginForm } from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full overflow-hidden bg-[#030712]">
      
      {/* LEFT — 3D scene, completely isolated */}
      <div className="hidden lg:block relative flex-1">
        <HeroSceneSafe />
        
        {/* Isolated Overlay Content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center">
             <h2 className="text-5xl font-black text-white uppercase tracking-[0.2em] opacity-10 transform -rotate-12">
                Adopti
             </h2>
             <p className="text-white text-[10px] font-black uppercase tracking-[0.5em] opacity-10 mt-6 italic">
                Know what to do with your ad spend.
             </p>
        </div>
      </div>
      
      {/* RIGHT — form, no Three.js dependency whatsoever */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-20 bg-gradient-to-l from-[#030712] via-[#030712] lg:via-transparent to-transparent">
        <Suspense fallback={<div className="w-full max-w-[440px] h-[600px] bg-white/5 animate-pulse rounded-[2rem]" />}>
            <LoginForm />
        </Suspense>
      </div>
      
    </main>
  )
}

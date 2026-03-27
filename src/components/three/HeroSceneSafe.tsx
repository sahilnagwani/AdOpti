"use client"

import { Component, ReactNode } from 'react'
import dynamic from 'next/dynamic'

const HeroScene = dynamic(() => import('./HeroScene').then(mod => mod.HeroScene), { 
  ssr: false,
  loading: () => <HeroFallback />
})

class HeroErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  
  componentDidCatch(error: any, errorInfo: any) {
    console.error("HeroScene Error Captured:", error, errorInfo)
  }
  
  render() {
    if (this.state.hasError) {
      return <HeroFallback />
    }
    return this.props.children
  }
}

function HeroFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse at 60% 40%, rgba(99,102,241,0.15), transparent 70%), radial-gradient(ellipse at 20% 80%, rgba(139,92,246,0.1), transparent 60%), #030712',
      position: 'absolute',
      inset: 0
    }} />
  )
}

export function HeroSceneSafe() {
  return (
    <HeroErrorBoundary>
      <HeroScene />
    </HeroErrorBoundary>
  )
}

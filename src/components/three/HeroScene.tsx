"use client"

import React, { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Points, PointMaterial, Environment } from '@react-three/drei'
import * as THREE from 'three'

function ContextHandler() {
  const gl = useThree((state) => state.gl)

  useEffect(() => {
    const canvas = gl.domElement
    
    const handleContextLost = (e: Event) => {
      e.preventDefault()
      console.warn('WebGL context lost - suspending render')
    }
    
    const handleContextRestored = () => {
      console.log('WebGL context restored')
    }
    
    canvas.addEventListener('webglcontextlost', handleContextLost)
    canvas.addEventListener('webglcontextrestored', handleContextRestored)
    
    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost)
      canvas.removeEventListener('webglcontextrestored', handleContextRestored)
    }
  }, [gl])

  return null
}

function AbstractNodes() {
  const pointsRef = useRef<THREE.Points>(null!)
  const groupRef = useRef<THREE.Group>(null!)
  const { mouse } = useThree()

  const count = 120
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  useFrame((state, delta) => {
    if (pointsRef.current) {
        pointsRef.current.rotation.y += delta * 0.05
        pointsRef.current.rotation.x += delta * 0.02
    }
    
    if (groupRef.current) {
        // Smooth mouse parallax
        groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouse.y * 0.1, 0.05)
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, mouse.x * 0.1, 0.05)
    }
  })

  return (
    <group ref={groupRef}>
      <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#6366f1"
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      
      <Float speed={3} rotationIntensity={1.5} floatIntensity={2}>
        <mesh position={[3, 2, -2]}>
          <octahedronGeometry args={[1.5, 0]} />
          <MeshDistortMaterial
            color="#8b5cf6"
            speed={4}
            distort={0.4}
            emissive="#8b5cf6"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
            roughness={0}
          />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={2} floatIntensity={1}>
        <mesh position={[-4, -2, -1]}>
          <torusKnotGeometry args={[1, 0.3, 128, 32]} />
          <MeshDistortMaterial
            color="#06b6d4"
            speed={3}
            distort={0.3}
            emissive="#06b6d4"
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
            roughness={0}
          />
        </mesh>
      </Float>

      <Float speed={4} rotationIntensity={0.5} floatIntensity={3}>
        <mesh position={[0, -4, -3]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <MeshDistortMaterial
            color="#6366f1"
            speed={5}
            distort={0.5}
            emissive="#6366f1"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
            roughness={0}
          />
        </mesh>
      </Float>
    </group>
  )
}

export function HeroScene() {
  // Use a local variable to avoid 'window is not defined' during SSR if not lazily loaded properly
  const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 1.5) : 1

  return (
    <div className="absolute inset-0 z-0 h-full w-full bg-[#030712]">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030712]/50 to-[#030712] z-[1]" />
      <Canvas 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        gl={{ 
            powerPreference: 'low-power',
            antialias: false,
            depth: false,
            stencil: false,
            alpha: true
        }}
        dpr={dpr}
        frameloop="demand"
      >
        <ContextHandler />
        <color attach="background" args={['#030712']} />
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#6366f1" />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#8b5cf6" />
        <pointLight position={[0, 0, 5]} intensity={0.5} color="#06b6d4" />
        <AbstractNodes />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}

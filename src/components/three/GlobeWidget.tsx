"use client"

import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Sphere, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

const cities = [
  { name: 'Mumbai', lat: 19.07, lng: 72.87 },
  { name: 'Delhi', lat: 28.6, lng: 77.2 },
  { name: 'Bengaluru', lat: 12.97, lng: 77.59 },
  { name: 'Hyderabad', lat: 17.38, lng: 78.48 },
]

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

function PulseMarker({ city, isHovered, onHover }: { city: any, isHovered: boolean, onHover: (name: string | null) => void }) {
  const meshRef = useRef<THREE.Mesh>(null!)
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.2
      meshRef.current.scale.set(s, s, s)
    }
  })

  return (
    <group position={city.pos.toArray() as [number, number, number]}>
      <mesh 
        onPointerOver={(e) => {
          e.stopPropagation()
          onHover(city.name)
        }}
        onPointerOut={() => onHover(null)}
      >
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={1} />
      </mesh>
      
      {/* Outer Pulse */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.2} />
      </mesh>

      <Html distanceFactor={10}>
        <div 
          className={`bg-[#0f1117]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#1f2937] text-white text-[10px] whitespace-nowrap font-bold shadow-2xl transition-all duration-300 transform pointer-events-none ${
            isHovered ? 'opacity-100 scale-100 translate-y-[-24px]' : 'opacity-0 scale-90 translate-y-[-10px]'
          }`}
        >
          {city.name}
        </div>
      </Html>
    </group>
  )
}

function Globe() {
  const globeRef = useRef<THREE.Group>(null!)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)

  useFrame((state, delta) => {
    if (!hoveredCity && globeRef.current) {
      globeRef.current.rotation.y += delta * 0.15
    }
  })

  const markers = useMemo(() => {
    return cities.map((city) => ({
      ...city,
      pos: latLngToVector3(city.lat, city.lng, 2),
    }))
  }, [])

  return (
    <group ref={globeRef}>
      {/* Globe Sphere - Grid View */}
      <Sphere args={[2, 48, 48]}>
        <meshStandardMaterial 
            color="#6366f1" 
            wireframe={true} 
            transparent 
            opacity={0.1} 
            emissive="#6366f1" 
            emissiveIntensity={0.3}
        />
      </Sphere>
      
      {/* Glossy inner sphere */}
      <Sphere args={[1.98, 64, 64]}>
        <meshStandardMaterial 
          color="#030712" 
          roughness={0.1} 
          metalness={0.8}
          transparent
          opacity={0.8}
        />
      </Sphere>

      {/* Atmospheric Glow */}
      <Sphere args={[2.5, 32, 32]}>
        <meshBasicMaterial color="#6366f1" transparent opacity={0.02} side={THREE.BackSide} />
      </Sphere>

      {/* Markers */}
      {markers.map((city, i) => (
        <PulseMarker 
            key={i} 
            city={city} 
            isHovered={hoveredCity === city.name} 
            onHover={setHoveredCity} 
        />
      ))}
    </group>
  )
}

export function GlobeWidget() {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 7], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color="#6366f1" />
        <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={1} color="#06b6d4" />
        <Globe />
        <OrbitControls
            enableZoom={false}
            enablePan={false}
            rotateSpeed={0.5}
            dampingFactor={0.05}
            enableDamping
        />
      </Canvas>
    </div>
  )
}

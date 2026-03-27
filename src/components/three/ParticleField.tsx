"use client"

import React, { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles({ count = 150 }) {
  const mesh = useRef<THREE.InstancedMesh>(null!)
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < count; i++) {
        temp.push({
            t: Math.random() * 100,
            speed: 0.005 + Math.random() * 0.01,
            radius: 10 + Math.random() * 15,
            xOffset: (Math.random() - 0.5) * 40,
            yOffset: (Math.random() - 0.5) * 20,
            zOffset: (Math.random() - 0.5) * 10,
        })
    }
    return temp
  }, [count])

  const dummy = useMemo(() => new THREE.Object3D(), [])

  useFrame((state, delta) => {
    particles.forEach((p, i) => {
        p.t += p.speed * 0.5
        const x = p.xOffset + Math.cos(p.t) * 2
        const y = p.yOffset + Math.sin(p.t) * 2
        const z = p.zOffset
        
        dummy.position.set(x, y, z)
        const s = 0.5 + Math.sin(p.t) * 0.2
        dummy.scale.set(s, s, s)
        dummy.updateMatrix()
        mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.03, 8, 8]} />
      <meshBasicMaterial color="#6366f1" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
    </instancedMesh>
  )
}

export function ParticleField() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} dpr={[1, 1]}>
        <Particles />
      </Canvas>
    </div>
  )
}

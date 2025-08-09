"use client"

import { useRef, useState, Suspense } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Stars, Html, useProgress } from "@react-three/drei"
import { TextureLoader, Vector3 } from "three"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut, Info } from "lucide-react"

function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center space-y-4">
        <div className="w-32 h-32 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-medium">Loading Earth... {Math.round(progress)}%</p>
      </div>
    </Html>
  )
}

export default function Component() {
  const [autoRotate, setAutoRotate] = useState(true)
  const [showInfo, setShowInfo] = useState(false)
  const controlsRef = useRef()

  const handleReset = () => {
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const handleZoomIn = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object
      const direction = new Vector3()
      camera.getWorldDirection(direction)
      camera.position.addScaledVector(direction, 0.5)
      controlsRef.current.update()
    }
  }

  const handleZoomOut = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object
      const direction = new Vector3()
      camera.getWorldDirection(direction)
      camera.position.addScaledVector(direction, -0.5)
      controlsRef.current.update()
    }
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Earth 3D Explorer</h1>
            <p className="text-gray-300">Interactive 3D visualization of our planet</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowInfo(!showInfo)}
            className="bg-black/50 border-white/20 text-white hover:bg-white/10"
          >
            <Info className="w-4 h-4 mr-2" />
            Info
          </Button>
        </div>
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-6 left-6 z-10">
        <Card className="bg-black/70 border-white/20 backdrop-blur-sm p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setAutoRotate(!autoRotate)}
              className="text-white hover:bg-white/10"
            >
              {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-white hover:bg-white/10">
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-white hover:bg-white/10">
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-white hover:bg-white/10">
              <ZoomOut className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-3 text-xs text-gray-400">
            <p>Left click: Rotate • Scroll: Zoom • Right click: Pan</p>
          </div>
        </Card>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="absolute top-20 right-6 z-10 w-80">
          <Card className="bg-black/80 border-white/20 backdrop-blur-sm p-6">
            <h3 className="text-xl font-semibold text-white mb-4">About Earth</h3>
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex justify-between">
                <span>Diameter:</span>
                <span className="text-white">12,742 km</span>
              </div>
              <div className="flex justify-between">
                <span>Surface Area:</span>
                <span className="text-white">510.1 million km²</span>
              </div>
              <div className="flex justify-between">
                <span>Population:</span>
                <span className="text-white">8+ billion</span>
              </div>
              <div className="flex justify-between">
                <span>Age:</span>
                <span className="text-white">4.54 billion years</span>
              </div>
              <div className="flex justify-between">
                <span>Rotation Period:</span>
                <span className="text-white">23h 56m 4s</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 3], fov: 45 }} gl={{ antialias: true, alpha: true }} dpr={[1, 2]}>
        <Suspense fallback={<Loader />}>
          {/* Enhanced Lighting */}
          <ambientLight intensity={0.15} color="#4a90e2" />
          <directionalLight
            position={[5, 3, 5]}
            intensity={1.2}
            color="#ffffff"
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ff6b6b" />

          {/* Earth with Atmosphere */}
          <Earth />
          <Atmosphere />

          {/* Sun and Moon */}
          <Sun />
          <Moon />

          {/* Enhanced Starfield */}
          <Stars radius={300} depth={60} count={25000} factor={8} saturation={0} fade speed={0.5} />

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            autoRotate={autoRotate}
            autoRotateSpeed={0.3}
            minDistance={1.8}
            maxDistance={8}
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.8}
          />
        </Suspense>
      </Canvas>

      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.1)_100%)]"></div>
      </div>
    </div>
  )
}

function Earth() {
  const meshRef = useRef()
  const earthTexture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg")

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial map={earthTexture} roughness={0.7} metalness={0.1} bumpScale={0.05} transparent={false} />
    </mesh>
  )
}

function Atmosphere() {
  return (
    <mesh scale={[1.02, 1.02, 1.02]}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial color="#4a90e2" transparent={true} opacity={0.1} side={2} />
    </mesh>
  )
}

function Sun() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Earth
      const time = state.clock.getElapsedTime()
      meshRef.current.position.x = Math.cos(time * 0.2) * 4
      meshRef.current.position.z = Math.sin(time * 0.2) * 4
      meshRef.current.position.y = Math.sin(time * 0.1) * 0.5

      // Self rotation
      meshRef.current.rotation.y += delta * 0.5
    }
  })

  return (
    <group ref={meshRef}>
      {/* Sun glow effect */}
      <mesh scale={[1.8, 1.8, 1.8]}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.3} />
      </mesh>
      {/* Main sun body */}
      <mesh>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial color="#ffdd44" />
      </mesh>
      {/* Sun light */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffdd44" distance={10} />
    </group>
  )
}

function Moon() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Earth (opposite to sun)
      const time = state.clock.getElapsedTime()
      meshRef.current.position.x = Math.cos(time * 0.2 + Math.PI) * 3.5
      meshRef.current.position.z = Math.sin(time * 0.2 + Math.PI) * 3.5
      meshRef.current.position.y = Math.sin(time * 0.15 + Math.PI) * 0.3

      // Self rotation (slower than sun)
      meshRef.current.rotation.y += delta * 0.2
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.15, 32, 32]} />
      <meshStandardMaterial color="#cccccc" roughness={0.8} metalness={0.1} />
    </mesh>
  )
}

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera, Box, Plane, Edges, Text } from '@react-three/drei';
import * as THREE from 'three';

function GlowingPillar() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1 + 0.5;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Platform */}
      <Box args={[4, 0.2, 4]} position={[0, -0.1, 0]}>
        <meshStandardMaterial color="#050507" emissive="#00E5FF" emissiveIntensity={0.1} />
        <Edges color="#00E5FF" opacity={0.3} transparent />
      </Box>
      <Box args={[2, 0.4, 2]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#050507" />
        <Edges color="#00E5FF" opacity={0.5} transparent />
      </Box>
      <Box args={[1, 0.6, 1]} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#050507" />
        <Edges color="#00E5FF" opacity={0.8} transparent />
      </Box>
      {/* Central Pillar (HTLC) */}
      <Box ref={meshRef} args={[0.4, 1.5, 0.4]} position={[0, 1.5, 0]}>
        <meshStandardMaterial emissive="#00E5FF" emissiveIntensity={1} color="#00E5FF" toneMapped={false} />
      </Box>
      
      {/* Orbiting particles */}
      <OrbitingBox index={0} />
      <OrbitingBox index={1} offset={Math.PI} />
      <OrbitingBox index={2} offset={Math.PI / 2} />
      <OrbitingBox index={3} offset={(Math.PI * 3) / 2} />
    </group>
  );
}

function OrbitingBox({ index, offset = 0 }: { index: number, offset?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime * 0.5 + offset;
      const radius = 2.5 + Math.sin(t * 2) * 0.2;
      meshRef.current.position.x = Math.cos(t) * radius;
      meshRef.current.position.z = Math.sin(t) * radius;
      meshRef.current.rotation.y = t * 2;
      meshRef.current.rotation.x = t;
    }
  });

  return (
    <Box ref={meshRef} args={[0.2, 0.2, 0.2]} position={[2, 1, 0]}>
      <meshStandardMaterial emissive="#00E5FF" emissiveIntensity={0.8} color="#00E5FF" toneMapped={false} />
    </Box>
  );
}

function BaseGrid() {
  return (
    <group position={[0, -0.2, 0]}>
      <gridHelper args={[20, 20, '#00E5FF', '#00E5FF']} position={[0, 0, 0]} rotation={[0, 0, 0]} material-opacity={0.1} material-transparent />
    </group>
  );
}

export default function ThreeDScene() {
  return (
    <div className="w-full h-full relative" style={{ minHeight: '400px' }}>
      <Canvas dpr={[1, 2]} shadows gl={{ antialias: true, alpha: true }}>
        <OrthographicCamera makeDefault position={[5, 4, 5]} zoom={60} near={-100} far={100} />
        <ambientLight intensity={0.2} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[0, 2, 0]} color="#00E5FF" intensity={2} distance={5} />
        
        <BaseGrid />
        <GlowingPillar />
        <CameraRig />
      </Canvas>
    </div>
  );
}

function CameraRig() {
  useFrame((state) => {
    state.camera.position.x = 5 + Math.sin(state.clock.elapsedTime * 0.1) * 0.5;
    state.camera.position.z = 5 + Math.cos(state.clock.elapsedTime * 0.1) * 0.5;
    state.camera.lookAt(0, 1, 0);
  });
  return null;
}

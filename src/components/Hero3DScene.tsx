'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Text, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

const CARD_SPACING = 0.07;

function FloatingCard({ position, rotation, color, label, speed = 1 }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  label: string;
  speed?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const startY = position[1];

  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = startY + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      ref.current.rotation.z += 0.002 * speed;
    }
  });

  return (
    <group ref={ref} position={position} rotation={rotation}>
      <mesh>
        <planeGeometry args={[0.8, 1.2]} />
        <meshStandardMaterial
          color={color}
          roughness={0.3}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Inner border */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.65, 1.05]} />
        <meshBasicMaterial color="#0B0D12" transparent opacity={0.3} />
      </mesh>
      {/* Label */}
      <Text
        position={[0, 0, 0.02]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
}

function CentralDeck({ count = 7 }: { count?: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.15;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => (
        <mesh
          key={i}
          position={[0, CARD_SPACING * i, -CARD_SPACING * i * 0.5]}
          rotation={[i * 0.03, i * 0.02, i * 0.04]}
        >
          <planeGeometry args={[0.6, 0.85]} />
          <meshStandardMaterial
            color={`hsl(260, ${70 + i * 5}%, ${30 + i * 5}%)`}
            roughness={0.4}
            metalness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function OrbitingCards() {
  const groupRef = useRef<THREE.Group>(null);
  const cards = useMemo(() => [
    { color: '#E44747', label: '+2', angle: 0, radius: 2.2 },
    { color: '#7A4DFF', label: '+4', angle: Math.PI * 0.4, radius: 2.5 },
    { color: '#00F0FF', label: '😊', angle: Math.PI * 0.8, radius: 2.0 },
    { color: '#FF6A00', label: '+6', angle: Math.PI * 1.2, radius: 2.4 },
    { color: '#F3C742', label: '↺', angle: Math.PI * 1.6, radius: 2.1 },
    { color: '#B4FF39', label: '+10', angle: Math.PI * 2.0, radius: 2.6 },
    { color: '#FF2E9A', label: '⊘', angle: Math.PI * 2.4, radius: 2.3 },
    { color: '#3478F6', label: '✕', angle: Math.PI * 2.8, radius: 2.0 },
  ], []);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh
            position={[
              Math.cos(card.angle) * card.radius,
              Math.sin(card.angle * 2) * 0.3,
              Math.sin(card.angle) * card.radius,
            ]}
            rotation={[0, -card.angle, 0.2]}
          >
            <planeGeometry args={[0.5, 0.7]} />
            <MeshDistortMaterial
              color={card.color}
              roughness={0.2}
              metalness={0.3}
              distort={0.1}
              speed={1.5}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

function TableSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[12, 12]} />
      <meshStandardMaterial
        color="#141820"
        roughness={0.8}
        metalness={0.1}
      />
    </mesh>
  );
}

function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 8, 5]} intensity={1.2} color="#B4FF39" />
      <directionalLight position={[-5, 3, -5]} intensity={0.6} color="#FF2E9A" />
      <pointLight position={[0, 2, 0]} intensity={0.5} color="#00F0FF" />
      <pointLight position={[-3, 1, 3]} intensity={0.4} color="#FF6A00" />
    </>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <SceneLights />
        <TableSurface />
        <CentralDeck count={6} />
        <OrbitingCards />
      </Canvas>
    </div>
  );
}

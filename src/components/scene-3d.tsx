"use client";

import { Float, RoundedBox, Sparkles } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import type { Track } from "@/content/types";

const TRACK_COLOR: Record<Track, string> = { programacao: "#6366f1", ingles: "#10b981", ia: "#f59e0b" };
const STEPS: { track: Track; x: number; height: number }[] = [
  { track: "programacao", x: -1.15, height: 1 },
  { track: "ingles", x: 0, height: 1.6 },
  { track: "ia", x: 1.15, height: 2.2 },
];
const FLOOR = -1.1;

export type SceneProps = { lit: Record<Track, boolean>; allDone: boolean; still: boolean };

function Step({ x, height, color, lit }: { x: number; height: number; color: string; lit: boolean }) {
  const mesh = useRef<Mesh>(null);
  // Lit steps rise to full height; unlit ones stay squashed, so finishing a track visibly "grows" the stair.
  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const target = lit ? 1 : 0.35;
    m.scale.y += (target - m.scale.y) * Math.min(1, delta * 6);
    m.position.y = FLOOR + (height * m.scale.y) / 2;
  });
  return (
    <RoundedBox ref={mesh} args={[1, height, 1]} radius={0.12} smoothness={4} position={[x, FLOOR + height / 2, 0]}>
      <meshStandardMaterial
        color={lit ? color : "#a1a1aa"}
        emissive={lit ? color : "#000000"}
        emissiveIntensity={lit ? 0.35 : 0}
        roughness={0.35}
        metalness={0.1}
        transparent
        opacity={lit ? 1 : 0.55}
      />
    </RoundedBox>
  );
}

function Goal({ allDone }: { allDone: boolean }) {
  const mesh = useRef<Mesh>(null);
  useFrame(({ clock }) => {
    const m = mesh.current;
    if (!m) return;
    const t = clock.getElapsedTime();
    const top = FLOOR + 2.2 + 0.55;
    m.position.y = top + Math.abs(Math.sin(t * (allDone ? 4 : 2))) * (allDone ? 0.4 : 0.2);
    m.rotation.y = t * (allDone ? 3 : 0.8);
  });
  return (
    <mesh ref={mesh} position={[1.15, FLOOR + 2.75, 0]}>
      <icosahedronGeometry args={[0.38, 1]} />
      <meshStandardMaterial color="#fcd34d" emissive="#f59e0b" emissiveIntensity={allDone ? 0.9 : 0.4} roughness={0.25} flatShading />
    </mesh>
  );
}

function Stair({ lit, allDone }: Omit<SceneProps, "still">) {
  const group = useRef<Group>(null);
  // Turns slowly and leans toward the mouse; touch input is ignored so the page still scrolls on phones.
  useFrame(({ clock, pointer }, delta) => {
    const g = group.current;
    if (!g) return;
    const targetY = -0.35 + Math.sin(clock.getElapsedTime() * 0.3) * 0.35 + pointer.x * 0.4;
    const targetX = 0.25 - pointer.y * 0.15;
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 3);
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 3);
  });
  return (
    <group ref={group} position={[0, -0.55, 0]} rotation={[0.25, -0.35, 0]}>
      <Float speed={1.5} rotationIntensity={0.15} floatIntensity={0.4}>
        {STEPS.map((s) => (
          <Step key={s.track} x={s.x} height={s.height} color={TRACK_COLOR[s.track]} lit={lit[s.track]} />
        ))}
        <Goal allDone={allDone} />
        {allDone && <Sparkles count={40} scale={[4, 3.5, 2]} size={4} speed={0.6} color="#fcd34d" />}
      </Float>
    </group>
  );
}

export default function Scene3D({ lit, allDone, still }: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.6], fov: 40 }}
      dpr={[1, 2]}
      frameloop={still ? "demand" : "always"}
      gl={{ antialias: true, alpha: true }}
      aria-hidden="true"
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 5]} intensity={1.4} />
      <pointLight position={[-4, 2, 3]} intensity={0.6} color="#a5b4fc" />
      <Stair lit={lit} allDone={allDone} />
    </Canvas>
  );
}

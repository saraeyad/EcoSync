import { useRef, memo } from "react";
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// ── 3D Bar Chart ──────────────────────────────────────────────────────────────
function AnimatedBar({ x, color, speed, phase }: { x: number; color: string; speed: number; phase: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const h = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * speed + phase)) * 1.2;
    ref.current.scale.y = h;
    ref.current.position.y = h * 0.25;
    const mat = ref.current.material as THREE.MeshStandardMaterial;
    mat.emissiveIntensity = 0.3 + Math.abs(Math.sin(state.clock.elapsedTime * speed + phase)) * 0.7;
  });
  return (
    <mesh ref={ref} position={[x, 0, 0]}>
      <boxGeometry args={[0.28, 1, 0.28]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.4} roughness={0.3} />
    </mesh>
  );
}

export const MiniBarChart = memo(function MiniBarChart({ color = "#10b981" }: { color?: string }) {
  const bars = [-1.4, -0.7, 0, 0.7, 1.4];
  const colors = ["#059669", "#10b981", "#34d399", "#10b981", "#059669"];
  return (
    <Canvas camera={{ position: [0, 1.5, 4.5], fov: 36 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 4, 3]} intensity={1.8} color={color} />
      {bars.map((x, i) => (
        <AnimatedBar key={i} x={x} color={colors[i]} speed={0.8 + i * 0.25} phase={i * 1.2} />
      ))}
    </Canvas>
  );
});

// ── Spinning Globe ──────────────────────────────────────────────────────────
function SpinGlobe({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.6;
  });
  const lats = [-60, -30, 0, 30, 60];
  const lngs = [-120, -60, 0, 60, 120];
  return (
    <group ref={ref}>
      <mesh>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0f172a" wireframe={false} transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.01, 16, 16]} />
        <meshStandardMaterial color={color} wireframe transparent opacity={0.25} emissive={color} emissiveIntensity={0.3} />
      </mesh>
      {lats.flatMap((lat) =>
        lngs.map((lng) => {
          const phi   = (90 - lat) * (Math.PI / 180);
          const theta = (lng + 180) * (Math.PI / 180);
          return (
            <mesh key={`${lat}-${lng}`} position={[Math.sin(phi)*Math.cos(theta)*1.05, Math.cos(phi)*1.05, Math.sin(phi)*Math.sin(theta)*1.05]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1} />
            </mesh>
          );
        })
      )}
    </group>
  );
}

export const MiniGlobe = memo(function MiniGlobe({ color = "#34d399" }: { color?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.2], fov: 40 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={1.5} color={color} />
      <SpinGlobe color={color} />
    </Canvas>
  );
});

// ── Orbiting Particles ────────────────────────────────────────────────────────
function OrbitParticles({ color }: { color: string }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.5;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
  });
  return (
    <group ref={ref}>
      {Array.from({ length: 40 }, (_, i) => {
        const phi   = Math.acos(1 - 2 * (i + 0.5) / 40);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const r     = 1.1;
        return (
          <mesh key={i} position={[Math.sin(phi)*Math.cos(theta)*r, Math.cos(phi)*r, Math.sin(phi)*Math.sin(theta)*r]}>
            <sphereGeometry args={[0.06, 6, 6]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
          </mesh>
        );
      })}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  );
}

export const MiniOrbit = memo(function MiniOrbit({ color = "#6ee7b7" }: { color?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 38 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} style={{ background: "transparent" }}>
      <ambientLight intensity={0.3} />
      <pointLight position={[2, 2, 2]} intensity={2} color={color} />
      <OrbitParticles color={color} />
    </Canvas>
  );
});

import { Suspense, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars, Environment } from "@react-three/drei";
import { ParticleSphere } from "../../../components/three/ParticleSphere.tsx";

interface HeroSceneProps {
  mousePos: MutableRefObject<{ x: number; y: number }>;
}

export function HeroScene({ mousePos }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[6,  6,  4]} intensity={2.5}  color="#10b981" />
      <pointLight position={[-6, -4, 4]} intensity={1.2}  color="#34d399" />
      <pointLight position={[0,  8, -4]} intensity={0.8}  color="#6ee7b7" />

      <Stars radius={100} depth={60} count={2500} factor={2.5} saturation={0} fade speed={0.4} />

      <Suspense fallback={null}>
        <ParticleSphere mousePos={mousePos} count={2400} radius={2.2} />
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

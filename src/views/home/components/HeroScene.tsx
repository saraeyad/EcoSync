import { Suspense, type MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { ParticleSphere } from "../../../components/three/ParticleSphere.tsx";

interface HeroSceneProps {
  mousePos: MutableRefObject<{ x: number; y: number }>;
}

/** Lighter hero WebGL: fewer particles/stars, no HDR Environment. */
export function HeroScene({ mousePos }: HeroSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={1}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[6, 6, 4]} intensity={2} color="#10b981" />
      <pointLight position={[-6, -4, 4]} intensity={0.9} color="#34d399" />

      <Stars radius={80} depth={40} count={600} factor={2} saturation={0} fade speed={0.3} />

      <Suspense fallback={null}>
        <ParticleSphere mousePos={mousePos} count={900} radius={2.2} />
      </Suspense>
    </Canvas>
  );
}

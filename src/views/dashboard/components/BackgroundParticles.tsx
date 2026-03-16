import { memo, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ParticleSphere } from "../../../components/three/ParticleSphere.tsx";

/** Shared visual DNA: the same particle sphere from the landing page
 *  lives in the dashboard at 12% opacity — creating continuity. */
export const BackgroundParticles = memo(function BackgroundParticles() {
  const mousePos = useRef({ x: 0, y: 0 }); // static — no interaction needed

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden
      style={{ opacity: 0.12 }}
    >
      <Canvas
        camera={{ position: [0, 0, 9], fov: 50 }}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        dpr={[0.5, 0.75]}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#10b981" />
        <Suspense fallback={null}>
          <ParticleSphere
            mousePos={mousePos}
            count={500}
            radius={3.2}
            color="#10b981"
            secondaryColor="#34d399"
          />
        </Suspense>
      </Canvas>
    </div>
  );
});

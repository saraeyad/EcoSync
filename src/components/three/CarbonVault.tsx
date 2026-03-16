import { useRef, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

interface ParticleCloudProps {
  count: number;     // 0–200 based on carbonDensity
  color: string;
  speed: number;
}

function ParticleCloud({ count, color, speed }: ParticleCloudProps) {
  const ref      = useRef<THREE.Points>(null);
  const phase    = useRef(Math.random() * Math.PI * 2);

  // Spawn particles in a sphere volume
  const { positions, sizes } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const sz   = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r     = 0.3 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      sz[i] = 0.01 + Math.random() * 0.025;
    }
    return { positions: pos, sizes: sz };
  }, [count]);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * speed + phase.current;
    ref.current.rotation.y = t * 0.3;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.4;
  });

  if (count === 0) return null;

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-size"     args={[sizes, 1]}    count={count} itemSize={1} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={color}
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function GlassSphere({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <Sphere args={[1, 64, 64]}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          roughness={0.05}
          transmission={0.95}
          ior={1.5}
          chromaticAberration={0.06}
          color={color}
          distortionScale={0.2}
          temporalDistortion={0.1}
        />
      </Sphere>
    </mesh>
  );
}

interface CarbonVaultSceneProps {
  carbonDensity: number; // 0–100
}

export function CarbonVaultScene({ carbonDensity }: CarbonVaultSceneProps) {
  // Map density to particle count and color
  const particleCount = Math.floor((carbonDensity / 100) * 180);
  const vaultColor = carbonDensity > 60
    ? "#ef4444"
    : carbonDensity > 35
    ? "#f59e0b"
    : "#10b981";
  const particleColor = carbonDensity > 60
    ? "#fca5a5"
    : carbonDensity > 35
    ? "#fcd34d"
    : "#6ee7b7";
  const speed = 0.4 + (carbonDensity / 100) * 1.8;

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[3, 3, 3]}   intensity={1.2} color={vaultColor} />
      <pointLight position={[-3, -3, 3]} intensity={0.6} color="#ffffff" />
      <pointLight position={[0, 4, 0]}   intensity={0.8} color={vaultColor} />
      <Suspense fallback={null}>
        <GlassSphere color={vaultColor} />
        <ParticleCloud count={particleCount} color={particleColor} speed={speed} />
      </Suspense>
    </>
  );
}

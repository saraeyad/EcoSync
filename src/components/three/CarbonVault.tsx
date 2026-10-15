import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleCloudProps {
  count: number;
  color: string;
  speed: number;
}

function ParticleCloud({ count, color, speed }: ParticleCloudProps) {
  const ref = useRef<THREE.Points>(null);
  const phase = useRef(Math.random() * Math.PI * 2);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 0.3 + Math.random() * 0.6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.028}
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

/** Cheap glass look — avoids MeshTransmissionMaterial (very heavy). */
function GlassSphere({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshPhysicalMaterial
        color={color}
        roughness={0.15}
        metalness={0.05}
        transmission={0.65}
        thickness={0.4}
        ior={1.4}
        transparent
        opacity={0.85}
      />
    </mesh>
  );
}

interface CarbonVaultSceneProps {
  carbonDensity: number;
}

export function CarbonVaultScene({ carbonDensity }: CarbonVaultSceneProps) {
  const particleCount = Math.floor((carbonDensity / 100) * 80);
  const vaultColor =
    carbonDensity > 60 ? "#ef4444" : carbonDensity > 35 ? "#f59e0b" : "#10b981";
  const particleColor =
    carbonDensity > 60 ? "#fca5a5" : carbonDensity > 35 ? "#fcd34d" : "#6ee7b7";
  const speed = 0.4 + (carbonDensity / 100) * 1.2;

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={1} color={vaultColor} />
      <pointLight position={[-2, -2, 2]} intensity={0.4} color="#ffffff" />
      <GlassSphere color={vaultColor} />
      <ParticleCloud count={particleCount} color={particleColor} speed={speed} />
    </>
  );
}

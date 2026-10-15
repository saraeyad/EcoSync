import { useRef, useMemo, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpringState {
  pos: { x: number; y: number };
  vel: { x: number; y: number };
}

interface ParticleSphereProps {
  mousePos: MutableRefObject<{ x: number; y: number }>;
  count?: number;
  radius?: number;
  color?: string;
  secondaryColor?: string;
}

export function ParticleSphere({
  mousePos,
  count = 900,
  radius = 2.2,
  color = "#10b981",
  secondaryColor = "#34d399",
}: ParticleSphereProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const spring = useRef<SpringState>({
    pos: { x: 0, y: 0 },
    vel: { x: 0, y: 0 },
  });

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(secondaryColor);
    const phi = Math.PI * (Math.sqrt(5) - 1);

    for (let i = 0; i < count; i++) {
      const y = 1 - (i / Math.max(count - 1, 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const noise = 0.04 * (Math.random() - 0.5);

      pos[i * 3] = (Math.cos(theta) * r + noise) * radius;
      pos[i * 3 + 1] = (y + noise) * radius;
      pos[i * 3 + 2] = (Math.sin(theta) * r + noise) * radius;

      const t = (y + 1) / 2;
      const blended = c1.clone().lerp(c2, t);
      cols[i * 3] = blended.r;
      cols[i * 3 + 1] = blended.g;
      cols[i * 3 + 2] = blended.b;
    }
    return { positions: pos, colors: cols };
  }, [count, radius, color, secondaryColor]);

  const ringCount = Math.min(120, Math.max(40, Math.floor(count / 8)));
  const ringPositions = useMemo(() => {
    const pos = new Float32Array(ringCount * 3);
    for (let i = 0; i < ringCount; i++) {
      const angle = (i / ringCount) * Math.PI * 2;
      const r = radius * 1.18 + Math.random() * 0.12;
      pos[i * 3] = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.25;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [radius, ringCount]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const sp = spring.current;
    const mx = mousePos.current.x * 0.9;
    const my = mousePos.current.y * 0.9;

    const stiffness = 0.045;
    const damping = 0.14;
    sp.vel.x += (mx - sp.pos.x) * stiffness - sp.vel.x * damping;
    sp.vel.y += (my - sp.pos.y) * stiffness - sp.vel.y * damping;
    sp.pos.x += sp.vel.x;
    sp.pos.y += sp.vel.y;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08 + sp.pos.x * 0.5;
      groupRef.current.rotation.x = t * 0.03 - sp.pos.y * 0.4;
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.04;
    }

    if (pointsRef.current) {
      const breathe = 1 + Math.sin(t * 0.7) * 0.012;
      pointsRef.current.scale.setScalar(breathe);
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={count}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={count}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.024}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[ringPositions, 3]}
            count={ringCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.032}
          color="#6ee7b7"
          transparent
          opacity={0.45}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <mesh>
        <sphereGeometry args={[radius * 0.42, 16, 16]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.08}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

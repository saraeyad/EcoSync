import { useRef, useMemo, type MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SpringState {
  pos:  { x: number; y: number };
  vel:  { x: number; y: number };
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
  count = 2400,
  radius = 2.2,
  color = "#10b981",
  secondaryColor = "#34d399",
}: ParticleSphereProps) {
  const pointsRef  = useRef<THREE.Points>(null);
  const groupRef   = useRef<THREE.Group>(null);
  const spring     = useRef<SpringState>({ pos: { x: 0, y: 0 }, vel: { x: 0, y: 0 } });

  // Fibonacci sphere distribution for uniform density
  const { positions, colors } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const cols = new Float32Array(count * 3);
    const c1   = new THREE.Color(color);
    const c2   = new THREE.Color(secondaryColor);
    const phi  = Math.PI * (Math.sqrt(5) - 1); // golden angle

    for (let i = 0; i < count; i++) {
      const y     = 1 - (i / (count - 1)) * 2;
      const r     = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const noise = 0.04 * (Math.random() - 0.5);

      pos[i * 3]     = (Math.cos(theta) * r + noise) * radius;
      pos[i * 3 + 1] = (y + noise) * radius;
      pos[i * 3 + 2] = (Math.sin(theta) * r + noise) * radius;

      // Gradient: top = secondary, bottom = primary
      const t = (y + 1) / 2;
      const blended = c1.clone().lerp(c2, t);
      cols[i * 3]     = blended.r;
      cols[i * 3 + 1] = blended.g;
      cols[i * 3 + 2] = blended.b;
    }
    return { positions: pos, colors: cols };
  }, [count, radius, color, secondaryColor]);

  // Inner ring of particles
  const ringPositions = useMemo(() => {
    const pos = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      const angle = (i / 320) * Math.PI * 2;
      const r     = radius * 1.18 + Math.random() * 0.15;
      pos[i * 3]     = Math.cos(angle) * r;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pos;
  }, [radius]);

  useFrame((state) => {
    const t  = state.clock.elapsedTime;
    const sp = spring.current;
    const mx = mousePos.current.x * 0.9;
    const my = mousePos.current.y * 0.9;

    // Spring physics: F = -k*x - b*v
    const stiffness = 0.045;
    const damping   = 0.14;
    sp.vel.x += (mx - sp.pos.x) * stiffness - sp.vel.x * damping;
    sp.vel.y += (my - sp.pos.y) * stiffness - sp.vel.y * damping;
    sp.pos.x += sp.vel.x;
    sp.pos.y += sp.vel.y;

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.08  + sp.pos.x * 0.5;
      groupRef.current.rotation.x = t * 0.03  - sp.pos.y * 0.4;
      groupRef.current.rotation.z = Math.sin(t * 0.05) * 0.04;
    }

    if (pointsRef.current) {
      // Subtle breathing scale
      const breathe = 1 + Math.sin(t * 0.7) * 0.012;
      pointsRef.current.scale.setScalar(breathe);

      // Update particle sizes for twinkling
      const sizes = pointsRef.current.geometry.attributes.size as THREE.BufferAttribute | undefined;
      if (sizes) {
        for (let i = 0; i < sizes.count; i++) {
          sizes.setX(i, 0.012 + Math.abs(Math.sin(t * 1.5 + i * 0.7)) * 0.016);
        }
        sizes.needsUpdate = true;
      }
    }
  });

  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = 0.012 + Math.random() * 0.016;
    return s;
  }, [count]);

  return (
    <group ref={groupRef}>
      {/* Main sphere */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} itemSize={3} />
          <bufferAttribute attach="attributes-color"    args={[colors, 3]}    count={count} itemSize={3} />
          <bufferAttribute attach="attributes-size"     args={[sizes, 1]}     count={count} itemSize={1} />
        </bufferGeometry>
        <pointsMaterial
          size={0.022}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Equatorial ring */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[ringPositions, 3]} count={320} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={0.035}
          color="#6ee7b7"
          transparent
          opacity={0.5}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Core glow sphere */}
      <mesh>
        <sphereGeometry args={[radius * 0.42, 32, 32]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#064e3b"
          emissiveIntensity={0.8}
          transparent
          opacity={0.06}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

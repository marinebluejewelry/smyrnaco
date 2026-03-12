"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import type { Mesh } from "three";

// ---------------------------------------------------------------------------
// Model — hero product mesh (TorusKnot placeholder).
//
// Interaction:
//   • Camera-level rotation is handled by OrbitControls in Scene.tsx
//     (autoRotate for idle spin, drag for manual rotation).
//   • This component handles: responsive positioning, scroll-driven tilt,
//     and the Float wrapper.
// ---------------------------------------------------------------------------

interface ModelProps {
  scrollProgress?: number; // 0 → 1 normalised scroll
}

// Config per breakpoint
const DESKTOP = {
  position: [2.4, 0, 0] as [number, number, number],
  scale: 1.15,
};
const MOBILE = {
  position: [0, 1.4, 0] as [number, number, number],
  scale: 0.65,
};

export function Model({ scrollProgress = 0 }: ModelProps) {
  const meshRef = useRef<Mesh>(null!);
  const { viewport } = useThree();

  // Smooth breakpoint — viewport.width ≈ 6 world units at ~768px
  const isMobile = viewport.width < 6;
  const target = isMobile ? MOBILE : DESKTOP;

  // Use refs for smooth interpolation (no re-render per frame)
  const currentPos = useRef<[number, number, number]>([...target.position]);
  const currentScale = useRef(target.scale);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    // Lerp position & scale for buttery breakpoint transitions
    const lerpFactor = 1 - Math.pow(0.001, delta); // frame-rate-independent lerp
    currentPos.current[0] = MathUtils.lerp(currentPos.current[0], target.position[0], lerpFactor);
    currentPos.current[1] = MathUtils.lerp(currentPos.current[1], target.position[1], lerpFactor);
    currentPos.current[2] = MathUtils.lerp(currentPos.current[2], target.position[2], lerpFactor);
    currentScale.current = MathUtils.lerp(currentScale.current, target.scale, lerpFactor);

    meshRef.current.position.set(...currentPos.current);
    const s = currentScale.current;
    meshRef.current.scale.set(s, s, s);

    // Scroll-driven tilt — smooth sinusoidal rather than raw linear
    meshRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.8;
    meshRef.current.rotation.z = Math.cos(scrollProgress * Math.PI) * 0.15;
  });

  // Higher-quality geometry for better reflections & distortion detail
  const geometryArgs = useMemo(
    () => [1, 0.2, 300, 80] as [number, number, number, number],
    [],
  );

  return (
    <Float speed={3.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={geometryArgs} />
        <MeshDistortMaterial
          color="#e8e8e8"
          roughness={0.08}
          metalness={0.99}
          distort={0.2}
          speed={2}
          envMapIntensity={1.8}
        />
      </mesh>
    </Float>
  );
}

export default Model;

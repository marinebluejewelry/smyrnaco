"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group } from "three";

// ---------------------------------------------------------------------------
// ProductModel — loads a Draco-compressed .glb from /public/models/.
//
// HOW TO USE:
//   1. Compress your .glb with Draco:
//        npx gltf-pipeline -i model.glb -o model-draco.glb --draco.compressionLevel 7
//      or use https://gltf.report/ (drag & drop → compress → download)
//
//   2. Place the compressed file in /public/models/
//        e.g.  public/models/product.glb
//
//   3. In data.ts, set:  modelPath: "/models/product.glb"
//
//   4. Swap <Model /> for <ProductModel /> in Scene.tsx:
//        <ProductModel
//          path="/models/product.glb"
//          scrollProgress={scrollProgress}
//        />
//
// The `useDraco: true` flag tells drei to auto-load the Draco WASM decoder
// from a CDN (Google's public decoder). For self-hosted decoders, pass a
// string path instead:  useGLTF(path, "/draco/")
// ---------------------------------------------------------------------------

interface ProductModelProps {
  /** Path relative to /public, e.g. "/models/product.glb" */
  path: string;
  scrollProgress?: number;
  /** Uniform scale multiplier (default 1) */
  baseScale?: number;
}

// Config per breakpoint
const DESKTOP = {
  position: [2.4, 0, 0] as [number, number, number],
  scale: 10.15,
};
const MOBILE = {
  position: [0, 0.4, 0] as [number, number, number],
  scale: 0.65,
};

export function ProductModel({
  path,
  scrollProgress = 0,
  baseScale = 1,
}: ProductModelProps) {
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  // Load with Draco decompression enabled
  const { scene } = useGLTF(path, true);

  // Responsive layout
  const isMobile = viewport.width < 6;
  const target = isMobile ? MOBILE : DESKTOP;

  // Smooth interpolation refs
  const currentPos = useRef<[number, number, number]>([...target.position]);
  const currentScale = useRef(target.scale * baseScale);

  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    const lerpFactor = 1 - Math.pow(0.001, delta);
    currentPos.current[0] = MathUtils.lerp(currentPos.current[0], target.position[0], lerpFactor);
    currentPos.current[1] = MathUtils.lerp(currentPos.current[1], target.position[1], lerpFactor);
    currentPos.current[2] = MathUtils.lerp(currentPos.current[2], target.position[2], lerpFactor);
    currentScale.current = MathUtils.lerp(currentScale.current, target.scale * baseScale, lerpFactor);

    groupRef.current.position.set(...currentPos.current);
    const s = currentScale.current;
    groupRef.current.scale.set(s, s, s);

    // Scroll-driven tilt (idle rotation handled by OrbitControls autoRotate)
    groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
    groupRef.current.rotation.z = Math.cos(scrollProgress * Math.PI) * 0.1;
  });

  return (
    <Float speed={3.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

// ---------------------------------------------------------------------------
// Preload helper — call at module level to start downloading before render.
// Example:  ProductModel.preload("/models/product.glb");
// ---------------------------------------------------------------------------
ProductModel.preload = (path: string) => {
  useGLTF.preload(path, true);
};

export default ProductModel;

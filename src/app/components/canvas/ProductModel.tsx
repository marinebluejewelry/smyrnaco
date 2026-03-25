"use client";

import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import { MathUtils } from "three";
import * as THREE from "three";
import type { Group } from "three";

// ---------------------------------------------------------------------------
// ProductModel — loads a Draco-compressed .glb from /public/models/.
//
// GPU Memory Strategy:
//   On UNMOUNT, this component deep-disposes all geometries, materials, and
//   textures, then clears the drei cache. The parent (Projects page) handles
//   the unmount→pause→remount cycle to ensure only ONE model is ever in GPU
//   memory at a time. This prevents OOM crashes on mobile.
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
  position: [0, 0, 0] as [number, number, number],
  scale: 0.5,
};
const MOBILE = {
  position: [0, 0.2, 0] as [number, number, number],
  scale: 0.25,
};

/** Traverse a scene graph and dispose all GPU resources */
function disposeScene(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((mat) => {
        if (!mat) return;
        // Dispose all texture maps on the material
        Object.values(mat).forEach((val) => {
          if (val instanceof THREE.Texture) val.dispose();
        });
        mat.dispose();
      });
    }
  });
}

export function ProductModel({
  path,
  scrollProgress = 0,
  baseScale = 1,
}: ProductModelProps) {
  const groupRef = useRef<Group>(null!);
  const { viewport } = useThree();

  // Load with Draco decompression enabled
  const { scene } = useGLTF(path, true);

  const gl = useThree((s) => s.gl);

  // On unmount: deep-dispose GPU resources + clear drei & THREE caches
  useEffect(() => {
    const currentPath = path;
    const currentScene = scene;

    return () => {
      // Log GPU memory before disposal
      const memBefore = gl.info.memory;
      console.log(
        `[ProductModel] DISPOSE "${currentPath}" — before: ${memBefore.geometries} geom, ${memBefore.textures} tex`,
      );

      disposeScene(currentScene);
      useGLTF.clear(currentPath);

      // Also clear THREE.js internal HTTP response cache
      THREE.Cache.clear();

      const memAfter = gl.info.memory;
      console.log(
        `[ProductModel] DISPOSE complete — after: ${memAfter.geometries} geom, ${memAfter.textures} tex`,
      );
    };
  }, [path, scene, gl]);

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

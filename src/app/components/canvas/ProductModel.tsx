"use client";

import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { MathUtils, Cache } from "three";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import type { Group } from "three";

// ---------------------------------------------------------------------------
// ProductModel — loads a Draco-compressed .glb with manual memory management.
//
// WHY NOT useGLTF:
//   drei's useGLTF uses fetch() internally. On iOS Safari, the browser keeps
//   the raw ArrayBuffer (and Draco WASM decoder output) in system RAM even
//   after THREE.js GPU resources are disposed. After 3-4 model swaps, this
//   accumulates ~200+ MB of unreleased JS heap, causing an iOS OOM kill.
//
// STRATEGY:
//   1. Fetch the .glb as an ArrayBuffer manually
//   2. Parse with GLTFLoader + DRACOLoader
//   3. On unmount: dispose GPU resources, revoke blob URL, null the buffer
//   4. This gives iOS the best chance to reclaim both GPU and system memory
// ---------------------------------------------------------------------------

interface ProductModelProps {
  path: string;
  scrollProgress?: number;
  baseScale?: number;
}

const DESKTOP = {
  position: [0, 0, 0] as [number, number, number],
  scale: 0.5,
};
const MOBILE = {
  position: [0, 0.2, 0] as [number, number, number],
  scale: 0.25,
};

// Shared Draco loader — reuse across all model loads
let _dracoLoader: DRACOLoader | null = null;
function getDracoLoader(): DRACOLoader {
  if (!_dracoLoader) {
    _dracoLoader = new DRACOLoader();
    _dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    _dracoLoader.setDecoderConfig({ type: "js" }); // JS decoder — no WASM memory leak
  }
  return _dracoLoader;
}

/** Traverse and dispose all GPU resources */
function disposeScene(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.geometry?.dispose();
      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];
      materials.forEach((mat) => {
        if (!mat) return;
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
  const [loadedScene, setLoadedScene] = useState<THREE.Group | null>(null);
  const { viewport } = useThree();
  const gl = useThree((s) => s.gl);

  // Manual fetch + parse with explicit buffer lifecycle
  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;
    let sceneRef: THREE.Group | null = null;

    const controller = new AbortController();

    (async () => {
      try {
        // 1. Fetch as ArrayBuffer with abort support
        const response = await fetch(path, {
          signal: controller.signal,
          cache: "no-store", // prevent browser from caching the response
        });
        if (cancelled) return;

        const buffer = await response.arrayBuffer();
        if (cancelled) return;

        // 2. Create a blob URL so GLTFLoader can consume it
        const blob = new Blob([buffer], { type: "model/gltf-binary" });
        objectUrl = URL.createObjectURL(blob);

        // 3. Parse with GLTFLoader + Draco
        const loader = new GLTFLoader();
        loader.setDRACOLoader(getDracoLoader());

        const gltf = await new Promise<{ scene: THREE.Group }>(
          (resolve, reject) => {
            loader.load(
              objectUrl!,
              (result) => resolve(result),
              undefined,
              (err) => reject(err),
            );
          },
        );

        if (cancelled) {
          disposeScene(gltf.scene);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          return;
        }

        sceneRef = gltf.scene;
        setLoadedScene(gltf.scene);

        // 4. Immediately revoke the blob URL — data is already parsed into GPU
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      } catch (err) {
        if (!cancelled) {
          console.error(`[ProductModel] Failed to load ${path}:`, err);
        }
      }
    })();

    // Cleanup on unmount
    return () => {
      cancelled = true;
      controller.abort();

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }

      if (sceneRef) {
        const memBefore = gl.info.memory;
        console.log(
          `[ProductModel] DISPOSE "${path}" — before: ${memBefore.geometries} geom, ${memBefore.textures} tex`,
        );

        disposeScene(sceneRef);
        sceneRef = null;

        // Clear THREE.js internal caches
        Cache.clear();

        const memAfter = gl.info.memory;
        console.log(
          `[ProductModel] DISPOSE complete — after: ${memAfter.geometries} geom, ${memAfter.textures} tex`,
        );
      }

      setLoadedScene(null);
    };
  }, [path, gl]);

  // Responsive layout
  const isMobile = viewport.width < 6;
  const target = isMobile ? MOBILE : DESKTOP;

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

    groupRef.current.rotation.x = Math.sin(scrollProgress * Math.PI * 2) * 0.3;
    groupRef.current.rotation.z = Math.cos(scrollProgress * Math.PI) * 0.1;
  });

  if (!loadedScene) return null;

  return (
    <Float speed={3.2} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={groupRef}>
        <primitive object={loadedScene} />
      </group>
    </Float>
  );
}

export default ProductModel;

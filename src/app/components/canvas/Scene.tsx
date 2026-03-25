"use client";

import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Lightformer,
  OrbitControls,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useEffect, useRef, useState } from "react";

// ---------------------------------------------------------------------------
// Scene — Reusable R3F Canvas shell with dramatic studio lighting + PostFX.
//
// Accepts children for 3D content (Bracelet, models, etc.) and exposes
// configurable OrbitControls via props.
//
// Lighting rig, Environment, ContactShadows, and PostFX are always rendered.
// The consumer decides what 3D content goes inside.
// ---------------------------------------------------------------------------

interface SceneProps {
  /** Called once the Canvas has mounted and rendered its first frame. */
  onReady?: () => void;
  /** When true, the canvas captures pointer events for drag interaction. */
  interactive?: boolean;
  /** 3D content to render inside the Canvas (e.g. Bracelet). */
  children?: React.ReactNode;
  /** Enable OrbitControls (default false). */
  orbitEnabled?: boolean;
  /** Auto-rotate speed when orbit is enabled (default 0 = off). */
  autoRotateSpeed?: number;
  /** Enable scroll-wheel zoom on OrbitControls (default false). */
  enableZoom?: boolean;
}

// ---------------------------------------------------------------------------
// Inner component that fires the onReady callback once the GL context is live.
// ---------------------------------------------------------------------------
function ReadySignal({ onReady }: { onReady?: () => void }) {
  const gl = useThree((s) => s.gl);

  useEffect(() => {
    if (gl && onReady) {
      const raf = requestAnimationFrame(() => onReady());
      return () => cancelAnimationFrame(raf);
    }
  }, [gl, onReady]);

  return null;
}

export function Scene({
  onReady,
  interactive = true,
  children,
  orbitEnabled = false,
  autoRotateSpeed = 0,
  enableZoom = false,
}: SceneProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);

  // Detect mobile for reduced post-processing (saves GPU memory)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, isMobile ? 1.5 : 2]}
      gl={{
        antialias: !isMobile,
        alpha: true,
        powerPreference: "high-performance",
      }}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <Suspense fallback={null}>
        <ReadySignal onReady={onReady} />

        {/* ── Orbit controls — configurable via props ──────────── */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enabled={orbitEnabled}
          enableZoom={enableZoom}
          enablePan={false}
          enableDamping
          dampingFactor={0.05}
          autoRotate={autoRotateSpeed > 0}
          autoRotateSpeed={autoRotateSpeed}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          minDistance={3}
          maxDistance={15}
        />

        {/* ── Lighting rig ─────────────────────────────────────── */}
        <ambientLight intensity={0.15} />

        <directionalLight
          position={[5, 8, 5]}
          intensity={2}
          color="#fff5e6"
          castShadow
        />

        <pointLight
          position={[-6, 3, -4]}
          intensity={1.2}
          color="#80a0ff"
        />

        <pointLight
          position={[2, -4, 3]}
          intensity={0.4}
          color="#ffe0c0"
        />

        {/* ── 3D content (provided by parent) ────────────────── */}
        {children}

        {/* ── Ground shadow ────────────────────────────────────── */}
        <ContactShadows
          position={[0, -2.5, 0]}
          opacity={0.1}
          scale={14}
          blur={2.5}
          far={4}
          resolution={256}
        />

        {/* ── Environment — studio HDRI for realistic reflections */}
        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={2}
            position={[0, 5, -5]}
            scale={[10, 2, 1]}
            color="#ffffff"
          />
          <Lightformer
            form="ring"
            intensity={0.8}
            position={[-5, 2, 1]}
            scale={3}
            color="#c0c8ff"
          />
          <Lightformer
            form="rect"
            intensity={0.5}
            position={[5, -1, 3]}
            scale={[4, 4, 1]}
            color="#ffe8d6"
          />
        </Environment>

        {/* ── Post-processing (lighter on mobile to save GPU) ── */}
        {isMobile ? (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.15}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Vignette
              blendFunction={BlendFunction.NORMAL}
              offset={0.3}
              darkness={0.45}
            />
          </EffectComposer>
        ) : (
          <EffectComposer multisampling={4}>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.9}
              mipmapBlur
            />
            <Noise
              blendFunction={BlendFunction.SOFT_LIGHT}
              opacity={0.25}
            />
            <Vignette
              blendFunction={BlendFunction.NORMAL}
              offset={0.3}
              darkness={0.65}
            />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}

export default Scene;

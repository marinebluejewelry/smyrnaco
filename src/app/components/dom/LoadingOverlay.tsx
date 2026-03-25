"use client";

import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

// ---------------------------------------------------------------------------
// LoadingOverlay — DOM-side 0–100% progress indicator for R3F assets.
//
// Uses drei's `useProgress` which hooks into Three.js DefaultLoadingManager.
// Reports combined progress for all assets (GLTF, textures, etc.) currently
// loading through any drei loader (useGLTF, useTexture, etc.).
//
// Place as a sibling to <Scene> inside a `position: relative` container.
// The overlay covers the canvas with `absolute inset-0 z-10` and fades out
// once loading completes.
// ---------------------------------------------------------------------------

export function LoadingOverlay() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
    if (active) setVisible(true);
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-none"
      style={{ opacity: active ? 1 : 0 }}
    >
      <div className="text-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40 mb-3">
          Loading
        </p>
        <p className="text-2xl font-light text-white tabular-nums">
          {Math.round(progress)}%
        </p>
        <div className="mt-3 w-32 h-px bg-white/10 overflow-hidden mx-auto">
          <div
            className="h-full bg-white/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default LoadingOverlay;

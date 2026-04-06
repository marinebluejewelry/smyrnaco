"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

// ---------------------------------------------------------------------------
// LoadingOverlay — DOM-side 0–100% progress indicator for R3F assets.
//
// Uses drei's `useProgress` which hooks into Three.js DefaultLoadingManager.
// Reports combined progress for all assets (GLTF, textures, etc.) currently
// loading through any drei loader (useGLTF, useTexture, etc.).
//
// The overlay is **visible immediately** on mount (before Three.js even
// initialises) so the user sees a loading indicator from the very first
// frame — no blank canvas. It fades out once asset loading completes.
//
// Place as a sibling to <Scene> inside a `position: relative` container.
// The overlay covers the canvas with `absolute inset-0 z-10`.
// ---------------------------------------------------------------------------

export function LoadingOverlay() {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);

  // Track whether Three.js has ever reported loading activity.
  // Before it does, active is false and progress is 0 — we keep the
  // overlay visible during this pre-init phase so there's no blank frame.
  const hasStarted = useRef(false);
  if (active) hasStarted.current = true;

  // Done = loading started via DefaultLoadingManager and finished,
  // OR a safety timeout fired (covers pages where useProgress never
  // reports active because the model bypasses drei's loading manager).
  const done = hasStarted.current && !active && progress === 100;

  useEffect(() => {
    if (done) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
    if (active) setVisible(true);
  }, [done, active]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-500 pointer-events-none"
      style={{ opacity: done ? 0 : 1 }}
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

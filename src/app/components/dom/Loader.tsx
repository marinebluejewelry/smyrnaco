"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

// ---------------------------------------------------------------------------
// Loader — cinematic preloader with a designed count-up sequence.
//
// Strategy:
//   Since the scene uses procedural geometry (no GLTF / texture assets),
//   drei's `useProgress` has nothing to track. Instead we drive a simulated
//   count-up that pauses at ~30% until the Canvas signals "ready" (GL
//   context initialised + first frame rendered), then accelerates to 100%.
//
//   This mirrors what high-end brand sites (Apple, Gucci, Prada) do — the
//   loader is a *designed experience*, not a raw progress bar.
// ---------------------------------------------------------------------------

interface LoaderProps {
  /** Has the 3D Canvas mounted and rendered its first frame? */
  sceneReady: boolean;
  /** Fired after the exit animation completes — unlocks the page. */
  onComplete: () => void;
}

export function Loader({ sceneReady, onComplete }: LoaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null!);
  const numberRef = useRef<HTMLSpanElement>(null!);
  const lineRef = useRef<HTMLDivElement>(null!);
  const [display, setDisplay] = useState(0);
  const hasExited = useRef(false);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  // ── Phase 1: Count quickly to ~30%, then hold ──────────────────────
  useEffect(() => {
    const obj = { val: 0 };
    tweenRef.current = gsap.to(obj, {
      val: 30,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(obj.val)),
    });
  }, []);

  // ── Phase 2: Once scene is ready, accelerate to 100% ──────────────
  useEffect(() => {
    if (!sceneReady) return;

    // Kill the phase-1 tween in case it's still running
    tweenRef.current?.kill();

    const obj = { val: display };
    tweenRef.current = gsap.to(obj, {
      val: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => setDisplay(Math.round(obj.val)),
      onComplete: () => exit(),
    });
  }, [sceneReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Exit animation ─────────────────────────────────────────────────
  const exit = useCallback(() => {
    if (hasExited.current) return;
    hasExited.current = true;

    const tl = gsap.timeline({ onComplete });

    // Hold "100" briefly
    tl.to({}, { duration: 0.3 })
      // Number slides up + fades
      .to(numberRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.5,
        ease: "power3.in",
      })
      // Progress line shrinks
      .to(
        lineRef.current,
        { scaleX: 0, duration: 0.4, ease: "power3.in" },
        "-=0.3",
      )
      // Overlay fades out
      .to(overlayRef.current, {
        opacity: 0,
        duration: 0.7,
        ease: "power2.inOut",
      })
      .set(overlayRef.current, { display: "none" });
  }, [onComplete]);

  // Normalised 0–1 for the progress bar width
  const progress01 = display / 100;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      {/* Percentage counter */}
      <span
        ref={numberRef}
        className="block font-light tabular-nums text-white"
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "clamp(2rem, 6vw, 5rem)",
        }}
      >
        {display}
        <span className="text-white/30">%</span>
      </span>

      {/* Thin progress line */}
      <div className="mt-6 h-px w-24 overflow-hidden bg-white/10">
        <div
          ref={lineRef}
          className="h-full origin-left bg-white/60"
          style={{ transform: `scaleX(${progress01})` }}
        />
      </div>
    </div>
  );
}

export default Loader;

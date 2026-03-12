"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
// @ts-ignore — GSAP types casing conflict on Windows
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import siteContent from "@/app/lib/data";

gsap.registerPlugin(Observer);

// ---------------------------------------------------------------------------
// Conceptualizing — 50/50 split with interactive 3D bracelet.
//
// Desktop: text on left, R3F canvas on right.
// Mobile:  vertical 50/50 — text top (scrollable), canvas bottom.
//
// Since the page has overflow-hidden, standard ScrollTrigger can't work.
// Instead we use the GSAP Observer plugin:
//   • Auto-play: assembly animation plays slowly on load (0→1 over 8s).
//   • User takeover: any wheel/touch/pointer event kills auto-play.
//   • Vertical delta → assembly progress scrubbing (0→1).
//   • Horizontal delta → Y-axis rotation of the bracelet.
//
// No OrbitControls — Observer handles all interaction to avoid conflicts.
// ---------------------------------------------------------------------------

// ── Lazy-load heavy 3D components ────────────────────────────────────────

const Scene = dynamic(
  () => import("@/app/components/canvas/Scene").then((mod) => mod.Scene),
  { ssr: false },
);

const Bracelet = dynamic(
  () => import("@/app/components/canvas/Bracelet").then((mod) => mod.Bracelet),
  { ssr: false },
);

// ---------------------------------------------------------------------------
// BraceletWithRotation — thin R3F wrapper that applies an external rotation
// ref to a parent <group> around the Bracelet. This keeps rotation logic
// outside of Bracelet.tsx (which only cares about assembly progress).
// ---------------------------------------------------------------------------

function BraceletWithRotation({
  progressRef,
  rotationRef,
}: {
  progressRef: React.MutableRefObject<number>;
  rotationRef: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <group ref={groupRef}>
      <Bracelet progressRef={progressRef} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function ConceptualizingPage() {
  const progressRef = useRef(0);
  const rotationRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  const { conceptualizing } = siteContent;

  // ── GSAP Observer — auto-play + user interaction ────────────────────────
  useGSAP(() => {
    // 1. Auto-play: slowly animate progress from 0 → 1 over 8 seconds
    const autoTween = gsap.to(progressRef, {
      current: 1,
      duration: 8,
      ease: "power1.inOut",
    });

    // 2. Observer: listen for user input
    const observer = Observer.create({
      target: canvasContainerRef.current || undefined,
      type: "wheel,touch,pointer",
      wheelSpeed: -1,
      onPress() {
        autoTween.kill();
      },
      onChange(self) {
        autoTween.kill();
        // Vertical delta → assembly progress
        if (self.deltaY) {
          progressRef.current = gsap.utils.clamp(
            0,
            1,
            progressRef.current - self.deltaY * 0.001,
          );
        }
        // Horizontal delta → rotation
        if (self.deltaX) {
          rotationRef.current += self.deltaX * 0.005;
        }
      },
      tolerance: 5,
      preventDefault: true,
    });

    return () => {
      autoTween.kill();
      observer.kill();
    };
  }, { dependencies: [] });

  return (
    <div className="snap-container">

      {/* ── Left panel — text ──────────────────────────────────────── */}
      <div className="snap-slide snap-slide--text flex flex-col justify-center p-8 md:p-12 lg:p-16">
        <p className="mb-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
          Interactive
        </p>
        <h1
          className="mb-8 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {conceptualizing.headline}
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-white/50">
          {conceptualizing.body}
        </p>

        {/* Interaction hint */}
        <div className="mt-12 flex items-center gap-3 text-white/20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="text-[0.6rem] uppercase tracking-[0.3em]">
            Scroll to assemble · Drag to rotate
          </span>
        </div>
      </div>

      {/* ── Right panel — 3D Canvas ────────────────────────────────── */}
      <div
        ref={canvasContainerRef}
        className="snap-slide snap-slide--media relative"
      >
        <Scene interactive orbitEnabled={false}>
          <BraceletWithRotation
            progressRef={progressRef}
            rotationRef={rotationRef}
          />
        </Scene>
      </div>
    </div>
  );
}

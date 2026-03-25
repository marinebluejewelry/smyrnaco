"use client";

import { useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import gsap from "gsap";
// @ts-ignore — GSAP types casing conflict on Windows
import { Observer } from "gsap/Observer";
import { useGSAP } from "@gsap/react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import siteContent from "@/app/lib/data";
import { LoadingOverlay } from "@/app/components/dom/LoadingOverlay";
import { WebGLErrorBoundary } from "@/app/components/dom/WebGLErrorBoundary";

gsap.registerPlugin(Observer);

// ---------------------------------------------------------------------------
// About Us — 50/50 split with scroll-driven bracelet assembly.
//
// Desktop: text left (scrollable in constrained inner frame), canvas right.
//          Floating hint box centered over the page (absolute, z-20).
// Mobile:  media top (order:1), text bottom (order:3).
//          Hint box floats centered.
//
// Text panel scroll drives bracelet assembly progress (0→1), smoothed via
// GSAP interpolation to avoid jerky mouse-wheel snapping.
// GSAP Observer on canvas handles horizontal drag rotation only.
// ---------------------------------------------------------------------------

const Scene = dynamic(
  () => import("@/app/components/canvas/Scene").then((mod) => mod.Scene),
  { ssr: false },
);

const Bracelet = dynamic(
  () => import("@/app/components/canvas/Bracelet").then((mod) => mod.Bracelet),
  { ssr: false },
);

// ---------------------------------------------------------------------------
// BraceletWithRotation — thin R3F wrapper for horizontal drag rotation.
// ---------------------------------------------------------------------------

function BraceletWithRotation({
  progressRef,
  rotationRef,
  onAssemblyComplete,
}: {
  progressRef: React.MutableRefObject<number>;
  rotationRef: React.MutableRefObject<number>;
  onAssemblyComplete?: (complete: boolean) => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <group ref={groupRef}>
      <Bracelet progressRef={progressRef} onAssemblyComplete={onAssemblyComplete} />
    </group>
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

export default function AboutUsPage() {
  const progressRef = useRef(0);
  const rotationRef = useRef(0);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { aboutUs } = siteContent;

  // Text scroll → bracelet progress (smoothed via GSAP tween)
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return;
    const targetProgress = el.scrollTop / scrollable;

    // Smooth interpolation — avoids jerky mouse-wheel snapping
    gsap.to(progressRef, {
      current: targetProgress,
      duration: 2.6,
      ease: "power2.out",
      overwrite: true,
    });
  }, []);

  const handleAssemblyComplete = useCallback((complete: boolean) => {
    setIsComplete(complete);
  }, []);

  // GSAP Observer — horizontal drag rotation only
  useGSAP(() => {
    const observer = Observer.create({
      target: canvasContainerRef.current || undefined,
      type: "touch,pointer",
      onChangeX(self: { deltaX: number }) {
        rotationRef.current += self.deltaX * 0.005;
      },
      tolerance: 5,
      preventDefault: true,
    });

    return () => {
      observer.kill();
    };
  }, { dependencies: [] });

  return (
    <div className="snap-container relative">
      {/* ── Text panel ────────────────────────────────────────────── */}
      <div className="snap-slide snap-slide--text about-us-text flex flex-col items-center justify-center p-4 md:p-12 lg:p-16">
        {/* Desktop: constrained inner scroll frame — smaller, bordered, centered */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="w-full max-w-xl overflow-y-auto md:max-h-[40vh] md:border md:border-white/10 md:rounded md:p-6 lg:p-8"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255,255,255,0.15) transparent",
          }}
        >
          <p className="mb-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
            Our Story
          </p>
          <h1
            className="mb-8 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {aboutUs.headline}
          </h1>
          {aboutUs.paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-sm leading-relaxed text-white/50 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* ── Floating hint box — at boundary between text & canvas ──── */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-[40%] z-20 pointer-events-auto">
        <div className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-3 rounded">
          {isComplete ? (
            <Link
              href={aboutUs.completionHref}
              className="block text-[0.65rem] italic text-white/40 hover:text-white/70 transition-colors duration-300 text-center whitespace-nowrap"
            >
              {aboutUs.completionText}
            </Link>
          ) : (
            <span className="block text-[0.6rem] uppercase tracking-[0.2em] text-white/20 text-center whitespace-nowrap">
              {aboutUs.scrollHint}
            </span>
          )}
        </div>
      </div>

      {/* ── Media panel — 3D canvas ───────────────────────────────── */}
      <div
        ref={canvasContainerRef}
        className="snap-slide snap-slide--media about-us-media relative"
      >
        <LoadingOverlay />
        <WebGLErrorBoundary>
          <Scene interactive orbitEnabled={false}>
            <BraceletWithRotation
              progressRef={progressRef}
              rotationRef={rotationRef}
              onAssemblyComplete={handleAssemblyComplete}
            />
          </Scene>
        </WebGLErrorBoundary>
      </div>
    </div>
  );
}

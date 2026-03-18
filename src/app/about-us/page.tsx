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

gsap.registerPlugin(Observer);

// ---------------------------------------------------------------------------
// About Us — 50/50 split with scroll-driven bracelet assembly.
//
// Desktop: text left (scrollable), hint strip (vertical, between), canvas right.
// Mobile:  media top (order:1), hint strip (horizontal, order:2), text bottom (order:3).
//
// Text panel scroll drives bracelet assembly progress (0→1).
// GSAP Observer on canvas handles horizontal drag rotation only.
// Hint strip shows scroll hint initially, swaps to completion link.
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
  const textPanelRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  const { aboutUs } = siteContent;

  // Text scroll → bracelet progress
  const handleScroll = useCallback(() => {
    const el = textPanelRef.current;
    if (!el) return;
    const scrollable = el.scrollHeight - el.clientHeight;
    if (scrollable <= 0) return;
    progressRef.current = el.scrollTop / scrollable;
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
    <div className="snap-container">
      {/* ── Text panel ────────────────────────────────────────────── */}
      <div
        ref={textPanelRef}
        onScroll={handleScroll}
        className="snap-slide snap-slide--text about-us-text flex flex-col justify-start p-4 md:p-12 lg:p-16"
      >
        <div className="w-full max-w-xl">
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

      {/* ── Hint strip — between text and canvas ──────────────────── */}
      <div className="about-us-hint flex-shrink-0 flex items-center justify-center bg-black/40 border-white/5 h-10 md:h-auto md:w-12 border-y md:border-y-0 md:border-x">
        {isComplete ? (
          <Link
            href={aboutUs.completionHref}
            className="text-[0.5rem] italic text-white/40 hover:text-white/70 transition-colors duration-300 md:[writing-mode:vertical-lr] md:rotate-180 text-center px-2 md:px-0 md:py-4"
          >
            {aboutUs.completionText}
          </Link>
        ) : (
          <span className="text-[0.5rem] uppercase tracking-[0.2em] text-white/20 md:[writing-mode:vertical-lr] md:rotate-180 text-center px-2 md:px-0 md:py-4">
            {aboutUs.scrollHint}
          </span>
        )}
      </div>

      {/* ── Media panel — 3D canvas ───────────────────────────────── */}
      <div
        ref={canvasContainerRef}
        className="snap-slide snap-slide--media about-us-media relative"
      >
        <Scene interactive orbitEnabled={false}>
          <BraceletWithRotation
            progressRef={progressRef}
            rotationRef={rotationRef}
            onAssemblyComplete={handleAssemblyComplete}
          />
        </Scene>
      </div>
    </div>
  );
}

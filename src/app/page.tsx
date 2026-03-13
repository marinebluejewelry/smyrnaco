"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import siteContent from "@/app/lib/data";

// ---------------------------------------------------------------------------
// Homepage — Full-viewport video sequence.
//
// Video A plays once. When it ends, Video B takes over on infinite loop.
// A "REPLAY" button (visible during loop) resets to Video A.
//
// Supports mobile-specific video sources (portrait aspect ratio).
// Overlay: logo top-left (GSAP fade-in), headline + subtitle above BottomMenu.
// No scrolling. Root container is h-screen w-screen overflow-hidden.
// ---------------------------------------------------------------------------

type VideoPhase = "intro" | "loop";

export default function Home() {
  const [phase, setPhase] = useState<VideoPhase>("intro");
  const [isMobile, setIsMobile] = useState(false);
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // ── Detect mobile viewport ────────────────────────────────────────────────
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // ── Logo + text entrance animation ──────────────────────────────────────
  useGSAP(() => {
    if (logoRef.current) {
      gsap.fromTo(
        logoRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out", delay: 0.5 },
      );
    }
    if (textRef.current) {
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.8 },
      );
    }
  }, { dependencies: [] });

  // ── Video A ended → switch to loop ──────────────────────────────────────
  const handleIntroEnd = useCallback(() => {
    setPhase("loop");
    videoBRef.current?.play();
  }, []);

  // ── Replay button — reset to Video A ────────────────────────────────────
  const handleReplay = useCallback(() => {
    videoBRef.current?.pause();
    setPhase("intro");
    if (videoARef.current) {
      videoARef.current.currentTime = 0;
      videoARef.current.play();
    }
  }, []);

  const { home } = siteContent;

  // ── Resolve video sources (mobile → desktop fallback) ─────────────────
  const introSrc = isMobile && home.videoIntroSrcMobile
    ? home.videoIntroSrcMobile : home.videoIntroSrc;
  const loopSrc = isMobile && home.videoLoopSrcMobile
    ? home.videoLoopSrcMobile : home.videoLoopSrc;
  const introPoster = isMobile && home.videoIntroPosterMobile
    ? home.videoIntroPosterMobile : (home.videoIntroPoster || undefined);
  const loopPoster = isMobile && home.videoLoopPosterMobile
    ? home.videoLoopPosterMobile : (home.videoLoopPoster || undefined);

  return (
    <div className="relative flex-1 w-full overflow-hidden bg-black">

      {/* ── Video A — intro (plays once) ─────────────────────────────── */}
      <video
        ref={videoARef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          phase === "intro" ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        autoPlay
        muted
        playsInline
        onEnded={handleIntroEnd}
        poster={introPoster}
      >
        <source src={introSrc} type="video/mp4" />
      </video>

      {/* ── Video B — loop (infinite) ────────────────────────────────── */}
      <video
        ref={videoBRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          phase === "loop" ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
        loop
        preload="auto"
        poster={loopPoster}
      >
        <source src={loopSrc} type="video/mp4" />
      </video>

      {/* ── Logo — top left ──────────────────────────────────────────── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={logoRef}
        src={home.logoSrc}
        alt={siteContent.brand}
        className="absolute left-4 top-6 z-10 h-auto w-40 opacity-0 md:left-20 md:top-10 md:w-80"
      />

      {/* ── Bottom overlay — replay + headline ──────────────────────── */}
      <div className="absolute bottom-6 left-8 right-8 z-10">

        {/* Replay — above headline, right-aligned */}
        {phase === "loop" && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleReplay}
              className="text-[11px] md:text-[13px] uppercase tracking-[0.3em] text-white/40 transition-colors duration-300 hover:text-white/70 border border-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
            >
              REPLAY
            </button>
          </div>
        )}

        {/* Headline + subtitle */}
        <div ref={textRef} className="max-w-lg opacity-0">
          <h1
            className="text-[34px] md:text-[62px] font-light leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {home.headline}
          </h1>
          <span className="mt-3 block text-[17px] md:text-[19px] uppercase tracking-[0.4em] text-white/50">
            {home.subtitle}
          </span>
        </div>
      </div>
    </div>
  );
}

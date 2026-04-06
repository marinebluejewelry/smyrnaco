"use client";

import { useRef, useState, useCallback } from "react";
import gsap from "gsap";
import siteContent from "@/app/lib/data";
import { VideoLoadingOverlay } from "@/app/components/dom/VideoLoadingOverlay";

// ---------------------------------------------------------------------------
// How We Do It — 50/50 split with tab navigation.
//
// Desktop: tabs + text on left, fullbleed video on right.
// Mobile:  vertical 50/50 — tabs+text top (scrollable), video bottom.
//
// Clicking a tab triggers a GSAP cross-fade on the text and swaps the
// video source on the right.
// ---------------------------------------------------------------------------

export default function HowWeDoItPage() {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { howWeDoIt } = siteContent;
  const steps = howWeDoIt.steps;
  const current = steps[activeTab];

  const handleTabChange = useCallback(
    (index: number) => {
      if (index === activeTab || !contentRef.current) return;

      // Animate out current text
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          setActiveTab(index);

          // Swap video source + poster
          if (videoRef.current) {
            videoRef.current.poster = steps[index].posterSrc || "";
            videoRef.current.src = steps[index].videoSrc;
            videoRef.current.load();
            videoRef.current.play();
          }

          // Animate in new text
          requestAnimationFrame(() => {
            if (contentRef.current) {
              gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
              );
            }
          });
        },
      });
    },
    [activeTab, steps],
  );

  const handlePrev = useCallback(() => {
    handleTabChange((activeTab - 1 + steps.length) % steps.length);
  }, [activeTab, steps.length, handleTabChange]);

  const handleNext = useCallback(() => {
    handleTabChange((activeTab + 1) % steps.length);
  }, [activeTab, steps.length, handleTabChange]);

  return (
    <div className="snap-container">

      {/* ── Left / Top panel — tabs + text ─────────────────────────── */}
      <div className="snap-slide snap-slide--text flex flex-col items-start justify-start p-4 lg:p-12 xl:p-16">
        {/* Eyebrow */}

        {/* Section headline */}
        <h1
          className="mb-10 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
         
        >
          {howWeDoIt.headline}
        </h1>

        {/* Tab bar */}
        <div className="steps-scrollbar mb-10 flex w-full overflow-x-auto gap-2 border-b border-white/10 pb-6 whitespace-nowrap">
          {steps.map((step, i) => (
            <button
              key={step.id}
              onClick={() => handleTabChange(i)}
              className={`
                pb-2 text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-300
                ${i === activeTab
                  ? "text-white"
                  : "text-white/35 hover:text-white/60"
                }
              `}
            >
              {step.tabLabel}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div ref={contentRef}>
          <h2
            className="mb-4 text-xl md:text-2xl font-light tracking-tight text-white"
           
          >
            {current.headline}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/50">
            {current.body}
          </p>
        </div>
      </div>

      {/* ── Right / Bottom panel — fullbleed video ─────────────────── */}
      <div className="snap-slide snap-slide--media relative">
        <VideoLoadingOverlay videoRef={videoRef} />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster={current.posterSrc || undefined}
          autoPlay
          muted
          playsInline
          loop
        >
          <source src={current.videoSrc} type="video/mp4" />
        </video>

        {/* Prev / Next overlay buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-6/7 lg:top-2/3 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          ← Prev
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-6/7 lg:top-2/3 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import siteContent from "@/app/lib/data";
import { modelPath } from "@/app/lib/models";

// ---------------------------------------------------------------------------
// Projects — 50/50 split with tab navigation + 3D model viewer.
//
// Desktop: tabs + text on left, interactive 3D model viewer on right.
// Mobile:  vertical 50/50 — tabs+text top (scrollable), 3D model bottom.
//
// 10 project tabs, each loading a .glb model. Prev/Next overlay buttons
// on the media panel sync with the tab bar.
// ---------------------------------------------------------------------------

const Scene = dynamic(
  () => import("@/app/components/canvas/Scene").then((mod) => mod.Scene),
  { ssr: false },
);

const ProductModel = dynamic(
  () =>
    import("@/app/components/canvas/ProductModel").then(
      (mod) => mod.ProductModel,
    ),
  { ssr: false },
);

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  const { projects } = siteContent;
  const tabs = projects.tabs;
  const current = tabs[activeTab];

  // Auto-scroll active tab into view
  useEffect(() => {
    if (!tabBarRef.current) return;
    const activeBtn = tabBarRef.current.children[activeTab] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeTab]);

  const handleTabChange = useCallback(
    (index: number) => {
      if (index === activeTab || !contentRef.current) return;

      gsap.to(contentRef.current, {
        opacity: 0,
        y: -15,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => {
          setActiveTab(index);

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
    [activeTab],
  );

  const handlePrev = useCallback(() => {
    handleTabChange((activeTab - 1 + tabs.length) % tabs.length);
  }, [activeTab, tabs.length, handleTabChange]);

  const handleNext = useCallback(() => {
    handleTabChange((activeTab + 1) % tabs.length);
  }, [activeTab, tabs.length, handleTabChange]);

  return (
    <div className="snap-container">
      {/* ── Left / Top panel — tabs + text ─────────────────────────── */}
      <div className="snap-slide snap-slide--text flex flex-col items-start justify-start p-4 md:p-12 lg:p-16">
        <p className="mb-6 text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
          Collection
        </p>

        <h1
          className="mb-10 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {projects.headline}
        </h1>

        {/* Tab bar */}
        <div
          ref={tabBarRef}
          className="steps-scrollbar mb-10 flex w-full overflow-x-auto gap-2 border-b border-white/10 pb-3 whitespace-nowrap"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(i)}
              className={`
                pb-2 text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-300
                ${i === activeTab
                  ? "text-white"
                  : "text-white/35 hover:text-white/60"
                }
              `}
            >
              {tab.tabLabel}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div ref={contentRef}>
          <h2
            className="mb-4 text-xl md:text-2xl font-light tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {current.headline}
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-white/50">
            {current.body}
          </p>
        </div>
      </div>

      {/* ── Right / Bottom panel — 3D model viewer ──────────────────── */}
      <div className="snap-slide snap-slide--media relative">
        <Scene interactive orbitEnabled autoRotateSpeed={1.5} enableZoom>
          <ProductModel
            path={modelPath(current.modelFilename)}
            baseScale={0.2}
          />
        </Scene>

        {/* Prev / Next overlay buttons */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          ← Prev
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

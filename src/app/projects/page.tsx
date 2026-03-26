"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import siteContent from "@/app/lib/data";
import { modelPath, mobileModelPath } from "@/app/lib/models";
import { LoadingOverlay } from "@/app/components/dom/LoadingOverlay";
import { WebGLErrorBoundary } from "@/app/components/dom/WebGLErrorBoundary";

// ---------------------------------------------------------------------------
// Projects — two-level tab navigation + 3D model viewer.
//
// Desktop: full single-page experience with model swapping (full-quality models).
// Mobile:  same single-page experience but with optimized /models-mobile/ assets.
//
// ROLLBACK NOTE: If mobile OOM crashes return, switch back to subpage navigation
// by uncommenting the "SUBPAGE FLOW" blocks and commenting out "SINGLE-PAGE FLOW".
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

const SWAP_DELAY_DESKTOP = 150;

export default function ProjectsPage() {
  const [activePrimary, setActivePrimary] = useState(0);
  const [activeSecondary, setActiveSecondary] = useState(0);
  const [modelReady, setModelReady] = useState(true);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const secondaryBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 767px)").matches);
  }, []);

  const { projects } = siteContent;
  const categories = projects.categories;
  const activeCategory = categories[activePrimary];
  const tabs = activeCategory.tabs;
  const current = tabs[activeSecondary];

  // Auto-scroll active secondary tab into view
  useEffect(() => {
    if (!secondaryBarRef.current) return;
    const activeBtn = secondaryBarRef.current.children[activeSecondary] as HTMLElement;
    if (activeBtn) {
      activeBtn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeSecondary]);

  // Desktop: staged model swap (unmount → pause → remount)
  const swapModel = useCallback(
    (updateFn: () => void) => {
      setModelReady(false);

      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -15,
          duration: 0.3,
          ease: "power3.in",
        });
      }

      setTimeout(() => {
        updateFn();
        setModelReady(true);

        requestAnimationFrame(() => {
          if (contentRef.current) {
            gsap.fromTo(
              contentRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
            );
          }
        });
      }, SWAP_DELAY_DESKTOP);
    },
    [],
  );

  const handlePrimaryChange = useCallback(
    (index: number) => {
      if (index === activePrimary) return;
      // SINGLE-PAGE FLOW: swap model in-page for both mobile and desktop
      swapModel(() => {
        setActivePrimary(index);
        setActiveSecondary(0);
      });
      /* SUBPAGE FLOW (uncomment if mobile OOM returns):
      if (isMobile) {
        setActivePrimary(index);
        setActiveSecondary(0);
        return;
      }
      swapModel(() => {
        setActivePrimary(index);
        setActiveSecondary(0);
      });
      */
    },
    [activePrimary, swapModel],
  );

  const handleSecondaryChange = useCallback(
    (index: number) => {
      if (index === activeSecondary) return;
      swapModel(() => {
        setActiveSecondary(index);
      });
    },
    [activeSecondary, swapModel],
  );

  /* SUBPAGE FLOW (uncomment if mobile OOM returns):
  const handleMobileTabClick = useCallback(
    (tabId: string) => {
      window.location.href = `/projects/${tabId}`;
    },
    [],
  );
  */

  const handlePrev = useCallback(() => {
    handleSecondaryChange((activeSecondary - 1 + tabs.length) % tabs.length);
  }, [activeSecondary, tabs.length, handleSecondaryChange]);

  const handleNext = useCallback(() => {
    handleSecondaryChange((activeSecondary + 1) % tabs.length);
  }, [activeSecondary, tabs.length, handleSecondaryChange]);

  return (
    <div className="snap-container">
      {/* ── Left / Top panel — tabs + text ─────────────────────────── */}
      <div className="snap-slide snap-slide--text flex flex-col items-start justify-start p-4 md:p-12 lg:p-16">

        <h1
          className="mb-8 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {projects.headline}
        </h1>

        {/* Primary tab bar — categories */}
        <div className="mb-6 flex w-full gap-6 border-b border-white/10 pb-3">
          {categories.map((cat, i) => (
            <button
              key={cat.id}
              onClick={() => handlePrimaryChange(i)}
              className={`
                pb-2 text-xs md:text-sm uppercase tracking-[0.2em] transition-all duration-300
                ${i === activePrimary
                  ? "text-white border-b-2 border-white"
                  : "text-white/30 hover:text-white/60"
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Secondary tab bar — projects within category */}
        <div
          ref={secondaryBarRef}
          className="steps-scrollbar mb-10 flex w-full overflow-x-auto gap-2 border-b border-white/5 pb-3 whitespace-nowrap"
        >
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => handleSecondaryChange(i)
                /* SUBPAGE FLOW (uncomment if mobile OOM returns):
                isMobile ? handleMobileTabClick(tab.id) : handleSecondaryChange(i)
                */
              }
              className={`
                pb-2 text-[0.65rem] uppercase tracking-[0.3em] transition-all duration-300
                ${i === activeSecondary
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
        {/* SINGLE-PAGE FLOW: 3D on both mobile and desktop */}
        <LoadingOverlay />
        <WebGLErrorBoundary>
          <Scene interactive orbitEnabled autoRotateSpeed={1.5} enableZoom>
            {modelReady && (
              <ProductModel
                path={isMobile ? mobileModelPath(current.modelFilename) : modelPath(current.modelFilename)}
                baseScale={0.2}
              />
            )}
          </Scene>
        </WebGLErrorBoundary>

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

        {/* SUBPAGE FLOW (uncomment if mobile OOM returns, and comment out above):
        {isMobile ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-8">
            <p className="text-lg font-light text-white/60 text-center" style={{ fontFamily: "var(--font-serif)" }}>
              Select a piece to explore in 3D
            </p>
            <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/20 text-center">
              Each model opens on its own page for the best experience
            </p>
          </div>
        ) : (
          <>
            <LoadingOverlay />
            <WebGLErrorBoundary>
              <Scene interactive orbitEnabled autoRotateSpeed={1.5} enableZoom>
                {modelReady && (
                  <ProductModel path={modelPath(current.modelFilename)} baseScale={0.2} />
                )}
              </Scene>
            </WebGLErrorBoundary>
            <button onClick={handlePrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30">← Prev</button>
            <button onClick={handleNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30">Next →</button>
          </>
        )}
        */}
      </div>
    </div>
  );
}

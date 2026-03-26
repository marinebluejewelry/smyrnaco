"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { mobileModelPath } from "@/app/lib/models";
import { LoadingOverlay } from "@/app/components/dom/LoadingOverlay";
import { WebGLErrorBoundary } from "@/app/components/dom/WebGLErrorBoundary";
import type { FlatCatalogTab } from "@/app/lib/data";

// ---------------------------------------------------------------------------
// MobileModelView — single-model 3D viewer for mobile subpages.
//
// Only ONE model is ever loaded per page context. Navigation between models
// uses hard <a href> links (NOT Next.js <Link>), forcing a full page reload
// that guarantees complete browser memory reclamation on iOS.
//
// On desktop viewports, redirects to /catalog (the single-page experience).
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

interface MobileModelViewProps {
  tab: FlatCatalogTab;
  prevId: string;
  nextId: string;
}

export function MobileModelView({ tab, prevId, nextId }: MobileModelViewProps) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!mobile) {
      window.location.replace("/catalog");
      return;
    }
    setIsMobile(true);
  }, []);

  // Not yet determined or redirecting to desktop
  if (isMobile !== true) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/20">
          Loading…
        </p>
      </div>
    );
  }

  return (
    <div className="snap-container">
      {/* ── Text panel ─────────────────────────────────────────────── */}
      <div className="snap-slide snap-slide--text flex flex-col items-start justify-start p-4">
        {/* Back link + category breadcrumb */}
        <div className="mb-4 flex items-center gap-3">
          <a
            href="/catalog"
            className="text-[0.6rem] uppercase tracking-[0.2em] text-white/40 hover:text-white/70 transition-colors duration-300"
          >
            ← Catalog
          </a>
          <span className="text-white/15">·</span>
          <span className="text-[0.6rem] uppercase tracking-[0.2em] text-white/25">
            {tab.categoryLabel}
          </span>
        </div>

        <h1
          className="mb-4 text-2xl font-light leading-tight tracking-tight text-white"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {tab.headline}
        </h1>

        <p className="max-w-md text-sm leading-relaxed text-white/50">
          {tab.body}
        </p>
      </div>

      {/* ── Media panel — single 3D model ──────────────────────────── */}
      <div className="snap-slide snap-slide--media relative">
        <LoadingOverlay />
        <WebGLErrorBoundary>
          <Scene interactive orbitEnabled autoRotateSpeed={1.5} enableZoom>
            <ProductModel
              path={mobileModelPath(tab.modelFilename)}
              baseScale={0.2}
            />
          </Scene>
        </WebGLErrorBoundary>

        {/* Prev / Next — hard <a> links, NOT Next.js <Link> */}
        <a
          href={`/catalog/${prevId}`}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          ← Prev
        </a>
        <a
          href={`/catalog/${nextId}`}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-3 py-2 text-[0.6rem] uppercase tracking-[0.2em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          Next →
        </a>
      </div>
    </div>
  );
}

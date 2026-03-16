"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import siteContent from "@/app/lib/data";

// ---------------------------------------------------------------------------
// Who We Are — 50/50 split layout.
//
// Desktop: text left, interactive 3D model viewer right (zoom enabled).
// Mobile:  vertical 50/50 — text top (scrollable), 3D model bottom.
//
// Two GLB models available, toggled via a small button overlaid on the canvas.
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

// ── Available models ────────────────────────────────────────────────────────
const MODELS = ["/models/product.glb"];

export default function WhoWeArePage() {
  const [modelIndex, setModelIndex] = useState(0);
  const { whoWeAre } = siteContent;

  return (
    <div className="snap-container">
      {/* ── Left / Top panel — text ─────────────────────────────────── */}
      <div className="snap-slide snap-slide--text flex items-start justify-start md:p-12 lg:p-16">
        <div className="w-full max-w-xl border border-white/[0.06] p-5 md:p-12">
          <p className="mb-4 text-[0.6rem] uppercase tracking-[0.4em] text-white/30">
            About
          </p>
          <h1
            className="mb-8 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {whoWeAre.headline}
          </h1>
          {whoWeAre.paragraphs.map((p, i) => (
            <p
              key={i}
              className="mb-5 text-sm leading-relaxed text-white/50 last:mb-0"
            >
              {p}
            </p>
          ))}
        </div>
      </div>

      {/* ── Right / Bottom panel — 3D model viewer ──────────────────── */}
      <div className="snap-slide snap-slide--media relative">
        <Scene interactive orbitEnabled autoRotateSpeed={1.5} enableZoom>
          <ProductModel path={MODELS[modelIndex]} baseScale={0.2} />
        </Scene>

        {/* Model toggle button */}
        <button
          onClick={() => setModelIndex((i) => (i + 1) % MODELS.length)}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 border border-white/15 bg-black/60 backdrop-blur-sm px-5 py-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
        >
          Next Model →
        </button>
      </div>
    </div>
  );
}

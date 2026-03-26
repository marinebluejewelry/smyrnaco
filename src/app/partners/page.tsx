"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import gsap from "gsap";
import siteContent from "@/app/lib/data";
import { Carousel } from "@/app/components/dom/Carousel";

// ---------------------------------------------------------------------------
// Partners — 50/50 split with tab navigation + image carousel.
//
// Desktop: tabs + text + partnership CTA on left, carousel on right.
// Mobile:  vertical 50/50 — tabs+text top (scrollable), carousel bottom.
//
// Text panel has two sections:
//   Top (flex-1): Tabs + GSAP cross-fade partner content
//   Bottom (flex-shrink-0): Static partnership text + "Join Us" Link
// ---------------------------------------------------------------------------

export default function PartnersPage() {
  const [activeTab, setActiveTab] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const { partners } = siteContent;
  const tabs = partners.tabs;
  const current = tabs[activeTab];

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

  return (
    <div className="snap-container">
      {/* ── Left / Top panel — tabs + text + partnership ──────────── */}
      <div className="snap-slide snap-slide--text flex flex-col items-start justify-start p-4 lg:p-12 xl:p-16">
        {/* Top section — tabs + dynamic content */}
        <div className="flex-1 w-full">

          <h1
            className="mb-10 text-3xl md:text-5xl font-light leading-tight tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {partners.headline}
          </h1>

          {/* Tab bar */}
          <div className="steps-scrollbar mb-10 flex w-full overflow-x-auto gap-2 border-b border-white/10 pb-3 whitespace-nowrap">
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

        {/* Bottom section — static partnership CTA */}
        <div className="w-full flex-shrink-0 mt-auto border-t border-white/10 pt-6 md:pt-8">
          <h3
            className="mb-3 text-lg md:text-xl font-light tracking-tight text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            {partners.partnership.headline}
          </h3>
          <p className="mb-5 max-w-md text-xs leading-relaxed text-white/40">
            {partners.partnership.body}
          </p>
          <Link
            href={partners.partnership.ctaHref}
            className="inline-block border border-white/15 px-6 py-2.5 text-[0.6rem] uppercase tracking-[0.3em] text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30"
          >
            {partners.partnership.ctaLabel}
          </Link>
        </div>
      </div>

      {/* ── Right / Bottom panel — carousel ─────────────────────── */}
      <div className="snap-slide snap-slide--media relative" key={activeTab}>
        <Carousel images={current.images} />
      </div>
    </div>
  );
}

"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

// ---------------------------------------------------------------------------
// ShopNowCTA — Floating call-to-action in the top-right corner.
//
// Desktop (md+): Always expanded — "Shop Now!" label + Retail/Wholesale btns.
// Mobile (< md): Collapsed by default — vertical "SHOP" tab on top-right.
//   Clicking expands to reveal the full label + buttons (GSAP animation).
//   Exception: Homepage (/) starts expanded on mobile.
//
// Rendered in root layout alongside BottomMenu.
// ---------------------------------------------------------------------------

interface ShopLink {
  label: string;
  href: string;
}

const SHOP_LINKS: ShopLink[] = [
  { label: "Retail", href: "https://marinebluejewelry.com/" },      // TODO: replace with real URL
  { label: "Wholesale", href: "https://wholesalejewelry.store/" }, // TODO: replace with real URL
];

export function ShopNowCTA() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [isExpanded, setIsExpanded] = useState(isHome);
  const contentRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  // Set initial state on mount (no animation)
  useEffect(() => {
    if (!contentRef.current || hasInitialized.current) return;
    hasInitialized.current = true;

    if (!isExpanded) {
      gsap.set(contentRef.current, { height: 0, opacity: 0 });
    }
  }, [isExpanded]);

  // Update expanded state on route change
  useEffect(() => {
    setIsExpanded(isHome);
    if (contentRef.current) {
      if (isHome) {
        gsap.to(contentRef.current, { height: "auto", opacity: 1, duration: 0.3, ease: "power3.out" });
      } else {
        gsap.to(contentRef.current, { height: 0, opacity: 0, duration: 0.3, ease: "power3.in" });
      }
    }
  }, [isHome]);

  const toggle = useCallback(() => {
    if (!contentRef.current) return;
    const next = !isExpanded;
    setIsExpanded(next);

    if (next) {
      gsap.to(contentRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.3,
        ease: "power3.out",
      });
    } else {
      gsap.to(contentRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.25,
        ease: "power3.in",
      });
    }
  }, [isExpanded]);

  return (
    <div className="fixed top-6 right-4 md:right-6 z-[60] flex flex-col items-end gap-2">

      {/* ── Mobile toggle — vertical "SHOP" tab ────────────────────── */}
      <button
        onClick={toggle}
        className="md:hidden border border-white/15 bg-black/60 backdrop-blur-sm px-2 py-2 text-[0.6rem] uppercase tracking-[0.25em] text-white/60 transition-all duration-300 hover:bg-white/10 hover:text-white"
        style={{ writingMode: "horizontal-tb", textOrientation: "mixed" }}
        aria-label={isExpanded ? "Collapse shop links" : "Expand shop links"}
      >
        SHOP
      </button>

      {/* ── Desktop: always visible label ──────────────────────────── */}
      <span className="hidden md:block text-[0.6rem] uppercase tracking-[0.3em] text-white/50">
        Shop Now!
      </span>

      {/* ── Expandable content — buttons ───────────────────────────── */}
      <div
        ref={contentRef}
        className="overflow-hidden md:!h-auto md:!opacity-100"
      >
        <div className="flex flex-col md:flex-row gap-2 items-end">
          {SHOP_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                border border-white/15 bg-black/60 backdrop-blur-sm uppercase tracking-[0.3em] text-white/70 transition-all duration-300 hover:bg-white/10 hover:text-white hover:border-white/30 text-center
                py-2 text-[0.6rem]
                ${link.label === "Retail"
                  ? "px-4 md:px-4"
                  : "px-4"
                }
              `}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ShopNowCTA;

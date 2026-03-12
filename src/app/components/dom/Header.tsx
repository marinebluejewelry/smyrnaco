// @ts-nocheck — DEPRECATED: This component is from the old single-page layout.
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import siteContent from "@/app/lib/data";

// ---------------------------------------------------------------------------
// Header — minimal fixed navigation bar.
//
// - Transparent background with subtle backdrop blur on scroll.
// - Logo left, "Menu" text right.
// - Fades in only after the loading sequence completes (controlled via prop).
// ---------------------------------------------------------------------------

interface HeaderProps {
  /** Set to true once the Loader has finished its exit animation. */
  isReady: boolean;
}

export function Header({ isReady }: HeaderProps) {
  const headerRef = useRef<HTMLElement>(null!);

  // Fade in when the page is ready (after loader finishes)
  useEffect(() => {
    if (!isReady) return;

    gsap.fromTo(
      headerRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 },
    );
  }, [isReady]);

  return (
    <header
      ref={headerRef}
      className="pointer-events-auto fixed left-0 right-0 top-0 z-50 flex items-center justify-between px-6 py-5 opacity-0 mix-blend-difference md:px-12 lg:px-16"
    >
      {/* Logo */}
      <a
        href="/"
        className="text-[11px] font-medium uppercase tracking-[0.45em] text-white"
      >
        {siteContent.brand}
      </a>

      {/* Menu trigger (placeholder — can wire to a drawer later) */}
      <button
        type="button"
        className="group flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.35em] text-white"
      >
        <span className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-white after:transition-all after:duration-300 group-hover:after:w-full">
          Menu
        </span>

        {/* Hamburger lines */}
        <span className="flex w-5 flex-col gap-[5px]">
          <span className="block h-px w-full bg-white transition-transform duration-300 group-hover:translate-x-0.5" />
          <span className="block h-px w-3/4 bg-white transition-all duration-300 group-hover:w-full group-hover:-translate-x-0.5" />
        </span>
      </button>
    </header>
  );
}

export default Header;

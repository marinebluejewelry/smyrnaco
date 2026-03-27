// @ts-nocheck — DEPRECATED: This component is from the old single-page layout.
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import siteContent from "@/app/lib/data";

// ---------------------------------------------------------------------------
// Hero — full-viewport intro section.
//
// Key upgrades:
//   • Headline uses Playfair Display (serif) via CSS var(--font-serif)
//   • Each headline line animates in independently (line-by-line stagger)
//   • Tagline, description, CTA cascade after the headline
//   • Entrance is gated behind `isReady` to sync with the Loader exit
// ---------------------------------------------------------------------------

interface HeroProps {
  isReady: boolean;
}

export function Hero({ isReady }: HeroProps) {
  const sectionRef = useRef<HTMLElement>(null!);
  const taglineRef = useRef<HTMLParagraphElement>(null!);
  const linesRef = useRef<(HTMLSpanElement | null)[]>([]);
  const descRef = useRef<HTMLParagraphElement>(null!);
  const ctaRef = useRef<HTMLAnchorElement>(null!);
  const dividerRef = useRef<HTMLDivElement>(null!);

  const { hero } = siteContent;

  useEffect(() => {
    if (!isReady) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.15,
      });

      // 1 — Tagline fades up
      tl.fromTo(
        taglineRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
      );

      // 2 — Headline lines stagger in one-by-one from below
      tl.fromTo(
        linesRef.current.filter(Boolean),
        { y: 100, opacity: 0, rotateX: 30 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 1.2,
          stagger: 0.15,
          ease: "power4.out",
        },
        "-=0.5",
      );

      // 3 — Divider line draws in
      tl.fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8, ease: "power2.inOut" },
        "-=0.6",
      );

      // 4 — Description
      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 },
        "-=0.5",
      );

      // 5 — CTA
      tl.fromTo(
        ctaRef.current,
        { y: 15, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.6",
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isReady]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-screen w-full items-center pointer-events-none"
    >
      <div className="pointer-events-auto relative z-10 flex w-full flex-col justify-center px-6 pt-28 md:w-1/2 md:px-16 md:pt-0 lg:px-24">
        {/* Tagline */}
        <p
          ref={taglineRef}
          className="mb-5 text-[10px] font-medium uppercase tracking-[0.4em] text-white/40 opacity-0 md:text-xs"
        >
          {hero.tagline}
        </p>

        {/* Headline — each line independent for stagger */}
        <h1 className="overflow-hidden leading-[0.92] tracking-tight text-white">
          {hero.headline.map((line, i) => (
            <span
              key={i}
              ref={(el) => { linesRef.current[i] = el; }}
              className="block font-serif text-5xl font-light italic opacity-0 sm:text-6xl md:text-7xl lg:text-[5.5rem] xl:text-[7rem]"
             
            >
              {line}
            </span>
          ))}
        </h1>

        {/* Divider line */}
        <div
          ref={dividerRef}
          className="mt-8 h-px w-16 origin-left bg-white/20"
          style={{ transform: "scaleX(0)" }}
        />

        {/* Description */}
        <p
          ref={descRef}
          className="mt-6 max-w-md text-sm leading-relaxed text-white/50 opacity-0 md:text-[15px] md:leading-relaxed"
        >
          {hero.description}
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href={hero.cta.href}
          className="group mt-10 inline-flex w-fit items-center gap-3 border-b border-white/20 pb-2 text-[11px] font-medium uppercase tracking-[0.3em] text-white opacity-0 transition-colors duration-500 hover:border-white/80"
        >
          {hero.cta.label}
          <span className="inline-block text-sm transition-transform duration-500 group-hover:translate-x-1.5">
            →
          </span>
        </a>
      </div>
    </section>
  );
}

export default Hero;

// @ts-nocheck — DEPRECATED: This component is from the old single-page layout.
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import siteContent from "@/app/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// Features — horizontal grid of brand pillars (Craftsmanship, Materials,
// Sustainability). Each card fades in on scroll with a staggered offset.
//
// Layout:
//   Desktop → 3-column grid with vertical dividers.
//   Mobile  → stacked single column.
// ---------------------------------------------------------------------------

export function Features() {
  const sectionRef = useRef<HTMLElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading
      gsap.fromTo(
        sectionRef.current.querySelector("[data-heading]"),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Feature cards stagger
      gsap.fromTo(
        sectionRef.current.querySelectorAll("[data-feature]"),
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative z-10 px-6 py-32 md:px-16 md:py-48 lg:px-24"
    >
      {/* Section heading */}
      <div data-heading className="mb-16 md:mb-24">
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-white/30 md:text-xs">
          The Foundation
        </p>
        <h2
          className="max-w-2xl text-3xl font-light italic leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Built on three
          <br />
          enduring principles.
        </h2>
      </div>

      {/* Feature grid */}
      <div className="grid gap-12 md:grid-cols-3 md:gap-0">
        {siteContent.features.map((feature, i) => (
          <article
            key={feature.id}
            data-feature
            className={`flex flex-col ${
              i > 0 ? "md:border-l md:border-white/10 md:pl-10" : ""
            } ${i < siteContent.features.length - 1 ? "md:pr-10" : ""}`}
          >
            {/* Index number */}
            <span className="mb-6 block text-[11px] font-medium tabular-nums tracking-[0.3em] text-white/25">
              {feature.index}
            </span>

            {/* Title */}
            <h3 className="mb-4 text-lg font-medium tracking-tight text-white md:text-xl">
              {feature.title}
            </h3>

            {/* Divider */}
            <div className="mb-5 h-px w-8 bg-white/15" />

            {/* Description */}
            <p className="text-sm leading-[1.75] text-white/40 md:text-[14px]">
              {feature.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Features;

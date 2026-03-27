"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ShowcaseSection as ShowcaseSectionData } from "@/app/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// ShowcaseSection — scroll-triggered content block.
//
// Upgrades:
//   • Headline uses serif font (Playfair Display)
//   • Horizontal rule draws in on scroll
//   • Alternating alignment (left / right) per index
//   • Smoother stagger with clip-path reveal
// ---------------------------------------------------------------------------

interface ShowcaseSectionProps {
  data: ShowcaseSectionData;
  index: number;
}

export function ShowcaseSection({ data, index }: ShowcaseSectionProps) {
  const ref = useRef<HTMLElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const animElements = ref.current.querySelectorAll("[data-animate]");
      const line = ref.current.querySelector("[data-line]");

      gsap.fromTo(
        animElements,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ref.current,
            start: "top 78%",
            end: "top 25%",
            toggleActions: "play none none reverse",
          },
        },
      );

      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, ref);

    return () => ctx.revert();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <section
      ref={ref}
      id={data.id}
      className="relative flex min-h-screen w-full items-center pointer-events-none"
    >
      <div
        className={`pointer-events-auto relative z-10 flex w-full flex-col justify-center px-6 md:w-1/2 md:px-16 lg:px-24 ${
          isEven ? "" : "md:ml-auto"
        }`}
      >
        <p
          data-animate
          className="mb-4 text-[10px] font-medium uppercase tracking-[0.4em] text-white/30 md:text-xs"
        >
          {data.label}
        </p>

        <h2
          data-animate
          className="font-light italic leading-tight tracking-tight text-white text-4xl sm:text-5xl md:text-6xl lg:text-7xl"
         
        >
          {data.headline}
        </h2>

        {/* Divider */}
        <div
          data-line
          className="mt-6 h-px w-12 origin-left bg-white/15"
          style={{ transform: "scaleX(0)" }}
        />

        <p
          data-animate
          className="mt-6 max-w-lg text-sm leading-relaxed text-white/45 md:text-[15px] md:leading-relaxed"
        >
          {data.body}
        </p>
      </div>
    </section>
  );
}

export default ShowcaseSection;

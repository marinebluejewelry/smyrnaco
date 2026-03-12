"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
// @ts-ignore — GSAP types casing conflict on Windows
import { Draggable } from "gsap/Draggable";
// @ts-ignore — GSAP types casing conflict on Windows
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { MediaImage } from "@/app/lib/data";

gsap.registerPlugin(ScrollTrigger, Draggable, InertiaPlugin);

// ---------------------------------------------------------------------------
// MediaShowcase — infinite drag carousel with 3:4 aspect-ratio slides.
//
// Desktop: text column left, carousel bleeds to right edge.
// Mobile:  text stacks above, carousel still bleeds right.
// Interaction: GSAP Draggable + InertiaPlugin with snap-to-slide.
// ---------------------------------------------------------------------------

const CLONE_COUNT = 3; // sets of clones on each side
const GAP = 16; // px gap between slides

interface MediaShowcaseProps {
  images: MediaImage[];
  heading?: string;
  eyebrow?: string;
}

export function MediaShowcase({
  images,
  heading,
  eyebrow,
}: MediaShowcaseProps) {
  const sectionRef = useRef<HTMLElement>(null!);
  const trackRef = useRef<HTMLDivElement>(null!);
  const draggableRef = useRef<Draggable[]>([]);

  // Build the looped slide array: [...clones, ...originals, ...clones]
  const totalClones = CLONE_COUNT * 2 + 1; // sets before + original + sets after
  const slides: MediaImage[] = [];
  for (let c = 0; c < totalClones; c++) {
    images.forEach((img) => slides.push(img));
  }

  // Measure one "set" width and teleport when out of bounds
  const getSetWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    const slideEl = trackRef.current.querySelector<HTMLElement>("[data-slide]");
    if (!slideEl) return 0;
    return (slideEl.offsetWidth + GAP) * images.length;
  }, [images.length]);

  // Teleport track back to center set if it drifts too far
  const wrapPosition = useCallback(() => {
    if (!trackRef.current || !draggableRef.current[0]) return;
    const setW = getSetWidth();
    if (setW === 0) return;

    const d = draggableRef.current[0];
    const x = d.x;
    const centerOffset = -CLONE_COUNT * setW; // starting x of center set

    // If dragged past the left clones or right clones, teleport
    if (x > centerOffset + setW) {
      gsap.set(trackRef.current, { x: x - setW });
      d.update(true);
    } else if (x < centerOffset - setW) {
      gsap.set(trackRef.current, { x: x + setW });
      d.update(true);
    }
  }, [getSetWidth]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Entrance animation ────────────────────────────────────────
      const headingEl = sectionRef.current.querySelector("[data-media-heading]");
      if (headingEl) {
        gsap.fromTo(
          headingEl,
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
      }

      gsap.fromTo(
        trackRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // ── Draggable setup ───────────────────────────────────────────
      const setW = getSetWidth();
      if (setW === 0) return;

      // Start centered on the "original" set (middle of the clones)
      const startX = -CLONE_COUNT * setW;
      gsap.set(trackRef.current, { x: startX });

      const slideWidth =
        trackRef.current.querySelector<HTMLElement>("[data-slide]")!
          .offsetWidth + GAP;

      draggableRef.current = Draggable.create(trackRef.current, {
        type: "x",
        inertia: true,
        edgeResistance: 0.65,
        snap: {
          x: (val) => Math.round(val / slideWidth) * slideWidth,
        },
        onDrag: wrapPosition,
        onThrowUpdate: wrapPosition,
        onThrowComplete: wrapPosition,
        cursor: "grab",
        activeCursor: "grabbing",
      });
    }, sectionRef);

    return () => {
      draggableRef.current.forEach((d) => d.kill());
      ctx.revert();
    };
  }, [getSetWidth, wrapPosition]);

  return (
    <section
      ref={sectionRef}
      className="relative z-10 py-24 md:py-40 overflow-hidden"
    >
      <div className="flex flex-col md:flex-row md:items-center">
        {/* ── Text column ─────────────────────────────────────────── */}
        {(eyebrow || heading) && (
          <div
            data-media-heading
            className="mb-10 pl-6 pr-6 md:mb-0 md:w-[33%] md:pl-16 md:pr-12 lg:w-[30%] lg:pl-24"
          >
            {eyebrow && (
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.4em] text-white/30 md:text-xs">
                {eyebrow}
              </p>
            )}
            {heading && (
              <h2
                className="max-w-sm text-3xl font-light italic leading-tight tracking-tight text-white sm:text-4xl md:text-5xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {heading}
              </h2>
            )}
          </div>
        )}

        {/* ── Carousel ────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden pr-0">
          <div
            ref={trackRef}
            className="carousel-track flex"
            style={{ gap: `${GAP}px` }}
          >
            {slides.map((img, i) => (
              <div
                key={`${img.id}-${i}`}
                data-slide
                className="carousel-slide group relative flex-shrink-0 w-[260px] md:w-[320px] lg:w-[360px]"
                style={{ aspectRatio: "3 / 4" }}
              >
                <div className="relative h-full w-full overflow-hidden">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 768px) 260px, (max-width: 1024px) 320px, 360px"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    quality={75}
                    draggable={false}
                  />

                  {/* Caption overlay on hover */}
                  {img.caption && (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        <p className="text-xs leading-relaxed text-white/80">
                          {img.caption}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MediaShowcase;

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
// @ts-ignore — GSAP types casing conflict on Windows
import { Draggable } from "gsap/Draggable";
// @ts-ignore — GSAP types casing conflict on Windows
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { MediaImage } from "@/app/lib/data";

gsap.registerPlugin(Draggable, InertiaPlugin);

// ---------------------------------------------------------------------------
// Carousel — bounded drag carousel with 3:4 aspect-ratio slides.
//
// No infinite loop. Draggable with hard bounds: first slide locks at the left
// edge, last slide locks at the right edge. Rubber-band edge resistance gives
// a tactile feel when hitting the ends.
//
// Each slide can optionally display a "Visit Product" link (target=_blank)
// via the MediaImage.link field.
// ---------------------------------------------------------------------------

const GAP = 16;
const PADDING = 24;

interface CarouselProps {
  images: MediaImage[];
}

export function Carousel({ images }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const trackRef = useRef<HTMLDivElement>(null!);
  const draggableRef = useRef<Draggable[]>([]);

  useEffect(() => {
    if (!trackRef.current || !containerRef.current) return;

    const slideEls = trackRef.current.querySelectorAll<HTMLElement>("[data-slide]");
    if (slideEls.length === 0) return;

    const slideWidth = slideEls[0].offsetWidth + GAP;
    // Use the browser's actual measured scrollWidth — accounts for padding,
    // gaps, and slide widths at every breakpoint without manual math.
    const trackWidth = trackRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;

    // Max drag: 0 (first slide at left edge)
    // Min drag: negative overflow (last slide fully visible), or 0 if content fits
    const minX = Math.min(0, -(trackWidth - containerWidth));
    const maxX = 0;

    draggableRef.current = Draggable.create(trackRef.current, {
      type: "x",
      inertia: true,
      bounds: { minX, maxX },
      edgeResistance: 0.85,
      snap: {
        x: (val: number) => Math.round(val / slideWidth) * slideWidth,
      },
      cursor: "grab",
      activeCursor: "grabbing",
    });

    return () => {
      draggableRef.current.forEach((d) => d.kill());
    };
  }, [images.length]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 flex items-center overflow-hidden">
      <div
        ref={trackRef}
        className="carousel-track flex"
        style={{ gap: `${GAP}px`, paddingLeft: `${PADDING}px`, paddingRight: `${PADDING}px` }}
      >
        {images.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            data-slide
            className="carousel-slide group relative flex-shrink-0 w-[200px] lg:w-[280px] xl:w-[320px]"
            style={{ aspectRatio: "3 / 4" }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 200px, (max-width: 1280px) 280px, 320px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                quality={75}
                draggable={false}
              />

              {/* Caption — always visible on mobile, hover-reveal on desktop */}
              {img.caption && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent lg:opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100" />
                  <div className="absolute top-0 left-0 right-0 p-4 lg:-translate-y-4 lg:opacity-0 transition-all duration-500 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                    <p className="text-center text-[0.75rem] leading-relaxed text-white/80">
                      {img.caption}
                    </p>
                  </div>
                </>
              )}

              {/* Visit Product link — always visible at bottom center */}
              {img.link && (
                <a
                  href={img.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 border border-white/15 bg-black/10 backdrop-blur-sm px-3 py-1.5 text-[0.45rem] uppercase tracking-[0.2em] text-black/90 transition-all duration-300 hover:bg-black/30 hover:text-white hover:border-white/30 whitespace-nowrap"
                >
                  Visit Product
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Carousel;

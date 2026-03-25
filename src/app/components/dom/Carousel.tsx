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
// ---------------------------------------------------------------------------

const GAP = 16;

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
    const trackWidth = slideWidth * images.length - GAP; // total track (no trailing gap)
    const containerWidth = containerRef.current.offsetWidth;

    // Max drag: 0 (first slide flush left)
    // Min drag: negative overflow (last slide flush right), or 0 if content fits
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
    <div ref={containerRef} className="absolute inset-0 flex items-center overflow-hidden">
      <div
        ref={trackRef}
        className="carousel-track flex"
        style={{ gap: `${GAP}px`, paddingLeft: "24px", paddingRight: "24px" }}
      >
        {images.map((img, i) => (
          <div
            key={`${img.id}-${i}`}
            data-slide
            className="carousel-slide group relative flex-shrink-0 w-[200px] md:w-[280px] lg:w-[320px]"
            style={{ aspectRatio: "3 / 4" }}
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 200px, (max-width: 1024px) 280px, 320px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                quality={75}
                draggable={false}
              />

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
  );
}

export default Carousel;

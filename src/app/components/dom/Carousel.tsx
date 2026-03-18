"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
// @ts-ignore — GSAP types casing conflict on Windows
import { Draggable } from "gsap/Draggable";
// @ts-ignore — GSAP types casing conflict on Windows
import { InertiaPlugin } from "gsap/InertiaPlugin";
import type { MediaImage } from "@/app/lib/data";

gsap.registerPlugin(Draggable, InertiaPlugin);

// ---------------------------------------------------------------------------
// Carousel — standalone infinite drag carousel with 3:4 aspect-ratio slides.
//
// Extracted from MediaShowcase for embedding inside snap-slide--media panels.
// Interaction: GSAP Draggable + InertiaPlugin with snap-to-slide.
// Fills its parent container.
// ---------------------------------------------------------------------------

const CLONE_COUNT = 3;
const GAP = 16;

interface CarouselProps {
  images: MediaImage[];
}

export function Carousel({ images }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null!);
  const trackRef = useRef<HTMLDivElement>(null!);
  const draggableRef = useRef<Draggable[]>([]);

  // Build looped slide array
  const totalClones = CLONE_COUNT * 2 + 1;
  const slides: MediaImage[] = [];
  for (let c = 0; c < totalClones; c++) {
    images.forEach((img) => slides.push(img));
  }

  const getSetWidth = useCallback(() => {
    if (!trackRef.current) return 0;
    const slideEl = trackRef.current.querySelector<HTMLElement>("[data-slide]");
    if (!slideEl) return 0;
    return (slideEl.offsetWidth + GAP) * images.length;
  }, [images.length]);

  const wrapPosition = useCallback(() => {
    if (!trackRef.current || !draggableRef.current[0]) return;
    const setW = getSetWidth();
    if (setW === 0) return;

    const d = draggableRef.current[0];
    const x = d.x;
    const centerOffset = -CLONE_COUNT * setW;

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
      const setW = getSetWidth();
      if (setW === 0) return;

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
          x: (val: number) => Math.round(val / slideWidth) * slideWidth,
        },
        onDrag: wrapPosition,
        onThrowUpdate: wrapPosition,
        onThrowComplete: wrapPosition,
        cursor: "grab",
        activeCursor: "grabbing",
      });
    }, containerRef);

    return () => {
      draggableRef.current.forEach((d) => d.kill());
      ctx.revert();
    };
  }, [getSetWidth, wrapPosition]);

  return (
    <div ref={containerRef} className="absolute inset-0 flex items-center overflow-hidden">
      <div
        ref={trackRef}
        className="carousel-track flex"
        style={{ gap: `${GAP}px` }}
      >
        {slides.map((img, i) => (
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

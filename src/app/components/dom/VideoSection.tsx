"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { VideoItem } from "@/app/lib/data";

gsap.registerPlugin(ScrollTrigger);

// ---------------------------------------------------------------------------
// VideoSection — full-width cinematic video block.
//
// Usage:
//   Place compressed .mp4 files in /public/videos/.
//   Recommended encoding:
//     ffmpeg -i input.mp4 -vcodec libx264 -crf 28 -preset slow \
//       -movflags +faststart -an output.mp4
//
//   For WebM (smaller, modern browsers):
//     ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 \
//       -an output.webm
//
//   Provide both formats for maximum compatibility.
//
// Layout:
//   Desktop — full-width with optional overlay text.
//   Mobile  — same, with scaled-down padding.
// ---------------------------------------------------------------------------

interface VideoSectionProps {
  data: VideoItem;
}

export function VideoSection({ data }: VideoSectionProps) {
  const sectionRef = useRef<HTMLElement>(null!);
  const videoRef = useRef<HTMLVideoElement>(null!);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade the section in on scroll
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Play/pause video based on visibility
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => videoRef.current?.play(),
        onLeave: () => videoRef.current?.pause(),
        onEnterBack: () => videoRef.current?.play(),
        onLeaveBack: () => videoRef.current?.pause(),
      });

      // Text overlay animation
      const textEl = sectionRef.current.querySelector("[data-video-text]");
      if (textEl) {
        gsap.fromTo(
          textEl,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 60%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={data.id}
      className="relative w-full overflow-hidden opacity-0"
    >
      {/* Aspect ratio container */}
      <div className="relative aspect-video w-full">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          poster={data.poster ?? undefined}
        >
          {/* WebM first for modern browsers (smaller file) */}
          {data.srcWebm && (
            <source src={data.srcWebm} type="video/webm" />
          )}
          {/* MP4 fallback */}
          <source src={data.src} type="video/mp4" />
        </video>

        {/* Dark gradient overlay for text readability */}
        {(data.headline || data.caption) && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        )}

        {/* Overlay text */}
        {(data.headline || data.caption) && (
          <div
            data-video-text
            className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16"
          >
            {data.headline && (
              <h3
                className="mb-2 text-2xl font-light italic leading-tight text-white sm:text-3xl md:text-4xl lg:text-5xl"
               
              >
                {data.headline}
              </h3>
            )}
            {data.caption && (
              <p className="max-w-lg text-sm leading-relaxed text-white/50 md:text-[15px]">
                {data.caption}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default VideoSection;

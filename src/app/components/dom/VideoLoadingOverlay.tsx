"use client";

import { useEffect, useState, type RefObject } from "react";

// ---------------------------------------------------------------------------
// VideoLoadingOverlay — 0–100% progress indicator for <video> elements.
//
// Listens to native video events (loadstart, progress, canplaythrough) and
// estimates loading progress from the buffered time ranges.
//
// Place as a sibling to the <video> inside a `position: relative` container.
// ---------------------------------------------------------------------------

interface VideoLoadingOverlayProps {
  videoRef: RefObject<HTMLVideoElement | null>;
}

export function VideoLoadingOverlay({ videoRef }: VideoLoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      if (!video.duration || video.duration === Infinity) return;
      const buffered = video.buffered;
      if (buffered.length > 0) {
        const loaded = buffered.end(buffered.length - 1);
        const pct = Math.min(100, (loaded / video.duration) * 100);
        setProgress(pct);
      }
    };

    const handleLoadStart = () => {
      setActive(true);
      setVisible(true);
      setProgress(0);
    };

    const handleCanPlay = () => {
      setProgress(100);
      setActive(false);
    };

    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("progress", updateProgress);
    video.addEventListener("canplaythrough", handleCanPlay);
    video.addEventListener("canplay", handleCanPlay);

    // If already ready (cached), skip overlay
    if (video.readyState >= 3) {
      setActive(false);
      setVisible(false);
    }

    return () => {
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("progress", updateProgress);
      video.removeEventListener("canplaythrough", handleCanPlay);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, [videoRef]);

  // Fade out after loading completes
  useEffect(() => {
    if (!active && progress >= 100) {
      const timer = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timer);
    }
  }, [active, progress]);

  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 z-10 flex items-center justify-center transition-opacity duration-500 pointer-events-none"
      style={{ opacity: active ? 1 : 0 }}
    >
      {/* Transparent overlay — poster image shows through behind this */}
      <div className="text-center bg-black/50 backdrop-blur-sm rounded-lg px-6 py-4">
        <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40 mb-3">
          Loading
        </p>
        <p className="text-2xl font-light text-white tabular-nums">
          {Math.round(progress)}%
        </p>
        <div className="mt-3 w-32 h-px bg-white/10 overflow-hidden mx-auto">
          <div
            className="h-full bg-white/50 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default VideoLoadingOverlay;

"use client";

import { useEffect, useRef, useState } from "react";

type LazyVideoProps = {
  src: string;
  className?: string;
  /** Above-fold: start after idle. Below-fold: wait until visible. */
  mode?: "hero" | "lazy";
  poster?: string;
  rootMargin?: string;
};

/**
 * Defers video network work so text/UI paints first.
 * - hero: idle callback (~0–1.5s) then load+play
 * - lazy: IntersectionObserver then load+play
 */
export default function LazyVideo({
  src,
  className = "",
  mode = "lazy",
  poster,
  rootMargin = "200px",
}: LazyVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [activeSrc, setActiveSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let observer: IntersectionObserver | undefined;

    const activate = () => {
      if (cancelled) return;
      setActiveSrc(src);
    };

    if (mode === "hero") {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(activate, { timeout: 1200 });
      } else {
        timeoutId = setTimeout(activate, 150);
      }
    } else {
      if (!("IntersectionObserver" in window)) {
        activate();
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries.some((e) => e.isIntersecting)) {
              activate();
              observer?.disconnect();
            }
          },
          { rootMargin },
        );
        observer.observe(video);
      }
    }

    return () => {
      cancelled = true;
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect();
    };
  }, [src, mode, rootMargin]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !activeSrc) return;
    video.load();
    const play = () => {
      void video.play().catch(() => {});
    };
    if (video.readyState >= 2) play();
    else video.addEventListener("canplay", play, { once: true });
    return () => video.removeEventListener("canplay", play);
  }, [activeSrc]);

  return (
    <video
      ref={videoRef}
      className={className}
      muted
      loop
      playsInline
      autoPlay
      controls={false}
      preload="none"
      poster={poster}
      aria-hidden
    >
      {activeSrc ? <source src={activeSrc} type="video/mp4" /> : null}
    </video>
  );
}

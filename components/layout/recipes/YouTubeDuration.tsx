"use client";

import { useEffect, useState } from "react";

type YouTubeDurationProps = {
  videoId?: string | null;
  fallback?: string;
};

function formatClock(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function loadYouTubeApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.resolve(null);

  const w = window as Window & {
    YT?: any;
    onYouTubeIframeAPIReady?: () => void;
  };

  if (w.YT?.Player) return Promise.resolve(w.YT);

  return new Promise((resolve) => {
    const previous = w.onYouTubeIframeAPIReady;
    w.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve(w.YT);
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    if (w.YT?.Player) resolve(w.YT);
  });
}

export default function YouTubeDuration({
  videoId,
  fallback = "",
}: YouTubeDurationProps) {
  const [label, setLabel] = useState(fallback);

  useEffect(() => {
    if (!videoId) return;

    let cancelled = false;
    let player: any;
    const host = document.createElement("div");
    host.setAttribute("aria-hidden", "true");
    host.style.cssText =
      "position:absolute;width:1px;height:1px;overflow:hidden;opacity:0;pointer-events:none;";
    document.body.appendChild(host);

    loadYouTubeApi().then((YT) => {
      if (cancelled || !YT?.Player) return;

      player = new YT.Player(host, {
        videoId,
        width: 1,
        height: 1,
        playerVars: {
          autoplay: 0,
          controls: 0,
        },
        events: {
          onReady: () => {
            const duration = Number(player?.getDuration?.() || 0);
            if (!cancelled && duration > 0) {
              setLabel(formatClock(duration));
            }
          },
        },
      });
    });

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        // ignore
      }
      host.remove();
    };
  }, [videoId]);

  if (!label) return null;

  return <span>{label}</span>;
}

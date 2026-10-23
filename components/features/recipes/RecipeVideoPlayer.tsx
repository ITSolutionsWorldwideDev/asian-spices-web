"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

type RecipeVideoPlayerProps = {
  title: string;
  youtubeVideoId?: string | null;
  thumbnailUrl: string;
};

export default function RecipeVideoPlayer({
  title,
  youtubeVideoId,
  thumbnailUrl,
}: RecipeVideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-gray-200">
      {playing && youtubeVideoId ? (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
          title={`${title} video`}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={thumbnailUrl}
            alt={`${title} video thumbnail`}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
            unoptimized={thumbnailUrl.startsWith("http")}
          />
          {youtubeVideoId ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/10 transition hover:bg-black/20"
              aria-label="Play recipe video"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg">
                <Play
                  className="ml-1 h-6 w-6 fill-gray-900 text-gray-900"
                  aria-hidden
                />
              </span>
            </button>
          ) : null}
        </>
      )}
    </div>
  );
}

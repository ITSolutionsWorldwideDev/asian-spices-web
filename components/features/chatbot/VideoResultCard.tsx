"use client";

import type { BibiVideoResult } from "@/types/chat";

type VideoResultCardProps = {
  videos: BibiVideoResult[];
};

export function VideoResultCard({ videos }: VideoResultCardProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {videos.map((video, index) => (
        <div
          key={`${video.url}-${index}`}
          className="overflow-hidden rounded-[1.4rem] border border-[rgba(226,218,204,0.95)] bg-white p-3 shadow-[0_14px_36px_rgba(95,61,37,0.08)]"
        >
          <video
            className="w-full rounded-[1rem] bg-[#111]"
            controls
            playsInline
            preload="metadata"
            poster={video.poster ?? undefined}
          >
            <source src={video.url} />
            Your browser does not support embedded video playback.
          </video>
          {video.title ? (
            <p className="mt-3 text-sm font-medium text-[#5a4d42]">{video.title}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

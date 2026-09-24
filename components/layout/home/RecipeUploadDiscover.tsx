"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CloudUpload, Play, ArrowRight, Upload } from "lucide-react";
import RecipeThumbnail from "@/components/layout/recipes/RecipeThumbnail";
import { extractYoutubeData } from "@/core/utils";

type Reel = {
  slug: string;
  title: string;
  image: string | null;
  viewsLabel: string;
  handle: string;
  videoId: string | null;
  duration: string;
};

function formatViews(count?: number | null) {
  const n = Number(count || 0);
  if (n <= 0) return "";
  if (n >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M views`;
  }
  if (n >= 1000) {
    return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k views`;
  }
  return `${n} views`;
}

export default function RecipeUploadDiscover() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [playingSlug, setPlayingSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/recipes?limit=3")
      .then((res) => res.json())
      .then(async (json) => {
        if (cancelled) return;
        const items = json.items || [];
        const mapped: Reel[] = items.slice(0, 3).map((r: any) => ({
          slug: r.slug,
          title: r.title,
          image: r.thumbnail_url || null,
          viewsLabel: formatViews(r.total_views),
          handle: r.category_slug ? `@${r.category_slug}` : "@asian-spices",
          videoId: r.youtube_url
            ? extractYoutubeData(r.youtube_url)?.videoId || null
            : null,
          duration: "",
        }));

        setReels(mapped);

        const withStats = await Promise.all(
          mapped.map(async (reel) => {
            if (!reel.videoId) return reel;
            try {
              const res = await fetch(
                `/api/youtube/stats?id=${encodeURIComponent(reel.videoId)}`,
              );
              const stats = await res.json();
              return {
                ...reel,
                duration: stats.duration || "",
                viewsLabel:
                  formatViews(stats.views) || reel.viewsLabel,
              };
            } catch {
              return reel;
            }
          }),
        );

        if (!cancelled) setReels(withStats);
      })
      .catch((err) => console.error("Failed to load recipes:", err));

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full min-w-0 max-w-full py-8 sm:py-10 md:py-12">
      <div className="grid min-w-0 gap-5 sm:gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Upload card */}
        <div className="flex min-w-0 flex-col rounded-3xl bg-white p-4 shadow-md ring-1 ring-[#E6DEC9] sm:p-6 md:p-8">
          <span className="inline-block w-fit self-start rounded-full bg-[#FFF2E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#F27A21]">
            Upload & Get Reward
          </span>
          <h3 className="mt-4 break-words text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
            Upload Your Recipe Videos & Get Rewards
          </h3>
          <p className="mt-3 text-sm leading-relaxed break-words text-stone-500 sm:text-base">
            Show off your kitchen setup! Upload a video of yourself prepping
            ingredients, sizzling pans, or serving up final plates. Every clip
            gets you closer to free culinary treats and chef reward points.
          </p>

          <div className="mt-5 flex min-h-[180px] flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-stone-300 bg-[#f7f1e8] px-3 py-8 text-center sm:mt-6 sm:min-h-[220px] sm:px-4 sm:py-10 lg:min-h-0">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
              <CloudUpload className="h-6 w-6 text-orange-500" />
            </div>
            <Link
              href="/account/recipes/new"
              className="text-sm font-semibold break-words text-stone-800 underline-offset-2 transition hover:text-orange-600 hover:underline"
            >
              Upload the video
            </Link>
            <p className="mt-1 max-w-full text-xs break-words text-stone-500">
              Supports MP4, MOV, or webm (max 250MB, vertical format preferred)
            </p>
          </div>

          <Link
            href="/account/recipes/new"
            className="mt-5 flex w-full min-w-0 shrink-0 items-center justify-center gap-2 rounded-full bg-black px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            <Upload className="h-4 w-4 shrink-0" />
            <span className="truncate">Select Video to Upload</span>
          </Link>
        </div>

        {/* Discover card */}
        <div className="min-w-0 rounded-3xl bg-white p-4 shadow-md ring-1 ring-[#E6DEC9] sm:p-6 md:p-8">
          <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-rose-600">
            Discover Asian Home Chefs
          </span>
          <h3 className="mt-4 break-words text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">
            Discover Real Home Cooking
          </h3>
          <p className="mt-3 text-sm leading-relaxed break-words text-stone-500 sm:text-base">
            Expand your culinary repertoire! Get instant inspiration from raw,
            unedited, authentic cooking videos filmed by food lovers. Follow
            along, save instructions, and comment your feedback.
          </p>

          <div
            className="mt-5 flex min-w-0 gap-3 overflow-x-auto pb-1 scrollbar-hide sm:mt-6 md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
            style={{ scrollbarWidth: "none" }}
          >
            {reels.length === 0
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/5] w-[46%] min-w-[150px] shrink-0 animate-pulse rounded-2xl bg-stone-200 sm:w-[160px] md:w-auto md:min-w-0"
                  />
                ))
              : reels.map((reel) => {
                  const isPlaying = playingSlug === reel.slug && !!reel.videoId;

                  return (
                    <div
                      key={reel.slug}
                      className="group relative aspect-[3/5] w-[46%] min-w-[150px] shrink-0 overflow-hidden rounded-2xl bg-stone-900 shadow-sm sm:w-[160px] md:w-auto md:min-w-0"
                    >
                      {isPlaying ? (
                        <div className="absolute inset-0 overflow-hidden bg-black">
                          <iframe
                            src={`https://www.youtube.com/embed/${reel.videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1&controls=0&fs=0`}
                            title={`${reel.title} video`}
                            className="absolute left-1/2 top-1/2 h-[135%] w-[175%] max-w-none -translate-x-[48%] -translate-y-1/2 border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          />
                        </div>
                      ) : (
                        <>
                          <RecipeThumbnail
                            src={reel.image}
                            alt={reel.title}
                            fill
                            sizes="(max-width: 1024px) 30vw, 12vw"
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (reel.videoId) setPlayingSlug(reel.slug);
                            }}
                            disabled={!reel.videoId}
                            aria-label={`Play ${reel.title}`}
                            className="absolute inset-0 z-10 flex items-center justify-center disabled:cursor-default"
                          >
                            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/80 shadow-md backdrop-blur-[1px] transition group-hover:bg-white/95">
                              <Play className="ml-0.5 h-5 w-5 fill-stone-900 text-stone-900" />
                            </span>
                          </button>
                        </>
                      )}

                      {/* Always keep overlays visible (including while playing) */}
                      <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

                      {reel.duration && (
                        <span className="pointer-events-none absolute left-2 top-2 z-30 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          {reel.duration}
                        </span>
                      )}

                      {reel.viewsLabel && (
                        <span className="pointer-events-none absolute right-2 top-2 z-30 rounded-md bg-orange-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                          {reel.viewsLabel}
                        </span>
                      )}

                      <div className="pointer-events-none absolute bottom-2.5 left-2 right-2 z-30">
                        <p className="truncate text-[11px] font-semibold text-white drop-shadow">
                          {reel.handle}
                        </p>
                        <span className="mt-1 inline-block max-w-full truncate rounded-md bg-black/55 px-2 py-0.5 text-[11px] font-medium text-white">
                          {reel.title}
                        </span>
                      </div>
                    </div>
                  );
                })}
          </div>

          <Link
            href="/recipes"
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-stone-900 bg-white px-5 py-3.5 text-sm font-semibold text-stone-900 transition hover:bg-stone-50"
          >
            Explore & Watch All Cooking Reels
            <ArrowRight className="h-4 w-4 text-red-500" />
          </Link>
        </div>
      </div>
    </section>
  );
}

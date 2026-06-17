"use client";

import { useEffect, useState } from "react";

type RecipeLinkCardProps = {
  recipeUrl: string;
  youtubeUrlOverride?: string | null;
};

type RecipePreview = {
  title: string | null;
  description: string | null;
  imageUrl: string | null;
  youtubeUrl: string | null;
  recipeUrl: string;
};

function slugToTitle(recipeUrl: string) {
  try {
    const url = new URL(recipeUrl);
    const slug = url.pathname.split("/").filter(Boolean).pop() ?? "";
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return "Recipe";
  }
}

export function RecipeLinkCard({
  recipeUrl,
  youtubeUrlOverride = null,
}: RecipeLinkCardProps) {
  const [preview, setPreview] = useState<RecipePreview | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isActive = true;

    async function loadPreview() {
      setStatus("loading");

      try {
        const response = await fetch(
          `/api/recipe-preview?url=${encodeURIComponent(recipeUrl)}`,
          { cache: "no-store" },
        );

        if (!response.ok) {
          throw new Error(`Preview request failed with ${response.status}`);
        }

        const data = (await response.json()) as RecipePreview;
        if (!isActive) {
          return;
        }

        setPreview(data);
        setStatus("ready");
      } catch {
        if (!isActive) {
          return;
        }

        setPreview(null);
        setStatus("error");
      }
    }

    void loadPreview();

    return () => {
      isActive = false;
    };
  }, [recipeUrl]);

  const title = preview?.title ?? slugToTitle(recipeUrl);
  const description = preview?.description ?? null;
  const imageUrl = preview?.imageUrl ?? null;
  const youtubeUrl = preview?.youtubeUrl ?? youtubeUrlOverride ?? null;

  return (
    <div className="overflow-hidden rounded-[1.55rem] border border-[rgba(226,218,204,0.95)] bg-[rgba(249,246,240,0.98)] shadow-[0_18px_40px_rgba(95,61,37,0.09)]">
      {imageUrl ? (
        <div className="aspect-[16/8.25] overflow-hidden bg-[rgba(92,65,45,0.08)]">
          {youtubeUrl ? (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="group relative block h-full w-full"
              aria-label={`Watch ${title} on YouTube`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,10,0.08),rgba(10,10,10,0.28))]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(190,81,53,0.92)] text-white shadow-[0_16px_36px_rgba(0,0,0,0.22)] transition-transform duration-300 group-hover:scale-105">
                  <svg
                    viewBox="0 0 24 24"
                    className="ml-1 h-7 w-7 fill-current"
                    aria-hidden="true"
                  >
                    <path d="M8 6.82v10.36c0 .79.87 1.27 1.54.84l8.14-5.18a1 1 0 0 0 0-1.68L9.54 5.98A1 1 0 0 0 8 6.82Z" />
                  </svg>
                </span>
              </div>
              <div className="absolute bottom-3 left-3 rounded-full bg-[rgba(255,248,242,0.92)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--paprika)]">
                Watch on YouTube
              </div>
            </a>
          ) : (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
            </>
          )}
        </div>
      ) : null}

      <div className="space-y-4 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[rgba(224,176,74,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(152,104,30,0.95)]">
              Recipe
            </span>
            {youtubeUrl ? (
              <span className="inline-flex rounded-full bg-[rgba(189,94,66,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--paprika)]">
                Video available
              </span>
            ) : null}
          </div>

          <h3 className="text-[1.65rem] font-semibold leading-[1.2] text-[#43362f]">
            {title}
          </h3>

          {description ? (
            <p className="text-[15px] leading-7 text-[#5b4d43]">
              {description}
            </p>
          ) : null}

          {status === "loading" ? (
            <p className="text-sm text-[rgba(116,98,84,0.8)]">
              Loading recipe preview...
            </p>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={recipeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[var(--paprika)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c7644d]"
          >
            View Recipe
          </a>
          {status === "error" ? (
            <span className="text-sm text-[rgba(116,98,84,0.8)]">
              Recipe page link is still available.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

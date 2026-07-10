"use client";

import { useEffect, useState } from "react";

type ProductLinkCardProps = {
  productUrl: string;
};

type ProductPreview = {
  title: string | null;
  description: string | null;
  base_price: string | null;
  imageUrl: string | null;
  productUrl: string;
};

function slugToTitle(productUrl: string) {
  try {
    const url = new URL(productUrl);
    const slug = url.pathname.split("/").filter(Boolean).pop() ?? "";
    return slug
      .split("-")
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
  } catch {
    return "Product";
  }
}

export function ProductLinkCard({ productUrl }: ProductLinkCardProps) {
  const [preview, setPreview] = useState<ProductPreview | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isActive = true;

    async function loadPreview() {
      setStatus("loading");

      try {
        const response = await fetch(
          `/api/product-preview?url=${encodeURIComponent(productUrl)}`,
          {
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(`Preview request failed with ${response.status}`);
        }

        const data = (await response.json()) as ProductPreview;
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
  }, [productUrl]);

  const title = preview?.title ?? slugToTitle(productUrl);
  const description = preview?.description ?? null;
  const base_price = preview?.base_price ?? null;
  const imageUrl = preview?.imageUrl ?? null;

  return (
    <div className="overflow-hidden rounded-[1.55rem] border border-[rgba(226,218,204,0.95)] bg-[rgba(249,246,240,0.98)] shadow-[0_18px_40px_rgba(95,61,37,0.09)]">
      {imageUrl ? (
        <div className="aspect-[16/8.25] overflow-hidden bg-[rgba(92,65,45,0.08)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="inline-flex rounded-full bg-[rgba(224,176,74,0.18)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[rgba(152,104,30,0.95)]">
              Product
            </p>
            <h3 className="text-[1.65rem] font-semibold leading-[1.2] text-[#43362f]">
              {title}
            </h3>
          </div>
          {base_price ? (
            <span className="shrink-0 rounded-full bg-[rgba(189,94,66,0.12)] px-3.5 py-1.5 text-sm font-semibold text-[var(--paprika)]">
              {base_price}
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="line-clamp-3 text-[15px] leading-7 text-[#5b4d43]">
            {description}
          </p>
        ) : null}

        {status === "loading" ? (
          <p className="text-sm text-[rgba(116,98,84,0.8)]">
            Loading product preview...
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={productUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex rounded-full bg-[var(--paprika)] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#c7644d]"
          >
            View Product
          </a>
          {status === "error" ? (
            <span className="text-sm text-[rgba(116,98,84,0.8)]">
              Product page link is still available.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}

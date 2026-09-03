"use client";

import { useEffect, useState } from "react";
import Image, { type ImageProps } from "next/image";
import { getRecipeImageSrc } from "@/core/utils";

const FALLBACK_SRC = "/assets/alt-recipe-banner.jpg";

type RecipeThumbnailProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
  fallbackSrc?: string;
};

/**
 * Recipe thumbnail that falls back to a local placeholder when a remote
 * image (e.g. a deleted YouTube thumbnail) fails to load via next/image.
 */
export default function RecipeThumbnail({
  src,
  alt,
  fallbackSrc = FALLBACK_SRC,
  onError,
  ...props
}: RecipeThumbnailProps) {
  const resolvedSrc = getRecipeImageSrc(src, fallbackSrc);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <Image
      {...props}
      alt={alt}
      src={currentSrc}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
        onError?.(event);
      }}
    />
  );
}

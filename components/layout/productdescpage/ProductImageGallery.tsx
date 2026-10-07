// ProductImageGallery.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
  name: string;
  badge?: string;
}

export default function ProductImageGallery({ images, name, badge }: Props) {
  const fallback = "/assets/spices/spices-1.png";

  const safeImages = images && images.length > 0 ? images : [fallback];

  //   const [activeImage, setActiveImage] = useState(safeImages[0]);
  const [activeImage, setActiveImage] = useState<string>(
    safeImages[0] || fallback,
  );
  const [zoomStyle, setZoomStyle] = useState<any>({});

  // 🔥 Zoom handler
  const handleMouseMove = (e: any) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)", // zoom level
    });
  };

  const resetZoom = () => {
    setZoomStyle({
      transform: "scale(1)",
    });
  };

  return (
    <div>
      {/* Main image */}
      <div
        className="relative w-full aspect-square overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200 bg-white shadow-sm cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetZoom}
      >
        {badge ? (
          <span className="absolute left-3 top-3 sm:left-4 sm:top-4 z-10 rounded-full bg-white/95 px-2.5 py-1 text-[11px] sm:text-xs font-semibold text-amber-800 shadow-xs border border-amber-100">
            {badge}
          </span>
        ) : null}
        <Image
          src={activeImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain p-3 sm:p-6 transition-transform duration-200"
          style={zoomStyle}
          priority
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="mt-3 sm:mt-4 flex gap-2.5 overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-4 sm:gap-3">
          {safeImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveImage(img)}
              className={`relative h-16 w-16 sm:h-24 sm:w-full shrink-0 sm:shrink overflow-hidden rounded-xl border-2 transition cursor-pointer p-1 bg-white
                ${activeImage === img ? "border-amber-600 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
            >
              <Image
                src={img}
                alt={`${name}-${idx}`}
                fill
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

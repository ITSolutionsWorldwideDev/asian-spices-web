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
        className="relative w-full aspect-square overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetZoom}
      >
        {badge ? (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-amber-700 shadow-sm">
            {badge}
          </span>
        ) : null}
        <Image
          src={activeImage}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-200"
          style={zoomStyle}
          priority
        />
      </div>

      {/* Thumbnails */}
      <div className="mt-4 grid grid-cols-4 gap-3">
        {safeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative h-20 w-full overflow-hidden rounded-xl border-2 transition sm:h-24
              ${activeImage === img ? "border-orange-500" : "border-gray-200"}`}
          >
            <Image
              src={img}
              alt={`${name}-${idx}`}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

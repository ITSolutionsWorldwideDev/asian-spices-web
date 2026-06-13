// ProductImageGallery.tsx

"use client";

import Image from "next/image";
import { useState } from "react";

interface Props {
  images: string[];
  name: string;
}

export default function ProductImageGallery({ images, name }: Props) {
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
      {/* 🔥 MAIN IMAGE */}
      <div
        className="relative w-full aspect-square bg-white rounded-2xl overflow-hidden cursor-zoom-in"
        onMouseMove={handleMouseMove}
        onMouseLeave={resetZoom}
      >
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

      {/* 🔥 THUMBNAILS */}
      <div className="flex gap-3 mt-4 overflow-x-auto">
        {safeImages.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition
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

import type { BibiImageResult } from "@/types/chat";

type ImageResultGridProps = {
  images: BibiImageResult[];
};

export function ImageResultGrid({ images }: ImageResultGridProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {images.map((image) => (
        <div
          key={image.url}
          className="luxury-card overflow-hidden rounded-[1.5rem]"
        >
          <div className="relative aspect-[4/3]">
            {/* Backend image URLs may be remote and variable, so this stays plain img until remote patterns are finalized. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.url}
              alt={image.alt ?? "Inventory result image"}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="px-4 py-3 text-sm text-[var(--muted)]">
            {image.alt ?? "Inventory result image"}
          </p>
        </div>
      ))}
    </div>
  );
}

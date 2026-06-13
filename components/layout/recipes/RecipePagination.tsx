// apps/web/components/layout/recipes/RecipePagination.tsx
"use client";

import Link from "next/link";

interface RecipePaginationProps {
  currentPage: number;

  totalPages: number;
}

export default function RecipePagination({
  currentPage,
  totalPages,
}: RecipePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 pt-8">
      {/* PREV */}
      {currentPage > 1 && (
        <Link
          href={`/recipes?page=${currentPage - 1}`}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          Previous
        </Link>
      )}

      {/* PAGES */}
      {Array.from({
        length: totalPages,
      }).map((_, index) => {
        const page = index + 1;

        const active =
          currentPage === page;

        return (
          <Link
            key={page}
            href={`/recipes?page=${page}`}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition ${
              active
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {/* NEXT */}
      {currentPage < totalPages && (
        <Link
          href={`/recipes?page=${currentPage + 1}`}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          Next
        </Link>
      )}
    </div>
  );
}
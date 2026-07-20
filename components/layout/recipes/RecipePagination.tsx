// apps/web/components/layout/recipes/RecipePagination.tsx

import Link from "next/link";

interface RecipePaginationProps {
  currentPage: number;
  totalPages: number;
  searchParams?: {
    search?: string;
    category?: string;
    tag?: string;
  };
}

function buildHref(
  page: number,
  searchParams?: RecipePaginationProps["searchParams"],
) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (searchParams?.search) params.set("search", searchParams.search);
  if (searchParams?.category) params.set("category", searchParams.category);
  if (searchParams?.tag) params.set("tag", searchParams.tag);
  const qs = params.toString();
  return qs ? `/recipes?${qs}` : "/recipes";
}

/** Server Component — plain links, no client JS. */
export default function RecipePagination({
  currentPage,
  totalPages,
  searchParams,
}: RecipePaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  // Cap visible page buttons to avoid huge DOM on large catalogs
  const maxButtons = 7;
  let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
  let end = Math.min(totalPages, start + maxButtons - 1);
  start = Math.max(1, end - maxButtons + 1);

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-2 pt-8 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1, searchParams)}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          scroll={false}
        >
          Previous
        </Link>
      )}

      {pages.map((page) => {
        const active = currentPage === page;
        return (
          <Link
            key={page}
            href={buildHref(page, searchParams)}
            scroll={false}
            className={`w-10 h-10 flex items-center justify-center rounded-xl border transition ${
              active
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white hover:bg-gray-50"
            }`}
            aria-current={active ? "page" : undefined}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1, searchParams)}
          className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
          scroll={false}
        >
          Next
        </Link>
      )}
    </div>
  );
}

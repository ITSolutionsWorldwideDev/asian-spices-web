import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-4 sm:py-8 sm:px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-10 w-10 sm:h-14 sm:w-14 items-center justify-center rounded-xl sm:rounded-2xl bg-[rgba(199,141,30,0.12)] text-[var(--saffron)]">
          <Sparkles className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <h3 className="mt-2.5 sm:mt-4 text-base sm:text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
          Start with Bibi
        </h3>
        <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-[var(--muted)]">
          Ask about flavor pairings, recipe ideas, ingredient swaps, or which
          Asian Spices product fits the dish you want to make.
        </p>
      </div>
    </div>
  );
}

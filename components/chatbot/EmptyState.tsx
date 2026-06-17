import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
      <div className="max-w-md text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-[rgba(199,141,30,0.12)] text-[var(--saffron)]">
          <Sparkles className="h-7 w-7" />
        </div>
        <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
          Start with Bibi
        </h3>
        <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
          Ask about flavor pairings, recipe ideas, ingredient swaps, or which
          Asian Spices product fits the dish you want to make.
        </p>
      </div>
    </div>
  );
}

// apps/web/components/ui/Button.tsx
import clsx from "clsx";

export function Button({
  loading,
  children,
  ...props
}: any) {
  return (
    <button
      {...props}
      className={clsx(
        "w-full rounded-lg px-4 py-2 text-sm font-medium transition",
        "bg-black text-white hover:bg-black/90",
        "disabled:opacity-50 disabled:cursor-not-allowed",
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
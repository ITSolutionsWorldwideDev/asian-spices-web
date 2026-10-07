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
      translate="no"
      className={clsx(
        "notranslate w-full rounded-lg px-4 py-2 text-sm font-medium transition",
        "bg-black text-white hover:bg-black/90",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        props.className,
      )}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
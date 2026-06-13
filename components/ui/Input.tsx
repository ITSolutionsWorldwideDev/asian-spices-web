// apps/web/components/ui/Input.tsx
import { forwardRef } from "react";
import clsx from "clsx";

export const Input = forwardRef<HTMLInputElement, any>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        {...props}
        className={clsx(
          "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm",
          "focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black",
          "transition bg-white",
          className,
        )}
      />
    );
  },
);

Input.displayName = "Input";
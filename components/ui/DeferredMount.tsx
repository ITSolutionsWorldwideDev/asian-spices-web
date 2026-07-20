"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/** Mount children only when near viewport or after idle — keeps below-fold JS off the critical path. */
export default function DeferredMount({
  children,
  rootMargin = "200px",
  fallback = null,
  strategy = "visible",
  idleTimeoutMs = 2500,
}: {
  children: ReactNode;
  rootMargin?: string;
  fallback?: ReactNode;
  /** visible = IntersectionObserver; idle = requestIdleCallback / timeout */
  strategy?: "visible" | "idle";
  idleTimeoutMs?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;

    if (strategy === "idle") {
      let idleId: number | undefined;
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const enable = () => setShow(true);

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(enable, { timeout: idleTimeoutMs });
      } else {
        timeoutId = setTimeout(enable, idleTimeoutMs);
      }

      return () => {
        if (idleId !== undefined && "cancelIdleCallback" in window) {
          window.cancelIdleCallback(idleId);
        }
        if (timeoutId) clearTimeout(timeoutId);
      };
    }

    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShow(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin, show, strategy, idleTimeoutMs]);

  return <div ref={ref}>{show ? children : fallback}</div>;
}

"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const GuruChatWidget = dynamic(
  () =>
    import("@/components/chatbot/GuruChatWidget").then(
      (mod) => mod.GuruChatWidget,
    ),
  { ssr: false },
);

/** Load chat only after idle / first interaction so it doesn't hurt page TBT. */
export function DeferredGuruChatWidget() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const enable = () => {
      if (!cancelled) setReady(true);
    };

    const onInteract = () => enable();
    window.addEventListener("pointerdown", onInteract, { once: true });
    window.addEventListener("keydown", onInteract, { once: true });
    window.addEventListener("scroll", onInteract, { once: true, passive: true });

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if ("requestIdleCallback" in window) {
      idleId = window.requestIdleCallback(enable, { timeout: 6000 });
    } else {
      timeoutId = setTimeout(enable, 4000);
    }

    return () => {
      cancelled = true;
      window.removeEventListener("pointerdown", onInteract);
      window.removeEventListener("keydown", onInteract);
      window.removeEventListener("scroll", onInteract);
      if (idleId !== undefined && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return null;
  return <GuruChatWidget />;
}

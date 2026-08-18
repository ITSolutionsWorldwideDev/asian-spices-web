"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Clock } from "lucide-react";

const IDLE_BEFORE_WARNING_MS = 4 * 60 * 1000;
const WARNING_GRACE_MS = 15 * 60 * 1000;
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
  "click",
];
const MODAL_Z_INDEX = 1000001;

function formatRemaining(ms: number) {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

type SessionStatus = "idle" | "warning" | "expired";

interface SessionTimeoutModalProps {
  enabled: boolean;
  onExpire: () => void;
}

export default function SessionTimeoutModal({
  enabled,
  onExpire,
}: SessionTimeoutModalProps) {
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<SessionStatus>("idle");
  const [remainingMs, setRemainingMs] = useState(WARNING_GRACE_MS);

  const lastActivityRef = useRef(Date.now());
  const warningShownAtRef = useRef<number | null>(null);
  const onExpireRef = useRef(onExpire);

  onExpireRef.current = onExpire;

  useEffect(() => {
    setMounted(true);
  }, []);

  const extendSession = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownAtRef.current = null;
    setRemainingMs(WARNING_GRACE_MS);
    setStatus("idle");
  }, []);

  const startAgain = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownAtRef.current = null;
    setRemainingMs(WARNING_GRACE_MS);
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!enabled || status === "expired") {
      return;
    }

    const onActivity = () => {
      if (warningShownAtRef.current) return;
      lastActivityRef.current = Date.now();
    };

    ACTIVITY_EVENTS.forEach((event) => {
      window.addEventListener(event, onActivity, { passive: true });
    });

    const interval = window.setInterval(() => {
      const now = Date.now();

      if (warningShownAtRef.current) {
        const left = WARNING_GRACE_MS - (now - warningShownAtRef.current);
        setRemainingMs(Math.max(0, left));

        if (left <= 0) {
          warningShownAtRef.current = null;
          setStatus("expired");
          onExpireRef.current();
        }
        return;
      }

      if (now - lastActivityRef.current >= IDLE_BEFORE_WARNING_MS) {
        warningShownAtRef.current = now;
        setRemainingMs(WARNING_GRACE_MS);
        setStatus("warning");
      }
    }, 1000);

    return () => {
      ACTIVITY_EVENTS.forEach((event) => {
        window.removeEventListener(event, onActivity);
      });
      window.clearInterval(interval);
    };
  }, [enabled, status]);

  useEffect(() => {
    if (status === "idle") return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [status]);

  useEffect(() => {
    if (!enabled) {
      lastActivityRef.current = Date.now();
      warningShownAtRef.current = null;
      setStatus("idle");
    }
  }, [enabled]);

  if (!mounted || status === "idle") return null;

  const isWarning = status === "warning";

  return createPortal(
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="session-timeout-title"
      aria-describedby="session-timeout-description"
      style={{ zIndex: MODAL_Z_INDEX }}
      className="fixed inset-0 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50">
          <Clock className="h-6 w-6 text-[#FF6900]" />
        </div>

        <h2
          id="session-timeout-title"
          className="text-center text-xl font-bold text-gray-900"
        >
          {isWarning ? "Session timeout" : "Session expired"}
        </h2>

        <p
          id="session-timeout-description"
          className="mt-3 text-center text-sm leading-6 text-gray-600"
        >
          {isWarning
            ? "Your session is about to expire in 15 minutes due to inactivity. Do you need more time?"
            : "Your session has expired due to inactivity. You can start the registration again."}
        </p>

        {isWarning && (
          <p className="mt-4 text-center text-sm font-semibold text-[#FF6900]">
            Time remaining: {formatRemaining(remainingMs)}
          </p>
        )}

        <button
          type="button"
          onClick={isWarning ? extendSession : startAgain}
          className="mt-6 w-full rounded-xl bg-[#FF6900] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-600 active:bg-orange-700"
        >
          {isWarning ? "Extend Session" : "Start again"}
        </button>
      </div>
    </div>,
    document.body,
  );
}

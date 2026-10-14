"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";

declare global {
  interface Window {
    grecaptcha?: {
      render: (
        container: HTMLElement,
        parameters: {
          sitekey: string;
          theme?: "light" | "dark";
          size?: "normal" | "compact";
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string;
      ready: (callback: () => void) => void;
    };
    __recaptchaLoaded?: boolean;
    __recaptchaCallbacks?: (() => void)[];
  }
}

export interface ReCaptchaRef {
  reset: () => void;
}

interface ReCaptchaProps {
  onChange: (token: string | null) => void;
  onExpired?: () => void;
  theme?: "light" | "dark";
  className?: string;
}

const SCRIPT_ID = "google-recaptcha-v2-script";

function loadRecaptchaScript(onLoad: () => void) {
  if (typeof window === "undefined") return;

  if (window.grecaptcha && typeof window.grecaptcha.render === "function") {
    onLoad();
    return;
  }

  window.__recaptchaCallbacks = window.__recaptchaCallbacks || [];
  window.__recaptchaCallbacks.push(onLoad);

  if (document.getElementById(SCRIPT_ID)) {
    return;
  }

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.src =
    "https://www.google.com/recaptcha/api.js?onload=__onRecaptchaReady&render=explicit";
  script.async = true;
  script.defer = true;

  (window as unknown as { __onRecaptchaReady: () => void }).__onRecaptchaReady =
    () => {
      window.__recaptchaLoaded = true;
      if (window.__recaptchaCallbacks) {
        window.__recaptchaCallbacks.forEach((cb) => cb());
        window.__recaptchaCallbacks = [];
      }
    };

  document.head.appendChild(script);
}

const ReCaptcha = forwardRef<ReCaptchaRef, ReCaptchaProps>(
  ({ onChange, onExpired, theme = "light", className = "" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<number | null>(null);

    // Keep callback refs stable so prop changes don't trigger re-rendering of reCAPTCHA
    const onChangeRef = useRef(onChange);
    onChangeRef.current = onChange;
    const onExpiredRef = useRef(onExpired);
    onExpiredRef.current = onExpired;

    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (
          widgetIdRef.current !== null &&
          window.grecaptcha &&
          typeof window.grecaptcha.reset === "function"
        ) {
          try {
            window.grecaptcha.reset(widgetIdRef.current);
          } catch (e) {
            console.warn("[reCAPTCHA] reset error:", e);
          }
          onChangeRef.current?.(null);
        }
      },
    }));

    useEffect(() => {
      if (!siteKey || !containerRef.current) return;

      let isMounted = true;

      const initWidget = () => {
        if (!isMounted || !containerRef.current || !window.grecaptcha) return;
        if (widgetIdRef.current !== null) return;

        const grecaptcha = window.grecaptcha;

        grecaptcha.ready(() => {
          if (!isMounted || !containerRef.current || widgetIdRef.current !== null) return;

          try {
            // Clear prior contents and create a fresh target child node
            // This prevents Google reCAPTCHA's "already rendered in this element" error
            containerRef.current.innerHTML = "";
            const targetEl = document.createElement("div");
            containerRef.current.appendChild(targetEl);

            const widgetId = grecaptcha.render(targetEl, {
              sitekey: siteKey,
              theme,
              callback: (token: string) => {
                if (isMounted) onChangeRef.current?.(token);
              },
              "expired-callback": () => {
                if (isMounted) {
                  onChangeRef.current?.(null);
                  onExpiredRef.current?.();
                }
              },
              "error-callback": () => {
                if (isMounted) onChangeRef.current?.(null);
              },
            });

            widgetIdRef.current = widgetId;
          } catch (err) {
            console.warn("[reCAPTCHA] render error:", err);
          }
        });
      };

      loadRecaptchaScript(initWidget);

      return () => {
        isMounted = false;
        widgetIdRef.current = null;
        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }
      };
    }, [siteKey, theme]);

    if (!siteKey) {
      if (process.env.NODE_ENV !== "production") {
        return (
          <div className="p-3 my-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md">
            <strong>reCAPTCHA Preview:</strong> Add{" "}
            <code className="bg-amber-100 px-1 py-0.5 rounded">
              NEXT_PUBLIC_RECAPTCHA_SITE_KEY
            </code>{" "}
            in your <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> to display the live widget.
          </div>
        );
      }
      return null;
    }

    return (
      <div className={`my-3 min-h-[78px] flex justify-center sm:justify-start ${className}`}>
        <div ref={containerRef} />
      </div>
    );
  },
);

ReCaptcha.displayName = "ReCaptcha";

export default ReCaptcha;

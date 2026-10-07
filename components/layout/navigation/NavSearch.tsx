"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Search, UtensilsCrossed, ShoppingBag, Mic, X, ArrowRight, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { getProductPath } from "@/lib/product-path";

type Suggestion = {
  label: string;
  href: string;
  type: "product" | "recipe";
};

type BrowserSpeechRecognition = {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
};

async function fetchSuggestions(query: string): Promise<Suggestion[]> {
  if (!query || query.length < 2) return [];

  const results: Suggestion[] = [];

  try {
    const [productsRes, recipesRes] = await Promise.all([
      fetch(`/api/products?search=${encodeURIComponent(query)}&limit=5&category=all`),
      fetch(`/api/recipes?search=${encodeURIComponent(query)}&limit=4`),
    ]);

    if (productsRes.ok) {
      const data = await productsRes.json();
      const items: {
        name?: string;
        weight?: string;
        slug?: string;
        category_slug?: string;
        subcategory_slug?: string;
      }[] = data?.data ?? [];
      items.slice(0, 4).forEach((p) => {
        if (p.name && p.slug) {
          const path = getProductPath(
            {
              slug: p.slug,
              category_slug: p.category_slug,
              subcategory_slug: p.subcategory_slug,
            },
            "spices",
          );
          const label = p.weight ? `${p.name} ${p.weight}` : p.name;
          results.push({ label, href: path, type: "product" });
        }
      });
    }

    if (recipesRes.ok) {
      const data = await recipesRes.json();
      const items: { title?: string; slug?: string }[] = data?.items ?? [];
      items.slice(0, 3).forEach((r) => {
        if (r.title) {
          results.push({
            label: r.title,
            href: r.slug ? `/recipes/${r.slug}` : `/recipes?search=${encodeURIComponent(r.title)}`,
            type: "recipe",
          });
        }
      });
    }
  } catch {
    // silently fail — form submit still works
  }

  return results;
}

type NavSearchProps = {
  variant?: "desktop" | "mobile";
};

export default function NavSearch({ variant = "desktop" }: NavSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  // Sync query with URL if currently on /search
  useEffect(() => {
    if (typeof window !== "undefined" && pathname === "/search") {
      const q = new URLSearchParams(window.location.search).get("q");
      if (q) {
        setQuery(q);
      }
    }
  }, [pathname]);

  // Check speech recognition capability
  useEffect(() => {
    if (typeof window !== "undefined") {
      const win = window as Window & {
        SpeechRecognition?: new () => BrowserSpeechRecognition;
        webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
      };
      if (win.SpeechRecognition || win.webkitSpeechRecognition) {
        setSpeechSupported(true);
      }
    }
  }, []);

  // Debounced suggestion fetch
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const items = await fetchSuggestions(query.trim());
      setSuggestions(items);
      setOpen(items.length > 0);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // Close dropdown on click or touch outside
  useEffect(() => {
    const handleOutside = (e: Event) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, []);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSubmit = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    inputRef.current?.blur();
    (document.activeElement as HTMLElement)?.blur();
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelect = (href: string) => {
    setOpen(false);
    inputRef.current?.blur();
    (document.activeElement as HTMLElement)?.blur();
    router.push(href);
  };

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleVoiceSearch = () => {
    const win = window as Window & {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecognitionCtor =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onerror = () => {
      setListening(false);
      recognitionRef.current = null;
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0]?.[0]?.transcript?.trim();
      if (!transcript) return;
      setQuery(transcript);
      setOpen(false);
      inputRef.current?.blur();
      (document.activeElement as HTMLElement)?.blur();
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const isMobile = variant === "mobile";
  const hasText = query.trim().length > 0;

  return (
    <div
      ref={containerRef}
      translate="no"
      className={`notranslate relative flex items-center ${isMobile ? "w-full" : "w-32 min-w-[7rem] shrink xl:w-40"}`}
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        {isMobile && (
          <button
            type="submit"
            aria-label="Search"
            className="absolute left-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-gray-400 transition hover:text-orange-500 active:scale-95"
          >
            <Search className="h-4.5 w-4.5" />
          </button>
        )}

        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={isMobile ? "Search spices, herbs, recipes..." : "Search Here....."}
          className={
            isMobile
              ? `w-full rounded-full border border-gray-200/90 bg-gray-50/90 py-2.5 pl-10 ${
                  hasText ? "pr-20" : "pr-11"
                } text-[16px] sm:text-sm text-gray-800 shadow-sm outline-none placeholder:text-gray-400 focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all`
              : "w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-12 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-orange-300"
          }
          aria-label="Search products and recipes"
          autoComplete="off"
        />

        {isMobile ? (
          <div className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-orange-400" />
            )}
            {hasText ? (
              <>
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={handleClear}
                  className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-200/70 hover:text-gray-600 active:scale-90"
                >
                  <X className="h-4 w-4" />
                </button>
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm transition hover:bg-orange-600 active:scale-95"
                >
                  <Search className="h-4 w-4" strokeWidth={2.2} />
                </button>
              </>
            ) : (
              speechSupported && (
                <button
                  type="button"
                  aria-label={listening ? "Stop voice search" : "Search by voice"}
                  onClick={handleVoiceSearch}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition active:scale-95 ${
                    listening
                      ? "bg-red-50 text-red-600 animate-pulse ring-2 ring-red-400"
                      : "text-gray-500 hover:bg-gray-200/70"
                  }`}
                >
                  <Mic className="h-4.5 w-4.5" />
                </button>
              )
            )}
          </div>
        ) : (
          <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {loading && (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-orange-400" />
            )}
            {hasText && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={handleClear}
                className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 transition hover:text-gray-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <button
              type="submit"
              aria-label="Search"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        )}
      </form>

      {open && suggestions.length > 0 && (
        <div
          className={`absolute left-0 top-full z-[300] mt-1.5 flex flex-col overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xl ${
            isMobile ? "w-full max-h-[min(60vh,380px)]" : "w-80 max-h-96"
          }`}
        >
          <ul className="flex-1 overflow-y-auto overscroll-contain divide-y divide-gray-100">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(s.href)}
                  className="flex min-h-[46px] w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-orange-50/80 hover:text-orange-600 active:bg-orange-100/70"
                >
                  {s.type === "recipe" ? (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                    </span>
                  ) : (
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                      <ShoppingBag className="h-3.5 w-3.5" />
                    </span>
                  )}
                  <span className="truncate font-medium">{s.label}</span>
                  <span className="ml-auto shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                    {s.type === "recipe" ? "Recipe" : "Product"}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          {hasText && (
            <div className="border-t border-gray-100 bg-gray-50/90 p-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSubmit()}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-100/60 active:bg-orange-200/60 transition"
              >
                <span>View all results for &ldquo;{query.trim()}&rdquo;</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

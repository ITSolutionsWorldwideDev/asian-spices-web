"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Search, UtensilsCrossed, ShoppingBag, Mic } from "lucide-react";
import { useRouter } from "next/navigation";

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

    if (recipesRes.ok) {
      const data = await recipesRes.json();
      const items: { title?: string; slug?: string }[] = data?.items ?? [];
      items.slice(0, 4).forEach((r) => {
        if (r.title) {
          results.push({ label: r.title, href: `/recipes?search=${encodeURIComponent(r.title)}`, type: "recipe" });
        }
      });
    }

    if (productsRes.ok) {
      const data = await productsRes.json();
      const items: { name?: string; slug?: string; category_slug?: string }[] = data?.data ?? [];
      items.slice(0, 3).forEach((p) => {
        if (p.name && p.slug) {
          const categoryPath = p.category_slug ?? "spices";
          results.push({ label: p.name, href: `/${categoryPath}?search=${encodeURIComponent(p.name)}`, type: "product" });
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
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<BrowserSpeechRecognition | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      const items = await fetchSuggestions(query.trim());
      setSuggestions(items);
      setOpen(items.length > 0);
    }, 350);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    return () => {
      recognitionRef.current?.stop();
    };
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  const handleSelect = (href: string) => {
    setOpen(false);
    setQuery("");
    router.push(href);
  };

  const handleVoiceSearch = () => {
    const win = window as Window & {
      SpeechRecognition?: new () => BrowserSpeechRecognition;
      webkitSpeechRecognition?: new () => BrowserSpeechRecognition;
    };
    const SpeechRecognitionCtor =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) {
      return;
    }

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
      router.push(`/search?q=${encodeURIComponent(transcript)}`);
    };

    recognition.start();
  };

  const isMobile = variant === "mobile";

  return (
    <div
      ref={containerRef}
      className={`relative flex items-center ${isMobile ? "w-full" : "w-40 shrink-0 xl:w-48"}`}
    >
      <form onSubmit={handleSubmit} className="relative w-full">
        {isMobile && (
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 sm:left-5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
        )}
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={isMobile ? "Search spices, herbs..." : "Search Here....."}
          className={
            isMobile
              ? "w-full rounded-full border-0 bg-white py-3.5 pl-12 pr-14 text-sm text-gray-700 shadow-sm outline-none placeholder:text-gray-400 sm:py-4 md:pl-14 md:pr-16 md:text-base lg:py-[1.125rem] lg:text-lg"
              : "w-full rounded-full border border-gray-200 bg-white py-2 pl-4 pr-12 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-orange-300"
          }
          aria-label="Search products and recipes"
          autoComplete="off"
        />
        {isMobile ? (
          <button
            type="button"
            aria-label={listening ? "Stop voice search" : "Search by voice"}
            onClick={handleVoiceSearch}
            className={`absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-gray-600 transition sm:h-11 sm:w-11 md:h-12 md:w-12 ${
              listening ? "bg-orange-100 text-orange-600" : "hover:bg-gray-100"
            }`}
          >
            <Mic className="h-5 w-5 sm:h-5 sm:w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" />
          </button>
        ) : (
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-orange-500 text-white transition hover:bg-orange-600"
          >
            <Search className="h-4 w-4" />
          </button>
        )}
      </form>

      {open && suggestions.length > 0 && (
        <ul
          className={`absolute left-0 top-full z-[300] mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl ${
            isMobile ? "w-full" : "w-72"
          }`}
        >
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(s.href)}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
              >
                {s.type === "recipe" ? (
                  <UtensilsCrossed className="h-3.5 w-3.5 shrink-0 text-orange-400" />
                ) : (
                  <ShoppingBag className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                )}
                <span className="truncate">{s.label}</span>
                <span className="ml-auto shrink-0 text-[10px] text-gray-400">
                  {s.type === "recipe" ? "Recipe" : "Product"}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

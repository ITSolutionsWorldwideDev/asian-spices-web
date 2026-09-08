"use client";

import { useGlobalStore } from "@/store/useGlobalStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import CountryFlag from "@/components/ui/CountryFlag";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type MenuPos = { top: number; left: number; width: number };

export default function UpperSelection() {
  const router = useRouter();
  const { countries, selectedCountry, setSelectedCountry } = useGlobalStore();
  const { currencies, selectedCurrency, setSelectedCurrency, fetchCurrencies } =
    useCurrencyStore();

  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [countryPos, setCountryPos] = useState<MenuPos | null>(null);
  const [currencyPos, setCurrencyPos] = useState<MenuPos | null>(null);
  const [mounted, setMounted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const countryBtnRef = useRef<HTMLButtonElement>(null);
  const currencyBtnRef = useRef<HTMLButtonElement>(null);
  const countryMenuRef = useRef<HTMLDivElement>(null);
  const currencyMenuRef = useRef<HTMLDivElement>(null);

  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency);

  useEffect(() => {
    setMounted(true);
    fetchCurrencies();
  }, [fetchCurrencies]);

  useLayoutEffect(() => {
    if (!countryOpen || !countryBtnRef.current) {
      setCountryPos(null);
      return;
    }
    const r = countryBtnRef.current.getBoundingClientRect();
    setCountryPos({ top: r.bottom + 8, left: r.right - 192, width: 192 });
  }, [countryOpen]);

  useLayoutEffect(() => {
    if (!currencyOpen || !currencyBtnRef.current) {
      setCurrencyPos(null);
      return;
    }
    const r = currencyBtnRef.current.getBoundingClientRect();
    setCurrencyPos({ top: r.bottom + 8, left: r.right - 160, width: 160 });
  }, [currencyOpen]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      const t = e.target as Node;
      const insideRoot = rootRef.current?.contains(t);
      const insideCountry = countryMenuRef.current?.contains(t);
      const insideCurrency = currencyMenuRef.current?.contains(t);
      if (!insideRoot && !insideCountry && !insideCurrency) {
        setCountryOpen(false);
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const countryMenu =
    mounted &&
    countryOpen &&
    countryPos &&
    createPortal(
      <div
        ref={countryMenuRef}
        className="notranslate max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
        translate="no"
        style={{
          position: "fixed",
          top: countryPos.top,
          left: Math.max(8, countryPos.left),
          width: countryPos.width,
          zIndex: 10000000,
        }}
      >
        {countries.length === 0 ? (
          <p className="px-3 py-2 text-xs text-gray-400">No options</p>
        ) : (
          countries.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={async () => {
                setCountryOpen(false);
                await setSelectedCountry(c.iso2);
                router.refresh();
              }}
              className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-gray-50 ${
                selectedCountry === c.iso2
                  ? "font-semibold text-gray-900"
                  : "text-gray-700"
              }`}
            >
              <CountryFlag iso2={c.iso2} size={15} />
              {c.name}
            </button>
          ))
        )}
      </div>,
      document.body,
    );

  const currencyMenu =
    mounted &&
    currencyOpen &&
    currencyPos &&
    createPortal(
      <div
        ref={currencyMenuRef}
        className="notranslate max-h-56 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl"
        translate="no"
        style={{
          position: "fixed",
          top: currencyPos.top,
          left: Math.max(8, currencyPos.left),
          width: currencyPos.width,
          zIndex: 10000000,
        }}
      >
        {currencies.length === 0 ? (
          <p className="px-3 py-2 text-xs text-gray-400">No options</p>
        ) : (
          currencies.map((c) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                setSelectedCurrency(c.code);
                setCurrencyOpen(false);
              }}
              className={`flex w-full items-center gap-1.5 px-3 py-2.5 text-left text-xs hover:bg-gray-50 ${
                selectedCurrency === c.code
                  ? "font-semibold text-gray-900"
                  : "text-gray-700"
              }`}
            >
              {c.symbol} {c.code}
            </button>
          ))
        )}
      </div>,
      document.body,
    );

  return (
    <div
      ref={rootRef}
      className="flex shrink-0 items-center rounded-full bg-[#e8dfd0] px-1 py-1 notranslate"
      translate="no"
    >
      <div className="relative">
        <button
          ref={countryBtnRef}
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            setCountryOpen((v) => !v);
            setCurrencyOpen(false);
          }}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-800 transition hover:bg-white/40"
        >
          <CountryFlag iso2={selectedCountry || "NL"} size={16} />
          <span className="uppercase">{selectedCountry || "NL"}</span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      <span className="mx-0.5 h-4 w-px bg-gray-400/40" aria-hidden />

      <div className="relative">
        <button
          ref={currencyBtnRef}
          type="button"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => {
            setCurrencyOpen((v) => !v);
            setCountryOpen(false);
          }}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-800 transition hover:bg-white/40"
        >
          <span>
            {selectedCurrencyData?.symbol ?? "€"} {selectedCurrency || "EUR"}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
      </div>

      {countryMenu}
      {currencyMenu}
    </div>
  );
}

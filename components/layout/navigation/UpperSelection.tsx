"use client";

import { useGlobalStore } from "@/store/useGlobalStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect, useRef, useState } from "react";
import CountryFlag from "@/components/ui/CountryFlag";
import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UpperSelection() {
  const router = useRouter();
  const { countries, selectedCountry, setSelectedCountry } = useGlobalStore();
  const { currencies, selectedCurrency, setSelectedCurrency, fetchCurrencies } =
    useCurrencyStore();

  const [countryOpen, setCountryOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selectedCurrencyData = currencies.find((c) => c.code === selectedCurrency);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setCountryOpen(false);
        setCurrencyOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div
      ref={ref}
      className="flex shrink-0 items-center rounded-full bg-[#e8dfd0] px-1 py-1"
    >
      {/* Country */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setCountryOpen(!countryOpen); setCurrencyOpen(false); }}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-800 transition hover:bg-white/40"
        >
          <CountryFlag iso2={selectedCountry || "NL"} size={16} />
          <span className="uppercase">{selectedCountry || "NL"}</span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>

        {countryOpen && (
          <div className="absolute right-0 top-full z-[1000] mt-2 max-h-56 w-48 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
            {countries.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-400">No options</p>
            ) : (
              countries.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={async () => {
                    setCountryOpen(false);
                    await setSelectedCountry(c.iso2);
                    router.refresh();
                  }}
                  className={`flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs hover:bg-gray-50 ${
                    selectedCountry === c.iso2 ? "font-semibold text-gray-900" : "text-gray-700"
                  }`}
                >
                  <CountryFlag iso2={c.iso2} size={15} />
                  {c.name}
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* Divider */}
      <span className="mx-0.5 h-4 w-px bg-gray-400/40" aria-hidden />

      {/* Currency */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setCurrencyOpen(!currencyOpen); setCountryOpen(false); }}
          className="flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold text-gray-800 transition hover:bg-white/40"
        >
          <span>
            {selectedCurrencyData?.symbol ?? "€"} {selectedCurrency || "EUR"}
          </span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>

        {currencyOpen && (
          <div className="absolute right-0 top-full z-[1000] mt-2 max-h-56 w-40 overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-xl">
            {currencies.length === 0 ? (
              <p className="px-3 py-2 text-xs text-gray-400">No options</p>
            ) : (
              currencies.map((c) => (
                <button
                  key={c.id}
                  type="button"
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
          </div>
        )}
      </div>
    </div>
  );
}

// apps/web/components/layout/navigation/UpperSelection.tsx

"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect, useState, useRef } from "react";
import CountryFlag from "@/components/ui/CountryFlag";

export default function UpperSelection() {

  const { countries, selectedCountry, setSelectedCountry } = useGlobalStore();

  const { currencies, selectedCurrency, setSelectedCurrency, fetchCurrencies } =
    useCurrencyStore();

  // useEffect(() => {
  //   fetchCurrencies();
  // }, []);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCurrencies();
    
    // Close dropdown when clicking anywhere outside of it
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchCurrencies]);

  

  return (
    <nav className="flex items-center justify-between px-6 container mx-auto py-2">
      <div></div>

      <div className="flex flex-col gap-2">
        {/* COUNTRY disabled*/}

        {/* CUSTOM COUNTRY DROPDOWN (Flags & ISO only) */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 border px-3 py-1.5 text-xs font-semibold rounded-md bg-white hover:bg-gray-50 transition min-w-[70px] justify-between"
          >
            <div className="flex items-center gap-1.5">
              <CountryFlag iso2={selectedCountry} size={18} />
              <span className="uppercase text-gray-700">{selectedCountry || "NL"}</span>
            </div>
            <span className="text-[10px] text-gray-400">{isOpen ? "▲" : "▼"}</span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-1 w-28 bg-white border rounded-md shadow-lg max-h-60 overflow-y-auto z-50 py-1">
              {countries.length === 0 && (
                <div className="px-3 py-2 text-xs text-gray-400">No options</div>
              )}
              {countries.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    setSelectedCountry(c.iso2);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition hover:bg-gray-50 ${
                    selectedCountry === c.iso2 ? "bg-blue-50/50 font-bold text-blue-600" : "text-gray-700"
                  }`}
                >
                  <CountryFlag iso2={c.iso2} size={18} />
                  <span className="uppercase">{c.iso2}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        {/* <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border px-3 py-1 text-xs rounded-md bg-white cursor-pointer"
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((c) => (
            <option key={c.id} value={c.iso2}>
              {getFlagEmoji(c.iso2)} {c.name}
            </option>
          ))}
        </select> */}

        {/* CURRENCY */}
        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border px-3 py-1 text-xs rounded-md bg-white cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.id} value={c.code}>
              {c.symbol} - {c.code}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
}

/* import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect, useState } from "react";

interface Country {
  id: number;
  name: string;
  iso2: string;
}

export default function UpperSelection() {
  const {
    currencies,
    selectedCurrency,
    rate,
    fetchCurrencies,
    setSelectedCurrency,
  } = useCurrencyStore();

  const DEFAULT_COUNTRY = "NL";

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("");

  const selectedCountryValue =
    selectedCountry || (countries.length ? DEFAULT_COUNTRY : "");

  useEffect(() => {
    const fetchData = async () => {
      const countryRes = await fetch("/api/countries?shippable=true");
      const countriesData = await countryRes.json();

      setCountries(countriesData);

      if (!selectedCountry) {
        const exists = countriesData.some(
          (c: Country) => c.iso2 === DEFAULT_COUNTRY,
        );

        if (exists) {
          setSelectedCountry(DEFAULT_COUNTRY);
        }
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (currencies.length > 0 && !selectedCurrency) {
      const euro = currencies.find((c) => c.code === "EUR");
      if (euro) {
        setSelectedCurrency(euro.code);
      }
    }
  }, [currencies, selectedCurrency, setSelectedCurrency]);

  return (
    <nav className="flex items-center justify-between px-6 container mx-auto ">

      <div></div>


      <div className="flex items-center gap-4 ">

        <select
          value={selectedCountryValue}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="border px-3 py-1 text-xs rounded-md bg-white cursor-pointer"
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((c) => (
            <option key={c.id} value={c.iso2}>
              {c.name}
            </option>
          ))}
        </select>


        <select
          value={selectedCurrency}
          onChange={(e) => setSelectedCurrency(e.target.value)}
          className="border px-3 py-1 text-xs rounded-md bg-white cursor-pointer"
        >
          {currencies.map((c) => (
            <option key={c.id} value={c.code}>
              {c.symbol} - {c.code}
            </option>
          ))}
        </select>
      </div>
    </nav>
  );
} */

// apps/web/components/layout/navigation/UpperSelection.tsx

"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useCurrencyStore } from "@/store/useCurrencyStore";
import { useEffect } from "react";

export default function UpperSelection() {
  const {
    countries,
    // currencies,
    selectedCountry,
    // selectedCurrency,
    setSelectedCountry,
    // setSelectedCurrency,
  } = useGlobalStore();

  const {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    fetchCurrencies,
  } = useCurrencyStore();

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 container mx-auto">
      <div></div>

      <div className="flex items-center gap-4">
        {/* COUNTRY disabled*/}
        <select
          value={selectedCountry}
          
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

        {/* CURRENCY */}
        <select
          value={selectedCurrency}
          disabled
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
      const countryRes = await fetch("/api/countries");
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

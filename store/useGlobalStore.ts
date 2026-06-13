// apps/web/store/useGlobalStore.ts

import { create } from "zustand";

interface Country {
  id: number;
  name: string;
  iso2: string;
}

interface Currency {
  id: number;
  code: string;
  symbol: string;
}

interface GlobalState {
  countries: Country[];
  // currencies: Currency[];
  selectedCountry: string;
  // selectedCurrency: string;

  fetchInitialData: () => Promise<void>;
  setSelectedCountry: (code: string) => void;
  // setSelectedCurrency: (code: string) => void;
}

const DEFAULT_COUNTRY = "NL";
const DEFAULT_CURRENCY = "EUR";

export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  // currencies: [],
  selectedCountry: "",
  // selectedCurrency: "",

  fetchInitialData: async () => {
    const { countries } = get();

    if (countries.length > 0) return;

    try {
      const countryRes = await fetch("/api/countries", {
        cache: "no-store",
      });

      if (!countryRes.ok) {
        console.error(
          "Countries API failed:",
          countryRes.status,
          countryRes.statusText,
        );

        set({
          countries: [],
          selectedCountry: DEFAULT_COUNTRY,
        });

        return;
      }

      const countriesData = await countryRes.json();

      set({
        countries: countriesData ?? [],
        selectedCountry: DEFAULT_COUNTRY,
      });
    } catch (error) {
      console.error("Countries fetch error:", error);

      set({
        countries: [],
        selectedCountry: DEFAULT_COUNTRY,
      });
    }
  },

  setSelectedCountry: (code) => set({ selectedCountry: code }),
  // setSelectedCurrency: (code) => set({ selectedCurrency: code }),
}));

/* fetchInitialData: async () => {
    const { countries } = get();

    // ✅ prevent refetch
    if (countries.length > 0) return;

    const [countryRes] = await Promise.all([
      fetch("/api/countries"),
    ]);

    // ✅ check response BEFORE parsing
    if (!countryRes.ok) throw new Error("Countries fetch failed");

    const countriesData = await countryRes.json();

    set({
      countries: countriesData,
      selectedCountry: DEFAULT_COUNTRY,
    });
  }, */

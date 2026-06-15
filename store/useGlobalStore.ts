// apps/web/store/useGlobalStore.ts

import { create } from "zustand";

interface Country {
  id: number;
  name: string;
  iso2: string;
  emoji?: string;
}

interface Currency {
  id: number;
  code: string;
  symbol: string;
}

interface GlobalState {
  countries: Country[];
  selectedCountry: string;

  taxRate: number;
  taxName: string;

  fetchInitialData: () => Promise<void>;
  setSelectedCountry: (code: string) => void;
  // setSelectedCurrency: (code: string) => void;
}

const DEFAULT_COUNTRY = "NL";
const DEFAULT_CURRENCY = "EUR";

export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  // currencies: [],
  selectedCountry: DEFAULT_COUNTRY,
  taxRate: 0.21,
  taxName: "VAT",

  fetchInitialData: async () => {
    const { countries } = get();
    if (countries.length > 0) return;

    try {
      const countryRes = await fetch("/api/countries", {
        cache: "no-store",
      });

      let countriesList = [];

      if (countryRes.ok) {
        countriesList = await countryRes.json();
      }

      set({
        countries: countriesList ?? [],
        selectedCountry: DEFAULT_COUNTRY,
      });

      // Fetch the default tax rate for the primary landing country
      await get().setSelectedCountry(DEFAULT_COUNTRY);

      /* if (!countryRes.ok) {
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
      }); */
    } catch (error) {
      console.error("Countries fetch error:", error);

      set({
        countries: [],
        selectedCountry: DEFAULT_COUNTRY,
      });
    }
  },

  setSelectedCountry: async (code) => {
    set({ selectedCountry: code });
    try {
      
      const taxRes = await fetch(`/api/tax-rules?country_code=${code}`);
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRate: taxData.taxRate, taxName: taxData.taxName });
      }
    } catch (err) {
      console.error("Failed adjusting dynamic tax rates on context layer:", err);
    }
  },

  // setSelectedCountry: (code) => set({ selectedCountry: code }),
  // setSelectedCurrency: (code) => set({ selectedCurrency: code }),
}));


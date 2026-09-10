// apps/web/store/useGlobalStore.ts

import { create } from "zustand";

interface Country {
  id: number;
  name: string;
  iso2: string;
  emoji?: string;
}

interface TaxRule {
  id: string;
  tax_rate: string;
  tax_name: string;
  category_id: string | null;
}

interface GlobalState {
  countries: Country[];
  selectedCountry: string;
  taxRules: TaxRule[];
  /** True after /api/tax-rules has been fetched (prevents premature 21% flash). */
  taxRulesLoaded: boolean;

  pendingCountryChange: string | null;
  setPendingCountryChange: (code: string | null) => void;
  confirmCountryChange: () => Promise<void>;

  fetchInitialData: () => Promise<void>;
  setSelectedCountry: (code: string) => Promise<void>;
}

const DEFAULT_COUNTRY = "NL";

/** Mirror the choice into a cookie so server-rendered pages can price without a ?country= param. */
const persistCountryCookie = (code: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `selected_country=${code}; path=/; max-age=31536000; samesite=lax`;
};

export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  selectedCountry: DEFAULT_COUNTRY,
  taxRules: [],
  taxRulesLoaded: false,
  pendingCountryChange: null,

  setPendingCountryChange: (code) => set({ pendingCountryChange: code }),

  fetchInitialData: async () => {
    try {
      const countryRes = await fetch("/api/countries?shippable=true", {
        cache: "no-store",
      });
      let countriesList: Country[] = [];
      if (countryRes.ok) countriesList = await countryRes.json();

      let targetCountry = "";
      if (typeof window !== "undefined") {
        targetCountry = localStorage.getItem("selected_country") || "";
      }

      if (!targetCountry) {
        try {
          const locationRes = await fetch("/api/init-location");
          if (locationRes.ok) {
            const locData = await locationRes.json();
            if (locData.country) {
              targetCountry = locData.country;
            }
          }
        } catch (locErr) {
          console.warn(
            "Failed resolving location state completely, using absolute default.",
            locErr,
          );
        }
      }

      if (!targetCountry) targetCountry = DEFAULT_COUNTRY;

      const countryExists = countriesList.some(
        (c) => c.iso2.toUpperCase() === targetCountry.toUpperCase(),
      );

      const finalSelection = countryExists
        ? targetCountry.toUpperCase()
        : DEFAULT_COUNTRY;

      persistCountryCookie(finalSelection);
      set({ countries: countriesList ?? [], selectedCountry: finalSelection });

      const taxRes = await fetch(
        `/api/tax-rules?country_code=${finalSelection}`,
      );
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRules: taxData.rules || [], taxRulesLoaded: true });
      } else {
        set({ taxRulesLoaded: true });
      }
    } catch (error) {
      console.error("Countries initialization pipeline broken:", error);
      set({ taxRulesLoaded: true });
    }
  },

  setSelectedCountry: async (code) => {
    const cleanCode = code.toUpperCase();
    const currentCountry = get().selectedCountry;

    if (currentCountry === cleanCode) return;

    set({ pendingCountryChange: cleanCode });
  },

  confirmCountryChange: async () => {
    const cleanCode = get().pendingCountryChange;
    if (!cleanCode) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("selected_country", cleanCode);
    }
    persistCountryCookie(cleanCode);

    set({
      selectedCountry: cleanCode,
      pendingCountryChange: null,
      taxRulesLoaded: false,
    });

    try {
      const taxRes = await fetch(`/api/tax-rules?country_code=${cleanCode}`);
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRules: taxData.rules || [], taxRulesLoaded: true });
      } else {
        set({ taxRulesLoaded: true });
      }
    } catch (err) {
      console.error("Failed adjusting dynamic tax rates:", err);
      set({ taxRulesLoaded: true });
    }
  },
}));

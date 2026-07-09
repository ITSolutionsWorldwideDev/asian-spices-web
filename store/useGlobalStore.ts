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

// interface Currency {
//   id: number;
//   code: string;
//   symbol: string;
// }

// interface GlobalState {
//   countries: Country[];
//   selectedCountry: string;

//   // taxRate: number;
//   // taxName: string;
//   taxRules: TaxRule[];

//   fetchInitialData: () => Promise<void>;
//   setSelectedCountry: (code: string) => void;
// }

interface GlobalState {
  countries: Country[];
  selectedCountry: string;
  taxRules: TaxRule[];
  
  // 🟢 State fields for custom modal handler
  pendingCountryChange: string | null; 
  setPendingCountryChange: (code: string | null) => void;
  confirmCountryChange: () => Promise<void>;

  fetchInitialData: () => Promise<void>;
  setSelectedCountry: (code: string) => Promise<void>;
}

const DEFAULT_COUNTRY = "NL";

export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  selectedCountry: DEFAULT_COUNTRY,
  taxRules: [],

  // 🟢 Modal initial states
  pendingCountryChange: null,
  setPendingCountryChange: (code) => set({ pendingCountryChange: code }),

  fetchInitialData: async () => {
    // const { countries } = get();
    // if (countries.length > 0) return;

    try {
      // 1. Fetch shippable countries list
      const countryRes = await fetch("/api/countries?shippable=true", {
        cache: "no-store",
      });
      let countriesList: Country[] = [];
      if (countryRes.ok) countriesList = await countryRes.json();

      //  2. 🟢 Check localStorage first before querying third-party IP lookups
      let targetCountry = "";
      if (typeof window !== "undefined") {
        targetCountry = localStorage.getItem("selected_country") || "";
      }

      // 3. Fallback to location endpoint if no custom choice was cached locally
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

      // 4. Verify the finalized code selection exists within available regional limits
      const countryExists = countriesList.some(
        (c) => c.iso2.toUpperCase() === targetCountry.toUpperCase(),
      );

      const finalSelection = countryExists
        ? targetCountry.toUpperCase()
        : DEFAULT_COUNTRY;

      // 5. Update the store state
      set({ countries: countriesList ?? [], selectedCountry: finalSelection });
      // await get().setSelectedCountry(finalSelection);

      const taxRes = await fetch(`/api/tax-rules?country_code=${finalSelection}`);
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRules: taxData.rules || [] });
      }

    } catch (error) {
      console.error("Countries initialization pipeline broken:", error);
      // set({ countries: [], selectedCountry: DEFAULT_COUNTRY, taxRules: [] });
    }
  },

  // setSelectedCountry: async (code) => {

  //   const cleanCode = code.toUpperCase();
    
  //   // 🟢 Save choice persistently across tab route updates
  //   if (typeof window !== "undefined") {
  //     localStorage.setItem("selected_country", cleanCode);
  //   }

  //   set({ selectedCountry: cleanCode });

  //   try {
  //     const taxRes = await fetch(`/api/tax-rules?country_code=${code}`);
  //     if (taxRes.ok) {
  //       const taxData = await taxRes.json();
  //       set({ taxRules: taxData.rules || [] });
  //     }
  //   } catch (err) {
  //     console.error(
  //       "Failed adjusting dynamic tax rates on context layer:",
  //       err,
  //     );
  //   }
  // },

  // 🟢 Triggered when dropdown selection changes
  setSelectedCountry: async (code) => {
    const cleanCode = code.toUpperCase();
    const currentCountry = get().selectedCountry;

    if (currentCountry === cleanCode) return;

    // Set pending code state to automatically mount our custom modal UI overlay
    set({ pendingCountryChange: cleanCode });
  },

  // 🟢 Triggered when user clicks "Confirm/OK" inside the custom modal component
  confirmCountryChange: async () => {
    const cleanCode = get().pendingCountryChange;
    if (!cleanCode) return;

    if (typeof window !== "undefined") {
      localStorage.setItem("selected_country", cleanCode);
    }

    set({ selectedCountry: cleanCode, pendingCountryChange: null });
    
    try {
      const taxRes = await fetch(`/api/tax-rules?country_code=${cleanCode}`);
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRules: taxData.rules || [] });
      }
    } catch (err) {
      console.error("Failed adjusting dynamic tax rates:", err);
    }
  },

  
}));

// try {
//   const locationRes = await fetch("/api/init-location");
//   if (locationRes.ok) {
//     const locData = await locationRes.json();

//     // 🟢 CLIENT SIDE FAILSAFE: If server can't identify the country, run a client-side API lookup
//     if (locData.source === "fallback" || locData.source === "error-fallback") {
//       try {
//         const clientGeoRes = await fetch("https://ipapi.co/json/", { signal: AbortSignal.timeout(2000) });
//         if (clientGeoRes.ok) {
//           const clientGeoData = await clientGeoRes.json();
//           if (clientGeoData.country_code) {
//             targetCountry = clientGeoData.country_code;
//           }
//         }
//       } catch (clientErr) {
//         console.error("Client IP API unreachable, relying on default", clientErr);
//       }
//     } else if (locData.country) {
//       targetCountry = locData.country;
//     }
//   }
// } catch (locErr) {
//   console.warn("Failed resolving location state completely, using absolute default.", locErr);
// }

/* export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  selectedCountry: DEFAULT_COUNTRY,
  taxRules: [],

  fetchInitialData: async () => {
    const { countries } = get();
    if (countries.length > 0) return;

    try {
      const countryRes = await fetch("/api/countries?shippable=true", { cache: "no-store" });
      let countriesList = [];
      if (countryRes.ok) countriesList = await countryRes.json();

      set({ countries: countriesList ?? [], selectedCountry: DEFAULT_COUNTRY });
      await get().setSelectedCountry(DEFAULT_COUNTRY);
    } catch (error) {
      console.error("Countries fetch error:", error);
      set({ countries: [], selectedCountry: DEFAULT_COUNTRY, taxRules: [] });
    }
  },

  setSelectedCountry: async (code) => {
    set({ selectedCountry: code });
    try {
      const taxRes = await fetch(`/api/tax-rules?country_code=${code}`);
      if (taxRes.ok) {
        const taxData = await taxRes.json();
        set({ taxRules: taxData.rules || [] });
      }
    } catch (err) {
      console.error("Failed adjusting dynamic tax rates on context layer:", err);
    }
  },
})); */

/* export const useGlobalStore = create<GlobalState>((set, get) => ({
  countries: [],
  // currencies: [],
  selectedCountry: DEFAULT_COUNTRY,
  taxRate: 0.21,
  taxName: "VAT",

  fetchInitialData: async () => {
    const { countries } = get();
    if (countries.length > 0) return;

    try {
      const countryRes = await fetch("/api/countries?shippable=true", {
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

      await get().setSelectedCountry(DEFAULT_COUNTRY);
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
      console.error(
        "Failed adjusting dynamic tax rates on context layer:",
        err,
      );
    }
  },
})); */

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

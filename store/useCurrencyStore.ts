// apps/web/store/useCurrencyStore.ts

import { create } from "zustand";

interface Currency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  is_base: boolean;
  //   symbol:
}

interface CurrencyStore {
  currencies: Currency[];
  selectedCurrency: string;
  baseCurrency: string;
  rate: number;
  symbol: string;
  hasLoaded: boolean;

  // actions
  fetchCurrencies: () => Promise<void>;
  setSelectedCurrency: (code: string) => Promise<void>;
  fetchRate: (code: string) => Promise<void>;
}

export const useCurrencyStore = create<CurrencyStore>((set, get) => ({
  // currencies: [],
  // selectedCurrency: "",
  // rate: 1,
  // symbol: "",

  currencies: [],
  selectedCurrency: "EUR", // ✅ default
  baseCurrency: "EUR",
  rate: 1,
  symbol: "€",
  hasLoaded: false,

  // 🔹 Fetch currencies only
  fetchCurrencies: async () => {
    const { hasLoaded } = get();
    if (hasLoaded) return;
    try {
      const res = await fetch("/api/currencies");
      // const currencies = await res.json();
      const currencies: Currency[] = await res.json();

      const saved = localStorage.getItem("currency");

      // const baseCurrency = currencies.find((c: Currency) => c.is_base);
      const baseCurrency =
        currencies.find((c) => c.is_base)?.code || "EUR";


      const selected =
        currencies.find((c) => c.code === saved)?.code ||
        baseCurrency;

      // console.log("baseCurrency ==== ", baseCurrency);

      // const selected =
      //   currencies.find((c: any) => c.code === saved)?.code ||
      //   baseCurrency?.code ||
      //   "";

      const currencyObj = currencies.find((c: any) => c.code === selected);

      set({
        currencies,
        selectedCurrency: selected,
        baseCurrency,
        symbol: currencyObj?.symbol || "€",
        hasLoaded: true,
      });

      // set({
      //   currencies,
      //   selectedCurrency: selected,
      //   symbol: currencyObj?.symbol || "",
      // });

      // await get().fetchRate(selected);
      if (selected !== baseCurrency) {
        await get().fetchRate(selected);
      } else {
        set({ rate: 1 });
      }
    } catch (err) {
      console.error("Error fetching currencies", err);
    }
  },

  // 🔹 Set currency + fetch rate

  setSelectedCurrency: async (code) => {
    const { currencies, baseCurrency } = get();

    const exists = currencies.some((c) => c.code === code);

    if (!exists) {
      console.warn("Invalid currency selected:", code);
      return;
    }

    localStorage.setItem("currency", code);

    const currencyObj = currencies.find((c) => c.code === code);

    set({
      selectedCurrency: code,
      symbol: currencyObj?.symbol || "",
    });

    // ✅ base currency → no API call
    if (code === baseCurrency) {
      set({ rate: 1 });
      return;
    }

    await get().fetchRate(code);
  },

  // setSelectedCurrency: async (code) => {
  //   const { currencies } = get();

  //   const exists = currencies.some((c) => c.code === code);

  //   if (!exists) {
  //     console.warn("Invalid currency selected:", code);
  //     return;
  //   }

  //   localStorage.setItem("currency", code);

  //   set({ selectedCurrency: code });

  //   await get().fetchRate(code);
  // },

  // 🔹 Fetch exchange rate

  fetchRate: async (code) => {
    const { baseCurrency } = get();

    // ✅ NEVER fetch rate for base currency
    if (code === baseCurrency) {
      set({ rate: 1 });
      return;
    }

    try {
      const res = await fetch(`/api/currency-rate?code=${code}`);
      const data = await res.json();

      set({
        rate: data?.rate || 1,
      });
    } catch (err) {
      console.error("Error fetching rate", err);
    }
  },
  // fetchRate: async (code) => {
  //   try {
  //     const res = await fetch(`/api/currency-rate?code=${code}`);
  //     const data = await res.json();

  //     const currency = get().currencies.find((c) => c.code === code);

  //     set({
  //       rate: data?.rate || 1,
  //       symbol: currency?.symbol || "",
  //     });
  //   } catch (err) {
  //     console.error("Error fetching rate", err);
  //   }
  // },
}));




      /* set({
        currencies,
        selectedCurrency: baseCurrency ? baseCurrency.code : "",
        symbol: baseCurrency ? baseCurrency.symbol : "",
      });

      // fetch rate for base currency
      if (baseCurrency) {
        await get().fetchRate(baseCurrency.code);
      } */

// setSelectedCurrency: async (code) => {
//   set({ selectedCurrency: code });
//   await get().fetchRate(code);
// },
/* setSelectedCurrency: async (code) => {
    localStorage.setItem("currency", code);
    set({ selectedCurrency: code });
    await get().fetchRate(code);
  }, */

// if (data?.rate) {
//   set((state) => ({
//     rate: data.rate,
//     symbol: data.symbol || state.symbol,
//   }));
//   // set({ rate: data.rate, symbol: data.symbol });
// }

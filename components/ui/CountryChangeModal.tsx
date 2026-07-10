// apps/web/components/ui/CountryChangeModal.tsx

"use client";

import { useGlobalStore } from "@/store/useGlobalStore";
import { Globe, AlertTriangle } from "lucide-react";

export default function CountryChangeModal() {
  const { pendingCountryChange, setPendingCountryChange, confirmCountryChange, countries } = useGlobalStore();

  if (!pendingCountryChange) return null;

  const targetCountryName = countries.find(
    (c) => c.iso2.toUpperCase() === pendingCountryChange.toUpperCase()
  )?.name || pendingCountryChange;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-md rounded-xl p-6 shadow-2xl mx-4 transform scale-100 transition-transform duration-200">
        
        {/* Header Icon Indicator */}
        <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4">
          <div className="p-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-500 rounded-lg">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-zinc-900 dark:text-white">
              Update Delivery Location?
            </h3>
            <p className="text-xs text-gray-400">Regional catalog synchronization</p>
          </div>
        </div>

        {/* Content Body Context */}
        <div className="space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
            You are switching your delivery location to&nbsp;
            <span className="font-semibold text-zinc-900 dark:text-white underline decoration-orange-500 underline-offset-4">
              {targetCountryName}
            </span>.
          </p>
          
          <div className="flex gap-2.5 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800/80 p-3 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                We'll update prices, available products, and your cart based on this location.
              {/* This choice clears stale cached pricing records. Your active shopping cart item listing values will refresh to match structural dynamic logistics frameworks. */}
            </p>
          </div>
        </div>

        {/* Action Controls Panel */}
        <div className="flex items-center justify-end gap-3 mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <button
            type="button"
            onClick={() => setPendingCountryChange(null)}
            className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={confirmCountryChange}
            className="px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-100 rounded-lg shadow-sm transition-all focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change Location
          </button>
        </div>

      </div>
    </div>
  );
}
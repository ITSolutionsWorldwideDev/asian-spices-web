// apps/web/components/ui/GlobalLoader.tsx

"use client";

import { useLoaderStore } from "@/store/useLoaderStore";

export default function GlobalLoader() {
  const { loading, message } = useLoaderStore();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
      <div className="bg-white px-6 py-5 rounded-xl shadow-xl flex flex-col items-center">
        
        {/* Spinner */}
        <div className="w-10 h-10 border-4 border-orange-400 border-t-transparent rounded-full animate-spin"></div>

        {/* Message */}
        <p className="mt-4 text-sm text-gray-600">
          {message || "Loading..."}
        </p>
      </div>
    </div>
  );
}
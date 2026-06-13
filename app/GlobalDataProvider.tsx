// apps/web/app/GlobalDataProvider.tsx

"use client";

import { useEffect } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";

export default function GlobalDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const fetchInitialData = useGlobalStore((s) => s.fetchInitialData);

  useEffect(() => {
    fetchInitialData();
  }, []);

  return <>{children}</>;
}
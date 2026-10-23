// apps/web/components/layout/partner_registration/idin/callback/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function IDINCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const ref = searchParams.get("ref");

  useEffect(() => {
    const run = async () => {
      const stored = localStorage.getItem("idin_transaction");

      if (!stored) {
        router.push("/partner-registration/failed");
        return;
      }

      const { transactionId } = JSON.parse(stored);

      // trigger backend verification (optional but safe)
      await fetch("/api/idin/webhook?manual=true", {
        method: "POST",
        body: JSON.stringify({
          ref,
          transactionId,
        }),
      });

      router.push("/partner-registration/success");
    };

    run();
  }, []);

  return (
    <div className="p-10 text-center">
      <h1>Verifying your identity...</h1>
    </div>
  );
}
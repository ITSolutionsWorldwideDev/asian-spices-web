// apps/web/app/partner-registration/idin/callback/page.tsx

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function IDINCallback() {
  const router = useRouter();

  useEffect(() => {
    const finalize = async () => {
      const res = await fetch("/api/partner-registration/idin/verify");
      const data = await res.json();

      if (data.success) {
        router.push("/partner-registration?step=6"); // Confirmation
      } else {
        alert("Verification failed");
        router.push("/partner-registration?step=5");
      }
    };

    finalize();
  }, []);

  return <p>Verifying your identity...</p>;
}
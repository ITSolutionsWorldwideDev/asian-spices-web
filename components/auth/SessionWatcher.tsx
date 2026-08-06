// components/auth/SessionWatcher.tsx

"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

export default function SessionWatcher() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.expired) {
      signOut({ callbackUrl: "/login" });
    }
  }, [session?.expired]);

  return null;
}

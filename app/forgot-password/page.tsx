// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      setStatus(null);

      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        router.push(
          `/reset-password?email=${encodeURIComponent(email.trim())}`,
        );
        return;
      }

      setStatus({
        type: "error",
        message: data.error || "Something went wrong. Try again.",
      });
    } catch (err) {
      setStatus({ type: "error", message: "Failed to connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-3 py-6 sm:px-6 sm:py-10 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl bg-white/90 backdrop-blur-xl border border-white/40 p-4 sm:p-6 md:p-8 shadow-xl">
        <div className="flex justify-center mb-4 sm:mb-6">
          <Link href="/">
            <Image
              src="/assets/logo/Group 87.png"
              alt="Logo"
              width={140}
              height={50}
              className="h-9 w-auto object-contain sm:h-11 cursor-pointer"
            />
          </Link>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
            Reset Password
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
            Enter your email to receive a 6-digit verification code.
          </p>
        </div>

        {status && (
          <div
            className={`p-3.5 rounded-xl text-xs sm:text-sm mb-5 ${status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-xs sm:text-sm text-gray-700 font-semibold">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1.5 px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-60 cursor-pointer text-sm sm:text-base"
          >
            {loading ? "Sending code..." : "Send Verification Code"}
          </button>
        </form>

        <p className="text-center text-xs sm:text-sm text-slate-500 mt-6 space-y-1 sm:space-y-0">
          <span>Remembered your password? </span>
          <Link
            href="/login"
            className="font-bold text-orange-600 hover:text-orange-700 hover:underline inline-block min-h-[44px] sm:min-h-0 py-2 sm:py-0"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

// app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
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

      if (res.ok) {
        setStatus({
          type: "success",
          message:
            "If that account exists, a link was generated in your terminal console logs!",
        });
      } else {
        setStatus({
          type: "error",
          message: "Something went wrong. Try again.",
        });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Failed to connect to the server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="w-full max-w-lg rounded-3xl bg-white/80 backdrop-blur-xl border border-white/30 p-10 shadow-xl">
        <div className="flex justify-center mb-6">
          <Link href="/">
            <Image
              src="/assets/logo/Group 87.png"
              alt="Logo"
              width={70}
              height={70}
            />
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Reset Password</h1>
          <p className="mt-2 text-slate-500">
            Enter your email address to receive a secure configuration link.
          </p>
        </div>

        {status && (
          <div
            className={`p-4 rounded-xl text-sm mb-6 ${status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-bold">
              Email Address
            </label>
            <input
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send Request Link"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="font-semibold text-orange-600 hover:text-orange-700"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

// app/reset-password/ResetPasswordClient.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import FormSideImage from "@/components/ui/FormSideImage";
import Link from "next/link";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!email.trim()) {
      setStatus({ type: "error", message: "Email is required." });
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setStatus({
        type: "error",
        message: "Enter the 6-digit verification code from your email.",
      });
      return;
    }

    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          otp: otp.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({
          type: "success",
          message: "Password updated successfully! Redirecting...",
        });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus({
          type: "error",
          message: data.error || "Reset failed. The code may be invalid or expired.",
        });
      }
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 container mx-auto p-10 bg-gray-100">
        <div className=" flex items-center justify-center ">
          <div className="w-full max-w-md">
            <div>
              <Link href={`/`}>
                <Image
                  src={`/assets/logo/Group 87.png`}
                  alt="home"
                  height={60}
                  width={60}
                  className="mb-10 cursor-pointer"
                />
              </Link>
            </div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-8">
              Reset your password
            </h1>
            <p className="text-sm text-gray-400 mb-10">
              Enter the verification code from your email, then choose a new
              password.
            </p>

            {status && (
              <div
                className={`p-4 rounded-xl text-sm mb-6 ${status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}
              >
                {status.message}
              </div>
            )}

            <form onSubmit={handleReset} className="space-y-4">
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

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  placeholder="6-digit code"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 font-bold">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-xl transition-all duration-300 disabled:opacity-60"
              >
                {loading ? "Updating..." : "Save & Update Password"}
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Didn&apos;t get a code?{" "}
              <Link
                href="/forgot-password"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                Request a new one
              </Link>
            </p>

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-sm text-gray-500 mt-6 font-bold">
              Don&apos;t you have an account?&nbsp;
              <Link href="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
            <p className="text-xs text-gray-400 mt-10">
              © 2026 ALL RIGHTS RESERVED
            </p>
          </div>
        </div>
        <FormSideImage />
      </div>
    </div>
  );
}

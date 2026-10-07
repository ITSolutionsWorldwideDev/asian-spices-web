// app/reset-password/ResetPasswordClient.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import FormSideImage from "@/components/ui/FormSideImage";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const emailFromQuery = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(emailFromQuery);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        message: "Password must be at least 6 characters.",
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
    <div
      className="notranslate min-h-dvh overflow-x-hidden overflow-y-auto bg-gray-100"
      translate="no"
    >
      <div className="mx-auto w-full max-w-7xl px-3 py-4 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-10 lg:py-12 xl:px-12">
        <div className="grid w-full grid-cols-1 items-stretch gap-4 sm:gap-6 md:grid-cols-2 md:gap-8 lg:gap-10 xl:gap-12">
          {/* Form — below image on mobile, left on desktop */}
          <div className="order-2 flex min-w-0 md:order-1">
            <div className="relative flex w-full flex-col overflow-hidden rounded-2xl border border-white/30 bg-white/80 p-4 sm:p-5 md:p-7 lg:p-8 xl:p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:rounded-3xl">
              <Link
                href="/login"
                className="group mb-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2 text-xs font-semibold text-orange-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:from-orange-100 hover:to-amber-100 sm:mb-4 sm:text-sm sm:px-4 sm:py-2 md:mb-5 w-fit"
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm sm:h-7 sm:w-7">
                  <ArrowLeft size={14} strokeWidth={2.5} />
                </span>
                Back to Login
              </Link>

              <div className="flex justify-center">
                <Link href="/">
                  <Image
                    src="/assets/logo/Group 87.png"
                    alt="Asian Spices"
                    width={180}
                    height={60}
                    priority
                    className="h-9 w-auto object-contain sm:h-10 md:h-11 lg:h-12"
                  />
                </Link>
              </div>

              <div className="mb-4 mt-2 text-center sm:mb-5 sm:mt-3 md:mb-6 md:mt-4">
                <h1 className="text-lg font-bold text-slate-900 sm:text-xl md:text-2xl lg:text-3xl">
                  Reset your password
                </h1>
                <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:mt-1.5 sm:text-sm md:mt-2 md:text-base">
                  Enter the verification code from your email, then choose a new password.
                </p>
              </div>

              {status && (
                <div
                  className={`p-3.5 rounded-xl text-xs sm:text-sm mb-4 ${status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}
                >
                  {status.message}
                </div>
              )}

              <form onSubmit={handleReset} className="space-y-3 sm:space-y-4 text-left">
                <div>
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

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 font-semibold">
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
                    className="w-full mt-1.5 px-3.5 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 tracking-widest font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 font-semibold">
                    New Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-3 pr-11 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 bottom-0 flex min-h-[44px] w-11 items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700 font-semibold">
                    Confirm New Password
                  </label>
                  <div className="relative mt-1.5">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-3.5 py-3 pr-11 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-0 top-0 bottom-0 flex min-h-[44px] w-11 items-center justify-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full min-h-[48px] py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-60 cursor-pointer text-sm sm:text-base"
                >
                  {loading ? "Updating..." : "Save & Update Password"}
                </button>
              </form>

              <p className="text-center text-xs sm:text-sm text-slate-500 mt-5">
                Didn&apos;t get a code?{" "}
                <Link
                  href="/forgot-password"
                  className="font-bold text-orange-600 hover:text-orange-700 hover:underline"
                >
                  Request a new one
                </Link>
              </p>

              <div className="flex items-center my-4">
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              <p className="text-center text-xs sm:text-sm text-gray-500 font-semibold">
                Don&apos;t have an account?&nbsp;
                <Link href="/signup" className="text-orange-600 hover:text-orange-700 hover:underline">
                  Sign up
                </Link>
              </p>
              <p className="text-center text-xs text-gray-400 mt-6">
                © 2026 Asian Spices Online. All rights reserved.
              </p>
            </div>
          </div>

          {/* Image — compact banner on mobile, full column on tablet+ */}
          <div className="order-1 min-w-0 md:order-2">
            <FormSideImage
              className="h-32 min-h-0 sm:h-44 md:h-full md:min-h-[460px] lg:min-h-[520px] xl:min-h-[580px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

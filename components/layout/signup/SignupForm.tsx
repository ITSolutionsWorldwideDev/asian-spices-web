// apps/web/components/layout/signup/SignupForm.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useLoaderStore } from "@/store/useLoaderStore";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

/* ---------------- ZOD SCHEMA ---------------- */
const signupSchema = z
  .object({
    email: z.string().email("Invalid email"),
    phone: z.string().min(8, "Phone is required"),
    password: z.string().min(8, "Minimum 8 characters"),
    confirmPassword: z.string(),
    acceptedTerms: z
      .boolean()
      .refine((value) => value === true, {
        message: "Please agree to the Terms & Conditions and Privacy Policy",
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [signupType, setSignupType] = useState<"selection" | "customer">(
    "selection",
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { show, hide } = useLoaderStore();

  const handleChange = (key: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  function zodToFieldErrors(issues: z.ZodIssue[]): Record<string, string> {
    const errors: Record<string, string> = {};

    issues.forEach((err) => {
      const key = err.path[0];

      if (typeof key === "string") {
        errors[key] = err.message;
      }
    });

    return errors;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* ---------------- VALIDATION ---------------- */
    const result = signupSchema.safeParse(form);

    if (!result.success) {
      setErrors(zodToFieldErrors(result.error.issues));
      return;
    }

    try {
      setLoading(true);
      show("signing Up...");

      /* ---------------- API CALL ---------------- */
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
          acceptedTerms: form.acceptedTerms,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ email: data.error || "Signup failed" });
        return;
      }

      /* ---------------- AUTO LOGIN ---------------- */
      await signIn("credentials", {
        email: form.email,
        password: form.password,
        callbackUrl: "/",
      });
    } catch (err) {
      setErrors({ email: "Something went wrong" });
    } finally {
      setLoading(false);
      hide();
    }
  };

  return (
    <div
      translate="no"
      className="
        notranslate
        min-h-screen
        flex items-center justify-center
        px-4 py-10
        bg-gradient-to-br
        from-orange-50
        via-white
        to-amber-50
        relative
        flex
        w-full
        flex-col
        overflow-hidden
        rounded-2xl
        border
        border-white/30
        bg-white/80
        shadow-[0_20px_80px_rgba(0,0,0,0.08)]
        backdrop-blur-xl
        sm:rounded-3xl
      "
    >
      {/* Customer / Partner tabs */}
      <div className="flex border-b border-slate-200 bg-white/90">
        <button
          type="button"
          onClick={() => setSignupType("customer")}
          className={`flex-1 py-3 text-center text-sm font-bold transition sm:text-base ${
            signupType === "customer"
              ? "border-b-2 border-orange-500 text-slate-900"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Customer
        </button>
        <Link
          href="/partner-registration"
          className="flex-1 py-3 text-center text-sm font-medium text-slate-500 transition hover:text-slate-800 sm:text-base"
        >
          Partner
        </Link>
      </div>

      <div className="flex flex-col p-4 sm:p-5 md:p-7 lg:p-8 xl:p-10">
        <Link
          href="/"
          className="group mb-3 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-3.5 py-2 text-xs font-semibold text-orange-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:from-orange-100 hover:to-amber-100 sm:mb-4 sm:text-sm sm:px-4 sm:py-2 md:mb-5"
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-orange-600 shadow-sm sm:h-7 sm:w-7">
            <ArrowLeft size={14} strokeWidth={2.5} />
          </span>
          Back to Home
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
            Join Asian Spices ✨
          </h1>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:mt-1.5 sm:text-sm md:mt-2 md:text-base">
            Create your account and start exploring authentic Asian products.
          </p>
        </div>

        {signupType === "selection" ? (
          <div className="space-y-3 mt-2 sm:mt-4">
            <button
              onClick={() => setSignupType("customer")}
              type="button"
              className="
                w-full rounded-2xl p-4 sm:p-5
                bg-gradient-to-r from-orange-500 to-amber-500
                hover:scale-[1.01] active:scale-[0.99]
                transition-all duration-200
                shadow-md hover:shadow-lg
                text-left cursor-pointer
              "
            >
              <p className="text-base sm:text-lg font-bold text-black">
                👤 Sign up as Customer
              </p>
              <p className="text-xs sm:text-sm text-black/75 mt-0.5">
                Order authentic Asian spices &amp; groceries online
              </p>
            </button>

            <Link href="/partner-registration" className="block">
              <div
                className="
                  w-full rounded-2xl p-4 sm:p-5
                  bg-white border border-slate-200
                  hover:border-orange-400
                  hover:scale-[1.01] active:scale-[0.99]
                  transition-all duration-200
                  shadow-sm hover:shadow-md
                  text-left cursor-pointer
                "
              >
                <p className="text-base sm:text-lg font-bold text-slate-800">
                  🚀 Sign up as Partner
                </p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Grow your business with Asian Spices
                </p>
              </div>
            </Link>

            <div className="my-3 sm:my-4 flex items-center">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="px-3 text-xs uppercase tracking-wider text-slate-400">
                Or
              </span>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <GoogleSignInButton
              label="Continue with Google"
              callbackUrl="/"
            />
          </div>
        ) : (
          <>
            <button
              onClick={() => setSignupType("selection")}
              type="button"
              className="
                inline-flex min-h-[44px] items-center gap-1.5
                py-2 text-xs sm:text-sm text-orange-600 font-semibold
                mb-2 hover:text-orange-700 active:scale-95 transition-all
              "
            >
              ← Choose another account type
            </button>

            <h2 className="text-base sm:text-lg font-bold text-slate-800 mb-3 text-left">
              Create Customer Account
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 text-left">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`w-full mt-1.5 rounded-xl border ${errors.email ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-orange-100"} bg-white px-3.5 py-3 text-sm transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:outline-none`}
                />
                {errors.email && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+31 6 12345678"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={`w-full mt-1.5 rounded-xl border ${errors.phone ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-orange-100"} bg-white px-3.5 py-3 text-sm transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:outline-none`}
                />
                {errors.phone && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    className={`w-full rounded-xl border ${errors.password ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-orange-100"} bg-white px-3.5 py-3 pr-11 text-sm transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:outline-none`}
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
                {errors.password && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs sm:text-sm font-semibold text-gray-700">
                  Confirm Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={form.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    className={`w-full rounded-xl border ${errors.confirmPassword ? "border-red-400 focus:ring-red-100" : "border-slate-200 focus:ring-orange-100"} bg-white px-3.5 py-3 pr-11 text-sm transition-all duration-200 focus:border-orange-400 focus:ring-4 focus:outline-none`}
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
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <label className="mt-2 flex cursor-pointer items-start gap-2.5 rounded-xl border border-gray-200 bg-gray-50/80 p-3 text-xs sm:text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={form.acceptedTerms}
                  onChange={(e) => handleChange("acceptedTerms", e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-orange-500"
                />
                <span className="leading-snug">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange-600 underline hover:text-orange-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-orange-600 underline hover:text-orange-700"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.acceptedTerms && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.acceptedTerms}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 py-3 font-bold text-white shadow-md hover:shadow-lg active:scale-[0.99] transition-all duration-200 disabled:opacity-60 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              <div className="my-3 sm:my-4 flex items-center">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="px-3 text-xs uppercase tracking-wider text-slate-400">
                  Or
                </span>
                <div className="h-px flex-1 bg-slate-200" />
              </div>

              <GoogleSignInButton
                label="Sign up with Google"
                callbackUrl="/"
              />
            </form>
          </>
        )}

        {/* Footer */}
        <p className="mt-6 text-center text-xs sm:text-sm font-semibold text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 hover:text-orange-700 hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Asian Spices Online. All rights reserved.
        </p>
      </div>
    </div>
  );
}

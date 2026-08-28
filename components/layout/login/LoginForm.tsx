// apps/web/components/layout/login/LoginForm.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useLoaderStore } from "@/store/useLoaderStore";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

/* ---------------- SCHEMA ---------------- */
const loginSchema = z.object({
  email: z.string().trim().email("Invalid email"),
  password: z.string().min(6, "Password required"),
});

export default function LoginForm() {
  const router = useRouter();

  const { show, hide } = useLoaderStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ---------------- HELPERS ---------------- */

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear field error on change
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

    const result = loginSchema.safeParse(form);

    if (!result.success) {
      setErrors(zodToFieldErrors(result.error.issues));
      return;
    }

    try {
      setLoading(true);
      show("Login Process...");

      const res = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        setErrors({ email: "Invalid email or password" });
        return;
      }

      // HANDLE CHECKOUT REDIRECT
      const redirect = localStorage.getItem("checkout_redirect");

      if (redirect) {
        localStorage.removeItem("checkout_redirect");
        router.push(redirect);
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
      setErrors({ email: "Login failed. Try again." });
    } finally {
      setLoading(false);
      hide();
    }
  };

  return (
    <div className="relative flex w-full min-w-0 flex-1">
      <div className="pointer-events-none absolute top-0 left-0 h-24 w-24 rounded-full bg-orange-300/20 blur-3xl sm:h-32 sm:w-32 md:h-40 md:w-40" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-24 w-24 rounded-full bg-amber-300/20 blur-3xl sm:h-32 sm:w-32 md:h-40 md:w-40" />
      <div
        className="
          relative
          flex
          w-full
          min-w-0
          flex-col
          rounded-2xl
          border
          border-white/30
          bg-white/80
          p-4
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          sm:p-5
          sm:rounded-3xl
          md:p-7
          lg:p-8
          xl:p-10
        "
      >
        <Link
          href="/"
          className="group mb-3 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50 px-3 py-1.5 text-xs font-semibold text-orange-700 shadow-sm transition-all duration-300 hover:border-orange-200 hover:from-orange-100 hover:to-amber-100 sm:mb-4 sm:text-sm sm:px-4 sm:py-2 md:mb-5"
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
            Welcome Back 👋
          </h1>

          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 sm:mt-1.5 sm:text-sm md:mt-2 md:text-base">
            Sign in to continue shopping your favorite Asian spices.
          </p>
        </div>

        <GoogleSignInButton
          label="Continue with Google"
          callbackUrl="/"
          className="min-h-[44px] text-sm sm:text-base"
        />

        <div className="my-3 flex items-center gap-2 sm:my-4 md:my-6">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="shrink-0 px-2 text-center text-[10px] uppercase tracking-wide text-slate-400 sm:px-4 sm:text-xs sm:tracking-wider">
            Or continue with email
          </span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-left sm:space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="
                w-full
                mt-2
                min-h-[44px]
                px-4
                py-3
                pr-10
                rounded-xl
                border
                border-slate-200
                bg-white
                text-base
                sm:text-sm
                transition-all
                duration-200
                focus:outline-none
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
                "
                // className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm sm:right-4">
                ✉️
              </span>
            </div>
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600 font-bold">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="
                w-full
                mt-2
                min-h-[44px]
                px-4
                py-3
                pr-10
                rounded-xl
                border
                border-slate-200
                bg-white
                text-base
                sm:text-sm
                transition-all
                duration-200
                focus:outline-none
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
                "
                // className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm sm:right-4">
                🔒
              </span>
            </div>
            {errors.password && <p className="error">{errors.password}</p>}

            <div className="flex justify-end">
               {/* /reset-password */}
              <Link
                href="/forgot-password"
                className="
                  text-sm
                  text-orange-600
                  hover:text-orange-700
                  transition
                "
              >
                Forgot Password?
              </Link>
            </div>
          </div>
          {/* <div className="text-sm text-gray-600 mb-4">
            <Link href="/reset-password">
              Reset Password
              <span className="menu-arrow inside-submenu" />
            </Link>
          </div> */}

          {/* Sign up button */}
          <button
            type="submit"
            className="
              w-full
              min-h-[44px]
              py-3.5
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r
              from-orange-500
              to-amber-500
              hover:shadow-xl
              active:scale-[0.99]
              sm:hover:scale-[1.01]
              transition-all
              duration-300
              disabled:opacity-60
              "
            // className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-3 text-center text-xs text-slate-500 sm:mt-4 sm:text-sm md:mt-6">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="
              font-semibold
              text-orange-600
              hover:text-orange-700
            "
          >
            Create one
          </Link>
        </p>
        {/* <p className="text-sm text-gray-500 mt-6 font-bold">
          Don't you have an account?&nbsp;
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p> */}

        <div
          className="
            mt-3
            rounded-xl
            border
            border-orange-100
            bg-orange-50
            p-2.5
            text-center
            sm:mt-4
            sm:p-3
            md:mt-6
          "
        >
          <p className="text-[11px] text-orange-700 sm:text-xs">
            🔒 Your account is protected with secure authentication
          </p>
        </div>

        <p className="mt-3 text-[10px] text-gray-400 sm:mt-4 sm:text-xs md:mt-6">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

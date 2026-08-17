// apps/web/components/layout/login/LoginForm.tsx

"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { z } from "zod";
import { useLoaderStore } from "@/store/useLoaderStore";

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
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-start
        justify-center
        overflow-visible
        px-0
        py-4
        sm:py-6
        md:items-center
        [@media(min-height:800px)]:py-10
      "
    >
      <div className="pointer-events-none absolute top-0 left-0 h-40 w-40 rounded-full bg-orange-300/20 blur-3xl sm:h-72 sm:w-72" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-40 w-40 rounded-full bg-amber-300/20 blur-3xl sm:h-72 sm:w-72" />
      <div
        className="
          relative
          my-auto
          w-full
          max-w-lg
          rounded-3xl
          border
          border-white/30
          bg-white/80
          p-5
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          backdrop-blur-xl
          sm:p-8
          lg:p-10
        "
      >
        <div className="flex justify-center">
          <Link href="/">
            <Image
              src="/assets/logo/Group 87.png"
              alt="Asian Spices"
              width={90}
              height={90}
              className="h-[70px] w-[70px] cursor-pointer sm:h-[90px] sm:w-[90px]"
            />
          </Link>
        </div>
        <div className="mb-6 mt-4 text-center sm:mb-8 sm:mt-6 [@media(max-height:700px)]:mb-4 [@media(max-height:700px)]:mt-3">
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Welcome Back 👋
          </h1>

          <p className="mt-2 text-slate-500 sm:mt-3 [@media(max-height:700px)]:hidden">
            Sign in to continue shopping your favorite Asian spices.
          </p>
        </div>
        {/* <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Welcome to Asian Spices 👋
        </h1>
        <p className="text-sm text-gray-400 mb-10">
          Great to see you. Sign in to access your account and get started.
        </p> */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                transition-all
                duration-200
                focus:outline-none
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
                "
                // className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />

              <span className="absolute right-4 top-4">✉️</span>
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
                px-4
                py-3
                rounded-xl
                border
                border-slate-200
                bg-white
                text-sm
                transition-all
                duration-200
                focus:outline-none
                focus:border-orange-400
                focus:ring-4
                focus:ring-orange-100
                "
                // className="w-full mt-1 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <span className="absolute right-4 top-4">🔒</span>
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
              py-3.5
              rounded-xl
              font-semibold
              text-white
              bg-gradient-to-r
              from-orange-500
              to-amber-500
              hover:shadow-xl
              hover:scale-[1.01]
              transition-all
              duration-300
              disabled:opacity-60
              "
            // className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center sm:my-8 [@media(max-height:700px)]:my-4">
          <div className="flex-1 h-px bg-slate-200" />

          <span className="px-4 text-xs uppercase tracking-wider text-slate-400">
            Account Access
          </span>

          <div className="flex-1 h-px bg-slate-200" />
        </div>
        {/* <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex-1 h-px bg-gray-200" />
        </div> */}

        {/* Login link */}

        <p className="text-center text-sm text-slate-500">
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
            mt-6
            rounded-xl
            border
            border-orange-100
            bg-orange-50
            p-3
            text-center
            sm:mt-8
            [@media(max-height:700px)]:mt-4
          "
        >
          <p className="text-xs text-orange-700">
            🔒 Your account is protected with secure authentication
          </p>
        </div>

        <p className="mt-6 text-xs text-gray-400 sm:mt-10 [@media(max-height:700px)]:mt-4">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

// apps/web/components/layout/signup/SignupForm.tsx

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { signIn } from "next-auth/react";
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
    // <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
    <div
      className="
        min-h-screen
        flex items-center justify-center
        px-4 py-10
        bg-gradient-to-br
        from-orange-50
        via-white
        to-amber-50
        relative
        overflow-hidden
      "
    >
      {/* <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-md text-center"> */}

      <div className="absolute top-0 left-0 h-72 w-72 bg-orange-300/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 h-72 w-72 bg-amber-300/20 rounded-full blur-3xl" />
      <div
        className="
          relative
          w-full
          max-w-lg
          rounded-3xl
          bg-white/80
          backdrop-blur-xl
          border border-white/30
          p-10
          shadow-[0_20px_80px_rgba(0,0,0,0.08)]
          text-center
        "
      >
        <Link href="/" className="flex justify-center">
          <Image
            src="/assets/logo/Group 87.png"
            alt="Asian Spices"
            width={60}
            height={60}
            className="mb-6 cursor-pointer"
          />
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">
            Join Asian Spices ✨
          </h1>

          <p className="mt-2 text-slate-500">
            Create your account and start exploring authentic Asian products.
          </p>
        </div>

        {/* <h1 className="mb-6 text-2xl font-semibold text-gray-900">
          Welcome Asian Spices 👋
        </h1> */}

        {signupType === "selection" ? (
          <div className="space-y-4 mt-8">
            <Link href="/partner-registration">
              <button
                className="
                  w-full rounded-2xl p-5
                  bg-gradient-to-r from-orange-500 to-amber-500
                  hover:scale-[1.02]
                  transition-all duration-300
                  shadow-lg hover:shadow-xl
                "
              >
                <div className="text-left">
                  <p className="text-lg font-bold text-black">
                    🚀 Sign up as Partner
                  </p>
                  <p className="text-sm text-black/70">
                    Grow your business with Asian Spices
                  </p>
                </div>
              </button>
            </Link>

            <button
              onClick={() => setSignupType("customer")}
              className="
                w-full rounded-2xl p-5 mt-4
                bg-white border border-slate-200
                hover:border-orange-400
                hover:scale-[1.02]
                transition-all duration-300
                shadow-md hover:shadow-lg
              "
            >
              <div className="text-left">
                <p className="text-lg font-bold text-slate-800">
                  👤 Sign up as Customer
                </p>
                <p className="text-sm text-slate-500">
                  Order authentic Asian spices online
                </p>
              </div>
            </button>

            <div className="my-4 flex items-center">
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
                flex items-center gap-2
                text-orange-600 font-medium
                mb-6 hover:text-orange-700
              "
            >
              ← Back
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Create Customer Account
            </h2>
          </>
        )}

        {/* <div className="flex justify-center mt-6">
          <Link href="/partner-registration">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white rounded-xl shadow-lg bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
              <span className="relative z-10 flex items-center gap-2 text-black cursor-pointer">
                🚀 Sign up as a partner
              </span>

             //  Glow Effect
              <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition duration-300 rounded-xl"></span>
            </button>
          </Link>
        </div>

        <div className="flex justify-center mt-6">
          <button className="group relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-semibold text-white rounded-xl shadow-lg bg-linear-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl">
            <span className="relative z-10 flex items-center gap-2 text-black cursor-pointer">
              🚀 Sign up as a customer
            </span>

            // Glow Effect 
            <span className="absolute inset-0 bg-white opacity-10 group-hover:opacity-20 transition duration-300 rounded-xl"></span>
          </button>
        </div> */}

        {/* ================= USER FORM ================= */}

        {signupType === "customer" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-bold text-gray-600">Email</label>
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="
                  w-full
                  mt-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-3
                  text-sm
                  transition-all
                  duration-200
                  focus:border-orange-400
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  "
                // className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                //            focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">
                Phone No
              </label>
              <input
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="
                  w-full
                  mt-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-3
                  text-sm
                  transition-all
                  duration-200
                  focus:border-orange-400
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  "
                // className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                //            focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {errors.phone && <p className="error">{errors.phone}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="
                  w-full
                  mt-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-3
                  text-sm
                  transition-all
                  duration-200
                  focus:border-orange-400
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  "
                // className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                //            focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-bold text-gray-600">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={(e) =>
                  handleChange("confirmPassword", e.target.value)
                }
                className="
                  w-full
                  mt-2
                  rounded-xl
                  border border-slate-200
                  bg-white
                  px-4 py-3
                  text-sm
                  transition-all
                  duration-200
                  focus:border-orange-400
                  focus:ring-4
                  focus:ring-orange-100
                  focus:outline-none
                  "
                // className="w-full mt-1 rounded-lg border border-gray-300 px-4 py-3 text-sm
                //            focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              {errors.confirmPassword && (
                <p className="error">{errors.confirmPassword}</p>
              )}
            </div>

            <label className="mt-1 flex cursor-pointer items-start gap-3 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.acceptedTerms}
                onChange={(e) =>
                  handleChange("acceptedTerms", e.target.checked)
                }
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-orange-500"
              />
              <span>
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
                and the{" "}
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
              <p className="error">{errors.acceptedTerms}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                rounded-xl
                bg-gradient-to-r
                from-orange-500
                to-amber-500
                py-3.5
                font-semibold
                text-white
                shadow-lg
                hover:shadow-xl
                hover:scale-[1.01]
                transition-all
                duration-300
                disabled:opacity-60
                "
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>

            <div className="my-4 flex items-center">
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
        )}

        {/* Footer */}
        <p className="mt-6 text-sm font-bold text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>

        <p className="mt-10 text-xs text-gray-400">
          © 2026 ALL RIGHTS RESERVED
        </p>
      </div>
    </div>
  );
}

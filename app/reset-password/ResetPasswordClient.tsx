// app/reset-password/ResetPasswordClient.tsx

"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import FormSideImage from "@/components/ui/FormSideImage";
import Link from "next/link";

export default function ResetPasswordClient() { 

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center p-8 bg-white rounded-2xl shadow border max-w-md">
          <p className="text-red-500 font-bold text-lg mb-2">Missing Reset Token</p>
          <p className="text-gray-500 text-sm mb-4">Please request a new link using the forgot password screen form.</p>
          <Link href="/forgot-password" className="text-orange-500 hover:underline text-sm font-semibold">Go to Forgot Password</Link>
        </div>
      </div>
    );
  }

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (password.length < 6) {
      setStatus({ type: "error", message: "Password must be at least 6 characters long." });
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
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: "Password updated successfully! Redirecting..." });
        setTimeout(() => router.push("/login"), 3000);
      } else {
        setStatus({ type: "error", message: data.error || "Reset failed. The token may be invalid or expired." });
      }
    } catch (err) {
      setStatus({ type: "error", message: "Something went wrong. Try again later." });
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    try {
      setLoading(true);

      await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password }),
      });
    } catch (err) {
      setErrors({ email: "Something went wrong" });
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
              Welcome to Asian Spices 👋
            </h1>
            <p className="text-sm text-gray-400 mb-10">
              Today is a new day. It's your day. You shape it. Sign in to start
              managing your projects.
            </p>

            {status && (
          <div className={`p-4 rounded-xl text-sm mb-6 ${status.type === "success" ? "bg-green-50 text-green-800 border border-green-100" : "bg-red-50 text-red-800 border border-red-100"}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <label className="text-sm text-gray-600 font-bold">New Password</label>
            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 font-bold">Confirm New Password</label>
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


            {/* <div>
              <label className="text-sm text-gray-600 font-bold">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full my-2 px-4 py-3 border  border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            <button
              type="button"
              onClick={submit}
              className="w-full py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition"
            >
              {loading ? "Reseting..." : "Reset Password"}
            </button> */}

            <div className="flex items-center my-6">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <p className="text-sm text-gray-500 mt-6 font-bold">
              Don't you have an account?&nbsp;
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

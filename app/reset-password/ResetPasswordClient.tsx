// apps/web/app/reset-password/ResetPasswordClient.tsx

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import FormSideImage from "@/components/ui/FormSideImage";
import Link from "next/link";

export default function ResetPasswordClient() {
  const token = useSearchParams().get("token");

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

            <div>
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
            </button>

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

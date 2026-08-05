// components/layout/footer/SubscribeNewsletter.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import { useZodForm } from "@/hooks/useZodForm";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@/lib/validation/newsletter";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

type SubscribeNewsletterProps = {
  variant?: "light" | "dark";
};

const SubscribeNewsletter = ({
  variant = "light",
}: SubscribeNewsletterProps) => {
  const isDark = variant === "dark";
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(newsletterSchema, {
    email: "",
    privacyConsent: false,
  });

  const onSubmit = async (data: NewsletterFormData) => {
    setStatus(null);

    try {
      const res = await fetch("/api/newsletter_subscriber", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (result.success) {
        setStatus({
          type: "success",
          message: "Subscribed successfully. Thanks for subscribing!",
        });
        reset({ email: "", privacyConsent: false });
        return;
      }

      setStatus({
        type: "error",
        message: result.message || "Unable to subscribe. Please try again.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  if (isDark) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto w-full max-w-2xl space-y-4"
      >
        <div className="mx-auto flex w-full max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-3">
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className="h-12 w-full min-w-0 flex-1 rounded-full border border-white/15 bg-[#2a3038] px-6 text-sm text-white outline-none placeholder:text-white/45 focus:border-orange-400/70 focus:ring-2 focus:ring-orange-500/20 sm:max-w-[340px]"
            disabled={isSubmitting}
            aria-label="Email address"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-linear-to-r from-orange-500 to-orange-700 px-7 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(234,88,12,0.28)] transition hover:from-orange-400 hover:to-orange-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" strokeWidth={2} />
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </div>

        <label className="mx-auto flex w-full max-w-xl cursor-pointer items-center justify-center gap-2 text-center">
          <input
            type="checkbox"
            {...register("privacyConsent")}
            className="h-3.5 w-3.5 shrink-0 cursor-pointer rounded border-white/30 accent-orange-500"
            disabled={isSubmitting}
          />
          <span className="text-[11px] leading-relaxed text-white/40">
            I agree to receive the newsletter and to the{" "}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 underline underline-offset-2 hover:text-orange-300"
              onClick={(e) => e.stopPropagation()}
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        {errors.email && (
          <p className="text-center text-xs text-red-400">
            {getErrorMessage(errors.email)}
          </p>
        )}
        {errors.privacyConsent && (
          <p className="text-center text-xs text-red-400">
            {getErrorMessage(errors.privacyConsent)}
          </p>
        )}
        {status && (
          <p
            className={`text-center text-xs ${
              status.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.message}
          </p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-3">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-md w-full justify-between">
        <div className="flex items-center flex-1 px-3 py-2 text-gray-400 sm:py-0">
          <input
            {...register("email")}
            type="email"
            placeholder="Enter your email address"
            className="w-full outline-none py-3 px-3 text-sm text-gray-900"
            disabled={isSubmitting}
          />
        </div>

        <button
          className="bg-black text-white px-6 py-3 text-sm hover:bg-gray-800 duration-150 sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}
        </button>
      </div>

      <label className="flex items-start gap-2 cursor-pointer text-left">
        <input
          type="checkbox"
          {...register("privacyConsent")}
          className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded border-gray-300 accent-orange-500"
          disabled={isSubmitting}
        />
        <span className="text-xs leading-relaxed text-gray-800">
          I want to receive the Asian Spices newsletter and agree to the
          processing of my email as described in the{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-700 underline hover:text-orange-800"
            onClick={(e) => e.stopPropagation()}
          >
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {errors.email && (
        <p className="text-xs text-red-500">{getErrorMessage(errors.email)}</p>
      )}

      {errors.privacyConsent && (
        <p className="text-xs text-red-500">
          {getErrorMessage(errors.privacyConsent)}
        </p>
      )}

      {status && (
        <p
          className={`text-xs ${
            status.type === "success" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status.message}
        </p>
      )}
    </form>
  );
};

export default SubscribeNewsletter;

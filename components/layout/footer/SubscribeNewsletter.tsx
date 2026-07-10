"use client";

import React, { useState } from "react";
import { AiOutlineMail } from "react-icons/ai";
import { useZodForm } from "@/hooks/useZodForm";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@/lib/validation/newsletter";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

const SubscribeNewsletter = () => {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(newsletterSchema, { email: "" });

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
        reset();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col lg:flex-row bg-white rounded-xl overflow-hidden shadow-md w-full justify-between">
        <div className="flex items-center flex-1 px-3 py-2 text-gray-400 sm:py-0">
          <AiOutlineMail size={20} />

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

      {errors.email && (
        <p className="mt-2 text-xs text-red-500">
          {getErrorMessage(errors.email)}
        </p>
      )}

      {status && (
        <p
          className={`mt-2 text-xs ${
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

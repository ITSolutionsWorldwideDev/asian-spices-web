"use client";

import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useZodForm } from "@/hooks/useZodForm";
import { contactSchema, type ContactFormData } from "@/lib/validation/contact";
import { getErrorMessage } from "@/lib/form/getErrorMessage";

const ContactUsForm = () => {
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useZodForm(contactSchema, {
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const onSubmit = async (data: ContactFormData) => {
    setStatus(null);

    try {
      const res = await fetch("/api/contact", {
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
          message: "Message sent! We'll respond within 48 hours.",
        });
        reset();
        return;
      }

      setStatus({
        type: "error",
        message: result.message || "Unable to send your message. Please try again.",
      });
    } catch {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-[#1b0d07] font-serif">
        Send Us a Message
      </h2>
      <div className="mt-3 mb-6 h-1 w-12 bg-orange-500 rounded-full" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-xl shadow-md p-6 md:p-8"
      >
        <div className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="fullName"
              placeholder="Enter your full name"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-60"
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500">
                {getErrorMessage(errors.fullName)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-60"
              {...register("email")}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">
                {getErrorMessage(errors.email)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              placeholder="What is this regarding?"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-60"
              {...register("subject")}
            />
            {errors.subject && (
              <p className="mt-1 text-xs text-red-500">
                {getErrorMessage(errors.subject)}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="message"
              className="block text-sm font-bold text-gray-900 mb-2"
            >
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Tell us how we can help you..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none disabled:opacity-60"
              {...register("message")}
            />
            {errors.message && (
              <p className="mt-1 text-xs text-red-500">
                {getErrorMessage(errors.message)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
            <ArrowRight className="w-4 h-4" />
          </button>

          {status && (
            <p
              className={`text-sm text-center ${
                status.type === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {status.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default ContactUsForm;

// apps/web/components/layout/partner_registration/IdentityVerification.tsx

"use client";

import { useEffect, useRef, useState } from "react";
import ReadAloudBtn from "./ReadAloudBtn";
import { useLoaderStore } from "@/store/useLoaderStore";

const banks = [
  { name: "ABN AMRO", issuer: "ABNANL2A" },
  { name: "ING", issuer: "INGBNL2A" },
  { name: "Rabobank", issuer: "RABONL2U" },
  { name: "SNS Bank", issuer: "SNSBNL2A" },
  { name: "ASN Bank", issuer: "ASNBNL21" },
];

export default function IdentityVerification({
  activeStep,
  setActiveStep,
  formData,
  setCompletedSteps,
  completedSteps,
  setFormData,
}: any) {
  const selectedBank = formData.selected_bank;
  const { show, hide } = useLoaderStore();

  // 🔥 NEW STATE MACHINE
  const [verificationState, setVerificationState] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");

  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  /**
   * STEP 1: START IDIN
   */
  const handleIDIN = async () => {
    try {
      if (!selectedBank) {
        throw {
          message: "Please select a bank",
          code: "BANK_SELECTION",
        };
        // return;
      }

      setLoading(true);
      show("iDIN Verification in Process...");

      setVerificationState("pending");

      localStorage.setItem(
        "partner_registration",
        JSON.stringify({ formData, activeStep, completedSteps }),
      );

      // 1️⃣ create tenant
      const tenant_res = await fetch("/api/adyen/tenants/create", {
        method: "POST",
        body: JSON.stringify({
          name: formData.store_name,
          email: formData.email,
        }),
      });

      const tenant = await tenant_res.json();
      setTenantId(tenant.id);

      // 2️⃣ start IDIN
      const res = await fetch("/api/partner-registration/idin/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bank: selectedBank,
          tenantId: tenant.id,
        }),
      });

      const data = await res.json();

      // store for recovery
      localStorage.setItem(
        "idin_transaction",
        JSON.stringify({
          tenantId: tenant.id,
          transactionId: data.transactionId,
        }),
      );

      // 🚀 open bank in NEW TAB (best UX)
      window.open(data.redirectUrl, "_blank");

      // start polling
      startPolling(tenant.id);
    } catch (err: any) {
      console.error(err);
      setVerificationState("failed");
      setLoading(false);

      if (err.code === "BANK_SELECTION") {
        setApiError("Please select a bank");
      }
    } finally {
      hide();
    }
  };

  /**
   * STEP 2: POLLING (DB state via webhook)
   */
  const startPolling = (tenantId: string) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(async () => {
      try {
        show("Checking for iDIN satus...");
        const res = await fetch(
          `/api/partner-registration/idin/status?tenantId=${tenantId}`,
        );
        const data = await res.json();

        if (data.status === "success") {
          clearInterval(intervalRef.current!);
          setVerificationState("success");
          setLoading(false);

          setCompletedSteps((prev: number[]) => [
            ...new Set([...prev, activeStep]),
          ]);

          setActiveStep(activeStep + 1);
        }

        if (data.status === "failed") {
          clearInterval(intervalRef.current!);
          setVerificationState("failed");
          setLoading(false);
        }
      } catch (err) {
        console.error("poll error", err);
      } finally {
        hide();
      }
    }, 3000);
  };

  /**
   * CLEANUP
   */
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // const handleSubmit = async () => {
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // ✅ validation
    if (!formData.selected_bank) {
      throw {
        message: "Please select a bank",
        code: "BANK_SELECTION",
      };
    }

    try {
      show("Setting up for Partner Store Registration...");

      const response = await fetch("/api/partner-registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // save backend-generated ID
      setFormData((prev: any) => ({
        ...prev,
        application_id: data.application_id,
      }));

      // ✅ mark step complete
      setCompletedSteps((prev: number[]) => [
        ...new Set([...prev, activeStep]),
      ]);

      // ✅ move to next step ONLY once
      setActiveStep(activeStep + 1);

      localStorage.removeItem("partner_registration");
    } catch (err: any) {
      console.error("Error:", err);
      if (err.code === "BANK_SELECTION") {
        setApiError("Please select a bank");
      }
    } finally {
      hide();
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center p-6"
      id="identity-verification"
    >
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Identity Verification (iDIN)
          </h1>
          <p className="text-gray-500 mt-2">
            Verify your identity securely through your bank using iDIN.
          </p>
          <p className="text-blue-500 text-sm mt-2 cursor-pointer">
            <ReadAloudBtn ID={"identity-verification"} />
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-lg text-sm">
          <p className="font-semibold">What is iDIN?</p>
          <p className="mt-1">
            iDIN is a secure identification tool provided by Dutch banks. It
            allows you to verify your identity without sharing financial data or
            bank balances. This verification helps us prevent fraud and confirm
            that you have the legal authority to register this business.
          </p>
        </div>

        {/* Bank Selection */}
        <div>
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {apiError}
            </div>
          )}
          <p className="font-medium text-gray-700 mb-4">
            Select your bank <span className="text-red-500">*</span>
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.name}
                type="button" // ✅ prevent form submission
                onClick={() => {
                  // setSelectedBank(bank);
                  setFormData((prev: any) => ({
                    ...prev,
                    selected_bank: bank.issuer,
                  }));
                }}
                className={`border rounded-xl p-4 text-left transition hover:border-gray-400 ${
                  selectedBank === bank.issuer
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-300 bg-white"
                }`}
              >
                {bank.name}
              </button>
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <div>
          {/* <button
            disabled={!selectedBank}
            onClick={handleIDIN}
            type="button"
            className={`w-full py-3 rounded-lg text-white font-medium transition ${
              selectedBank
                ? "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            🛡 Verify with iDIN →
          </button> */}

          <p className="text-xs text-gray-400 text-center mt-2">
            You will be redirected to your bank's secure environment
          </p>
        </div>

        {/* Privacy Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-3">
          <h2 className="font-semibold text-gray-800">
            Your Privacy & Security:
          </h2>

          <ul className="text-sm text-gray-600 space-y-2">
            <li>✔ No financial data or account balances are shared</li>
            <li>✔ Only your legal name and identity are verified</li>
            <li>✔ Secure connection directly with your bank</li>
            <li>✔ GDPR compliant identity verification</li>
          </ul>
        </div>

        <div className=" mt-6 bg-white rounded-lg shadow-sm border border-[#E5E7EB] p-6">
          <div className="text-sm text-gray-600 space-y-2">
            <h2 className="font-semibold text-gray-800">Need Help?</h2>
            <p>
              If you have any questions about your registration or need
              assistance, our support team is here to help.
            </p>

            <div className="flex flex-wrap gap-4 text-orange-600">
              <span>✉ partners@asianspices.com</span>
              <span>📄 Registration FAQ</span>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-between">
          <button
            className="px-5 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setActiveStep(activeStep - 1)}
          >
            ← Back
          </button>

          <button
            type="button"
            disabled={!formData.selected_bank}
            className={`px-6 py-2 rounded-lg text-white transition ${
              selectedBank
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
            onClick={handleSubmit}
          >
            Submit Partner Registration →
          </button>
        </div>
      </div>
    </div>
  );
}

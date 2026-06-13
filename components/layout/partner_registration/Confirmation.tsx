"use client";

import Link from "next/link";
import ReadAloudBtn from "./ReadAloudBtn";
// import { object } from "prop-types";

export default function Confirmation({ formData }: any) {
  return (
    <div
      className="min-h-screen bg-gray-100 flex justify-center p-6"
      id="confirmation"
    >
      {Object.keys(formData).length > 0 ? (
        <div className="w-full max-w-3xl space-y-8">
          {/* Success Icon + Title */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-3xl text-green-600">✓</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Thank You! Registration Submitted Successfully!
            </h1>

            <p className="text-gray-500">
              Thank you for joining us. We have received your application and
              documents.
              <br />
              Short onboarding time within
              <span className="font-semibold text-gray-700">
                {" "}
                2 working days
              </span>
              .
            </p>
            <ReadAloudBtn ID={"confirmation"} />
          </div>

          {/* Confirmation Email Box */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-sm text-orange-700">
            <p className="font-semibold">✉ Confirmation Email Sent</p>
            <p className="mt-1">
              A confirmation email has been sent to:{" "}
              {formData.business_email_address}
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <p className="text-sm text-blue-700 font-medium">
              Your Application ID
            </p>

            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-blue-900 tracking-wide">
                {formData.application_id}
              </h2>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(formData.application_id);
                }}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Copy
              </button>
            </div>

            <p className="text-xs text-blue-600 mt-2">
              Use this ID to track your application status.
            </p>
          </div>

          {/* Registration Summary */}
          <div className="bg-white rounded-xl border shadow-sm">
            <div className="p-4 border-b font-semibold text-gray-800">
              Registration Summary
            </div>

            <div className="divide-y text-sm text-gray-600">
              <div className="flex justify-between p-4">
                <span>Company Name:</span>
                <span className="font-medium text-gray-800">
                  {formData.company_name}
                </span>
              </div>

              <div className="flex justify-between p-4">
                <span>KVK Number:</span>
                <span>{formData.kvk_number}</span>
              </div>

              <div className="flex justify-between p-4">
                <span>Contact Person:</span>
                <span>
                  {formData.first_name} {formData.middle_name}{" "}
                  {formData.last_name}
                </span>
              </div>

              <div className="flex justify-between p-4">
                <span>Email:</span>
                <span>{formData.business_email_address}</span>
              </div>

              <div className="flex justify-between p-4">
                <span>Phone:</span>
                <span>{formData.business_phone_number}</span>
              </div>

              <div className="flex justify-between p-4">
                <span>VAT Number:</span>
                <span>{formData.vat_number}</span>
              </div>

              <div className="flex justify-between p-4">
                <span>Delivery Countries:</span>
                <span>{formData.country}</span>
              </div>
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 space-y-4">
            <h2 className="font-semibold text-gray-800">What happens next?</h2>

            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                  1
                </div>
                <div>
                  <p className="font-medium">Document Review</p>
                  <p className="text-gray-500">
                    Our team will review your Chamber of Commerce extract and
                    other submitted documents.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                  2
                </div>
                <div>
                  <p className="font-medium">Identity Verification</p>
                  <p className="text-gray-500">
                    We'll verify your iDIN authentication and match it with the
                    provided company details.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs">
                  3
                </div>
                <div>
                  <p className="font-medium">Account Activation</p>
                  <p className="text-gray-500">
                    Once approved, you'll receive an email with your login
                    credentials and next steps to start selling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help */}

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

          {/* Buttons */}
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/">
              <button className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition">
                ⬅ Back to Homepage
              </button>
            </Link>

            <Link href="/partnerplatform">
              <button className="px-6 py-2 rounded-lg border text-gray-700 hover:bg-gray-100 transition">
                📄 View Partner Platform
              </button>
            </Link>
          </div>

          {/* Footer Small Text */}
          <div className="text-center text-xs text-gray-400">
            <p>
              Registration Reference:{" "}
              <span className="font-semibold text-gray-700">
                {formData.application_id}
              </span>
            </p>

            <p>
              Registration Date:{" "}
              {formData.submitted_at
                ? new Date(formData.submitted_at).toLocaleDateString()
                : "-"}
            </p>

            {/* <p>Registration Reference: PR-78987142</p>
            <p>Registration Date: 20 February 2026</p> */}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            No Data Submitted please go back and fill the form.
          </h1>
        </div>
      )}
    </div>
  );
}

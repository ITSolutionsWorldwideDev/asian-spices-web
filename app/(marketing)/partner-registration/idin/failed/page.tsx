// app/partner-registration/idin/failed/page.tsx

"use client";

export default function FailedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          ❌ Verification Failed
        </h1>

        <p className="text-gray-600 mb-6">
          We couldn’t verify your identity.
        </p>

        <p className="text-sm text-gray-500">
          Please return to the previous tab and try again.
        </p>

        <button
          onClick={() => window.close()}
          className="mt-6 px-6 py-2 bg-gray-600 text-white rounded-lg"
        >
          Close this tab
        </button>
      </div>
    </div>
  );
}
// apps/web/app/partner-registration/idin/success/page.tsx

"use client";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ✅ Verification Completed
        </h1>

        <p className="text-gray-600 mb-6">
          Your identity verification was successful.
        </p>

        <p className="text-sm text-gray-500">
          You can now return to the previous tab and continue registration.
        </p>

        <button
          onClick={() => window.close()}
          className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-lg"
        >
          Close this tab
        </button>
      </div>
    </div>
  );
}
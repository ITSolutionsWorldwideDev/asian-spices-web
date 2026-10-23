import { AlertTriangle } from "lucide-react";

type ErrorBannerProps = {
  message: string;
  onRetry: () => void;
  disabled?: boolean;
};

export function ErrorBanner({
  message,
  onRetry,
  disabled = false,
}: ErrorBannerProps) {
  return (
    <div className="mx-4 mt-4 rounded-[1.6rem] border border-[rgba(184,84,49,0.18)] bg-[rgba(184,84,49,0.08)] p-4 sm:mx-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-[var(--paprika)]" />
          <div>
            <p className="text-sm font-semibold text-[var(--foreground)]">
              Message delivery failed
            </p>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
              {message}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRetry}
          disabled={disabled}
          className="rounded-full bg-[var(--paprika)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#9f4528] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Retry
        </button>
      </div>
    </div>
  );
}

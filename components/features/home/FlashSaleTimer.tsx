"use client";

import React, { useState, useEffect } from "react";

interface FlashSaleTimerProps {
  startDate?: string;
  endDate?: string;
  /** When set, the countdown repeats every N days and never exceeds it. */
  cycleDays?: number;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const splitDiff = (diff: number): TimeLeft => ({
  days: Math.floor(diff / (1000 * 60 * 60 * 24)),
  hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
  minutes: Math.floor((diff / 1000 / 60) % 60),
  seconds: Math.floor((diff / 1000) % 60),
});

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({
  startDate,
  endDate,
  cycleDays,
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimeUp, setIsTimeUp] = useState(false);

  const formatTime = (time: number) => (time < 10 ? `0${time}` : String(time));

  useEffect(() => {
    const cycleMs = cycleDays ? cycleDays * 24 * 60 * 60 * 1000 : 0;

    const calculateTimeLeft = (): TimeLeft => {
      const now = Date.now();

      // Rolling window: restarts automatically, so days never grow past cycleDays
      if (cycleMs > 0) {
        const anchor = startDate ? new Date(startDate).getTime() : 0;
        const elapsed = now - anchor;
        const remaining = cycleMs - (((elapsed % cycleMs) + cycleMs) % cycleMs);
        return splitDiff(remaining);
      }

      const start = startDate ? new Date(startDate).getTime() : now;
      if (now < start) return splitDiff(start - now);

      const end = endDate ? new Date(endDate).getTime() : now;
      const diff = end - now;

      if (diff <= 0) {
        setIsTimeUp(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return splitDiff(diff);
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate, cycleDays]);

  if (isTimeUp) {
    return (
      <div className="rounded-lg px-3 py-2 text-center text-base font-bold text-white sm:text-lg">
        Time&apos;s up — sale ended
      </div>
    );
  }

  const units = ["DAYS", "HOURS", "MINUTES", "SECONDS"] as const;

  return (
    <div className="flex items-center justify-center gap-1 sm:gap-1.5 md:gap-2">
      {units.map((label, idx) => {
        const value =
          label === "DAYS"
            ? timeLeft.days
            : label === "HOURS"
              ? timeLeft.hours
              : label === "MINUTES"
                ? timeLeft.minutes
                : timeLeft.seconds;
        return (
          <React.Fragment key={label}>
            <TimerBox value={formatTime(value)} label={label} />
            {idx < 3 && <Colon />}
          </React.Fragment>
        );
      })}
    </div>
  );
};

function TimerBox({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex min-w-[2.6rem] flex-col items-center justify-center rounded-md bg-neutral-900/85 px-1.5 py-1.5 shadow-md sm:min-w-[3.25rem] sm:rounded-lg sm:px-2.5 sm:py-2 md:min-w-[3.75rem] md:px-3 md:py-2.5">
      <div className="text-base font-bold leading-none text-white tabular-nums sm:text-xl md:text-2xl">
        {value}
      </div>
      <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-wider text-white/80 sm:mt-1 sm:text-[9px] md:text-[10px]">
        {label}
      </div>
    </div>
  );
}

function Colon() {
  return (
    <span className="pb-2 text-base font-light leading-none text-white/90 sm:pb-3 sm:text-xl md:text-2xl">
      :
    </span>
  );
}

"use client";

import React, { useState, useEffect } from "react";

interface FlashSaleTimerProps {
  startDate?: string;
  endDate: string;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({
  startDate,
  endDate,
}) => {
  const start = startDate ? new Date(startDate) : new Date();
  const end = new Date(endDate);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimeUp, setIsTimeUp] = useState(false);

  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();

    // Count down to start if sale hasn't begun yet
    if (now < start) {
      return splitDiff(start.getTime() - now.getTime());
    }

    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      setIsTimeUp(true);
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return splitDiff(diff);
  };

  const splitDiff = (diff: number): TimeLeft => ({
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  });

  const formatTime = (time: number) => (time < 10 ? `0${time}` : String(time));

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [startDate, endDate]);

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

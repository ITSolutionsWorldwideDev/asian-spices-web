// components/FlashSaleTimer.tsx
"use client";

import React, { useState, useEffect } from "react";

interface FlashSaleTimerProps {
  startDate?: string; // optional ISO string from backend
  endDate: string; // required ISO string from backend
}

export const FlashSaleTimer: React.FC<FlashSaleTimerProps> = ({
  startDate,
  endDate,
}) => {
  const start = startDate ? new Date(startDate) : new Date(); // default to now

  const end = new Date(endDate);

  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isNotStarted, setIsNotStarted] = useState(false);

  const calculateTimeLeft = () => {
    const now = new Date();

    // Sale not started yet
    if (now < start) {
      setIsNotStarted(true);
      const diff = start.getTime() - now.getTime();

      return {
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    }

    setIsNotStarted(false);

    const diff = +end - +now;

    if (diff <= 0) {
      setIsTimeUp(true);
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const formatTime = (time: number) => (time < 10 ? `0${time}` : time);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [start, end]);

  if (isTimeUp) {
    return (
      <div className="text-center text-3xl font-bold text-white p-6 rounded-lg shadow-2xl">
        🎉 TIME'S UP! Sales End! 🎉
      </div>
    );
  }

  if (isNotStarted) {
    return (
      <div className="flex justify-center items-center mt-8 rounded-lg">
        <div className="flex flex-col items-center justify-center p-3 backdrop-blur-sm bg-white/30 rounded-lg">
          <div className="text-5xl font-bold text-white">
            ⏳ Sale starts in {formatTime(timeLeft.hours)}hours:
          </div>
          <div className="text-xs sm:text-sm font-semibold text-white mt-1 opacity-80 uppercase tracking-wider">
            {formatTime(timeLeft.minutes)} minutes and{" "}
            {formatTime(timeLeft.seconds)} secounds
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center mt-8 rounded-lg">
      {["HOURS", "MINUTES", "SECONDS"].map((label, idx) => {
        const value =
          label === "HOURS"
            ? timeLeft.hours
            : label === "MINUTES"
              ? timeLeft.minutes
              : timeLeft.seconds;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center justify-center p-3 backdrop-blur-sm bg-white/30 rounded-lg">
              <div className="text-5xl font-bold text-white">
                {formatTime(value)}
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white mt-1 opacity-80 uppercase tracking-wider">
                {label}
              </div>
            </div>
            {idx < 2 && (
              <span className="text-7xl font-extralight text-white opacity-90 mx-1 sm:mx-2 -mt-4">
                :
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

import React, { useState, useEffect } from "react";

export interface TimeElapsed {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  yearSuffix: string;
  monthSuffix: string;
  daySuffix: string;
  hourSuffix: string;
  minuteSuffix: string;
}

export const defaultTimeElapsed: TimeElapsed = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  yearSuffix: "",
  monthSuffix: "",
  daySuffix: "",
  hourSuffix: "",
  minuteSuffix: "",
};

const useCountUpTimer = (eventDate: Date) => {
  const [timeElapsed, setTimeElapsed] =
    useState<TimeElapsed>(defaultTimeElapsed);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const difference = currentTime - eventDate.getTime();
      const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365));
      const months = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30)
      );
      const days = Math.floor(
        (difference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24)
      );
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Compute suffixes
      const yearSuffix = years > 1 ? "years" : "year";
      const monthSuffix = months > 1 ? "months" : "month";
      const daySuffix = days > 1 ? "days" : "day";
      const hourSuffix = hours > 1 ? "hours" : "hour";
      const minuteSuffix = minutes > 1 ? "minutes" : "minute";

      const timeSinceEvent = {
        years,
        months,
        days,
        hours,
        minutes,
        seconds,
        yearSuffix,
        monthSuffix,
        daySuffix,
        hourSuffix,
        minuteSuffix,
      };
      setTimeElapsed(timeSinceEvent);
    }, 1000);

    return () => clearInterval(timer);
  }, [eventDate]);

  return timeElapsed;
};

export default useCountUpTimer;

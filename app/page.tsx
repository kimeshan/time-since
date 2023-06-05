"use client";

import React, { useEffect, useState } from "react";
import useCountUpTimer, {
  defaultTimeElapsed,
} from "@/components/hooks/useCountUpTimer";
import Link from "next/link";

export default function Home() {
  // Man United's last title: 22 April 2013
  const eventDate = new Date("2013-04-22 13:00:00");
  const timeElapsed = useCountUpTimer(eventDate);
  // Use the timeElapsed value in your main component state or wherever needed
  const [countUpTime, setCountUpTime] = useState(defaultTimeElapsed);

  // Update countUpTime whenever timeElapsed changes
  useEffect(() => {
    setCountUpTime(timeElapsed);
  }, [timeElapsed]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl lg:text-8xl md:text-6xl font-bold p-3 md:p-10 text-center text-gray-700">
        Time Since
      </h1>
      <h2 className="text-3xl lg:text-6xl md:text-4xl font-bold p-1 md:p-10 text-center text-red-600">
        Manchester United last won the league
      </h2>

      {countUpTime === defaultTimeElapsed ? (
        <progress className="progress progress-success w-56"></progress>
      ) : (
        <div className="stats shadow-2xl m-2 lg:m-10 stats-vertical lg:stats-horizontal  text-center">
          <div className="stat w-80 md:w-100 ">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.years}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-700 p-2">
              {countUpTime.yearSuffix}
            </div>
          </div>
          <div className="stat w-80 lg:w-1/6">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.months}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-600 p-2">
              {countUpTime.monthSuffix}
            </div>
          </div>
          <div className="stat w-80 lg:w-1/6">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.days}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-500 p-2">
              {countUpTime.daySuffix}
            </div>
          </div>
          <div className="stat w-80 lg:w-1/6">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.hours}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-400 p-2">
              {countUpTime.hourSuffix}
            </div>
          </div>
          <div className="stat w-80 lg:w-1/6">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.minutes}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-300 p-2">
              {countUpTime.minuteSuffix}
            </div>
          </div>
          <div className="stat w-80 lg:w-1/6">
            <div className="stat-value text-3xl md:text-7xl">
              {countUpTime.seconds}
            </div>
            <div className="stat-desc text-2xl md:text-4xl text-red-200 p-2">
              seconds
            </div>
          </div>
        </div>
      )}

      <div className="p-2 md:p-20">
        <div className="divider"></div>
        <div className="p-2">
          This is an open source project created and maintained freely by&nbsp;
          <Link
            className="link link-accent"
            target="_blank"
            href="https://kimeshan.com"
          >
            Kimeshan Naidoo
          </Link>
          &nbsp;and&nbsp;
          <Link
            className="link link-accent"
            target="_blank"
            href="https://naidoonotes.com"
          >
            Naidoo Notes
          </Link>
          . If you like this, please consider contributing.
        </div>
        <div className="p-2">
          <Link
            className="btn btn-outline btn-primary"
            target="_blank"
            href="https://buy.stripe.com/aEU16EgQ80ivaUE288"
          >
            Contribute 💵
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import useCountUpTimer, {
  defaultTimeElapsed,
} from "@/components/hooks/useCountUpTimer";

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
      <h1 className="text-4xl lg:text-8xl md:text-6xl font-bold p-5 md:p-10 text-center text-gray-700">
        Time Since
      </h1>
      <h2 className="text-3xl lg:text-6xl md:text-4xl font-bold p-5 md:p-10 text-center text-red-600">
        Manchester United last won the league
      </h2>

      <div className="stats shadow-2xl m-5 lg:m-10 stats-vertical lg:stats-horizontal  text-center">
        <div className="stat w-80 md:w-100">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.years}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-700 p-2">
            {countUpTime.yearSuffix}
          </div>
        </div>
        <div className="stat w-80 lg:w-1/6">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.months}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-600 p-2">
            {countUpTime.monthSuffix}
          </div>
        </div>
        <div className="stat w-80 lg:w-1/6">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.days}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-500 p-2">
            {countUpTime.daySuffix}
          </div>
        </div>
        <div className="stat w-80 lg:w-1/6">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.hours}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-400 p-2">
            {countUpTime.hourSuffix}
          </div>
        </div>
        <div className="stat w-80 lg:w-1/6">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.minutes}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-300 p-2">
            {countUpTime.minuteSuffix}
          </div>
        </div>
        <div className="stat w-80 lg:w-1/6">
          <div className="stat-value text-4xl md:text-7xl">
            {countUpTime.seconds}
          </div>
          <div className="stat-desc text-2xl md:text-4xl text-red-200 p-2">
            seconds
          </div>
        </div>
      </div>
    </div>
  );
}

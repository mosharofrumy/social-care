"use client";

import * as React from "react";

import { todayISO } from "@/lib/api";

export function useTodayISO() {
  const [today, setToday] = React.useState(todayISO);

  React.useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    function scheduleNextDay() {
      const now = new Date();
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

      timeout = setTimeout(() => {
        setToday(todayISO());
        scheduleNextDay();
      }, nextMidnight.getTime() - now.getTime());
    }

    function syncToday() {
      setToday((current) => {
        const currentDate = todayISO();
        return current === currentDate ? current : currentDate;
      });
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        syncToday();
        clearTimeout(timeout);
        scheduleNextDay();
      }
    }

    scheduleNextDay();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return today;
}

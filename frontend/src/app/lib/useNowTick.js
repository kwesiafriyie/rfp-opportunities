"use client";
import { useEffect, useState } from "react";

// A single shared "clock" a page can tick off of instead of every card
// running its own setInterval -- countdowns and the open/expired filter
// both recompute from this on every tick, so an opportunity whose deadline
// passes while the tab is open disappears live, without waiting for a
// refetch from the backend.
export default function useNowTick(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}

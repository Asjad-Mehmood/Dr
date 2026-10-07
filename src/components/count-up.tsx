"use client";

import { useEffect, useRef } from "react";

// Renders the final number on the server; counts up from zero when it first
// scrolls into view (skipped for visitors who prefer reduced motion).
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || value === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const format = (n: number) => n.toLocaleString("en-US");
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / 1200);
        el.textContent = format(Math.round(value * (1 - (1 - t) ** 3)));
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return <span ref={ref}>{value.toLocaleString("en-US")}</span>;
}

"use client";

import { animate, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useInViewOnce } from "../lib/motion";

export interface NumberTickerProps {
  value: number;
  /** Starting value. */
  from?: number;
  /** Seconds. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Locale for thousands separators, e.g. "en-IN". */
  locale?: string;
  className?: string;
}

/** Counts up (or down) to a number when it scrolls into view, and re-animates when `value` changes. */
export function NumberTicker({
  value,
  from = 0,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
  locale,
  className,
}: NumberTickerProps) {
  const reduce = useReducedMotion();
  const [ref, inView] = useInViewOnce<HTMLSpanElement>();
  const current = useRef(from);
  const format = (n: number) =>
    prefix + n.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;

  useEffect(() => {
    const element = ref.current;
    if (!element || !inView) return;
    if (reduce) {
      element.textContent = format(value);
      current.current = value;
      return;
    }
    const controls = animate(current.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        current.current = latest;
        element.textContent = format(latest);
      },
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, inView, reduce, duration, decimals, prefix, suffix, locale]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: "tabular-nums" }}>
      {format(from)}
    </span>
  );
}

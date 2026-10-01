"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { cn } from "../lib/cn";
import type { Status } from "../status-dot";

export interface UptimeDay {
  status: Status | "nodata";
  /** Shown in the tooltip, e.g. "Sep 12". */
  label?: string;
  /** Shown in the tooltip, e.g. "12 min downtime". */
  note?: string;
}

export interface UptimeBarProps {
  days: UptimeDay[];
  /** Bar height in px. */
  height?: number;
  className?: string;
}

const fills: Record<UptimeDay["status"], string> = {
  online: "#22c55e",
  degraded: "#f59e0b",
  offline: "#ef4444",
  maintenance: "#3b82f6",
  nodata: "var(--iw-border)",
};

/** A status-page style row of daily bars that grow in one after another, with hover details. */
export function UptimeBar({ days, height = 32, className }: UptimeBarProps) {
  const reduce = useReducedMotion();
  const [hover, setHover] = useState<number | null>(null);
  const up = days.filter((d) => d.status === "online").length;
  const counted = days.filter((d) => d.status !== "nodata").length || 1;
  const active = hover === null ? null : days[hover];

  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-end gap-[2px]" style={{ height }} onMouseLeave={() => setHover(null)}>
        {days.map((day, i) => (
          <motion.div
            key={i}
            className="h-full flex-1 cursor-default rounded-[2px]"
            style={{ background: fills[day.status], originY: 1, opacity: hover === null || hover === i ? 1 : 0.45 }}
            initial={reduce ? false : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ delay: reduce ? 0 : i * 0.012, duration: 0.3 }}
            onMouseEnter={() => setHover(i)}
            aria-label={`${day.label ?? `Day ${i + 1}`}: ${day.status}`}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between gap-4 text-xs text-muted-foreground">
        <span>{active ? `${active.label ?? `Day ${(hover ?? 0) + 1}`} · ${active.note ?? active.status}` : `${days.length} days ago`}</span>
        <span>{((up / counted) * 100).toFixed(2)}% uptime</span>
      </div>
    </div>
  );
}

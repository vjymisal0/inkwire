"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  /** Shade the area under the line. */
  fill?: boolean;
  strokeWidth?: number;
  /** Draw a pulsing dot on the latest value. */
  showLast?: boolean;
  /** Fix the y-range instead of fitting the data. */
  min?: number;
  max?: number;
  className?: string;
}

/** A tiny trend line that draws itself in and morphs smoothly when `data` changes. Feed it live metrics. */
export function Sparkline({
  data,
  width = 160,
  height = 40,
  color = "var(--iw-primary)",
  fill = true,
  strokeWidth = 1.75,
  showLast = true,
  min,
  max,
  className,
}: SparklineProps) {
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const pad = strokeWidth + 3;
  const lo = min ?? Math.min(...data);
  const hi = max ?? Math.max(...data);
  const span = hi - lo || 1;
  const points = data.map((v, i) => [
    pad + (i / Math.max(1, data.length - 1)) * (width - pad * 2),
    height - pad - ((v - lo) / span) * (height - pad * 2),
  ]);
  const line = points.map(([x, y], i) => `${i ? "L" : "M"}${x!.toFixed(2)},${y!.toFixed(2)}`).join(" ");
  const area = `${line} L${width - pad},${height} L${pad},${height} Z`;
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`spark-${id}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.35} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {fill && <motion.path d={area} fill={`url(#spark-${id})`} animate={{ d: area }} transition={{ duration: reduce ? 0 : 0.45 }} />}
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1, d: line }}
        transition={{ pathLength: { duration: 1.1, ease: "easeOut" }, d: { duration: reduce ? 0 : 0.45 } }}
      />
      {showLast && last && (
        <g>
          <circle cx={last[0]} cy={last[1]} r={2.75} fill={color} />
          {!reduce && <circle cx={last[0]} cy={last[1]} r={2.75} fill={color} className="iw-ping" style={{ transformOrigin: `${last[0]}px ${last[1]}px` }} />}
        </g>
      )}
    </svg>
  );
}

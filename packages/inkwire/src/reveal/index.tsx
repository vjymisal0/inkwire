"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

export interface RevealProps {
  children: ReactNode;
  /** Direction the content travels in from. */
  from?: "up" | "down" | "left" | "right" | "none";
  /** Distance travelled, in px. */
  distance?: number;
  /** Start blurred and sharpen into focus. */
  blur?: boolean;
  delay?: number;
  duration?: number;
  /** Replay every time it re-enters the viewport. */
  repeat?: boolean;
  className?: string;
}

const offsets = { up: [0, 1], down: [0, -1], left: [1, 0], right: [-1, 0], none: [0, 0] } as const;

/** Fades (and optionally slides and un-blurs) its children in when scrolled into view. */
export function Reveal({
  children,
  from = "up",
  distance = 24,
  blur = true,
  delay = 0,
  duration = 0.6,
  repeat = false,
  className,
}: RevealProps) {
  const reduce = useReducedMotion();
  const [dx, dy] = offsets[from];
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, x: dx * distance, y: dy * distance, filter: blur ? "blur(8px)" : "blur(0px)" }}
      whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
      viewport={{ once: !repeat, amount: 0.3 }}
      transition={{ duration, delay, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

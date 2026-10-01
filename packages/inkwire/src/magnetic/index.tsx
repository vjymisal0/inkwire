"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

export interface MagneticProps {
  children: ReactNode;
  /** 0–1: how far the element follows the cursor. */
  strength?: number;
  className?: string;
}

/** Wraps anything (usually a button) so it is pulled toward the cursor and springs back on leave. */
export function Magnetic({ children, strength = 0.35, className }: MagneticProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 15, mass: 0.4 });

  const move = (event: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * strength);
    y.set((event.clientY - rect.top - rect.height / 2) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div className={className} style={{ x: sx, y: sy, display: "inline-block" }} onMouseMove={move} onMouseLeave={leave}>
      {children}
    </motion.div>
  );
}

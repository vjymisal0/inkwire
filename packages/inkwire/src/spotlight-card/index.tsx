"use client";

import { useRef, type HTMLAttributes, type MouseEvent } from "react";
import { cn } from "../lib/cn";

export interface SpotlightCardProps extends HTMLAttributes<HTMLDivElement> {
  /** Colour of the glow that follows the cursor. */
  spotlightColor?: string;
  /** Radius of the glow, in px. */
  size?: number;
}

/** A card with a soft glow that tracks the cursor. Uses CSS variables, so it never re-renders on move. */
export function SpotlightCard({
  spotlightColor = "color-mix(in oklab, var(--iw-primary) 28%, transparent)",
  size = 320,
  className,
  children,
  onMouseMove,
  style,
  ...rest
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--iw-x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--iw-y", `${event.clientY - rect.top}px`);
    onMouseMove?.(event);
  };
  return (
    <div
      ref={ref}
      onMouseMove={move}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-background",
        className,
      )}
      style={style}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${size}px circle at var(--iw-x, 50%) var(--iw-y, 50%), ${spotlightColor}, transparent 70%)`,
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}

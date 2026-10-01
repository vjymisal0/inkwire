import type { CSSProperties, HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface BorderBeamProps extends HTMLAttributes<HTMLDivElement> {
  /** Seconds per lap. */
  duration?: number;
  colorFrom?: string;
  colorTo?: string;
  /** Border thickness in px. */
  borderWidth?: number;
  /** Corner radius, any CSS length. */
  radius?: string;
}

/** A container whose border has a bright beam of light travelling around it. */
export function BorderBeam({
  duration = 6,
  colorFrom = "var(--iw-primary)",
  colorTo = "#22d3ee",
  borderWidth = 1.5,
  radius = "1rem",
  className,
  style,
  children,
  ...rest
}: BorderBeamProps) {
  const vars = {
    "--iw-duration": `${duration}s`,
    "--iw-from": colorFrom,
    "--iw-to": colorTo,
    "--iw-border-width": `${borderWidth}px`,
    borderRadius: radius,
    ...style,
  } as CSSProperties;
  return (
    <div className={cn("relative border border-border bg-background", className)} style={vars} {...rest}>
      <div aria-hidden="true" className="iw-beam pointer-events-none absolute inset-[-1px]" style={{ borderRadius: radius }} />
      <div className="relative">{children}</div>
    </div>
  );
}

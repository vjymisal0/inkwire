import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface MarqueeProps {
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  reverse?: boolean;
  vertical?: boolean;
  pauseOnHover?: boolean;
  /** Fade the edges out. */
  fade?: boolean;
  /** Space between items, any CSS length. */
  gap?: string;
  className?: string;
}

/** Infinitely scrolling row (or column) of items. Pure CSS, so it costs nothing on the main thread. */
export function Marquee({
  children,
  duration = 30,
  reverse = false,
  vertical = false,
  pauseOnHover = true,
  fade = true,
  gap = "2rem",
  className,
}: MarqueeProps) {
  const style = { "--iw-duration": `${duration}s`, "--iw-gap": gap } as CSSProperties;
  const mask = vertical
    ? "linear-gradient(to bottom, transparent, black 12%, black 88%, transparent)"
    : "linear-gradient(to right, transparent, black 12%, black 88%, transparent)";
  return (
    <div
      className={cn("iw-marquee group flex overflow-hidden", vertical ? "flex-col" : "flex-row", className)}
      style={{ ...style, gap, maskImage: fade ? mask : undefined, WebkitMaskImage: fade ? mask : undefined }}
      data-paused-on-hover={pauseOnHover || undefined}
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className={cn(
            "flex shrink-0 justify-around",
            vertical ? "flex-col iw-marquee-y" : "flex-row iw-marquee-x",
            reverse && "iw-marquee-reverse",
          )}
          style={{ gap }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}

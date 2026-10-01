import type { CSSProperties, ReactNode } from "react";
import { cn } from "../lib/cn";

export interface GradientTextProps {
  children: ReactNode;
  /** Colour stops; the first is repeated at the end so the loop is seamless. */
  colors?: string[];
  /** Seconds per full sweep. 0 disables the animation. */
  speed?: number;
  className?: string;
}

/** Text filled with a gradient that slowly sweeps across it. */
export function GradientText({
  children,
  colors = ["#7c3aed", "#ec4899", "#f59e0b", "#06b6d4"],
  speed = 6,
  className,
}: GradientTextProps) {
  const stops = [...colors, colors[0]].join(", ");
  const style = {
    backgroundImage: `linear-gradient(90deg, ${stops})`,
    "--iw-speed": `${speed}s`,
  } as CSSProperties;
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-size-[200%_100%]",
        speed > 0 && "iw-gradient-pan",
        className,
      )}
      style={style}
    >
      {children}
    </span>
  );
}

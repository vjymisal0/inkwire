import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from "react";
import { cn } from "../lib/cn";

export interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Colour of the light sweeping across the button. */
  shimmerColor?: string;
  /** Background of the button. */
  background?: string;
  /** Seconds per sweep. */
  duration?: number;
}

/** A pill button with a band of light that sweeps across it on a loop. */
export const ShimmerButton = forwardRef<HTMLButtonElement, ShimmerButtonProps>(function ShimmerButton(
  { shimmerColor = "rgba(255,255,255,0.55)", background = "var(--iw-primary)", duration = 2.6, className, style, children, ...rest },
  ref,
) {
  const vars = { "--iw-shimmer": shimmerColor, "--iw-duration": `${duration}s`, background, ...style } as CSSProperties;
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "iw-root iw-shimmer relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-5 py-2.5",
        "text-sm font-medium text-primary-foreground transition-transform duration-200 active:scale-[0.97]",
        "shadow-[0_8px_24px_-10px_var(--iw-primary)] disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      style={vars}
      {...rest}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </button>
  );
});

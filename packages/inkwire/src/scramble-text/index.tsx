"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion, useInViewOnce } from "../lib/motion";

export interface ScrambleTextProps {
  text: string;
  /** Total time to resolve the text, in ms. */
  duration?: number;
  /** Characters used for the noise. */
  characters?: string;
  /** Replay the effect on hover. */
  scrambleOnHover?: boolean;
  className?: string;
}

const DEFAULT_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}=+*^?#";

/** Decodes text from random glyphs, left to right, when it scrolls into view. */
export function ScrambleText({
  text,
  duration = 900,
  characters = DEFAULT_CHARS,
  scrambleOnHover = true,
  className,
}: ScrambleTextProps) {
  const reduce = usePrefersReducedMotion();
  const [ref, inView] = useInViewOnce<HTMLSpanElement>();
  const [output, setOutput] = useState(text);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (reduce || !inView) {
      setOutput(text);
      return;
    }
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      setOutput(
        text
          .split("")
          .map((char, i) =>
            i < settled || char === " " ? char : characters[Math.floor(Math.random() * characters.length)],
          )
          .join(""),
      );
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, duration, characters, reduce, inView, run]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      onMouseEnter={scrambleOnHover ? () => setRun((r) => r + 1) : undefined}
    >
      <span aria-hidden="true">{output}</span>
    </span>
  );
}

"use client";

import { useEffect, useState, type ReactNode } from "react";
import { cn } from "../lib/cn";
import { useInViewOnce, usePrefersReducedMotion } from "../lib/motion";

export type TerminalLine =
  | string
  | {
      text: string;
      /** "command" lines are typed out after a prompt; "output" lines appear at once. */
      type?: "command" | "output";
      /** Colour for this line. */
      color?: string;
    };

export interface TerminalProps {
  lines: TerminalLine[];
  title?: string;
  prompt?: ReactNode;
  /** Ms per typed character. */
  typeSpeed?: number;
  /** Ms between lines. */
  lineDelay?: number;
  /** Start over after finishing. */
  loop?: boolean;
  className?: string;
}

const normalize = (line: TerminalLine) =>
  typeof line === "string" ? { text: line, type: "command" as const } : { type: "command" as const, ...line };

/** A macOS-style terminal window that types out commands and prints their output. */
export function Terminal({
  lines,
  title = "zsh",
  prompt = "$",
  typeSpeed = 35,
  lineDelay = 450,
  loop = false,
  className,
}: TerminalProps) {
  const reduce = usePrefersReducedMotion();
  const [ref, inView] = useInViewOnce<HTMLDivElement>();
  const items = lines.map(normalize);
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const done = lineIndex >= items.length;

  useEffect(() => {
    if (!inView || reduce) return;
    if (done) {
      if (!loop) return;
      const t = setTimeout(() => {
        setLineIndex(0);
        setCharIndex(0);
      }, 2400);
      return () => clearTimeout(t);
    }
    const line = items[lineIndex]!;
    if (line.type === "output" || charIndex >= line.text.length) {
      const t = setTimeout(() => {
        setLineIndex((i) => i + 1);
        setCharIndex(0);
      }, line.type === "output" ? lineDelay / 2 : lineDelay);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIndex((c) => c + 1), typeSpeed);
    return () => clearTimeout(t);
  }, [inView, reduce, done, loop, lineIndex, charIndex, items, lineDelay, typeSpeed]);

  const visible = reduce ? items : items.slice(0, lineIndex + 1);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] text-left font-mono text-[13px] leading-relaxed text-[#e6edf3] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.6)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-white/45">{title}</span>
      </div>
      <div className="min-h-[8rem] p-4" aria-live="polite">
        {visible.map((line, i) => {
          const typing = !reduce && i === lineIndex && line.type === "command";
          const text = typing ? line.text.slice(0, charIndex) : line.text;
          return (
            <div key={i} className="whitespace-pre-wrap break-words" style={{ color: line.color }}>
              {line.type === "command" && <span className="mr-2 text-[#7ee787]">{prompt}</span>}
              {text}
              {typing && <span className="iw-caret ml-px inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#e6edf3]/80" />}
            </div>
          );
        })}
        {(done || reduce) && (
          <div>
            <span className="mr-2 text-[#7ee787]">{prompt}</span>
            <span className="iw-caret inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-[#e6edf3]/80" />
          </div>
        )}
      </div>
    </div>
  );
}

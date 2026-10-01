"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "../lib/motion";

export interface TypewriterTextProps {
  /** One phrase, or several to cycle through. */
  words: string | string[];
  /** Ms per typed character. */
  typeSpeed?: number;
  /** Ms per deleted character. */
  deleteSpeed?: number;
  /** Ms to hold a finished phrase before deleting it. */
  pause?: number;
  /** Keep cycling forever (only meaningful with several words). */
  loop?: boolean;
  cursor?: boolean;
  className?: string;
}

/** Types phrases out character by character, then deletes them and moves to the next. */
export function TypewriterText({
  words,
  typeSpeed = 70,
  deleteSpeed = 40,
  pause = 1400,
  loop = true,
  cursor = true,
  className,
}: TypewriterTextProps) {
  const list = Array.isArray(words) ? words : [words];
  const reduce = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const word = list[index % list.length] ?? "";
  const isLast = index === list.length - 1;

  useEffect(() => {
    if (reduce) return;
    let timeout: ReturnType<typeof setTimeout>;
    if (!deleting && text === word) {
      if (isLast && !loop) return;
      if (list.length === 1 && !loop) return;
      timeout = setTimeout(() => setDeleting(true), pause);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % list.length);
      return;
    } else {
      timeout = setTimeout(
        () => setText(deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
        deleting ? deleteSpeed : typeSpeed,
      );
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, word, isLast, loop, pause, typeSpeed, deleteSpeed, list.length, reduce]);

  return (
    <span className={cn("whitespace-pre", className)} aria-label={list.join(", ")}>
      <span aria-hidden="true">{reduce ? word : text}</span>
      {cursor && (
        <span aria-hidden="true" className="iw-caret ml-[0.05em] inline-block w-[0.08em] translate-y-[0.1em] bg-current align-baseline h-[1em]" />
      )}
    </span>
  );
}

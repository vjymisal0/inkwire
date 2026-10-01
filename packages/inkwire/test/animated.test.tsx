import { act, render } from "@testing-library/react";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  BorderBeam, GradientText, Magnetic, Marquee, NumberTicker, Reveal, ScrambleText,
  ShimmerButton, Sparkline, SpotlightCard, StatusDot, Terminal, TypewriterText, UptimeBar,
} from "../src";

// IntersectionObserver that reports "visible" immediately, so in-view animations start.
beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  globalThis.IntersectionObserver = class {
    constructor(private cb: IntersectionObserverCallback) {}
    observe() { this.cb([{ isIntersecting: true } as IntersectionObserverEntry], this as unknown as IntersectionObserver); }
    disconnect() {} unobserve() {} takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
});
afterEach(() => vi.useRealTimers());

describe("TypewriterText", () => {
  it("types the phrase out over time", () => {
    vi.useFakeTimers();
    const { container } = render(<TypewriterText words="hey" typeSpeed={10} loop={false} />);
    for (let i = 0; i < 10; i++) act(() => { vi.advanceTimersByTime(10); });
    expect(container.textContent).toContain("hey");
    expect(container.firstElementChild?.getAttribute("aria-label")).toBe("hey");
  });
});

describe("ScrambleText", () => {
  it("exposes the real text to assistive tech", () => {
    const { container } = render(<ScrambleText text="DECODE" />);
    expect(container.firstElementChild?.getAttribute("aria-label")).toBe("DECODE");
  });
});

describe("NumberTicker", () => {
  it("formats with prefix, suffix and decimals", () => {
    const { container } = render(<NumberTicker value={10} from={1234.5} decimals={1} prefix="$" suffix="k" locale="en-US" />);
    expect(container.textContent).toBe("$1,234.5k");
  });
});

describe("Terminal", () => {
  it("types commands then shows output", () => {
    vi.useFakeTimers();
    const { container } = render(
      <Terminal typeSpeed={1} lineDelay={2} lines={["npm i inkwire", { text: "added 1 package", type: "output" }]} />,
    );
    for (let i = 0; i < 60; i++) act(() => { vi.advanceTimersByTime(5); });
    expect(container.textContent).toContain("npm i inkwire");
    expect(container.textContent).toContain("added 1 package");
  });
});

describe("Sparkline", () => {
  it("draws a path through the data", () => {
    const { container } = render(<Sparkline data={[1, 4, 2, 8]} />);
    expect(container.querySelectorAll("path").length).toBe(2);
  });

  it("handles a flat series without NaN", () => {
    const { container } = render(<Sparkline data={[5, 5, 5]} />);
    expect(container.innerHTML).not.toContain("NaN");
  });
});

describe("UptimeBar", () => {
  it("computes uptime from online days", () => {
    const { getByText } = render(
      <UptimeBar days={[{ status: "online" }, { status: "online" }, { status: "offline" }, { status: "nodata" }]} />,
    );
    expect(getByText("66.67% uptime")).toBeTruthy();
  });
});

describe("simple components render their children", () => {
  it.each([
    ["Reveal", <Reveal>child</Reveal>],
    ["GradientText", <GradientText>child</GradientText>],
    ["Marquee", <Marquee>child</Marquee>],
    ["SpotlightCard", <SpotlightCard>child</SpotlightCard>],
    ["Magnetic", <Magnetic>child</Magnetic>],
    ["ShimmerButton", <ShimmerButton>child</ShimmerButton>],
    ["BorderBeam", <BorderBeam>child</BorderBeam>],
    ["StatusDot", <StatusDot label="child" />],
  ])("%s", (_name, element) => {
    expect(render(element).getAllByText("child").length).toBeGreaterThan(0);
  });
});

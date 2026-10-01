import { render } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { AnnotatedText, CircuitBoard, CircuitPattern, StepPlayer, TiltCard } from "../src";

beforeAll(() => {
  window.matchMedia ??= ((query: string) => ({
    matches: false, media: query, onchange: null,
    addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
  globalThis.IntersectionObserver ??= class {
    observe() {} disconnect() {} unobserve() {} takeRecords() { return []; }
  } as unknown as typeof IntersectionObserver;
  Element.prototype.animate ??= function () {
    return { pause() {}, play() {}, cancel() {} } as unknown as Animation;
  };
});

describe("AnnotatedText", () => {
  it("renders children and a mark", () => {
    const { container, getByText } = render(<AnnotatedText variant="underline">hello</AnnotatedText>);
    expect(getByText("hello")).toBeTruthy();
    expect(container.querySelector("svg path")).toBeTruthy();
  });

  it("draws identical geometry on every render", () => {
    const a = render(<AnnotatedText variant="circle">x</AnnotatedText>).container.innerHTML;
    const b = render(<AnnotatedText variant="circle">x</AnnotatedText>).container.innerHTML;
    expect(a).toBe(b);
  });

  it("applies a custom CSS color", () => {
    const { container } = render(<AnnotatedText color="rgb(255, 0, 0)">x</AnnotatedText>);
    expect(container.querySelector("svg")?.getAttribute("style")).toContain("rgb(255, 0, 0)");
  });
});

describe("CircuitBoard", () => {
  it("renders nodes and a trace per connection", () => {
    const { getByText, container } = render(
      <CircuitBoard
        nodes={[{ id: "a", x: 40, y: 40, label: "VM" }, { id: "b", x: 200, y: 40, label: "DB" }]}
        connections={[{ from: "a", to: "b" }]}
        width={260}
        height={100}
      />,
    );
    expect(getByText("VM")).toBeTruthy();
    expect(container.querySelectorAll("path").length).toBeGreaterThan(0);
  });

  it("gives two boards distinct SVG ids", () => {
    const { container } = render(<><CircuitPattern pattern="network" /><CircuitPattern pattern="tree" /></>);
    const ids = [...container.querySelectorAll("filter")].map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("TiltCard", () => {
  it("renders its children", () => {
    expect(render(<TiltCard>card</TiltCard>).getByText("card")).toBeTruthy();
  });
});

describe("StepPlayer", () => {
  it("shows the first step's detail", () => {
    const { getByText } = render(
      <StepPlayer name="Deploy" steps={[{ label: "Build", detail: "compile" }, { label: "Ship", detail: "upload" }]} />,
    );
    expect(getByText("step 1/2")).toBeTruthy();
    expect(getByText("compile")).toBeTruthy();
  });
});

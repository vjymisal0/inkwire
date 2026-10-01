import { useEffect, useState, type ReactNode } from "react";
import {
  AnnotatedText,
  CircuitBoard,
  CircuitPattern,
  StepPlayer,
  TiltCard,
  type AnnotationVariant,
  type CircuitConnection,
  type CircuitNodeType,
} from "inkwire";

const REGISTRY = typeof window === "undefined" ? "" : `${window.location.origin}/r`;

const icon = (d: string) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={d} />
  </svg>
);

/* ---------- small doc primitives ---------- */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        navigator.clipboard?.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Code({ children }: { children: string }) {
  return (
    <div className="code">
      <CopyButton text={children} />
      <pre>
        <code>{children}</code>
      </pre>
    </div>
  );
}

function Tabs({ tabs }: { tabs: Record<string, string> }) {
  const keys = Object.keys(tabs);
  const [active, setActive] = useState(keys[0]!);
  return (
    <div className="tabs">
      <div className="tablist" role="tablist">
        {keys.map((k) => (
          <button key={k} role="tab" aria-selected={k === active} onClick={() => setActive(k)}>
            {k}
          </button>
        ))}
      </div>
      <Code>{tabs[active]!}</Code>
    </div>
  );
}

function Demo({ id, title, blurb, preview, code, props }: {
  id: string;
  title: string;
  blurb: ReactNode;
  preview: ReactNode;
  code: string;
  props: [string, string, string][];
}) {
  return (
    <section id={id} className="demo">
      <header>
        <h2>{title}</h2>
        <p>{blurb}</p>
      </header>
      <div className="preview">{preview}</div>
      <Code>{code}</Code>
      <details>
        <summary>Props</summary>
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Prop</th><th>Type</th><th>Default</th></tr>
            </thead>
            <tbody>
              {props.map(([n, t, d]) => (
                <tr key={n}><td><code>{n}</code></td><td><code>{t}</code></td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
      <Tabs tabs={{ "shadcn (copy source)": `npx shadcn@latest add ${REGISTRY}/${id}.json` }} />
    </section>
  );
}

/* ---------- demo data ---------- */

const variants: AnnotationVariant[] = [
  "wavy", "underline", "doubleUnderline", "dottedUnderline", "line", "arrow",
  "highlight", "circle", "box", "bracket", "strikethrough", "crossOut",
];

const vmNodes: CircuitNodeType[] = [
  { id: "cron", x: 90, y: 60, label: "Cron", icon: icon("M12 6v6l4 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"), status: "active" },
  { id: "webhook", x: 90, y: 200, label: "Webhooks", icon: icon("M4 12h16M12 4v16"), status: "active" },
  { id: "vm", x: 360, y: 130, label: "Self-hosted VM · n8n", icon: icon("M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01"), status: "processing", size: "lg" },
  { id: "agent", x: 630, y: 60, label: "AI agent", icon: icon("M12 8V4H8M4 8h16v12H4zM9 14h.01M15 14h.01"), status: "active" },
  { id: "health", x: 630, y: 200, label: "Health check", icon: icon("M22 12h-4l-3 9L9 3l-3 9H2"), status: "active" },
  { id: "alert", x: 360, y: 250, label: "Telegram alert", icon: icon("M22 2L11 13M22 2l-7 20-4-9-9-4z"), status: "inactive", size: "sm" },
];
const vmConnections: CircuitConnection[] = [
  { from: "cron", to: "vm", animated: true },
  { from: "webhook", to: "vm", animated: true },
  { from: "vm", to: "agent", animated: true },
  { from: "vm", to: "health", animated: true, bidirectional: true },
  { from: "health", to: "alert", animated: true },
];

const install = {
  npm: "npm install inkwire framer-motion",
  pnpm: "pnpm add inkwire framer-motion",
  yarn: "yarn add inkwire framer-motion",
  bun: "bun add inkwire framer-motion",
  "GitHub Packages": "# .npmrc → @vjymisal0:registry=https://npm.pkg.github.com\nnpm install @vjymisal0/inkwire framer-motion",
  CDN: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/inkwire/dist/styles.css" />\n<!-- ESM: https://esm.sh/inkwire -->`,
};

/* ---------- page ---------- */

export function App() {
  const [dark, setDark] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="page">
      <nav className="top">
        <a href="#" className="logo">inkwire</a>
        <div className="links">
          <a href="#annotated-text">AnnotatedText</a>
          <a href="#circuit-board">CircuitBoard</a>
          <a href="#tilt-card">TiltCard</a>
          <a href="#step-player">StepPlayer</a>
          <button type="button" className="theme" onClick={() => setDark((d) => !d)} aria-label="Toggle theme">
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </nav>

      <header className="hero">
        <h1>
          React components that look <AnnotatedText variant="circle" delay={0.3}>hand-drawn</AnnotatedText>{" "}
          and <AnnotatedText variant="wavy" delay={0.9}>wired up</AnnotatedText>.
        </h1>
        <p>
          Annotations, live system maps, tilt cards and step players. One CSS file, no Tailwind required,
          works in Next.js, Vite and Remix.
        </p>
        <Tabs tabs={install} />
        <Code>{`import { AnnotatedText } from "inkwire";
import "inkwire/styles.css";

export default function Hero() {
  return <h1>Ship <AnnotatedText variant="underline">faster</AnnotatedText></h1>;
}`}</Code>
      </header>

      <main>
        <Demo
          id="annotated-text"
          title="AnnotatedText"
          blurb="Twelve hand-drawn marks generated from a seeded random walk, identical on server and client. Draws itself when scrolled into view."
          preview={
            <div className="variant-grid">
              {variants.map((v, i) => (
                <div key={v} className="variant">
                  <span className="big"><AnnotatedText variant={v} delay={i * 0.08}>annotate</AnnotatedText></span>
                  <code>{v}</code>
                </div>
              ))}
            </div>
          }
          code={`<AnnotatedText variant="highlight">important</AnnotatedText>
<AnnotatedText variant="circle" color="#e11d48" delay={0.4}>this</AnnotatedText>`}
          props={[
            ["variant", variants.map((v) => `"${v}"`).join(" | "), '"wavy"'],
            ["color", "string (any CSS color)", "per variant"],
            ["animate", "boolean", "true"],
            ["delay", "number (s)", "0"],
            ["duration", "number (s)", "0.65"],
            ["className", "string", "–"],
          ]}
        />

        <Demo
          id="circuit-board"
          title="CircuitBoard"
          blurb="An animated map of nodes and traces, handy for showing a VM, a pipeline or a service mesh. Nodes carry a status; traces pulse."
          preview={
            <div className="stack">
              <div className="scroll"><CircuitBoard nodes={vmNodes} connections={vmConnections} width={720} height={290} /></div>
              <div className="scroll"><CircuitPattern pattern="network" width={600} height={400} /></div>
            </div>
          }
          code={`const nodes = [
  { id: "cron", x: 90, y: 60, label: "Cron", status: "active" },
  { id: "vm", x: 360, y: 130, label: "Self-hosted VM", status: "processing", size: "lg" },
  { id: "health", x: 630, y: 200, label: "Health check", status: "active" },
];
const connections = [
  { from: "cron", to: "vm", animated: true },
  { from: "vm", to: "health", bidirectional: true },
];

<CircuitBoard nodes={nodes} connections={connections} width={720} height={290} />
// or a preset:
<CircuitPattern pattern="network" />   // "data-flow" | "network" | "processor" | "tree"`}
          props={[
            ["nodes", "{ id, x, y, label?, icon?, status?, size? }[]", "–"],
            ["connections", "{ from, to, animated?, bidirectional?, color?, pulseColor? }[]", "–"],
            ["width / height", "number", "600 / 400"],
            ["showGrid", "boolean", "true"],
            ["pulseSpeed", "number (s)", "2"],
            ["variant", '"light" | "dark" | "auto"', '"auto"'],
            ["traceColor, pulseColor, nodeColor, gridColor", "string", "theme aware"],
          ]}
        />

        <Demo
          id="tilt-card"
          title="TiltCard"
          blurb="A card that leans toward the cursor on a spring and eases back flat. Respects reduced motion."
          preview={
            <div className="tilt-row">
              {["Self-hosted", "Open source", "Zero config"].map((t, i) => (
                <TiltCard key={t} max={8 + i * 3} className="tilt">
                  <strong>{t}</strong>
                  <span>max={8 + i * 3}</span>
                </TiltCard>
              ))}
            </div>
          }
          code={`<TiltCard max={10} className="card">
  <h3>Hover me</h3>
</TiltCard>`}
          props={[
            ["max", "number (deg)", "6"],
            ["...rest", "motion.div props", "–"],
          ]}
        />

        <Demo
          id="step-player"
          title="StepPlayer"
          blurb="Plays through a pipeline one stage at a time, with a progress bar and an explanation for each stage."
          preview={
            <div className="narrow">
              <StepPlayer
                name="Deploy"
                steps={[
                  { label: "Push", detail: "A commit lands on main and triggers the workflow." },
                  { label: "Build", detail: "The package is bundled to ESM + CJS with type definitions." },
                  { label: "Test", detail: "Smoke renders run against every component in jsdom." },
                  { label: "Publish", detail: "Changesets publishes to npm and GitHub Packages with provenance." },
                ]}
              />
            </div>
          }
          code={`<StepPlayer
  name="Deploy"
  stepDuration={2200}
  steps={[
    { label: "Build", detail: "Bundle the package." },
    { label: "Publish", detail: "Push it to npm." },
  ]}
/>`}
          props={[
            ["steps", "{ label: string; detail: string }[]", "–"],
            ["name", "string", "–"],
            ["stepDuration", "number (ms)", "2200"],
            ["className", "string", "–"],
          ]}
        />

        <section className="demo">
          <header>
            <h2>Theming</h2>
            <p>Override the CSS variables anywhere. Dark mode follows a <code>.dark</code> class or <code>data-theme="dark"</code>.</p>
          </header>
          <Code>{`:root {
  --iw-primary: #0ea5e9;
  --iw-foreground: #0f172a;
  --iw-muted-foreground: #64748b;
  --iw-border: #e2e8f0;
}`}</Code>
        </section>
      </main>
      <footer>MIT · built by Vijay · <a href="https://www.npmjs.com/package/inkwire">npm</a></footer>
    </div>
  );
}

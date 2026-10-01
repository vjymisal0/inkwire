import { useEffect, useState, type ReactNode } from "react";
import {
  AnnotatedText,
  BorderBeam,
  CircuitBoard,
  CircuitPattern,
  GradientText,
  Magnetic,
  Marquee,
  NumberTicker,
  Reveal,
  ScrambleText,
  ShimmerButton,
  Sparkline,
  SpotlightCard,
  StatusDot,
  StepPlayer,
  Terminal,
  TiltCard,
  TypewriterText,
  UptimeBar,
  type UptimeDay,
  type AnnotationVariant,
  type CircuitConnection,
  type CircuitNodeType,
} from "inkwire";

const REGISTRY = typeof window === "undefined" ? "" : new URL(`${import.meta.env.BASE_URL}r`, window.location.origin).href;

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

const SHADCN = new Set(["annotated-text", "circuit-board", "magnetic", "number-ticker", "reveal", "scramble-text", "step-player", "tilt-card"]);

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
      {SHADCN.has(id) && <Tabs tabs={{ "shadcn (copy source)": `npx shadcn@latest add ${REGISTRY}/${id}.json` }} />}
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


/* deterministic 90-day uptime history */
const uptimeDays: UptimeDay[] = Array.from({ length: 90 }, (_, i) => {
  const date = new Date(Date.UTC(2026, 6, 3 + i)).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  if (i === 23) return { status: "offline", label: date, note: "41 min outage" };
  if (i === 24 || i === 61) return { status: "degraded", label: date, note: "elevated latency" };
  if (i === 47) return { status: "maintenance", label: date, note: "kernel upgrade" };
  return { status: "online", label: date, note: "no incidents" };
});

/** Fake live metrics so the dashboard keeps moving. */
function useLiveSeries(seed: number, base: number, spread: number, length = 24) {
  const [series, setSeries] = useState(() =>
    Array.from({ length }, (_, i) => base + Math.sin(i / 2 + seed) * spread * 0.6 + Math.cos(i * 1.7 + seed) * spread * 0.3),
  );
  useEffect(() => {
    const id = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1]!;
        const next = Math.max(0, Math.min(100, last + (Math.random() - 0.5) * spread * 0.8 + (base - last) * 0.2));
        return [...prev.slice(1), next];
      });
    }, 1500);
    return () => clearInterval(id);
  }, [base, spread]);
  return series;
}

function Metric({ label, series, unit, color }: { label: string; series: number[]; unit: string; color: string }) {
  const value = series[series.length - 1]!;
  return (
    <div className="metric">
      <span className="metric-label">{label}</span>
      <span className="metric-value"><NumberTicker value={value} decimals={1} duration={0.8} suffix={unit} /></span>
      <Sparkline data={series} min={0} max={100} color={color} width={180} height={44} />
    </div>
  );
}

function Dashboard() {
  const cpu = useLiveSeries(1, 42, 18);
  const mem = useLiveSeries(4, 67, 8);
  const net = useLiveSeries(9, 28, 22);
  return (
    <BorderBeam className="dashboard" radius="18px" duration={8}>
      <div className="dash-head">
        <div>
          <strong>vm-prod-01</strong>
          <span className="muted"> · n8n · Ubuntu 24.04</span>
        </div>
        <StatusDot status="online" label="Operational" />
      </div>
      <div className="metrics">
        <Metric label="CPU" series={cpu} unit="%" color="#8b5cf6" />
        <Metric label="Memory" series={mem} unit="%" color="#06b6d4" />
        <Metric label="Network" series={net} unit=" MB/s" color="#f59e0b" />
      </div>
      <UptimeBar days={uptimeDays} height={30} />
    </BorderBeam>
  );
}


const COUNT = 18; // keep in sync with packages/inkwire/src/index.ts

function SparklineDemo() {
  const a = useLiveSeries(2, 50, 25, 32);
  const b = useLiveSeries(7, 30, 15, 32);
  return (
    <div className="row">
      <Sparkline data={a} width={260} height={70} color="#8b5cf6" />
      <Sparkline data={b} width={260} height={70} color="#10b981" fill={false} />
    </div>
  );
}

function TickerDemo() {
  const [n, setN] = useState(12840);
  return (
    <div className="row ticker">
      <span><NumberTicker value={n} prefix="$" locale="en-US" /><small>revenue</small></span>
      <span><NumberTicker value={99.98} decimals={2} suffix="%" /><small>uptime</small></span>
      <span><NumberTicker value={1200} suffix="+" /><small>stars</small></span>
      <button type="button" className="theme" onClick={() => setN((v) => v + Math.round(Math.random() * 5000))}>Add revenue</button>
    </div>
  );
}

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
          <a href="#components">Components</a>
          <a href="#monitoring">Monitoring</a>
          <a href="#theming">Theming</a>
          <a href="https://github.com/vjymisal0/inkwire">GitHub</a>
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
          <TypewriterText words={["Hand-drawn annotations.", "Live system maps.", "Uptime bars & sparklines.", "Text that types, scrambles and counts."]} />
          <br />
          {COUNT} animated components in one CSS file. No Tailwind required, works in Next.js, Vite and Remix.
        </p>
        <div className="cta">
          <Magnetic>
            <ShimmerButton onClick={() => document.getElementById("components")?.scrollIntoView({ behavior: "smooth" })}>
              Browse components →
            </ShimmerButton>
          </Magnetic>
          <a className="ghost" href="https://github.com/vjymisal0/inkwire">Star on GitHub</a>
        </div>
        <Tabs tabs={install} />
        <Code>{`import { AnnotatedText } from "inkwire";
import "inkwire/styles.css";

export default function Hero() {
  return <h1>Ship <AnnotatedText variant="underline">faster</AnnotatedText></h1>;
}`}</Code>
      </header>

      <section id="monitoring" className="showcase">
        <Reveal>
          <Dashboard />
        </Reveal>
        <p className="caption">
          Live: <code>BorderBeam</code>, <code>StatusDot</code>, <code>NumberTicker</code>, <code>Sparkline</code> and{" "}
          <code>UptimeBar</code> composed into a VM monitor. Hover the bars.
        </p>
      </section>

      <Marquee className="logos" duration={28}>
        {["AnnotatedText", "CircuitBoard", "Terminal", "Sparkline", "UptimeBar", "Marquee", "ScrambleText", "NumberTicker", "BorderBeam", "SpotlightCard", "TypewriterText", "GradientText"].map((n) => (
          <span key={n} className="chip">{n}</span>
        ))}
      </Marquee>

      <main id="components">
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


        <Demo
          id="terminal"
          title="Terminal"
          blurb="A terminal window that types out commands and prints their output once it scrolls into view."
          preview={
            <div className="narrow">
              <Terminal
                title="~/my-app"
                loop
                lines={[
                  "pnpm add inkwire framer-motion",
                  { text: "+ inkwire 0.1.0", type: "output", color: "#7ee787" },
                  { text: "Done in 1.4s", type: "output", color: "#8b949e" },
                  "pnpm dev",
                  { text: "➜  Local: http://localhost:5173/", type: "output", color: "#79c0ff" },
                ]}
              />
            </div>
          }
          code={`<Terminal
  title="~/my-app"
  lines={[
    "pnpm add inkwire",
    { text: "+ inkwire 0.1.0", type: "output", color: "#7ee787" },
  ]}
/>`}
          props={[
            ["lines", 'string | { text, type?: "command" | "output", color? }[]', "–"],
            ["title", "string", '"zsh"'],
            ["prompt", "ReactNode", '"$"'],
            ["typeSpeed / lineDelay", "number (ms)", "35 / 450"],
            ["loop", "boolean", "false"],
          ]}
        />

        <Demo
          id="sparkline"
          title="Sparkline"
          blurb="A tiny trend line that draws itself in, smoothly morphs to new data, and pings its latest point."
          preview={<SparklineDemo />}
          code={`<Sparkline data={cpuHistory} min={0} max={100} color="#8b5cf6" />`}
          props={[
            ["data", "number[]", "–"],
            ["width / height", "number", "160 / 40"],
            ["color", "string", "var(--iw-primary)"],
            ["fill / showLast", "boolean", "true / true"],
            ["min / max", "number", "fit to data"],
          ]}
        />

        <Demo
          id="uptime-bar"
          title="UptimeBar & StatusDot"
          blurb="A status-page style uptime history that grows in bar by bar, plus a pinging live status dot."
          preview={
            <div className="stack narrow">
              <div className="row">
                <StatusDot status="online" label="online" />
                <StatusDot status="degraded" label="degraded" />
                <StatusDot status="offline" label="offline" />
                <StatusDot status="maintenance" label="maintenance" />
              </div>
              <UptimeBar days={uptimeDays} />
            </div>
          }
          code={`<StatusDot status="online" label="API" />

<UptimeBar days={[
  { status: "online", label: "Sep 1" },
  { status: "offline", label: "Sep 2", note: "41 min outage" },
]} />`}
          props={[
            ["StatusDot.status", '"online" | "degraded" | "offline" | "maintenance"', '"online"'],
            ["StatusDot.pulse", "boolean", "online/degraded"],
            ["UptimeBar.days", "{ status, label?, note? }[]", "–"],
            ["UptimeBar.height", "number", "32"],
          ]}
        />

        <Demo
          id="number-ticker"
          title="NumberTicker"
          blurb="Counts up to a value when it scrolls into view, and animates from the old value whenever the value changes."
          preview={<TickerDemo />}
          code={`<NumberTicker value={12840} prefix="$" />
<NumberTicker value={99.98} decimals={2} suffix="%" />`}
          props={[
            ["value", "number", "–"],
            ["from", "number", "0"],
            ["duration", "number (s)", "1.4"],
            ["decimals", "number", "0"],
            ["prefix / suffix", "string", '""'],
            ["locale", "string", "browser"],
          ]}
        />

        <Demo
          id="typewriter-text"
          title="TypewriterText"
          blurb="Types phrases out one character at a time, then deletes them and moves to the next. Screen readers get the full text."
          preview={<span className="big-text">We build <TypewriterText words={["dashboards.", "agents.", "pipelines.", "libraries."]} /></span>}
          code={`<TypewriterText words={["dashboards.", "agents.", "pipelines."]} />`}
          props={[
            ["words", "string | string[]", "–"],
            ["typeSpeed / deleteSpeed", "number (ms)", "70 / 40"],
            ["pause", "number (ms)", "1400"],
            ["loop / cursor", "boolean", "true / true"],
          ]}
        />

        <Demo
          id="scramble-text"
          title="ScrambleText"
          blurb="Decodes text out of random characters when it scrolls into view. Hover to run it again."
          preview={<span className="big-text mono"><ScrambleText text="ACCESS GRANTED" duration={1200} /></span>}
          code={`<ScrambleText text="ACCESS GRANTED" duration={1200} />`}
          props={[
            ["text", "string", "–"],
            ["duration", "number (ms)", "900"],
            ["characters", "string", "A–Z 0–9 symbols"],
            ["scrambleOnHover", "boolean", "true"],
          ]}
        />

        <Demo
          id="gradient-text"
          title="GradientText"
          blurb="Text filled with a gradient that slowly pans across it."
          preview={<span className="big-text"><GradientText>Ship something beautiful</GradientText></span>}
          code={`<GradientText colors={["#7c3aed", "#ec4899", "#f59e0b"]} speed={6}>
  Ship something beautiful
</GradientText>`}
          props={[
            ["colors", "string[]", "violet → pink → amber → cyan"],
            ["speed", "number (s), 0 = static", "6"],
          ]}
        />

        <Demo
          id="marquee"
          title="Marquee"
          blurb="An endlessly scrolling row or column with faded edges. It's pure CSS, so it doesn't use JavaScript to animate, and it pauses on hover."
          preview={
            <div className="stack">
              <Marquee duration={20}>{["React", "Vite", "Next.js", "Remix", "Astro", "Bun"].map((t) => <span key={t} className="chip">{t}</span>)}</Marquee>
              <Marquee duration={24} reverse>{["Cron", "Webhooks", "Agents", "Health checks", "Alerts"].map((t) => <span key={t} className="chip">{t}</span>)}</Marquee>
            </div>
          }
          code={`<Marquee duration={20} reverse pauseOnHover>
  {logos.map((l) => <img key={l.src} src={l.src} />)}
</Marquee>`}
          props={[
            ["duration", "number (s)", "30"],
            ["reverse / vertical", "boolean", "false"],
            ["pauseOnHover / fade", "boolean", "true / true"],
            ["gap", "CSS length", '"2rem"'],
          ]}
        />

        <Demo
          id="spotlight-card"
          title="SpotlightCard"
          blurb="A card with a soft glow that follows the cursor. It updates CSS variables instead of re-rendering on every mouse move."
          preview={
            <div className="tilt-row">
              {["Observability", "Automation", "Alerting"].map((t) => (
                <SpotlightCard key={t} className="spot">
                  <strong>{t}</strong>
                  <span className="muted">Move your cursor over me.</span>
                </SpotlightCard>
              ))}
            </div>
          }
          code={`<SpotlightCard spotlightColor="rgba(124,58,237,.25)" size={320}>
  ...
</SpotlightCard>`}
          props={[
            ["spotlightColor", "string", "primary @ 28%"],
            ["size", "number (px)", "320"],
          ]}
        />

        <Demo
          id="border-beam"
          title="BorderBeam"
          blurb="A container with a beam of light travelling around its border."
          preview={
            <BorderBeam className="beam-demo" duration={5}>
              <strong>Pro plan</strong>
              <span className="muted">Everything in inkwire, forever free.</span>
            </BorderBeam>
          }
          code={`<BorderBeam duration={6} colorFrom="#7c3aed" colorTo="#22d3ee" radius="1rem">
  ...
</BorderBeam>`}
          props={[
            ["duration", "number (s)", "6"],
            ["colorFrom / colorTo", "string", "primary / cyan"],
            ["borderWidth", "number (px)", "1.5"],
            ["radius", "CSS length", '"1rem"'],
          ]}
        />

        <Demo
          id="shimmer-button"
          title="ShimmerButton & Magnetic"
          blurb="A button with a band of light sweeping across it. Wrap anything in Magnetic to make it lean toward the cursor."
          preview={
            <div className="row">
              <ShimmerButton>Get started</ShimmerButton>
              <Magnetic strength={0.5}>
                <ShimmerButton background="#0f172a">I'm magnetic</ShimmerButton>
              </Magnetic>
            </div>
          }
          code={`<Magnetic strength={0.4}>
  <ShimmerButton onClick={start}>Get started</ShimmerButton>
</Magnetic>`}
          props={[
            ["ShimmerButton.shimmerColor", "string", "white @ 55%"],
            ["ShimmerButton.background", "string", "var(--iw-primary)"],
            ["ShimmerButton.duration", "number (s)", "2.6"],
            ["Magnetic.strength", "0–1", "0.35"],
          ]}
        />

        <Demo
          id="reveal"
          title="Reveal"
          blurb="Fades, slides and un-blurs its children into view as you scroll."
          preview={
            <div className="tilt-row">
              {(["up", "left", "right"] as const).map((dir, i) => (
                <Reveal key={dir} from={dir} delay={i * 0.12} repeat>
                  <div className="tilt"><strong>from="{dir}"</strong><span>repeat</span></div>
                </Reveal>
              ))}
            </div>
          }
          code={`<Reveal from="up" delay={0.1}>
  <Card />
</Reveal>`}
          props={[
            ["from", '"up" | "down" | "left" | "right" | "none"', '"up"'],
            ["distance", "number (px)", "24"],
            ["blur", "boolean", "true"],
            ["delay / duration", "number (s)", "0 / 0.6"],
            ["repeat", "boolean", "false"],
          ]}
        />

        <section id="theming" className="demo">
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

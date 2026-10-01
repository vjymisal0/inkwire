# inkwire

**Animated React components that look hand-drawn and wired up.** Includes hand-drawn annotations, live system maps,
uptime bars, sparklines, terminals, and text that types, scrambles and counts.
It ships as one CSS file and needs no Tailwind.

[Live demo & docs](https://vjymisal0.github.io/inkwire/) · [npm](https://www.npmjs.com/package/inkwire) · [GitHub](https://github.com/vjymisal0/inkwire)

## Install

```bash
npm install inkwire framer-motion
pnpm add inkwire framer-motion
yarn add inkwire framer-motion
bun add inkwire framer-motion
```

<details>
<summary>GitHub Packages, CDN, shadcn</summary>

**GitHub Packages:** add `@vjymisal0:registry=https://npm.pkg.github.com` to `.npmrc`, then `npm install @vjymisal0/inkwire`.

**CDN:** `https://cdn.jsdelivr.net/npm/inkwire/dist/styles.css`, and ESM at `https://esm.sh/inkwire`.

**shadcn (own the source):** `npx shadcn@latest add https://vjymisal0.github.io/inkwire/r/<component>.json`.
Available for `annotated-text`, `circuit-board`, `magnetic`, `number-ticker`, `reveal`, `scramble-text`, `step-player`, `tilt-card`.
</details>

## Quick start

```tsx
import { AnnotatedText, NumberTicker, StatusDot } from "inkwire";
import "inkwire/styles.css"; // once, at your app root

export function Hero() {
  return (
    <h1>
      Ship <AnnotatedText variant="underline">faster</AnnotatedText>.{" "}
      <NumberTicker value={99.98} decimals={2} suffix="%" /> uptime <StatusDot status="online" />
    </h1>
  );
}
```

Works in Next.js (App Router: components are client components), Vite, Remix and Astro (`client:load`).

## Components

| Component | What it does |
| --- | --- |
| `AnnotatedText` | 12 hand-drawn marks: underline, circle, highlight, box, arrow, strike-through and more |
| `CircuitBoard` / `CircuitPattern` | Animated node-and-trace map for VMs, pipelines and service meshes |
| `Terminal` | Terminal window that types commands and prints output |
| `Sparkline` | Tiny trend line that draws in and morphs as live data arrives |
| `UptimeBar` | Status-page style daily uptime history with hover details |
| `StatusDot` | Pinging online / degraded / offline / maintenance indicator |
| `NumberTicker` | Counts up to a value on scroll and on change |
| `TypewriterText` | Types and deletes a list of phrases |
| `ScrambleText` | Decodes text out of random glyphs |
| `GradientText` | Gradient fill that pans across text |
| `Marquee` | Infinite scrolling row or column, pure CSS |
| `SpotlightCard` | Card with a cursor-following glow |
| `BorderBeam` | A beam of light orbiting a container's border |
| `ShimmerButton` | Button with a looping band of light |
| `Magnetic` | Pulls any element toward the cursor |
| `TiltCard` | 3D tilt toward the cursor |
| `Reveal` | Fade, slide and un-blur on scroll |
| `StepPlayer` | Step-by-step pipeline player |

Every component respects `prefers-reduced-motion`. Full props and live examples are on the [docs site](https://vjymisal0.github.io/inkwire/).

## Theming

```css
:root {
  --iw-primary: #0ea5e9;
  --iw-primary-foreground: #fff;
  --iw-foreground: #0f172a;
  --iw-muted-foreground: #64748b;
  --iw-border: #e2e8f0;
  --iw-background: #fff;
}
```

Dark mode follows a `.dark` class or `data-theme="dark"` on any ancestor. The stylesheet has no global reset,
so importing it never restyles the rest of your app.

## License

MIT © Vijay

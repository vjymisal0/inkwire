# inkwire

Hand-drawn text annotations, animated circuit / system maps, tilt cards and step players for React.
Ships one CSS file, so you don't need Tailwind.

## Install

```bash
npm install inkwire framer-motion
# pnpm add inkwire framer-motion
# yarn add inkwire framer-motion
# bun add inkwire framer-motion
```

GitHub Packages: `npm install @vjymisal0/inkwire` (with `@vjymisal0:registry=https://npm.pkg.github.com` in `.npmrc`).

Own the source instead (shadcn): `npx shadcn@latest add https://<docs-site>/r/annotated-text.json`

## Usage

```tsx
import { AnnotatedText, CircuitBoard, TiltCard, StepPlayer } from "inkwire";
import "inkwire/styles.css";

<h1>Ship <AnnotatedText variant="underline">faster</AnnotatedText></h1>

<CircuitBoard
  width={720}
  height={290}
  nodes={[
    { id: "cron", x: 90, y: 60, label: "Cron", status: "active" },
    { id: "vm", x: 360, y: 130, label: "Self-hosted VM", status: "processing", size: "lg" },
  ]}
  connections={[{ from: "cron", to: "vm", animated: true }]}
/>

<TiltCard max={10}>Hover me</TiltCard>

<StepPlayer name="Deploy" steps={[{ label: "Build", detail: "Bundle" }, { label: "Ship", detail: "Publish" }]} />
```

`AnnotatedText` variants: `wavy`, `underline`, `doubleUnderline`, `dottedUnderline`, `line`, `arrow`,
`highlight`, `circle`, `box`, `bracket`, `strikethrough`, `crossOut`.

## Theming

```css
:root { --iw-primary: #0ea5e9; --iw-foreground: #0f172a; --iw-muted-foreground: #64748b; --iw-border: #e2e8f0; }
```

Dark mode follows a `.dark` class or `data-theme="dark"` on an ancestor.

## License

MIT

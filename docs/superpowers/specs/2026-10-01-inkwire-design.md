# inkwire — Design Spec

## Goal
Publish four components from the portfolio (`portfolio-vijay/components/ui/`) as an installable React library, with a live docs site showing each component and a copyable usage snippet.

**Success criteria**
- `npm i inkwire` (and pnpm/yarn/bun) works; importing a component plus `inkwire/styles.css` renders correctly in a fresh Vite React app with **no Tailwind**.
- Also published to GitHub Packages as `@vjymisal0/inkwire`.
- `npx shadcn add https://<docs-domain>/r/<component>.json` copies a component's source into the user's project.
- Docs site on Vercel: one page per component with a live preview, a props table, install tabs, and a usage snippet.
- The portfolio switches to the published package with no visual regression.

## Components (v1)
| Component | Source | Notes |
|---|---|---|
| AnnotatedText | annotated-text.tsx | Seeded hand-drawn underline, circle and highlight marks; SSR-safe |
| CircuitBoard | circuit-board.tsx | Node/connection map with status and animated links (the VM monitor) |
| TiltCard | tilt-card.tsx | 3D tilt on hover |
| StepPlayer | step-player.tsx | Step-by-step animated player |

**Porting rules**
- Replace `@/lib/utils` `cn` with a local `cn` (clsx + tailwind-merge, both bundled as deps).
- Tailwind classes use the `iw-` prefix; the build compiles them into `dist/styles.css`, so the consumer's CSS can't clash with them.
- Expose theme colors as CSS variables (`--iw-accent`, `--iw-fg`, `--iw-muted`, `--iw-border`, `--iw-bg`) with light and dark defaults.
- Keep `"use client"` at the top of each component's entry.
- Peer deps: `react` and `react-dom` (^18 || ^19), plus `framer-motion` (^11) only if any component uses it. Icons are passed in as props; no `lucide-react` dependency.

## Repo layout (pnpm workspace)
```
inkwire/
  packages/ui/            # the library
    src/<component>/index.tsx, src/index.ts, src/styles.css, src/lib/cn.ts
    tsup.config.ts        # ESM + CJS + d.ts, preserves "use client"
    tailwind.config.ts    # prefix "iw-", content = src/**
  apps/docs/              # Next.js site (Vercel), depends on workspace:ui
    public/r/*.json       # shadcn registry output
  registry.json           # shadcn registry source → built with `shadcn build`
  .changeset/
  .github/workflows/ci.yml       # install, typecheck, test, build
  .github/workflows/release.yml  # changesets → npm (provenance) + GitHub Packages
```

## Package exports
```json
"exports": {
  ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js", "require": "./dist/index.cjs" },
  "./styles.css": "./dist/styles.css"
},
"sideEffects": ["*.css"]
```

## Usage snippet (README + docs)
```tsx
import { AnnotatedText } from "inkwire";
import "inkwire/styles.css";

<AnnotatedText variant="underline">shipped it</AnnotatedText>
```

## Release flow
1. Write a changeset, then merge to main.
2. The Action opens a "Version Packages" PR; merging that PR publishes to npm (`NPM_TOKEN`).
3. The same job rewrites the name to `@vjymisal0/inkwire` and publishes to npm.pkg.github.com (`GITHUB_TOKEN`).

**User-provided:** create the GitHub repo `vjymisal0/inkwire`, add the `NPM_TOKEN` secret, and connect `apps/docs` to Vercel.

## Testing
- Vitest + Testing Library: a smoke render for each component (and the AnnotatedText output is deterministic across renders).
- A `tsc --noEmit` typecheck.
- `examples/vite-smoke`: a Vite app without Tailwind, built in CI against the packed tarball (`pnpm pack`), to prove the package installs and its styles apply.

## Out of scope (v1)
- Button and Card (generic; shadcn already covers them).
- Vue/Svelte ports.
- JSR.
- Storybook.

## Changes made during the build
- Renamed from vijay-ui to **inkwire** at the user's request.
- The docs site is **Vite** rather than Next.js. It deploys to Vercel the same way, and since it uses no Tailwind it also serves as the no-Tailwind smoke test, replacing `examples/vite-smoke`.
- Utility classes are **unprefixed** but ship without preflight (Tailwind v4 `theme` + `utilities` only). A scoped `.iw-root` reset covers the library's own buttons. Theme tokens map to `--iw-*` through `@theme inline`.
- TypeScript is pinned to 5.x because tsup's d.ts build fails on TypeScript 7.

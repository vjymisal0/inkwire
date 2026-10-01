# Contributing

```bash
pnpm install
pnpm dev        # builds the library + registry, then runs the docs at http://127.0.0.1:5180
pnpm test       # vitest
pnpm typecheck
```

- Components live in `packages/inkwire/src/<name>/index.tsx` and are exported from `src/index.ts`.
- Add a smoke test in `packages/inkwire/test/` and a demo section in `apps/docs/src/App.tsx`.
- Run `pnpm changeset` to describe your change; the release workflow versions and publishes it.

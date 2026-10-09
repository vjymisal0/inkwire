# inkwire

## 0.1.2

### Patch Changes

- 33e48ef: Fix TypeScript types for CommonJS consumers: `require` now resolves `dist/index.d.cts` instead of the ESM declarations. Also expose `./package.json` in the exports map.

## 0.1.1

### Patch Changes

- 1740e4a: Verified compatibility with framer-motion 14 (now used for development and tests) and declared supported Node.js versions in `engines`.

---
"inkwire": patch
---

Fix TypeScript types for CommonJS consumers: `require` now resolves `dist/index.d.cts` instead of the ESM declarations. Also expose `./package.json` in the exports map.

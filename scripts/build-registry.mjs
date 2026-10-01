// Emits shadcn registry items to apps/docs/public/r/<name>.json so users can run
// `npx shadcn add https://<docs-site>/r/<name>.json` and own the source.
//
// Only components that work with a stock shadcn/Tailwind setup are emitted: the
// ones whose animations live in inkwire's own stylesheet (iw-* classes) stay npm-only.
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";

const src = "packages/inkwire/src";
const out = "apps/docs/public/r";
mkdirSync(out, { recursive: true });

const motionLib = readFileSync(`${src}/lib/motion.ts`, "utf8");

const toShadcn = (code) =>
  code
    .replace(/from ["']\.\.\/lib\/cn["']/g, 'from "@/lib/utils"')
    .replace(/from ["']\.\.\/lib\/motion["']/g, 'from "@/lib/inkwire-motion"')
    // shadcn themes expose the same tokens without our prefix.
    .replace(/var\(--iw-([a-z-]+)\)/g, "var(--$1)")
    .replace(/'iw-root', /g, "");

const written = [];
const skipped = [];

for (const name of readdirSync(src, { withFileTypes: true }).filter((d) => d.isDirectory() && d.name !== "lib").map((d) => d.name)) {
  const code = toShadcn(readFileSync(`${src}/${name}/index.tsx`, "utf8"));
  if (/\biw-[a-z]/.test(code) || /from ["']\.\.\//.test(code)) {
    skipped.push(name);
    continue;
  }
  const files = [{ path: `components/inkwire/${name}.tsx`, type: "registry:ui", content: code }];
  if (code.includes("@/lib/inkwire-motion")) {
    files.push({ path: "lib/inkwire-motion.ts", type: "registry:lib", content: motionLib, target: "lib/inkwire-motion.ts" });
  }
  const dependencies = code.includes("framer-motion") ? ["framer-motion"] : [];
  writeFileSync(
    `${out}/${name}.json`,
    JSON.stringify(
      {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name,
        type: "registry:ui",
        dependencies,
        registryDependencies: ["utils"],
        files,
      },
      null,
      2,
    ),
  );
  written.push(name);
}

writeFileSync(`${out}/index.json`, JSON.stringify({ items: written }, null, 2));
console.log(`registry: ${written.length} items (${written.join(", ")}); npm-only: ${skipped.join(", ")}`);

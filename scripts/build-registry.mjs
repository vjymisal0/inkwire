// Emits shadcn registry items to apps/docs/public/r/<name>.json so users can run
// `npx shadcn add https://<docs-site>/r/<name>.json` and own the source.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const items = [
  { name: "annotated-text", title: "AnnotatedText", description: "Hand-drawn text annotations.", dependencies: [] },
  { name: "circuit-board", title: "CircuitBoard", description: "Animated circuit / system map.", dependencies: ["framer-motion"] },
  { name: "tilt-card", title: "TiltCard", description: "Card that tilts toward the cursor.", dependencies: ["framer-motion"] },
  { name: "step-player", title: "StepPlayer", description: "Step-by-step pipeline player.", dependencies: ["framer-motion"] },
];

const out = "apps/docs/public/r";
mkdirSync(out, { recursive: true });

for (const item of items) {
  // shadcn projects already ship `cn` at @/lib/utils.
  const content = readFileSync(`packages/inkwire/src/${item.name}/index.tsx`, "utf8").replace(
    /from ["']\.\.\/lib\/cn["']/,
    'from "@/lib/utils"',
  );
  const json = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    ...item,
    type: "registry:ui",
    registryDependencies: ["utils"],
    files: [{ path: `components/inkwire/${item.name}.tsx`, type: "registry:ui", content }],
  };
  writeFileSync(`${out}/${item.name}.json`, JSON.stringify(json, null, 2));
}
console.log(`registry: wrote ${items.length} items to ${out}`);

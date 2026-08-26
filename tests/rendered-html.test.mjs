import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

const routes = [
  ["/proofs/pythagorean-theorem", "Pythagorean Theorem"],
  ["/proofs/triangle-area", "Area of a Triangle"],
  ["/proofs/triangle-angle-sum", "Angle Sum of a Triangle"],
  ["/proofs/exterior-angle-theorem", "Exterior Angle Theorem"],
  ["/proofs/similar-triangles", "Similar Triangles and Proportional Sides"],
];

test("server-renders every dedicated visual-proof route", async () => {
  for (const [pathname, title] of routes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, pathname);
    assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
    const html = await response.text();
    assert.match(html, new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), pathname);
    assert.doesNotMatch(html, /codex-preview|Building your site|SkeletonPreview/i);
  }
});

test("keeps the expansion foundation registered and reusable", async () => {
  const [registry, engine, geometry, packageJson] = await Promise.all([
    readFile(new URL("../app/lib/proofRegistry.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/useProofCanvas.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/lib/geometry.ts", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  for (const [pathname] of routes) assert.match(registry, new RegExp(pathname));
  assert.match(registry, /proofDefinitionSchema/);
  assert.match(engine, /useCanvasHistory/);
  assert.match(engine, /setPointerCapture/);
  assert.match(engine, /clientToCanvasPoint/);
  assert.match(geometry, /polygonArea/);
  assert.match(geometry, /nearestPointSnap/);
  assert.match(packageJson, /"zod"/);
  assert.match(packageJson, /"clsx"/);
  assert.match(packageJson, /"vitest"/);
});

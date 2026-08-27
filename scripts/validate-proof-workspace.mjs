import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const workspace = process.cwd();
const catalogPath = path.join(workspace, "app/data/visual-proofs-detailed.json");
const statusDirectory = path.join(workspace, "app/proof-status");

const catalog = JSON.parse(await readFile(catalogPath, "utf8"));
const catalogById = new Map(catalog.visualProofs.map((proof) => [proof.id, proof]));
const files = (await readdir(statusDirectory)).filter((file) => file.endsWith(".json"));
const proofIds = new Set();
const routes = new Set();
const errors = [];

for (const file of files) {
  const filePath = path.join(statusDirectory, file);
  const manifest = JSON.parse(await readFile(filePath, "utf8"));
  const proof = catalogById.get(manifest.proofId);

  if (!proof) errors.push(`${file}: unknown proofId ${manifest.proofId}`);
  if (proofIds.has(manifest.proofId)) errors.push(`${file}: duplicate proofId ${manifest.proofId}`);
  if (routes.has(manifest.route)) errors.push(`${file}: duplicate route ${manifest.route}`);
  proofIds.add(manifest.proofId);
  routes.add(manifest.route);

  if (proof && proof.categorySlug !== manifest.categorySlug) {
    errors.push(`${file}: categorySlug must be ${proof.categorySlug}`);
  }
  if (proof && proof.slug !== manifest.slug) {
    errors.push(`${file}: slug must be ${proof.slug}`);
  }
  if (!["planned", "in-development", "interactive", "verified"].includes(manifest.status)) {
    errors.push(`${file}: invalid status ${manifest.status}`);
  }

  if (manifest.route?.startsWith("/visual-proofs/")) {
    const pagePath = path.join(
      workspace,
      "app",
      ...manifest.route.slice(1).split("/"),
      "page.tsx",
    );
    try {
      await access(pagePath);
    } catch {
      errors.push(`${file}: route has no isolated page at ${path.relative(workspace, pagePath)}`);
    }
  }
}

if (errors.length) {
  console.error(`Proof workspace validation failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

console.log(`Proof workspace valid: ${files.length} implementation manifests, ${catalog.visualProofs.length} catalog proofs.`);

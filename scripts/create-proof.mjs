import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const valueAfter = (flag) => {
  const index = args.indexOf(flag);
  return index >= 0 ? args[index + 1] : undefined;
};
const proofId = valueAfter("--id");
const owner = valueAfter("--owner");

if (!proofId) {
  console.error("Usage: npm run proof:new -- --id <catalog-proof-id> [--owner <name>]");
  process.exit(1);
}

const workspace = process.cwd();
const catalog = JSON.parse(
  await readFile(path.join(workspace, "app/data/visual-proofs-detailed.json"), "utf8"),
);
const proof = catalog.visualProofs.find((item) => item.id === proofId);
if (!proof) {
  console.error(`Unknown catalog proof id: ${proofId}`);
  process.exit(1);
}

const route = `/visual-proofs/${proof.categorySlug}/${proof.slug}`;
const directory = path.join(workspace, "app", "visual-proofs", proof.categorySlug, proof.slug);
const statusPath = path.join(workspace, "app", "proof-status", `${proof.id}.json`);
const testDirectory = path.join(workspace, "tests", "proofs");
const testPath = path.join(testDirectory, `${proof.id}.test.ts`);

for (const target of [directory, statusPath, testPath]) {
  try {
    await access(target);
    console.error(`Refusing to overwrite existing proof workspace: ${target}`);
    process.exit(1);
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
}

await mkdir(directory, { recursive: true });
await mkdir(testDirectory, { recursive: true });

const config = `export const proofConfig = ${JSON.stringify(
  {
    id: proof.id,
    title: proof.title,
    category: proof.category?.title ?? proof.categorySlug,
    difficulty: proof.difficulty,
    estimatedTime: proof.estimatedTime,
    description: proof.shortDescription,
  },
  null,
  2,
)} as const;\n`;

const page = `import VisualProofShell from "../../../components/VisualProofShell";\nimport Proof from "./Proof";\nimport { proofConfig } from "./proof.config";\n\nexport default function Page() {\n  return (\n    <VisualProofShell {...proofConfig}>\n      <Proof />\n    </VisualProofShell>\n  );\n}\n`;

const component = `"use client";\n\nimport styles from "./proof.module.css";\n\nexport default function Proof() {\n  return (\n    <div className={styles.proof} data-proof-id="${proof.id}">\n      <p>Build this proof inside its own directory. Use the shared proof engine for interaction.</p>\n    </div>\n  );\n}\n`;

const css = `.proof {\n  min-height: 36rem;\n  padding: 1.5rem;\n  border: 1px solid #dce1f4;\n  border-radius: 1.5rem;\n  background: #fff;\n  box-shadow: 0 12px 30px rgb(26 39 94 / 10%);\n}\n`;

const test = `import { describe, expect, it } from "vitest";\nimport { proofConfig } from "../../app/visual-proofs/${proof.categorySlug}/${proof.slug}/proof.config";\n\ndescribe("${proof.title}", () => {\n  it("keeps its catalog identity isolated", () => {\n    expect(proofConfig.id).toBe("${proof.id}");\n  });\n});\n`;

await Promise.all([
  writeFile(path.join(directory, "page.tsx"), page, { flag: "wx" }),
  writeFile(path.join(directory, "Proof.tsx"), component, { flag: "wx" }),
  writeFile(path.join(directory, "proof.config.ts"), config, { flag: "wx" }),
  writeFile(path.join(directory, "proof.module.css"), css, { flag: "wx" }),
  writeFile(testPath, test, { flag: "wx" }),
  writeFile(
    statusPath,
    `${JSON.stringify(
      {
        version: 1,
        proofId: proof.id,
        categorySlug: proof.categorySlug,
        slug: proof.slug,
        route,
        status: "in-development",
        ...(owner ? { owner } : {}),
      },
      null,
      2,
    )}\n`,
    { flag: "wx" },
  ),
]);

console.log(`Created isolated proof workspace:\n${path.relative(workspace, directory)}\n${path.relative(workspace, statusPath)}\n${path.relative(workspace, testPath)}`);

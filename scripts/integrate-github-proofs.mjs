import {
  copyFileSync,
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from "node:fs";
import path from "node:path";
import process from "node:process";

const workspace = process.cwd();
const sourceRoot = path.resolve(workspace, "..", "maths-visual-proofs-source");
const catalog = JSON.parse(
  readFileSync(path.join(workspace, "app/data/visual-proofs-detailed.json"), "utf8"),
);
const catalogById = new Map(catalog.visualProofs.map((proof) => [proof.id, proof]));

const KEEP = new Map([
  ["pythagorean-area-rearrangement", "Existing verified interactive proof at /proofs/pythagorean-theorem"],
  ["triangle-area-half-rectangle", "Existing interactive proof at /proofs/triangle-area"],
  ["triangle-angle-sum", "Existing interactive proof at /proofs/triangle-angle-sum"],
  ["exterior-angle-theorem", "Existing interactive proof at /proofs/exterior-angle-theorem"],
  ["similar-triangles-proportional-sides", "Existing interactive proof at /proofs/similar-triangles"],
]);

const HARIKISHORE = [
  ["line-rotational-symmetry", "proof/LineRotationalSymmetryProofPage"],
  ["tessellations-repeated-transformations", "proof167/TessellationsRepeatedTransformationsProofPage"],
  ["transformation-matrices-2d", "proof168/TransformationMatrices2DProofPage"],
  ["first-order-differential-equation-slope-field", "proof169/FirstOrderDifferentialEquationSlopeFieldProofPage"],
  ["simple-harmonic-motion", "proof170/SimpleHarmonicMotionProofPage"],
  ["fourier-series-wave-building", "proof171/FourierSeriesWaveBuildingProofPage"],
  ["laplace-transform-decay-system", "proof172/LaplaceTransformDecaySystemProofPage"],
  ["gradient-steepest-increase", "proof173/GradientSteepestIncreaseProofPage"],
  ["divergence-curl-vector-field", "proof174/DivergenceCurlVectorFieldProofPage"],
  ["trapezoidal-rule-numerical-integration", "proof175/TrapezoidalRuleNumericalIntegrationProofPage"],
  ["linear-programming-feasible-region", "proof176/LinearProgrammingFeasibleRegionProofPage"],
  ["arithmetic-progression-equal-steps", "proof177/ArithmeticProgressionEqualStepsProofPage"],
  ["sum-first-n-natural-numbers", "proof178/SumFirstNNaturalNumbersProofPage"],
  ["sum-first-n-odd-numbers", "proof179/SumFirstNOddNumbersProofPage"],
  ["sum-arithmetic-progression", "proof180/SumArithmeticProgressionProofPage"],
  ["geometric-progression-repeated-scaling", "proof181/GeometricProgressionRepeatedScalingProofPage"],
  ["finite-geometric-series-sum", "proof182/FiniteGeometricSeriesSumProofPage"],
  ["sierpinski-retained-area", "proof183/SierpinskiRetainedAreaProofPage"],
  ["sierpinski-removed-square-sum", "proof184/SierpinskiRemovedSquareSumProofPage"],
  ["triangular-numbers", "proof186/TriangularNumbersProofPage"],
  ["square-numbers-odd-layers", "proof187/SquareNumbersOddLayersProofPage"],
  ["fibonacci-sequence-tiling", "proof188/FibonacciSequenceTilingProofPage"],
  ["fibonacci-spiral-approximation", "proof189/FibonacciSpiralApproximationProofPage"],
];

const ISHWARYA = [
  ["integration-by-parts-visual-proof", "068-integration-by-parts", "IntegrationByPartsVisualProofPage"],
  ["even-odd-pairing", "073-even-odd-pairing", "EvenOddPairingProofPage"],
  ["matrix-addition-cell-by-cell", "105-matrix-addition-cell-by-cell", "MatrixAdditionCellByCellProofPage"],
  ["matrix-multiplication-row-column", "106-matrix-multiplication-row-column", "MatrixMultiplicationRowColumnProofPage"],
  ["matrix-linear-transformation-grid", "107-matrix-linear-transformation-grid", "MatrixLinearTransformationGridProofPage"],
  ["determinant-area-scale-factor", "108-determinant-area-scale-factor", "DeterminantAreaScaleFactorProofPage"],
  ["linear-system-line-intersection", "109-linear-system-line-intersection", "LinearSystemLineIntersectionProofPage"],
  ["row-operations-preserve-solutions", "110-row-operations-preserve-solutions", "RowOperationsPreserveSolutionsProofPage"],
  ["eigenvectors-directions-do-not-turn", "111-eigenvectors-directions-do-not-turn", "EigenvectorsDirectionsDoNotTurnProofPage"],
  ["matrix-inverse-undo-transformation", "112-matrix-inverse-undo-transformation", "MatrixInverseUndoTransformationProofPage"],
];

const PAVAN = [
  ["sphere-surface-area-volume", "135-sphere-surface-area-volume"],
  ["composite-solids-and-units", "136-composite-solids-and-units"],
  ["circle-locus-equal-distance", "137-circle-locus-equal-distance"],
  ["parabola-focus-directrix", "138-parabola-focus-directrix"],
  ["ellipse-sum-of-distances", "139-ellipse-sum-of-distances"],
  ["hyperbola-difference-of-distances", "140-hyperbola-difference-of-distances"],
  ["eccentricity-classification", "141-eccentricity-classification"],
  ["cone-slicing-conics", "142-cone-slice-conics"],
  ["parabola-reflective-property", "143-parabola-reflective-property"],
  ["directrix-focus-standard-equations", "144-directrix-focus-standard-equation"],
  ["inequality-number-line", "145-inequality-number-line"],
  ["solving-linear-inequalities", "146-solving-linear-inequalities"],
  ["compound-inequalities-intervals", "147-compound-inequalities-intervals"],
  ["quadratic-inequalities-graph-regions", "148-quadratic-inequalities-graphs-region"],
  ["am-gm-inequality", "149-am-gm-inequality"],
  ["triangle-inequality", "150-triangle-inequality"],
  ["fundamental-theorem-of-calculus", "67-fundamental-theorem-of-calculus"],
  ["optimization-derivative-max-min", "72-optimization-derivative-max-min"],
];

const ASAD = [
  ["riemann-sums-area-under-curve", "65/index.html"],
  ["derivative-of-exponential", "70/graph_lab_complete.html"],
  ["primes-non-rectangular-arrays", "75-code/prime-non-rectangular-arrays-fixed (2).html"],
  ["composites-rectangular-arrays", "76-code/index.html"],
  ["fundamental-theorem-arithmetic-factor-trees", "77-code/index.html"],
  ["euclid-infinitely-many-primes", "78-code/index.html"],
  ["gcd-euclidean-algorithm", "79/index.html"],
  ["lcm-grid-alignment", "80/index.html"],
  ["modular-arithmetic-clock", "81/index.html"],
  ["remainder-pattern-cycles", "82/index.html"],
  ["divisibility-by-3-and-9-digit-sum", "83/index.html"],
  ["irrationality-of-square-root-2", "84/why_sqrt2_irrational.html"],
  ["cross-multiplication-equal-rectangles", "85/index.html"],
];

const ADITYA = [
  ["lesson-01.html", "pythagorean-area-rearrangement"],
  ["lesson-02.html", "area-circle-unrolling"],
  ["lesson-03.html", "circle-to-triangle-uncurling"],
  ["lesson-04.html", "triangle-angle-sum"],
  ["lesson-05.html", "trapezoid-area-duplication"],
  ["lesson-06.html", "parallelogram-area-shearing"],
  ["lesson-07.html", "sum-first-n-odd-numbers"],
  ["lesson-08.html", "sum-first-n-natural-numbers"],
  ["lesson-09.html", "square-of-sum"],
  ["lesson-10.html", "difference-of-squares"],
  ["lesson-11.html", "infinite-geometric-series-convergence"],
  ["lesson-12.html", null],
  ["lesson-13.html", "pyramid-volume-one-third"],
  ["lesson-14.html", "sphere-surface-area-volume"],
  ["lesson-15.html", null],
  ["lesson-16.html", "unit-circle-sine-cosine"],
  ["lesson-17.html", "derivative-of-sine"],
  ["lesson-18.html", null],
  ["lesson-19.html", null],
  ["lesson-20.html", "fibonacci-spiral-approximation"],
  ["lesson-21.html", null],
  ["lesson-22.html", "polygon-interior-angle-sum"],
  ["lesson-23.html", "exterior-angle-sum-polygon"],
  ["lesson-24.html", null],
  ["lesson-25.html", "secant-becomes-tangent"],
  ["lesson-26.html", "fundamental-theorem-of-calculus"],
  ["lesson-27.html", null],
  ["lesson-28.html", "cube-of-sum"],
  ["lesson-29.html", "am-gm-inequality"],
  ["lesson-30.html", "cosine-rule-proof"],
  ["lesson-31.html", "parabola-reflective-property"],
  ["lesson-32.html", null],
];

const claimed = new Map();
const rows = [];
const githubInventory = [];

function ensureDir(dir) {
  mkdirSync(dir, { recursive: true });
}

function rewriteHtml(html) {
  return html
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css",
      "/vendor/katex/katex.min.css",
    )
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js",
      "/vendor/katex/katex.min.js",
    )
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js",
      "/vendor/katex/auto-render.min.js",
    )
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css",
      "/vendor/katex/katex.min.css",
    )
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js",
      "/vendor/katex/katex.min.js",
    )
    .replaceAll(
      "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js",
      "/vendor/katex/auto-render.min.js",
    )
    .replaceAll("../../index.html", "/proofs")
    .replace(
      "</head>",
      `<style>
        .app-sidebar, .sidebar, aside.sidebar, .sfp-sidenav { display: none !important; }
        body { display: block !important; min-height: auto !important; }
        .app-container, .proof-app { padding-left: 0 !important; }
      </style></head>`,
    );
}

function writeManifest(proof, notes) {
  const route = `/visual-proofs/${proof.categorySlug}/${proof.slug}`;
  writeFileSync(
    path.join(workspace, "app/proof-status", `${proof.id}.json`),
    `${JSON.stringify(
      {
        version: 1,
        proofId: proof.id,
        categorySlug: proof.categorySlug,
        slug: proof.slug,
        route,
        status: "interactive",
        owner: "github-intern-import",
        notes,
      },
      null,
      2,
    )}\n`,
  );
}

function writeConfig(proof, directory) {
  writeFileSync(
    path.join(directory, "proof.config.ts"),
    `export const proofConfig = ${JSON.stringify(
      {
        id: proof.id,
        title: proof.title,
        category: proof.categorySlug,
        difficulty: proof.difficulty,
        estimatedTime: proof.estimatedTime,
        description: proof.shortDescription,
      },
      null,
      2,
    )} as const;\n`,
  );
}

function writePage(directory) {
  writeFileSync(
    path.join(directory, "page.tsx"),
    `import VisualProofShell from "../../../components/VisualProofShell";
import Proof from "./Proof";
import { proofConfig } from "./proof.config";

export default function Page() {
  return (
    <VisualProofShell {...proofConfig}>
      <Proof />
    </VisualProofShell>
  );
}
`,
  );
}

function claim(id, githubLabel, sourceType, dependencies, notes) {
  const keep = KEEP.get(id);
  if (keep) {
    rows.push({
      github: githubLabel,
      page: id,
      status: "Existing Better",
      sourceType,
      dependencies,
      notes: keep,
    });
    return false;
  }
  if (claimed.has(id)) {
    rows.push({
      github: githubLabel,
      page: id,
      status: "Duplicate unused",
      sourceType,
      dependencies,
      notes: `Already integrated from ${claimed.get(id)}`,
    });
    return false;
  }
  const proof = catalogById.get(id);
  if (!proof) {
    rows.push({
      github: githubLabel,
      page: "—",
      status: "No Match",
      sourceType,
      dependencies,
      notes,
    });
    return false;
  }
  claimed.set(id, githubLabel);
  return proof;
}

function integrateReactPage(proof, githubLabel, sourceType, dependencies, proofTsx, extraImports) {
  const directory = path.join(
    workspace,
    "app/visual-proofs",
    proof.categorySlug,
    proof.slug,
  );
  ensureDir(directory);
  writeConfig(proof, directory);
  writePage(directory);
  writeFileSync(path.join(directory, "Proof.tsx"), proofTsx);
  writeManifest(proof, `Imported from ${githubLabel}`);
  rows.push({
    github: githubLabel,
    page: `${proof.categorySlug}/${proof.slug}`,
    status: "Integrated",
    sourceType,
    dependencies,
    notes: extraImports ?? "Working React import",
  });
}

function integrateHtml(proof, githubLabel, sourceFile, extraFiles = []) {
  const destDir = path.join(workspace, "public/imported-proofs", proof.id);
  ensureDir(destDir);
  const raw = readFileSync(sourceFile, "utf8");
  writeFileSync(path.join(destDir, "index.html"), rewriteHtml(raw));
  for (const extra of extraFiles) {
    const name = path.basename(extra);
    if (existsSync(extra)) copyFileSync(extra, path.join(destDir, name));
  }
  const directory = path.join(
    workspace,
    "app/visual-proofs",
    proof.categorySlug,
    proof.slug,
  );
  ensureDir(directory);
  writeConfig(proof, directory);
  writePage(directory);
  writeFileSync(
    path.join(directory, "Proof.tsx"),
    `"use client";

import ImportedHtmlProof from "../../../components/ImportedHtmlProof";
import { proofConfig } from "./proof.config";

export default function Proof() {
  return (
    <ImportedHtmlProof
      src="/imported-proofs/${proof.id}/index.html"
      title={proofConfig.title}
    />
  );
}
`,
  );
  writeManifest(proof, `Imported HTML from ${githubLabel}`);
  rows.push({
    github: githubLabel,
    page: `${proof.categorySlug}/${proof.slug}`,
    status: "Integrated",
    sourceType: "HTML/JS",
    dependencies: "local vendor copies where rewritten",
    notes: "Same-origin iframe of copied intern HTML",
  });
}

if (!existsSync(sourceRoot)) {
  console.error(`Missing cloned source at ${sourceRoot}`);
  process.exit(1);
}

ensureDir(path.join(workspace, "app/imported/harikishore"));
cpSync(path.join(sourceRoot, "Harikishore/src/utils"), path.join(workspace, "app/imported/harikishore/utils"), {
  recursive: true,
});
cpSync(path.join(sourceRoot, "Harikishore/src/data"), path.join(workspace, "app/imported/harikishore/data"), {
  recursive: true,
});
cpSync(path.join(sourceRoot, "Harikishore/src/types"), path.join(workspace, "app/imported/harikishore/types"), {
  recursive: true,
});
cpSync(
  path.join(sourceRoot, "Harikishore/src/components/common"),
  path.join(workspace, "app/imported/harikishore/components/common"),
  { recursive: true },
);
for (const dir of readdirSync(path.join(sourceRoot, "Harikishore/src/components"))) {
  if (dir === "common" || dir === "dashboard") continue;
  cpSync(
    path.join(sourceRoot, "Harikishore/src/components", dir),
    path.join(workspace, "app/imported/harikishore/components", dir),
    { recursive: true },
  );
}

for (const [id, componentPath] of HARIKISHORE) {
  githubInventory.push(`Harikishore/${id}`);
  const exportName = componentPath.split("/").at(-1);
  const proof = claim(id, `Harikishore/${id}`, "TSX", "lucide-react, katex, canvas-confetti", "");
  if (!proof) continue;
  integrateReactPage(
    proof,
    `Harikishore/${id}`,
    "TSX",
    "lucide-react, katex, canvas-confetti",
    `"use client";

import { useRouter } from "next/navigation";
import { ${exportName} } from "../../../imported/harikishore/components/${componentPath}";

export default function Proof() {
  const router = useRouter();
  return <${exportName} onBackToDashboard={() => router.push("/proofs")} />;
}
`,
  );
}

for (const dir of readdirSync(path.join(sourceRoot, "Praveen/src/proofs"))) {
  githubInventory.push(`Praveen/${dir}`);
  const proof = claim(dir, `Praveen/${dir}`, "TSX", "lucide-react", "");
  if (!proof) continue;
  const fromDir = path.join(sourceRoot, "Praveen/src/proofs", dir);
  const destDir = path.join(workspace, "app/visual-proofs", proof.categorySlug, proof.slug, "source");
  ensureDir(destDir);
  for (const file of readdirSync(fromDir)) {
    if (file.endsWith(".test.ts")) continue;
    copyFileSync(path.join(fromDir, file), path.join(destDir, file));
  }
  const pageFile = readdirSync(destDir).find((file) => file.endsWith("ProofPage.tsx"));
  const pageSource = readFileSync(path.join(destDir, pageFile), "utf8");
  const exportMatch = pageSource.match(/export function ([A-Za-z0-9_]+)/);
  const exportName = exportMatch?.[1];
  if (!exportName) {
    rows.push({
      github: `Praveen/${dir}`,
      page: proof.id,
      status: "Failed",
      sourceType: "TSX",
      dependencies: "lucide-react",
      notes: "Could not detect exported page component",
    });
    continue;
  }
  integrateReactPage(
    proof,
    `Praveen/${dir}`,
    "TSX",
    "lucide-react",
    `"use client";

import "../../../imported/chrome-overrides.css";
import { ${exportName} } from "./source/${pageFile.replace(".tsx", "")}";

export default function Proof() {
  return <${exportName} />;
}
`,
  );
}

for (const [id, folder, exportName] of ISHWARYA) {
  githubInventory.push(`Ishwarya/${folder}`);
  const proof = claim(id, `Ishwarya/${folder}`, "TSX", "react-katex, katex", "");
  if (!proof) continue;
  const fromDir = path.join(sourceRoot, "Ishwarya/src/proofs", folder);
  const destDir = path.join(workspace, "app/visual-proofs", proof.categorySlug, proof.slug, "source");
  ensureDir(destDir);
  cpSync(fromDir, destDir, { recursive: true });
  integrateReactPage(
    proof,
    `Ishwarya/${folder}`,
    "TSX",
    "react-katex, katex",
    `"use client";

import "../../../imported/chrome-overrides.css";
import ${exportName} from "./source/${exportName}";

export default function Proof() {
  return <${exportName} />;
}
`,
  );
}

for (const [id, folder] of PAVAN) {
  githubInventory.push(`Pavan/${folder}`);
  const proof = claim(id, `Pavan/${folder}`, "HTML/JS", "Three.js/KaTeX when used", "");
  if (!proof) continue;
  integrateHtml(
    proof,
    `Pavan/${folder}`,
    path.join(sourceRoot, "Pavan/projects", folder, "index.html"),
  );
}

for (const [id, rel] of ASAD) {
  githubInventory.push(`Asad/${rel}`);
  const proof = claim(id, `Asad/${rel}`, "HTML/JS", "None", "");
  if (!proof) continue;
  const sourceFile = path.join(sourceRoot, "Asad", rel);
  const extra = [];
  const siblingDir = path.dirname(sourceFile);
  for (const file of readdirSync(siblingDir)) {
    if (file.endsWith(".html")) continue;
    extra.push(path.join(siblingDir, file));
  }
  integrateHtml(proof, `Asad/${rel}`, sourceFile, extra);
}

for (const [file, id] of ADITYA) {
  githubInventory.push(`Aditya/${file}`);
  if (!id) {
    rows.push({
      github: `Aditya/${file}`,
      page: "—",
      status: "No Match",
      sourceType: "HTML/JS",
      dependencies: "None",
      notes: "No corresponding catalog page",
    });
    continue;
  }
  const proof = claim(id, `Aditya/${file}`, "HTML/JS", "None", "");
  if (!proof) continue;
  integrateHtml(proof, `Aditya/${file}`, path.join(sourceRoot, "Aditya", file));
}

for (const proof of catalog.visualProofs) {
  if (KEEP.has(proof.id) || claimed.has(proof.id)) continue;
  rows.push({
    github: "—",
    page: `${proof.categorySlug}/${proof.slug}`,
    status: "No Git Code Yet",
    sourceType: "—",
    dependencies: "—",
    notes: "Catalog placeholder retained",
  });
}

const md = [
  "# Visual Proof GitHub Integration",
  "",
  "Source: `https://github.com/praveenrakesh23/maths-visual-proofs` (cloned beside this repo as `maths-visual-proofs-source`).",
  "",
  `| # | GitHub Proof | Main Project Page | Status | Source Type | Dependencies | Notes |`,
  `| - | ------------ | ----------------- | ------ | ----------- | ------------ | ----- |`,
];

rows.forEach((row, index) => {
  md.push(
    `| ${index + 1} | ${row.github} | ${row.page} | ${row.status} | ${row.sourceType} | ${row.dependencies} | ${row.notes} |`,
  );
});

const counts = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] ?? 0) + 1;
  return acc;
}, {});

md.push("");
md.push("## Counts");
md.push("");
md.push(`- Catalog pages: ${catalog.visualProofs.length}`);
md.push(`- GitHub implementations inventoried: ${githubInventory.length}`);
md.push(`- Integrated: ${counts.Integrated ?? 0}`);
md.push(`- Existing retained: ${counts["Existing Better"] ?? 0}`);
md.push(`- Duplicate GitHub unused: ${counts["Duplicate unused"] ?? 0}`);
md.push(`- GitHub without match: ${counts["No Match"] ?? 0}`);
md.push(`- Catalog still placeholder: ${counts["No Git Code Yet"] ?? 0}`);
md.push(`- Failed: ${counts.Failed ?? 0}`);
md.push("");
md.push("## Dependencies added");
md.push("");
md.push("- `lucide-react` for intern React proofs");
md.push("- `canvas-confetti` for Harikishore challenge completions");
md.push("- `react-katex` for Ishwarya matrix/calculus proofs");
md.push("- Local `/vendor/three.min.js` and `/vendor/katex/*` for HTML proofs that used CDNs");
md.push("");

writeFileSync(path.join(workspace, "VISUAL_PROOF_GIT_INTEGRATION.md"), `${md.join("\n")}\n`);
console.log(`Wrote VISUAL_PROOF_GIT_INTEGRATION.md with ${rows.length} rows`);
console.log(counts);

import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const workspace = process.cwd();
const catalog = JSON.parse(
  readFileSync(path.join(workspace, "app/data/visual-proofs-detailed.json"), "utf8"),
);

const KEEP = new Set([
  "pythagorean-area-rearrangement",
  "triangle-area-half-rectangle",
  "triangle-angle-sum",
  "exterior-angle-theorem",
  "similar-triangles-proportional-sides",
]);

const sources = [
  ...[
    "line-rotational-symmetry",
    "tessellations-repeated-transformations",
    "transformation-matrices-2d",
    "first-order-differential-equation-slope-field",
    "simple-harmonic-motion",
    "fourier-series-wave-building",
    "laplace-transform-decay-system",
    "gradient-steepest-increase",
    "divergence-curl-vector-field",
    "trapezoidal-rule-numerical-integration",
    "linear-programming-feasible-region",
    "arithmetic-progression-equal-steps",
    "sum-first-n-natural-numbers",
    "sum-first-n-odd-numbers",
    "sum-arithmetic-progression",
    "geometric-progression-repeated-scaling",
    "finite-geometric-series-sum",
    "sierpinski-retained-area",
    "sierpinski-removed-square-sum",
    "triangular-numbers",
    "square-numbers-odd-layers",
    "fibonacci-sequence-tiling",
    "fibonacci-spiral-approximation",
  ].map((id) => ({ id, github: `Harikishore/${id}`, type: "TSX", intern: "Harikishore" })),
  ...[
    "derivative-of-sine",
    "divisibility-by-11",
    "divisibility-by-3",
    "divisibility-by-9",
    "divisibility-equal-grouping",
    "even-number-sum",
    "exponent-product-rule",
    "exponent-quotient-rule",
    "exterior-angle-sum-polygon",
    "herons-formula-visual-proof",
    "negative-exponent-rule",
    "power-of-a-power-rule",
    "pyramid-volume-one-third",
    "shoelace-formula",
    "zero-exponent-rule",
  ].map((id) => ({ id, github: `Praveen/${id}`, type: "TSX", intern: "Praveen" })),
  ...[
    ["integration-by-parts-visual-proof", "068-integration-by-parts"],
    ["even-odd-pairing", "073-even-odd-pairing"],
    ["matrix-addition-cell-by-cell", "105-matrix-addition-cell-by-cell"],
    ["matrix-multiplication-row-column", "106-matrix-multiplication-row-column"],
    ["matrix-linear-transformation-grid", "107-matrix-linear-transformation-grid"],
    ["determinant-area-scale-factor", "108-determinant-area-scale-factor"],
    ["linear-system-line-intersection", "109-linear-system-line-intersection"],
    ["row-operations-preserve-solutions", "110-row-operations-preserve-solutions"],
    ["eigenvectors-directions-do-not-turn", "111-eigenvectors-directions-do-not-turn"],
    ["matrix-inverse-undo-transformation", "112-matrix-inverse-undo-transformation"],
  ].map(([id, folder]) => ({ id, github: `Ishwarya/${folder}`, type: "TSX", intern: "Ishwarya" })),
  ...[
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
  ].map(([id, folder]) => ({ id, github: `Pavan/${folder}`, type: "HTML", intern: "Pavan" })),
  ...[
    ["riemann-sums-area-under-curve", "65"],
    ["derivative-of-exponential", "70"],
    ["primes-non-rectangular-arrays", "75-code"],
    ["composites-rectangular-arrays", "76-code"],
    ["fundamental-theorem-arithmetic-factor-trees", "77-code"],
    ["euclid-infinitely-many-primes", "78-code"],
    ["gcd-euclidean-algorithm", "79"],
    ["lcm-grid-alignment", "80"],
    ["modular-arithmetic-clock", "81"],
    ["remainder-pattern-cycles", "82"],
    ["divisibility-by-3-and-9-digit-sum", "83"],
    ["irrationality-of-square-root-2", "84"],
    ["cross-multiplication-equal-rectangles", "85"],
  ].map(([id, folder]) => ({ id, github: `Asad/${folder}`, type: "HTML", intern: "Asad" })),
  ...[
    ["lesson-01", "pythagorean-area-rearrangement"],
    ["lesson-02", "area-circle-unrolling"],
    ["lesson-03", "circle-to-triangle-uncurling"],
    ["lesson-04", "triangle-angle-sum"],
    ["lesson-05", "trapezoid-area-duplication"],
    ["lesson-06", "parallelogram-area-shearing"],
    ["lesson-07", "sum-first-n-odd-numbers"],
    ["lesson-08", "sum-first-n-natural-numbers"],
    ["lesson-09", "square-of-sum"],
    ["lesson-10", "difference-of-squares"],
    ["lesson-11", "infinite-geometric-series-convergence"],
    ["lesson-12", null],
    ["lesson-13", "pyramid-volume-one-third"],
    ["lesson-14", "sphere-surface-area-volume"],
    ["lesson-15", null],
    ["lesson-16", "unit-circle-sine-cosine"],
    ["lesson-17", "derivative-of-sine"],
    ["lesson-18", null],
    ["lesson-19", null],
    ["lesson-20", "fibonacci-spiral-approximation"],
    ["lesson-21", null],
    ["lesson-22", "polygon-interior-angle-sum"],
    ["lesson-23", "exterior-angle-sum-polygon"],
    ["lesson-24", null],
    ["lesson-25", "secant-becomes-tangent"],
    ["lesson-26", "fundamental-theorem-of-calculus"],
    ["lesson-27", null],
    ["lesson-28", "cube-of-sum"],
    ["lesson-29", "am-gm-inequality"],
    ["lesson-30", "cosine-rule-proof"],
    ["lesson-31", "parabola-reflective-property"],
    ["lesson-32", null],
  ].map(([file, id]) => ({
    id,
    github: `Aditya/${file}.html`,
    type: "HTML",
    intern: "Aditya",
  })),
];

const priority = { Harikishore: 1, Praveen: 2, Ishwarya: 3, Pavan: 4, Asad: 5, Aditya: 6 };
const byId = new Map();
const unmatched = [];
for (const src of sources) {
  if (!src.id) {
    unmatched.push(src);
    continue;
  }
  if (!catalog.visualProofs.some((p) => p.id === src.id)) {
    unmatched.push(src);
    continue;
  }
  const prev = byId.get(src.id);
  if (!prev || priority[src.intern] < priority[prev.intern]) byId.set(src.id, src);
}

const willIntegrate = [];
const keepRows = [];
for (const proof of catalog.visualProofs) {
  if (KEEP.has(proof.id)) {
    keepRows.push(proof);
    continue;
  }
  const src = byId.get(proof.id);
  if (src) willIntegrate.push({ proof, src });
}

const missing = catalog.visualProofs.filter(
  (proof) => !KEEP.has(proof.id) && !byId.has(proof.id),
);

writeFileSync(
  path.join(workspace, "VISUAL_PROOF_INVENTORY.json"),
  JSON.stringify(
    {
      catalog: catalog.visualProofs.length,
      githubSources: sources.length,
      keep: keepRows.map((p) => p.id),
      willIntegrate: willIntegrate.map(({ proof, src }) => ({
        id: proof.id,
        title: proof.title,
        category: proof.categorySlug,
        github: src.github,
        type: src.type,
      })),
      missing: missing.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.categorySlug,
      })),
      unmatchedGithub: unmatched,
    },
    null,
    2,
  ),
);

console.log(
  JSON.stringify(
    {
      catalog: catalog.visualProofs.length,
      githubSources: sources.length,
      keep: keepRows.length,
      willIntegrate: willIntegrate.length,
      missing: missing.length,
      unmatchedGithub: unmatched.length,
    },
    null,
    2,
  ),
);

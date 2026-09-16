import catalogData from "../data/visual-proofs-detailed.json";
import type { CatalogVisualProof } from "./visualProofCatalog";
import type { ProofImplementationStatus } from "./proofImplementation";

export type ProofReadiness = "upcoming" | "interactive" | "verified";

export type ProofFeel = {
  proofId: string;
  methodLabel: string;
  methodGlyph: string;
  doThis: string;
  provedWhen: string;
  uxEnhancement: string;
  tone: string;
};

type ModelFeel = {
  methodLabel: string;
  methodGlyph: string;
  doThis: string;
  provedWhenTemplate: (proof: CatalogVisualProof) => string;
  uxEnhancement: (proof: CatalogVisualProof) => string;
  tone: string;
};

const MODEL_FEEL: Record<string, ModelFeel> = {
  "area-rearrangement": {
    methodLabel: "Area rearrangement",
    methodGlyph: "◫",
    doThis: "Slide pieces until leftover regions match",
    provedWhenTemplate: (proof) =>
      `When the leftover areas lock together, ${stripTrailingPeriod(proof.shortDescription)} — and the equality is something you can see.`,
    uxEnhancement: (proof) =>
      `Magnetic snap on ${primaryTag(proof)} pieces, then a brief flash when leftover areas become equal.`,
    tone: "rearrange",
  },
  "angle-model": {
    methodLabel: "Angle gathering",
    methodGlyph: "∠",
    doThis: "Lift or copy angles onto a straight line or matching arc",
    provedWhenTemplate: (proof) =>
      `The moment the angles fill the target without gaps, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: (proof) =>
      `Detachable angle wedges with a living degree readout that hits ${proof.tags.includes("180") || proof.title.toLowerCase().includes("180") ? "180°" : "the target measure"} and celebrates the seal.`,
    tone: "angle",
  },
  "measurement-scene": {
    methodLabel: "Live measurement",
    methodGlyph: "⌖",
    doThis: "Roll, unwrap, or grow the figure while measures update",
    provedWhenTemplate: (proof) =>
      `Watch the measured lengths/areas converge: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Paired measure callouts that morph into the formula tokens as the construction finishes one full motion.`,
    tone: "measure",
  },
  "tile-model": {
    methodLabel: "Tile & count",
    methodGlyph: "▦",
    doThis: "Lay tiles until the pattern completes a known shape",
    provedWhenTemplate: (proof) =>
      `Counting the finished tiling makes the identity unavoidable: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Ghost target outline for ${primaryTag(proof)}; tiles click into a lattice and the running count becomes the closed form.`,
    tone: "tile",
  },
  "graph-limit": {
    methodLabel: "Graph & limit",
    methodGlyph: "∿",
    doThis: "Tighten a parameter and watch the graph settle",
    provedWhenTemplate: (proof) =>
      `As the parameter approaches the limit, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: () =>
      `Scrubbable ε/δ or n→∞ slider with a “settling trail” that fades into the limiting curve.`,
    tone: "limit",
  },
  "coordinate-grid": {
    methodLabel: "Coordinate argument",
    methodGlyph: "▦",
    doThis: "Drag points on the grid and read the invariant",
    provedWhenTemplate: (proof) =>
      `Coordinates make the claim concrete: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Live coordinate badges on vertices plus a highlighted invariant (distance, slope, or midpoint) that stays constant under allowed moves.`,
    tone: "grid",
  },
  "transformation-grid": {
    methodLabel: "Transformation",
    methodGlyph: "↻",
    doThis: "Apply the transform and compare before/after figures",
    provedWhenTemplate: (proof) =>
      `After the motion finishes, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: () =>
      `Ghost “before” silhouette that stays while the image morphs; invariants pulse green, non-invariants dim.`,
    tone: "transform",
  },
  "number-model": {
    methodLabel: "Number model",
    methodGlyph: "#",
    doThis: "Group, pair, or rearrange counters into a clear structure",
    provedWhenTemplate: (proof) =>
      `The structure of the counters is the proof: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Color-coded ${primaryTag(proof)} counters that auto-pack into columns/pairs, with remainder lanes for what cannot fit.`,
    tone: "number",
  },
  "comparison-model": {
    methodLabel: "Side-by-side compare",
    methodGlyph: "⇔",
    doThis: "Align two constructions and spot what must match",
    provedWhenTemplate: (proof) =>
      `When both sides match, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: () =>
      `Split canvas with a “balance beam” meter that tips to equality only when corresponding parts coincide.`,
    tone: "compare",
  },
  "simulation-board": {
    methodLabel: "Simulation board",
    methodGlyph: "◎",
    doThis: "Run trials and watch the long-run pattern emerge",
    provedWhenTemplate: (proof) =>
      `After enough trials, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: () =>
      `Trial stamp animation feeding a growing histogram; a target curve overlays once the sample is large enough.`,
    tone: "simulate",
  },
  "data-display": {
    methodLabel: "Data display",
    methodGlyph: "▥",
    doThis: "Reshape the same data and keep the summary honest",
    provedWhenTemplate: (proof) =>
      `Different pictures, same truth: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Linked highlighting across chart forms so selecting one bin lights the matching raw values.`,
    tone: "data",
  },
  "vector-field": {
    methodLabel: "Vector field",
    methodGlyph: "→",
    doThis: "Trace flow lines or combine vectors tip-to-tail",
    provedWhenTemplate: (proof) =>
      `Following the field makes the claim visible: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Particle tracers with optional path integral readout; curl/divergence glyphs appear only where the field warrants them.`,
    tone: "vector",
  },
  "complex-plane": {
    methodLabel: "Complex plane",
    methodGlyph: "ℂ",
    doThis: "Rotate and scale arrows in the Argand plane",
    provedWhenTemplate: (proof) =>
      `Geometry of arrows replaces algebra: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Draggable Argand arrows with polar guides; multiplication becomes a rotate-and-stretch that you feel.`,
    tone: "complex",
  },
  "growth-scale": {
    methodLabel: "Growth & scale",
    methodGlyph: "⤴",
    doThis: "Stack or scale layers and read the exponent change",
    provedWhenTemplate: (proof) =>
      `Scaling the figure rewrites the exponent: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Layer stack that merges/splits with a log-scale ruler so product/quotient rules appear as height changes.`,
    tone: "growth",
  },
  "applied-system": {
    methodLabel: "Applied system",
    methodGlyph: "⚙",
    doThis: "Tune the system and watch the governing relation hold",
    provedWhenTemplate: (proof) =>
      `The system cannot violate the relation: ${stripTrailingPeriod(proof.shortDescription)}.`,
    uxEnhancement: () =>
      `Linked sliders for real-world knobs with a formula HUD that stays satisfied under every legal tweak.`,
    tone: "applied",
  },
  "pattern-model": {
    methodLabel: "Pattern discovery",
    methodGlyph: "✣",
    doThis: "Build the next terms until the pattern forces the formula",
    provedWhenTemplate: (proof) =>
      `Once the pattern locks, ${stripTrailingPeriod(proof.shortDescription).toLowerCase()}.`,
    uxEnhancement: (proof) =>
      `Predict-the-next-term gate before revealing the closed form for ${proof.title.replace(/^The\s+/i, "")}.`,
    tone: "pattern",
  },
};

const FALLBACK_MODEL: ModelFeel = {
  methodLabel: "Visual argument",
  methodGlyph: "✦",
  doThis: "Manipulate the figure until the claim is forced",
  provedWhenTemplate: (proof) =>
    `You prove it by seeing it: ${stripTrailingPeriod(proof.shortDescription)}.`,
  uxEnhancement: () =>
    `Step-locked interactions with a final “proved” seal when the construction matches the statement.`,
  tone: "general",
};

function stripTrailingPeriod(text: string) {
  return text.replace(/\.\s*$/, "");
}

function primaryTag(proof: CatalogVisualProof) {
  return proof.tags[0] ?? proof.categorySlug.replaceAll("-", " ");
}

function sentenceCase(text: string) {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/** User-facing readiness: planned/in-development show as Upcoming. */
export function readinessForStatus(
  status: ProofImplementationStatus | null | undefined,
): ProofReadiness {
  if (status === "verified") return "verified";
  if (status === "interactive") return "interactive";
  return "upcoming";
}

export function readinessLabel(readiness: ProofReadiness): string {
  switch (readiness) {
    case "verified":
      return "Visually verified";
    case "interactive":
      return "Interactive";
    case "upcoming":
      return "Upcoming";
  }
}

export function getProofFeel(proof: CatalogVisualProof): ProofFeel {
  const model = MODEL_FEEL[proof.proofLearningModel] ?? FALLBACK_MODEL;
  return {
    proofId: proof.id,
    methodLabel: model.methodLabel,
    methodGlyph: model.methodGlyph,
    doThis: model.doThis,
    provedWhen: sentenceCase(model.provedWhenTemplate(proof)),
    uxEnhancement: model.uxEnhancement(proof),
    tone: model.tone,
  };
}

const proofsById = new Map(
  (catalogData as { visualProofs: CatalogVisualProof[] }).visualProofs.map(
    (proof) => [proof.id, proof],
  ),
);

export function getProofFeelById(proofId: string): ProofFeel | null {
  const proof = proofsById.get(proofId);
  return proof ? getProofFeel(proof) : null;
}

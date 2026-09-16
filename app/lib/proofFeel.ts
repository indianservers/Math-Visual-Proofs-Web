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
      `When the leftover areas lock together, ${asClause(proof.shortDescription)} — and the equality is something you can see.`,
    uxEnhancement: (proof) =>
      `Magnetic snap while you ${verbFrom(proof)} — leftover regions flash when they become equal for ${proof.title}.`,
    tone: "rearrange",
  },
  "angle-model": {
    methodLabel: "Angle gathering",
    methodGlyph: "∠",
    doThis: "Lift or copy angles onto a straight line or matching arc",
    provedWhenTemplate: (proof) =>
      `The moment the angles fill the target without gaps, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Detachable angle wedges with a live degree readout that seals at the target for ${shortTitle(proof)}.`,
    tone: "angle",
  },
  "measurement-scene": {
    methodLabel: "Live measurement",
    methodGlyph: "⌖",
    doThis: "Roll, unwrap, or grow the figure while measures update",
    provedWhenTemplate: (proof) =>
      `Watch the measured lengths/areas converge: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Paired measure callouts that morph into the formula as you ${verbFrom(proof)} in ${shortTitle(proof)}.`,
    tone: "measure",
  },
  "tile-model": {
    methodLabel: "Tile & count",
    methodGlyph: "▦",
    doThis: "Lay tiles until the pattern completes a known shape",
    provedWhenTemplate: (proof) =>
      `Counting the finished tiling makes the identity unavoidable: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Ghost outline for ${primaryTag(proof)}; tiles click into place while a running count becomes the closed form of ${shortTitle(proof)}.`,
    tone: "tile",
  },
  "graph-limit": {
    methodLabel: "Graph & limit",
    methodGlyph: "∿",
    doThis: "Tighten a parameter and watch the graph settle",
    provedWhenTemplate: (proof) =>
      `As the parameter approaches the limit, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Scrubbable limit slider with a settling trail that fades into the limiting curve for ${shortTitle(proof)}.`,
    tone: "limit",
  },
  "coordinate-grid": {
    methodLabel: "Coordinate argument",
    methodGlyph: "▦",
    doThis: "Drag points on the grid and read the invariant",
    provedWhenTemplate: (proof) =>
      `Coordinates make the claim concrete: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Live coordinate badges plus a highlighted invariant that stays constant while you explore ${shortTitle(proof)}.`,
    tone: "grid",
  },
  "transformation-grid": {
    methodLabel: "Transformation",
    methodGlyph: "↻",
    doThis: "Apply the transform and compare before/after figures",
    provedWhenTemplate: (proof) =>
      `After the motion finishes, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Ghost “before” silhouette while the image morphs; invariants pulse as you complete ${shortTitle(proof)}.`,
    tone: "transform",
  },
  "number-model": {
    methodLabel: "Number model",
    methodGlyph: "#",
    doThis: "Group, pair, or rearrange counters into a clear structure",
    provedWhenTemplate: (proof) =>
      `The structure of the counters is the proof: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Color-coded ${primaryTag(proof)} counters that pack into structure with remainder lanes for ${shortTitle(proof)}.`,
    tone: "number",
  },
  "comparison-model": {
    methodLabel: "Side-by-side compare",
    methodGlyph: "⇔",
    doThis: "Align two constructions and spot what must match",
    provedWhenTemplate: (proof) =>
      `When both sides match, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Split canvas with a balance meter that tips to equality only when ${shortTitle(proof)} lines up.`,
    tone: "compare",
  },
  "simulation-board": {
    methodLabel: "Simulation board",
    methodGlyph: "◎",
    doThis: "Run trials and watch the long-run pattern emerge",
    provedWhenTemplate: (proof) =>
      `After enough trials, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Trial stamps feed a growing histogram that overlays the target curve for ${shortTitle(proof)}.`,
    tone: "simulate",
  },
  "data-display": {
    methodLabel: "Data display",
    methodGlyph: "▥",
    doThis: "Reshape the same data and keep the summary honest",
    provedWhenTemplate: (proof) =>
      `Different pictures, same truth: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Linked highlighting across chart forms so selecting one part lights matching values in ${shortTitle(proof)}.`,
    tone: "data",
  },
  "vector-field": {
    methodLabel: "Vector field",
    methodGlyph: "→",
    doThis: "Trace flow lines or combine vectors tip-to-tail",
    provedWhenTemplate: (proof) =>
      `Following the field makes the claim visible: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Particle tracers with optional path readouts tailored to ${shortTitle(proof)}.`,
    tone: "vector",
  },
  "complex-plane": {
    methodLabel: "Complex plane",
    methodGlyph: "ℂ",
    doThis: "Rotate and scale arrows in the Argand plane",
    provedWhenTemplate: (proof) =>
      `Geometry of arrows replaces algebra: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Draggable Argand arrows with polar guides so ${shortTitle(proof)} becomes rotate-and-stretch.`,
    tone: "complex",
  },
  "growth-scale": {
    methodLabel: "Growth & scale",
    methodGlyph: "⤴",
    doThis: "Stack or scale layers and read the exponent change",
    provedWhenTemplate: (proof) =>
      `Scaling the figure rewrites the exponent: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Layer stack that merges/splits with a log-scale ruler for ${shortTitle(proof)}.`,
    tone: "growth",
  },
  "applied-system": {
    methodLabel: "Applied system",
    methodGlyph: "⚙",
    doThis: "Tune the system and watch the governing relation hold",
    provedWhenTemplate: (proof) =>
      `The system cannot violate the relation: ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Linked real-world knobs with a formula HUD that stays satisfied throughout ${shortTitle(proof)}.`,
    tone: "applied",
  },
  "pattern-model": {
    methodLabel: "Pattern discovery",
    methodGlyph: "✣",
    doThis: "Build the next terms until the pattern forces the formula",
    provedWhenTemplate: (proof) =>
      `Once the pattern locks, ${asClause(proof.shortDescription)}.`,
    uxEnhancement: (proof) =>
      `Predict-the-next-term gate before revealing the closed form in ${shortTitle(proof)}.`,
    tone: "pattern",
  },
};

const FALLBACK_MODEL: ModelFeel = {
  methodLabel: "Visual argument",
  methodGlyph: "✦",
  doThis: "Manipulate the figure until the claim is forced",
  provedWhenTemplate: (proof) =>
    `You prove it by seeing it: ${asClause(proof.shortDescription)}.`,
  uxEnhancement: (proof) =>
    `Step-locked interactions with a final “proved” seal when ${shortTitle(proof)} matches the statement.`,
  tone: "general",
};

function stripTrailingPeriod(text: string) {
  return text.replace(/\.\s*$/, "");
}

function primaryTag(proof: CatalogVisualProof) {
  return proof.tags[0] ?? proof.categorySlug.replaceAll("-", " ");
}

function shortTitle(proof: CatalogVisualProof) {
  return proof.title.replace(/^The\s+/i, "");
}

function verbFrom(proof: CatalogVisualProof) {
  const lead = proof.shortDescription.trim().split(/\s+/)[0]?.toLowerCase();
  if (!lead) return "explore the figure";
  if (lead.endsWith("e")) return `${lead.slice(0, -1)}ing`;
  if (lead.endsWith("y")) return `${lead.slice(0, -1)}ying`;
  return `${lead}ing`;
}

function asClause(text: string) {
  const stripped = stripTrailingPeriod(text).trim();
  if (!stripped) return stripped;
  return stripped.charAt(0).toLowerCase() + stripped.slice(1);
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

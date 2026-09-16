"use client";

import { Puzzle, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import {
  InvariantIndicator,
  ProofStepNavigator,
} from "../../../proof-engine/ProofUI";
import { factorQuadratic, matchesFactorPair } from "./factorMath";
import styles from "./proof.module.css";

const OX = 40;
const OY = 40;
const WIDTH = 460;
const HEIGHT = 380;
const X = 150;
const MIN = 30;
const MAX = 120;

type DragTarget = "m" | "n";
type PieceId = "x2" | "mx" | "nx" | "mn";

export default function Proof() {
  const [m, setM] = useState(50);
  const [n, setN] = useState(70);
  const [selected, setSelected] = useState<PieceId | null>("x2");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = factorQuadratic(m, n);
  const targetP = 120;
  const targetQ = 3500;
  const matched = matchesFactorPair(targetP, targetQ, m, n);
  const step = revealed.length >= 4 ? (matched ? 2 : 1) : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 4 && matched;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (target, point) => {
    if (target === "m") setM(Math.min(MAX, Math.max(MIN, point.y - (OY + X))));
    else setN(Math.min(MAX, Math.max(MIN, point.x - (OX + X))));
  });

  const items = useMemo(
    () =>
      [
        { id: "x2" as const, label: "x²", color: "#9bb6ff", complete: revealed.includes("x2") },
        { id: "mx" as const, label: "mx", color: "#f0a37a", complete: revealed.includes("mx") },
        { id: "nx" as const, label: "nx", color: "#f0c27a", complete: revealed.includes("nx") },
        { id: "mn" as const, label: "mn", color: "#7dcaa4", complete: revealed.includes("mn") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className={styles.proof} data-proof-id="quadratic-factorization-area-model">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Choose <MathFormula latex="m,n" /> so{" "}
            <MathFormula latex={`p=m+n=${targetP}`} /> and{" "}
            <MathFormula latex={`q=mn=${targetQ}`} />, then read{" "}
            <MathFormula latex="(x+m)(x+n)" />.
          </p>
        </div>
      </div>

      <ProofStepNavigator labels={["Pick m,n", "Build rectangle", "Match p,q"]} active={step} />

      <CanvasNavigator
        items={items}
        selectedId={selected}
        onSelect={reveal}
        onNudge={() => undefined}
        zoomPercent={100}
        canZoomIn={false}
        canZoomOut={false}
        onZoomIn={() => undefined}
        onZoomOut={() => undefined}
        onFit={() => undefined}
        completedCount={revealed.length}
        instruction="Reveal tiles, then drag m and n until p and q match the target."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setM(50);
            setN(70);
            setRevealed([]);
            setSelected("x2");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() => {
            setM(50);
            setN(70);
            setRevealed(["x2", "mx", "nx", "mn"]);
          }}
        >
          <Puzzle size={14} aria-hidden /> Snap factors
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Quadratic factorization area model"
      >
        <ProofShape
          geometry={{ kind: "rectangle", width: X, height: X }}
          transform={{ x: OX, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("x2") ? "#dfe9ff" : "#eef1f8",
            stroke: "#3f56c7",
            strokeWidth: 2.5,
          }}
          accessibleLabel="x squared"
          selected={selected === "x2"}
          onPointerDown={() => reveal("x2")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: X, height: m }}
          transform={{ x: OX, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("mx") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("mx") ? 0.95 : 0.35,
          }}
          accessibleLabel="mx"
          selected={selected === "mx"}
          onPointerDown={() => reveal("mx")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: n, height: X }}
          transform={{ x: OX + X, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("nx") ? "#f8d9ad" : "transparent",
            stroke: "#c47a20",
            strokeWidth: 2,
            opacity: revealed.includes("nx") ? 0.95 : 0.35,
          }}
          accessibleLabel="nx"
          selected={selected === "nx"}
          onPointerDown={() => reveal("nx")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: n, height: m }}
          transform={{ x: OX + X, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("mn") ? "#b8e7cf" : "#edf0f8",
            stroke: "#1f8a55",
            strokeWidth: 2.5,
          }}
          accessibleLabel="mn"
          selected={selected === "mn"}
          onPointerDown={() => reveal("mn")}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{ x: OX + X / 2, y: OY + X + m + 16, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag m"
          onPointerDown={(event) => canvas.beginDrag("m", event)}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{ x: OX + X + n + 16, y: OY + X / 2, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag n"
          onPointerDown={(event) => canvas.beginDrag("n", event)}
        />
        <text x={OX} y={OY + X + m + 40} className={styles.label}>
          m={m.toFixed(0)} n={n.toFixed(0)} · p={model.p} q={model.q}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="p" label={`${model.p} / ${targetP}`} complete={model.p === targetP} />
        <InvariantIndicator icon="q" label={`${model.q} / ${targetQ}`} complete={model.q === targetQ} />
        <InvariantIndicator icon="()" label={`(x+${m.toFixed(0)})(x+${n.toFixed(0)})`} complete={proved} />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`x^2+px+q=(x+m)(x+n)=x^2+${model.p}x+${model.q}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: the factor rectangle dimensions are exactly m and n.
        </div>
      )}
    </div>
  );
}

"use client";

import { RotateCcw, SquarePlus, Target } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import {
  InvariantIndicator,
  ProofStepNavigator,
} from "../../../proof-engine/ProofUI";
import { completeTheSquare } from "./completeSquareMath";
import styles from "./proof.module.css";

const OX = 40;
const OY = 40;
const WIDTH = 460;
const HEIGHT = 400;
const X = 160;
const MIN_B = 40;
const MAX_B = 140;

type DragTarget = "b";
type PieceId = "x2" | "strip" | "corner";

export default function Proof() {
  const [b, setB] = useState(80);
  const [selected, setSelected] = useState<PieceId | null>("x2");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = completeTheSquare(X, b);
  const half = b / 2;
  const step = revealed.includes("corner") ? 2 : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 3;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (_target, point) => {
    setB(Math.min(MAX_B, Math.max(MIN_B, 2 * (point.x - (OX + X)))));
  });

  const items = useMemo(
    () =>
      [
        { id: "x2" as const, label: "x²", color: "#9bb6ff", complete: revealed.includes("x2") },
        { id: "strip" as const, label: "bx", color: "#f0a37a", complete: revealed.includes("strip") },
        { id: "corner" as const, label: "(b/2)²", color: "#7dcaa4", complete: revealed.includes("corner") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className={styles.proof} data-proof-id="completing-the-square">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Split <MathFormula latex="bx" /> into two strips and add the missing{" "}
            <MathFormula latex="(b/2)^2" /> corner.
          </p>
        </div>
      </div>

      <ProofStepNavigator labels={["x² + bx", "Split strips", "Add corner"]} active={step} />

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
        instruction="Reveal x² and the bx strips, then place the missing corner square."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setB(80);
            setRevealed([]);
            setSelected("x2");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() => setRevealed(["x2", "strip", "corner"])}
        >
          <SquarePlus size={14} aria-hidden /> Complete square
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Completing the square area model"
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
          geometry={{ kind: "rectangle", width: half, height: X }}
          transform={{ x: OX + X, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("strip") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("strip") ? 0.95 : 0.35,
          }}
          accessibleLabel="Right bx half-strip"
          selected={selected === "strip"}
          onPointerDown={() => reveal("strip")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: X, height: half }}
          transform={{ x: OX, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("strip") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("strip") ? 0.95 : 0.35,
          }}
          accessibleLabel="Bottom bx half-strip"
          selected={selected === "strip"}
          onPointerDown={() => reveal("strip")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: half, height: half }}
          transform={{ x: OX + X, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("corner") ? "#b8e7cf" : "#edf0f8",
            stroke: "#1f8a55",
            strokeWidth: 2.5,
            opacity: revealed.includes("corner") ? 1 : 0.45,
          }}
          accessibleLabel="Missing corner (b/2) squared"
          selected={selected === "corner"}
          onPointerDown={() => reveal("corner")}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{ x: OX + X + half, y: OY + X / 2, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag to change b"
          onPointerDown={(event) => canvas.beginDrag("b", event)}
        />
        <text x={OX} y={OY + X + half + 32} className={styles.label}>
          x={X} · b={b.toFixed(0)} · b/2={half.toFixed(0)}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="x²" label={`${model.x2}`} complete={revealed.includes("x2")} />
        <InvariantIndicator icon="bx" label={`${model.bx}`} complete={revealed.includes("strip")} />
        <InvariantIndicator
          icon="(b/2)²"
          label={`${model.corner}`}
          complete={revealed.includes("corner")}
        />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`x^2+bx+(b/2)^2=(x+b/2)^2=${model.completed}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: the missing corner completes a square of side x + b/2.
        </div>
      )}
    </div>
  );
}

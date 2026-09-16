"use client";

import { RotateCcw, Target, Square } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import { InvariantIndicator, ProofStepNavigator } from "../../../proof-engine/ProofUI";
import { expandSquareOfDifference, isValidPair } from "./squareDiffMath";
import styles from "./proof.module.css";

const A = 220;
const ORIGIN_X = 40;
const ORIGIN_Y = 40;
const WIDTH = 420;
const HEIGHT = 360;
const MIN_B = 30;
const MAX_B = 140;

type DragTarget = "b-handle";
type PieceId = "a2" | "stripH" | "stripV" | "b2";

export default function Proof() {
  const [b, setB] = useState(70);
  const [selected, setSelected] = useState<PieceId | null>("a2");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = expandSquareOfDifference(A, b);
  const unit = A; // visual pixels represent length a
  const bPx = b;
  const leftover = A - b;
  const valid = isValidPair(A, b);
  const step = revealed.length >= 4 ? 2 : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 4 && valid;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (_target, point) => {
    const next = Math.min(MAX_B, Math.max(MIN_B, point.x - ORIGIN_X));
    setB(next);
  });

  const items = useMemo(
    () =>
      [
        { id: "a2" as const, label: "a²", color: "#9bb6ff", complete: revealed.includes("a2") },
        { id: "stripH" as const, label: "ab", color: "#f0a37a", complete: revealed.includes("stripH") },
        { id: "stripV" as const, label: "ab", color: "#f0a37a", complete: revealed.includes("stripV") },
        { id: "b2" as const, label: "b²", color: "#7dcaa4", complete: revealed.includes("b2") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className={styles.proof} data-proof-id="square-of-difference">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Drag <i>b</i> and reveal regions to see why{" "}
            <MathFormula latex="(a-b)^2 = a^2 - 2ab + b^2" />.
          </p>
        </div>
      </div>

      <ProofStepNavigator
        labels={["Set b", "Remove strips", "Add b²"]}
        active={step}
      />

      <CanvasNavigator
        items={items}
        selectedId={selected}
        onSelect={reveal}
        onNudge={() => {
          /* keyboard nudge not required for this area model */
        }}
        zoomPercent={100}
        canZoomIn={false}
        canZoomOut={false}
        onZoomIn={() => undefined}
        onZoomOut={() => undefined}
        onFit={() => undefined}
        completedCount={revealed.length}
        instruction="Select each area term, then drag the b-handle on the canvas."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setB(70);
            setRevealed([]);
            setSelected("a2");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button type="button" onClick={() => setRevealed(["a2", "stripH", "stripV", "b2"])}>
          <Square size={14} aria-hidden /> Reveal all
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Square of difference area model"
      >
        {/* a² outer square */}
        <ProofShape
          geometry={{ kind: "rectangle", width: unit, height: unit }}
          transform={{ x: ORIGIN_X, y: ORIGIN_Y, rotation: 0 }}
          appearance={{
            fill: revealed.includes("a2") ? "#dfe9ff" : "#eef1f8",
            stroke: "#3f56c7",
            strokeWidth: 2.5,
          }}
          accessibleLabel="Square of side a"
          selected={selected === "a2"}
          onPointerDown={() => reveal("a2")}
        />

        {/* horizontal ab strip */}
        <ProofShape
          geometry={{ kind: "rectangle", width: unit, height: bPx }}
          transform={{
            x: ORIGIN_X,
            y: ORIGIN_Y + leftover,
            rotation: 0,
          }}
          appearance={{
            fill: revealed.includes("stripH") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("stripH") ? 0.9 : 0.35,
          }}
          accessibleLabel="Horizontal ab strip"
          selected={selected === "stripH"}
          onPointerDown={() => reveal("stripH")}
        />

        {/* vertical ab strip */}
        <ProofShape
          geometry={{ kind: "rectangle", width: bPx, height: leftover }}
          transform={{ x: ORIGIN_X + leftover, y: ORIGIN_Y, rotation: 0 }}
          appearance={{
            fill: revealed.includes("stripV") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("stripV") ? 0.9 : 0.35,
          }}
          accessibleLabel="Vertical ab strip"
          selected={selected === "stripV"}
          onPointerDown={() => reveal("stripV")}
        />

        {/* leftover (a-b)^2 */}
        <ProofShape
          geometry={{ kind: "rectangle", width: leftover, height: leftover }}
          transform={{ x: ORIGIN_X, y: ORIGIN_Y, rotation: 0 }}
          appearance={{
            fill: "#fff7d6",
            stroke: "#c9a227",
            strokeWidth: 2,
          }}
          accessibleLabel="Leftover (a-b) squared"
        />

        {/* b² corner correction */}
        <ProofShape
          geometry={{ kind: "rectangle", width: bPx, height: bPx }}
          transform={{
            x: ORIGIN_X + leftover,
            y: ORIGIN_Y + leftover,
            rotation: 0,
          }}
          appearance={{
            fill: revealed.includes("b2") ? "#b8e7cf" : "#edf0f8",
            stroke: "#1f8a55",
            strokeWidth: 2.5,
          }}
          accessibleLabel="b squared corner"
          selected={selected === "b2"}
          onPointerDown={() => reveal("b2")}
        />

        {/* drag handle for b */}
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{
            x: ORIGIN_X + bPx,
            y: ORIGIN_Y + unit + 18,
            rotation: 0,
          }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag to change b"
          onPointerDown={(event) => canvas.beginDrag("b-handle", event)}
        />
        <text x={ORIGIN_X} y={ORIGIN_Y + unit + 40} className={styles.label}>
          a = {A.toFixed(0)} · b = {b.toFixed(0)} · (a−b) = {leftover.toFixed(0)}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="a²" label={`${model.a2}`} complete={revealed.includes("a2")} />
        <InvariantIndicator
          icon="2ab"
          label={`${model.twoAb}`}
          complete={revealed.includes("stripH") && revealed.includes("stripV")}
        />
        <InvariantIndicator icon="b²" label={`${model.b2}`} complete={revealed.includes("b2")} />
        <InvariantIndicator
          icon="(a−b)²"
          label={`${model.leftover}`}
          complete={proved}
        />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`(a-b)^2 = a^2 - 2ab + b^2 = ${model.leftover}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: removing two ab strips over-subtracts b², so add b² back.
        </div>
      )}
    </div>
  );
}

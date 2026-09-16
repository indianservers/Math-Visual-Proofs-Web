"use client";

import { RotateCcw, Target, Grid2x2 } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import {
  InvariantIndicator,
  ProofStepNavigator,
} from "../../../proof-engine/ProofUI";
import { expandBinomialProduct } from "./binomialMath";
import styles from "./proof.module.css";

const OX = 40;
const OY = 40;
const WIDTH = 460;
const HEIGHT = 380;
const X = 160;
const MIN = 40;
const MAX = 120;

type DragTarget = "a" | "b";
type PieceId = "x2" | "ax" | "bx" | "ab";

export default function Proof() {
  const [a, setA] = useState(70);
  const [b, setB] = useState(55);
  const [selected, setSelected] = useState<PieceId | null>("x2");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = expandBinomialProduct(X, a, b);
  const step = revealed.length >= 4 ? 2 : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 4;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (target, point) => {
    if (target === "a") {
      setA(Math.min(MAX, Math.max(MIN, point.y - (OY + X))));
    } else {
      setB(Math.min(MAX, Math.max(MIN, point.x - (OX + X))));
    }
  });

  const items = useMemo(
    () =>
      [
        { id: "x2" as const, label: "x²", color: "#9bb6ff", complete: revealed.includes("x2") },
        { id: "ax" as const, label: "ax", color: "#f0a37a", complete: revealed.includes("ax") },
        { id: "bx" as const, label: "bx", color: "#f0c27a", complete: revealed.includes("bx") },
        { id: "ab" as const, label: "ab", color: "#7dcaa4", complete: revealed.includes("ab") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className={styles.proof} data-proof-id="product-of-binomials">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Drag <i>a</i> and <i>b</i>, then reveal tiles for{" "}
            <MathFormula latex="(x+a)(x+b)=x^2+ax+bx+ab" />.
          </p>
        </div>
      </div>

      <ProofStepNavigator labels={["Set sides", "Reveal tiles", "Expand"]} active={step} />

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
        instruction="Select each area term. Drag the a/b handles on the canvas."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setA(70);
            setB(55);
            setRevealed([]);
            setSelected("x2");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() => setRevealed(["x2", "ax", "bx", "ab"])}
        >
          <Grid2x2 size={14} aria-hidden /> Reveal all
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Binomial product area model"
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
          geometry={{ kind: "rectangle", width: X, height: a }}
          transform={{ x: OX, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("ax") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("ax") ? 0.95 : 0.35,
          }}
          accessibleLabel="ax region"
          selected={selected === "ax"}
          onPointerDown={() => reveal("ax")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: b, height: X }}
          transform={{ x: OX + X, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("bx") ? "#f8d9ad" : "transparent",
            stroke: "#c47a20",
            strokeWidth: 2,
            opacity: revealed.includes("bx") ? 0.95 : 0.35,
          }}
          accessibleLabel="bx region"
          selected={selected === "bx"}
          onPointerDown={() => reveal("bx")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: b, height: a }}
          transform={{ x: OX + X, y: OY + X, rotation: 0 }}
          appearance={{
            fill: revealed.includes("ab") ? "#b8e7cf" : "#edf0f8",
            stroke: "#1f8a55",
            strokeWidth: 2.5,
          }}
          accessibleLabel="ab corner"
          selected={selected === "ab"}
          onPointerDown={() => reveal("ab")}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{ x: OX + X / 2, y: OY + X + a + 16, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag to change a"
          onPointerDown={(event) => canvas.beginDrag("a", event)}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 9 }}
          transform={{ x: OX + X + b + 16, y: OY + X / 2, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag to change b"
          onPointerDown={(event) => canvas.beginDrag("b", event)}
        />
        <text x={OX} y={OY + X + a + 40} className={styles.label}>
          x={X} · a={a.toFixed(0)} · b={b.toFixed(0)}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="x²" label={`${model.x2}`} complete={revealed.includes("x2")} />
        <InvariantIndicator icon="ax" label={`${model.ax}`} complete={revealed.includes("ax")} />
        <InvariantIndicator icon="bx" label={`${model.bx}`} complete={revealed.includes("bx")} />
        <InvariantIndicator icon="ab" label={`${model.ab}`} complete={revealed.includes("ab")} />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`(x+a)(x+b)=x^2+(a+b)x+ab=${model.total}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: the four tiles are exactly the binomial expansion.
        </div>
      )}
    </div>
  );
}

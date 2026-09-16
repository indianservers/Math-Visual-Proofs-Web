"use client";

import { Grid3x3, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import {
  InvariantIndicator,
  ProofStepNavigator,
} from "../../../proof-engine/ProofUI";
import { expandThreeTermSquare } from "./threeTermMath";
import styles from "./proof.module.css";

const OX = 36;
const OY = 36;
const WIDTH = 500;
const HEIGHT = 420;
const MIN = 36;
const MAX = 110;

type DragTarget = "a" | "b" | "c";
type PieceId = "a2" | "b2" | "c2" | "ab" | "bc" | "ca";

export default function Proof() {
  const [a, setA] = useState(90);
  const [b, setB] = useState(60);
  const [c, setC] = useState(50);
  const [selected, setSelected] = useState<PieceId | null>("a2");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = expandThreeTermSquare(a, b, c);
  const step = revealed.length >= 6 ? 2 : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 6;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (target, point) => {
    if (target === "a") setA(Math.min(MAX, Math.max(MIN, point.x - OX)));
    if (target === "b") setB(Math.min(MAX, Math.max(MIN, point.x - (OX + a))));
    if (target === "c")
      setC(Math.min(MAX, Math.max(MIN, point.x - (OX + a + b))));
  });

  const items = useMemo(
    () =>
      [
        { id: "a2" as const, label: "a²", color: "#9bb6ff", complete: revealed.includes("a2") },
        { id: "b2" as const, label: "b²", color: "#8fd3ff", complete: revealed.includes("b2") },
        { id: "c2" as const, label: "c²", color: "#b8e7cf", complete: revealed.includes("c2") },
        { id: "ab" as const, label: "2ab", color: "#f0a37a", complete: revealed.includes("ab") },
        { id: "bc" as const, label: "2bc", color: "#f0c27a", complete: revealed.includes("bc") },
        { id: "ca" as const, label: "2ca", color: "#e7a0d4", complete: revealed.includes("ca") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  const cell = (
    id: PieceId,
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    stroke: string,
  ) => (
    <ProofShape
      key={`${id}-${x}-${y}`}
      geometry={{ kind: "rectangle", width: w, height: h }}
      transform={{ x, y, rotation: 0 }}
      appearance={{
        fill: revealed.includes(id) ? fill : "transparent",
        stroke,
        strokeWidth: 2,
        opacity: revealed.includes(id) ? 0.95 : 0.3,
      }}
      accessibleLabel={id}
      selected={selected === id}
      onPointerDown={() => reveal(id)}
    />
  );

  return (
    <div className={styles.proof} data-proof-id="three-term-square">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Build a 3×3 tile grid for{" "}
            <MathFormula latex="(a+b+c)^2=a^2+b^2+c^2+2ab+2bc+2ca" />.
          </p>
        </div>
      </div>

      <ProofStepNavigator labels={["Set sides", "Nine tiles", "Pair cross terms"]} active={step} />

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
        instruction="Reveal squares and paired cross-term regions. Drag handles to resize a,b,c."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setA(90);
            setB(60);
            setC(50);
            setRevealed([]);
            setSelected("a2");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() => setRevealed(["a2", "b2", "c2", "ab", "bc", "ca"])}
        >
          <Grid3x3 size={14} aria-hidden /> Reveal all
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Three-term square area model"
      >
        {cell("a2", OX, OY, a, a, "#dfe9ff", "#3f56c7")}
        {cell("ab", OX + a, OY, b, a, "#f8c7ad", "#d4553a")}
        {cell("ca", OX + a + b, OY, c, a, "#f0c4e6", "#b44f9a")}
        {cell("ab", OX, OY + a, a, b, "#f8c7ad", "#d4553a")}
        {cell("b2", OX + a, OY + a, b, b, "#d7f0ff", "#2f7fb8")}
        {cell("bc", OX + a + b, OY + a, c, b, "#f8d9ad", "#c47a20")}
        {cell("ca", OX, OY + a + b, a, c, "#f0c4e6", "#b44f9a")}
        {cell("bc", OX + a, OY + a + b, b, c, "#f8d9ad", "#c47a20")}
        {cell("c2", OX + a + b, OY + a + b, c, c, "#b8e7cf", "#1f8a55")}

        <ProofShape
          geometry={{ kind: "circle", radius: 8 }}
          transform={{ x: OX + a, y: OY - 16, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag a"
          onPointerDown={(event) => canvas.beginDrag("a", event)}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 8 }}
          transform={{ x: OX + a + b, y: OY - 16, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag b"
          onPointerDown={(event) => canvas.beginDrag("b", event)}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 8 }}
          transform={{ x: OX + a + b + c, y: OY - 16, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag c"
          onPointerDown={(event) => canvas.beginDrag("c", event)}
        />
        <text x={OX} y={OY + a + b + c + 28} className={styles.label}>
          a={a.toFixed(0)} b={b.toFixed(0)} c={c.toFixed(0)}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="Σ□" label={`${model.squares}`} complete={revealed.includes("a2") && revealed.includes("b2") && revealed.includes("c2")} />
        <InvariantIndicator icon="2×" label={`${model.cross}`} complete={revealed.includes("ab") && revealed.includes("bc") && revealed.includes("ca")} />
        <InvariantIndicator icon="Σ" label={`${model.total}`} complete={proved} />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`(a+b+c)^2=a^2+b^2+c^2+2ab+2bc+2ca=${model.total}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: off-diagonal tiles come in pairs, so cross terms double.
        </div>
      )}
    </div>
  );
}

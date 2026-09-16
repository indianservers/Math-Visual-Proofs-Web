"use client";

import { Grid2x2, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { CanvasNavigator } from "../../../proof-engine/CanvasNavigator";
import { ProofShape } from "../../../proof-engine/ProofShape";
import {
  InvariantIndicator,
  ProofStepNavigator,
} from "../../../proof-engine/ProofUI";
import { expandDistributive } from "./distributiveMath";
import styles from "./proof.module.css";

const OX = 40;
const OY = 40;
const WIDTH = 480;
const HEIGHT = 400;
const MIN = 40;
const MAX = 130;

type DragTarget = "a" | "b" | "c" | "d";
type PieceId = "ac" | "ad" | "bc" | "bd";

export default function Proof() {
  const [a, setA] = useState(90);
  const [b, setB] = useState(60);
  const [c, setC] = useState(80);
  const [d, setD] = useState(50);
  const [selected, setSelected] = useState<PieceId | null>("ac");
  const [revealed, setRevealed] = useState<PieceId[]>([]);
  const model = expandDistributive(a, b, c, d);
  const step = revealed.length >= 4 ? 2 : revealed.length > 0 ? 1 : 0;
  const proved = revealed.length === 4;

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (target, point) => {
    if (target === "a") setA(Math.min(MAX, Math.max(MIN, point.x - OX)));
    if (target === "b") setB(Math.min(MAX, Math.max(MIN, point.x - (OX + a))));
    if (target === "c") setC(Math.min(MAX, Math.max(MIN, point.y - OY)));
    if (target === "d") setD(Math.min(MAX, Math.max(MIN, point.y - (OY + c))));
  });

  const items = useMemo(
    () =>
      [
        { id: "ac" as const, label: "ac", color: "#9bb6ff", complete: revealed.includes("ac") },
        { id: "ad" as const, label: "ad", color: "#f0a37a", complete: revealed.includes("ad") },
        { id: "bc" as const, label: "bc", color: "#f0c27a", complete: revealed.includes("bc") },
        { id: "bd" as const, label: "bd", color: "#7dcaa4", complete: revealed.includes("bd") },
      ] as const,
    [revealed],
  );

  const reveal = (id: PieceId) => {
    setSelected(id);
    setRevealed((current) => (current.includes(id) ? current : [...current, id]));
  };

  return (
    <div className={styles.proof} data-proof-id="distributive-law-area-model">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Drag side lengths to see{" "}
            <MathFormula latex="(a+b)(c+d)=ac+ad+bc+bd" /> as four rectangles.
          </p>
        </div>
      </div>

      <ProofStepNavigator labels={["Set sides", "Four tiles", "Distribute"]} active={step} />

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
        instruction="Reveal each product tile. Drag edge handles to resize a,b,c,d."
      />

      <div className={styles.controls}>
        <button
          type="button"
          onClick={() => {
            setA(90);
            setB(60);
            setC(80);
            setD(50);
            setRevealed([]);
            setSelected("ac");
          }}
        >
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() => setRevealed(["ac", "ad", "bc", "bd"])}
        >
          <Grid2x2 size={14} aria-hidden /> Reveal all
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Distributive law area model"
      >
        <ProofShape
          geometry={{ kind: "rectangle", width: a, height: c }}
          transform={{ x: OX, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("ac") ? "#dfe9ff" : "#eef1f8",
            stroke: "#3f56c7",
            strokeWidth: 2,
          }}
          accessibleLabel="ac"
          selected={selected === "ac"}
          onPointerDown={() => reveal("ac")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: a, height: d }}
          transform={{ x: OX, y: OY + c, rotation: 0 }}
          appearance={{
            fill: revealed.includes("ad") ? "#f8c7ad" : "transparent",
            stroke: "#d4553a",
            strokeWidth: 2,
            opacity: revealed.includes("ad") ? 0.95 : 0.35,
          }}
          accessibleLabel="ad"
          selected={selected === "ad"}
          onPointerDown={() => reveal("ad")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: b, height: c }}
          transform={{ x: OX + a, y: OY, rotation: 0 }}
          appearance={{
            fill: revealed.includes("bc") ? "#f8d9ad" : "transparent",
            stroke: "#c47a20",
            strokeWidth: 2,
            opacity: revealed.includes("bc") ? 0.95 : 0.35,
          }}
          accessibleLabel="bc"
          selected={selected === "bc"}
          onPointerDown={() => reveal("bc")}
        />
        <ProofShape
          geometry={{ kind: "rectangle", width: b, height: d }}
          transform={{ x: OX + a, y: OY + c, rotation: 0 }}
          appearance={{
            fill: revealed.includes("bd") ? "#b8e7cf" : "#edf0f8",
            stroke: "#1f8a55",
            strokeWidth: 2,
          }}
          accessibleLabel="bd"
          selected={selected === "bd"}
          onPointerDown={() => reveal("bd")}
        />

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
          transform={{ x: OX - 16, y: OY + c, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag c"
          onPointerDown={(event) => canvas.beginDrag("c", event)}
        />
        <ProofShape
          geometry={{ kind: "circle", radius: 8 }}
          transform={{ x: OX - 16, y: OY + c + d, rotation: 0 }}
          appearance={{ fill: "#4e2fd2", stroke: "#2d1a8a", strokeWidth: 2 }}
          accessibleLabel="Drag d"
          onPointerDown={(event) => canvas.beginDrag("d", event)}
        />
        <text x={OX} y={OY + c + d + 28} className={styles.label}>
          a={a.toFixed(0)} b={b.toFixed(0)} c={c.toFixed(0)} d={d.toFixed(0)}
        </text>
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator icon="ac" label={`${model.ac}`} complete={revealed.includes("ac")} />
        <InvariantIndicator icon="ad" label={`${model.ad}`} complete={revealed.includes("ad")} />
        <InvariantIndicator icon="bc" label={`${model.bc}`} complete={revealed.includes("bc")} />
        <InvariantIndicator icon="bd" label={`${model.bd}`} complete={revealed.includes("bd")} />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`(a+b)(c+d)=ac+ad+bc+bd=${model.total}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: distribution is the four-tile area split.
        </div>
      )}
    </div>
  );
}

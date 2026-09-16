"use client";

import { RotateCcw, Target, PieChart } from "lucide-react";
import { useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { ProofShape } from "../../../proof-engine/ProofShape";
import { InvariantIndicator, ProofStepNavigator } from "../../../proof-engine/ProofUI";
import {
  areaFraction,
  degreesToRadians,
  sectorAreaDegrees,
} from "./sectorMath";
import styles from "./proof.module.css";

const RADIUS = 110;
const CX = 170;
const CY = 160;
const WIDTH = 360;
const HEIGHT = 320;

type DragTarget = "handle";

function sectorPath(degrees: number): string {
  if (degrees <= 0) return "";
  if (degrees >= 360) {
    return `M ${CX} ${CY} m ${-RADIUS},0 a ${RADIUS},${RADIUS} 0 1,1 ${RADIUS * 2},0 a ${RADIUS},${RADIUS} 0 1,1 ${-RADIUS * 2},0`;
  }
  const rad = degreesToRadians(degrees);
  const endX = CX + RADIUS * Math.sin(rad);
  const endY = CY - RADIUS * Math.cos(rad);
  const large = degrees > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${CX} ${CY - RADIUS} A ${RADIUS} ${RADIUS} 0 ${large} 1 ${endX} ${endY} Z`;
}

function pointToDegrees(x: number, y: number): number {
  const angle = (Math.atan2(x - CX, CY - y) * 180) / Math.PI;
  const normalized = angle < 0 ? angle + 360 : angle;
  return Math.min(360, Math.max(0, normalized));
}

export default function Proof() {
  const [degrees, setDegrees] = useState(90);
  const area = sectorAreaDegrees(RADIUS, degrees);
  const full = Math.PI * RADIUS * RADIUS;
  const fraction = areaFraction(degrees);
  const handleX = CX + RADIUS * Math.sin(degreesToRadians(degrees));
  const handleY = CY - RADIUS * Math.cos(degreesToRadians(degrees));
  const step = degrees >= 360 ? 2 : degrees > 0 ? 1 : 0;
  const checkpoint =
    [90, 180, 270, 360].some((value) => Math.abs(degrees - value) < 0.8);

  const canvas = useProofCanvas<DragTarget>(WIDTH, HEIGHT, (_target, point) => {
    setDegrees(pointToDegrees(point.x, point.y));
  });

  return (
    <div className={styles.proof} data-proof-id="sector-area-formula">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Drag the sector handle. Area stays the same fraction of the full
            circle: θ/360 · πr².
          </p>
        </div>
      </div>

      <ProofStepNavigator
        labels={["Angle", "Fraction", "Area"]}
        active={step}
      />

      <div className={styles.controls}>
        <button type="button" onClick={() => setDegrees(0)}>
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button type="button" onClick={() => setDegrees(90)}>
          Quarter
        </button>
        <button type="button" onClick={() => setDegrees(180)}>
          Semicircle
        </button>
      </div>

      <div className={styles.layout}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
          {...canvas.canvasProps}
          role="img"
          aria-label="Draggable sector angle handle"
        >
          <ProofShape
            geometry={{ kind: "circle", radius: RADIUS }}
            transform={{ x: CX, y: CY, rotation: 0 }}
            appearance={{
              fill: "#eef2ff",
              stroke: "#aab6de",
              strokeWidth: 2,
              opacity: 1,
            }}
            accessibleLabel="Full circle"
          />
          <path d={sectorPath(degrees)} className={styles.sector} />
          <line
            x1={CX}
            y1={CY}
            x2={CX}
            y2={CY - RADIUS}
            className={styles.radius}
          />
          <line
            x1={CX}
            y1={CY}
            x2={handleX}
            y2={handleY}
            className={styles.radius}
          />
          <ProofShape
            geometry={{ kind: "circle", radius: 10 }}
            transform={{ x: handleX, y: handleY, rotation: 0 }}
            appearance={{ fill: "#d4553a", stroke: "#9b2f1c", strokeWidth: 2 }}
            accessibleLabel="Drag to change sector angle"
            onPointerDown={(event) => canvas.beginDrag("handle", event)}
          />
          <text x={20} y={28} className={styles.label}>
            θ = {degrees.toFixed(0)}°
          </text>
        </svg>

        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <PieChart size={16} aria-hidden />
            <b>Live measures</b>
          </div>
          <div className={styles.meter} aria-hidden="true">
            <i style={{ width: `${fraction * 100}%` }} />
          </div>
          <div className={styles.invariants}>
            <InvariantIndicator
              icon="%"
              label={`${(fraction * 100).toFixed(1)}% of circle`}
              complete={checkpoint}
            />
            <InvariantIndicator
              icon="A"
              label={`sector ${area.toFixed(0)}`}
              complete={checkpoint}
            />
          </div>
          <div className={styles.formulaRow}>
            <MathFormula
              latex={`A = \\dfrac{\\theta}{360}\\pi r^{2} = ${area.toFixed(1)}`}
              display
            />
            <MathFormula
              latex={`\\pi r^{2} = ${full.toFixed(1)}`}
              display
            />
          </div>
          {checkpoint && degrees > 0 && (
            <div className={styles.proved} role="status">
              Checkpoint: at {degrees.toFixed(0)}° the sector is exactly{" "}
              {(fraction * 100).toFixed(0)}% of the circle.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

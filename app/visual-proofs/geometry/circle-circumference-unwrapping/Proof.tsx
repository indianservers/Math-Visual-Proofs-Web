"use client";

import { RotateCcw, Target, Ruler } from "lucide-react";
import { useMemo, useState } from "react";
import MathFormula from "../../../components/MathFormula";
import { useProofCanvas } from "../../../components/useProofCanvas";
import { ProofShape } from "../../../proof-engine/ProofShape";
import { InvariantIndicator, ProofStepNavigator } from "../../../proof-engine/ProofUI";
import {
  circumference,
  formatLength,
  isFullRotation,
  travelDistance,
} from "./circumferenceMath";
import styles from "./proof.module.css";

const RADIUS = 48;
const CX0 = 90;
const CY = 150;
const GROUND_Y = CY + RADIUS;
const WIDTH = 560;
const HEIGHT = 280;
const MAX_TRAVEL = circumference(RADIUS);

type DragTarget = "roller";

export default function Proof() {
  const [distance, setDistance] = useState(0);
  const [showUnwrap, setShowUnwrap] = useState(false);
  const turns = distance / MAX_TRAVEL;
  const degrees = turns * 360;
  const cx = CX0 + distance;
  const proved = isFullRotation(turns);
  const C = MAX_TRAVEL;
  const step = proved ? 2 : distance > 0 ? 1 : 0;

  const canvas = useProofCanvas<DragTarget>(
    WIDTH,
    HEIGHT,
    (_target, point) => {
      const next = Math.min(MAX_TRAVEL, Math.max(0, point.x - CX0));
      setDistance(next);
    },
  );

  const mark = useMemo(() => {
    const rad = ((-degrees) * Math.PI) / 180;
    return {
      x: cx + Math.sin(rad) * RADIUS,
      y: CY - Math.cos(rad) * RADIUS,
    };
  }, [cx, degrees]);

  return (
    <div className={styles.proof} data-proof-id="circle-circumference-unwrapping">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Drag the circle one full turn. Travel distance equals the unwrapped
            circumference.
          </p>
        </div>
      </div>

      <ProofStepNavigator
        labels={["Start", "Roll", "Match C"]}
        active={step}
      />

      <div className={styles.controls}>
        <button type="button" onClick={() => setDistance(0)}>
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button type="button" onClick={() => setDistance(MAX_TRAVEL)}>
          Complete turn
        </button>
        <button
          type="button"
          aria-pressed={showUnwrap}
          onClick={() => setShowUnwrap((value) => !value)}
        >
          <Ruler size={14} aria-hidden />{" "}
          {showUnwrap ? "Hide unwrap" : "Unwrap boundary"}
        </button>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className={canvas.canvasClassName(styles.canvas, "interactive-svg")}
        {...canvas.canvasProps}
        role="img"
        aria-label="Draggable circle rolling along a ground line"
      >
        <line
          x1={CX0}
          y1={GROUND_Y}
          x2={CX0 + MAX_TRAVEL}
          y2={GROUND_Y}
          className={styles.ground}
        />
        <line
          x1={CX0}
          y1={GROUND_Y + 10}
          x2={CX0 + distance}
          y2={GROUND_Y + 10}
          className={styles.travel}
        />
        <text x={CX0 + distance / 2} y={GROUND_Y + 32} className={styles.label}>
          travel = {formatLength(distance)}
        </text>

        <ProofShape
          geometry={{ kind: "circle", radius: RADIUS }}
          transform={{ x: cx, y: CY, rotation: -degrees }}
          appearance={{ fill: "#dfe9ff", stroke: "#3f56c7", strokeWidth: 3 }}
          accessibleLabel="Rolling circle — drag horizontally"
          onPointerDown={(event) => canvas.beginDrag("roller", event)}
        />
        <line
          x1={cx}
          y1={CY}
          x2={mark.x}
          y2={mark.y}
          className={styles.radius}
        />
        <circle cx={mark.x} cy={mark.y} r={4} className={styles.mark} />

        {showUnwrap && (
          <g>
            <line
              x1={CX0}
              y1={42}
              x2={CX0 + C}
              y2={42}
              className={styles.unwrapped}
            />
            <foreignObject x={CX0} y={8} width={280} height={28}>
              <div className={styles.foreignFormula}>
                <MathFormula latex={`C = 2\\pi r = ${formatLength(C)}`} />
              </div>
            </foreignObject>
          </g>
        )}
      </svg>

      <div className={styles.invariants}>
        <InvariantIndicator
          icon="↻"
          label={`${degrees.toFixed(0)}° rotated`}
          complete={proved}
        />
        <InvariantIndicator
          icon="↔"
          label={`travel ${formatLength(distance)}`}
          complete={proved}
        />
        <InvariantIndicator
          icon="○"
          label={`C = ${formatLength(C)}`}
          complete={proved}
        />
      </div>

      <div className={styles.formulaRow}>
        <MathFormula
          latex={`\\text{travel} = 2\\pi r \\cdot t = ${formatLength(travelDistance(RADIUS, turns))}`}
          display
        />
      </div>

      {proved && (
        <div className={styles.proved} role="status">
          Proved: one full roll makes travel equal the circumference.
        </div>
      )}
    </div>
  );
}

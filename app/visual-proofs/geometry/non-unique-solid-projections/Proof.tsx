"use client";

import { Eye, Layers, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { InvariantIndicator, ProofStepNavigator } from "../../../proof-engine/ProofUI";
import {
  cubeCount,
  frontView,
  sideView,
  topView,
  type HeightGrid,
} from "../orthographic-projection-from-cube-stacks/orthoMath";
import { demonstrateAmbiguity, SOLID_A, SOLID_B } from "./nonUniqueMath";
import styles from "./proof.module.css";

function SolidPreview({
  title,
  grid,
  active,
  onSelect,
}: {
  title: string;
  grid: HeightGrid;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.solidCard} ${active ? styles.solidActive : ""}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <b>{title}</b>
      <span>
        <Layers size={14} aria-hidden /> {cubeCount(grid)} cubes
      </span>
      <div className={styles.heightMap}>
        {grid.map((row, r) =>
          row.map((h, c) => (
            <i key={`${r}-${c}`} data-h={h}>
              {h}
            </i>
          )),
        )}
      </div>
    </button>
  );
}

export default function Proof() {
  const [active, setActive] = useState<"A" | "B">("A");
  const demo = useMemo(() => demonstrateAmbiguity(), []);
  const grid = active === "A" ? SOLID_A : SOLID_B;
  const step = active === "B" ? 2 : 1;

  return (
    <div className={styles.proof} data-proof-id="non-unique-solid-projections">
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Switch between two solids. Shared orthographic views prove
            reconstruction is not always unique.
          </p>
        </div>
      </div>

      <ProofStepNavigator
        labels={["Solid A", "Solid B", "Ambiguity"]}
        active={step}
      />

      <div className={styles.solids}>
        <SolidPreview
          title="Solid A"
          grid={SOLID_A}
          active={active === "A"}
          onSelect={() => setActive("A")}
        />
        <SolidPreview
          title="Solid B"
          grid={SOLID_B}
          active={active === "B"}
          onSelect={() => setActive("B")}
        />
      </div>

      <div className={styles.compare}>
        <h3>
          <Eye size={16} aria-hidden /> Shared projections
        </h3>
        <div className={styles.views}>
          <div className={styles.viewStrip}>
            <b>Top</b>
            <div className={styles.topMini}>
              {topView(grid).flatMap((row, r) =>
                row.map((filled, c) => (
                  <span
                    key={`${r}-${c}`}
                    className={filled ? styles.on : styles.off}
                  />
                )),
              )}
            </div>
          </div>
          <div className={styles.viewStrip}>
            <b>Front</b>
            <div className={styles.heights}>
              {frontView(grid).map((h, i) => (
                <span key={i}>{h}</span>
              ))}
            </div>
          </div>
          <div className={styles.viewStrip}>
            <b>Side</b>
            <div className={styles.heights}>
              {sideView(grid).map((h, i) => (
                <span key={i}>{h}</span>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.invariants}>
          <InvariantIndicator
            icon="≡"
            label="Views match"
            complete={demo.sameProjections}
          />
          <InvariantIndicator
            icon="≠"
            label={`Counts ${demo.countA} vs ${demo.countB}`}
            complete={demo.differentCounts}
          />
        </div>

        {demo.sameProjections && demo.differentCounts && (
          <div className={styles.proved} role="status">
            Proved: equal orthographic views do not imply a unique solid.
          </div>
        )}
      </div>
    </div>
  );
}

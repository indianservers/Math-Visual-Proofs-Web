"use client";

import { Boxes, Grid3x3, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";
import { InvariantIndicator, ProofStepNavigator } from "../../../proof-engine/ProofUI";
import {
  bumpCell,
  cubeCount,
  emptyGrid,
  frontView,
  sideView,
  topView,
  type HeightGrid,
} from "./orthoMath";
import styles from "./proof.module.css";

const SIZE = 3;
const MAX_H = 3;

export default function Proof() {
  const [grid, setGrid] = useState<HeightGrid>(() => emptyGrid(SIZE));
  const top = useMemo(() => topView(grid), [grid]);
  const front = useMemo(() => frontView(grid), [grid]);
  const side = useMemo(() => sideView(grid), [grid]);
  const count = cubeCount(grid);
  const step = count === 0 ? 0 : front.some((h) => h > 1) || side.some((h) => h > 1) ? 2 : 1;

  return (
    <div
      className={styles.proof}
      data-proof-id="orthographic-projection-from-cube-stacks"
    >
      <div className={styles.mission}>
        <Target size={18} aria-hidden />
        <div>
          <b>Mission</b>
          <p>
            Click cells to stack cubes. Top marks occupied cells; front and side
            keep each column/row maximum height.
          </p>
        </div>
      </div>

      <ProofStepNavigator
        labels={["Place", "Stack", "Read views"]}
        active={step}
      />

      <div className={styles.controls}>
        <button type="button" onClick={() => setGrid(emptyGrid(SIZE))}>
          <RotateCcw size={14} aria-hidden /> Reset
        </button>
        <button
          type="button"
          onClick={() =>
            setGrid([
              [2, 1, 0],
              [1, 0, 0],
              [0, 0, 0],
            ])
          }
        >
          <Boxes size={14} aria-hidden /> Sample L-stack
        </button>
        <span className={styles.count}>
          <Grid3x3 size={14} aria-hidden /> Cubes: {count}
        </span>
      </div>

      <div className={styles.layout}>
        <div>
          <h3 className={styles.sectionTitle}>Build solid</h3>
          <div
            className={styles.buildGrid}
            style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
          >
            {grid.map((row, r) =>
              row.map((height, c) => (
                <button
                  key={`${r}-${c}`}
                  type="button"
                  className={styles.cell}
                  onClick={() =>
                    setGrid((current) => bumpCell(current, r, c, MAX_H))
                  }
                  aria-label={`Row ${r + 1} column ${c + 1}, height ${height}`}
                >
                  <strong>{height}</strong>
                  <div className={styles.stack} aria-hidden="true">
                    {Array.from({ length: MAX_H }, (_, level) => (
                      <i
                        key={level}
                        className={
                          MAX_H - level <= height ? styles.cubeOn : styles.cubeOff
                        }
                      />
                    ))}
                  </div>
                </button>
              )),
            )}
          </div>
        </div>

        <div className={styles.projections}>
          <h3 className={styles.sectionTitle}>Orthographic views</h3>
          <div className={styles.projCard}>
            <b>Top</b>
            <div
              className={styles.topGrid}
              style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
            >
              {top.flatMap((row, r) =>
                row.map((filled, c) => (
                  <span
                    key={`${r}-${c}`}
                    className={filled ? styles.topFilled : styles.topEmpty}
                  />
                )),
              )}
            </div>
          </div>
          <div className={styles.projCard}>
            <b>Front (max / column)</b>
            <div className={styles.barRow}>
              {front.map((h, index) => (
                <div key={index} className={styles.barCol}>
                  {Array.from({ length: MAX_H }, (_, level) => (
                    <span
                      key={level}
                      className={MAX_H - level <= h ? styles.barOn : styles.barOff}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.projCard}>
            <b>Side (max / row)</b>
            <div className={styles.barRow}>
              {side.map((h, index) => (
                <div key={index} className={styles.barCol}>
                  {Array.from({ length: MAX_H }, (_, level) => (
                    <span
                      key={level}
                      className={MAX_H - level <= h ? styles.barOn : styles.barOff}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.invariants}>
            <InvariantIndicator
              icon="▣"
              label="Top from occupied cells"
              complete={count > 0}
            />
            <InvariantIndicator
              icon="▮"
              label="Front/side from maxima"
              complete={count > 0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

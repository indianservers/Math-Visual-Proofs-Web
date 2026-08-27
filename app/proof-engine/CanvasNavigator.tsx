"use client";

import clsx from "clsx";
import { useState, type CSSProperties } from "react";
import type { CanvasDirection } from "./canvasEngine";
import styles from "./CanvasNavigator.module.css";

export type CanvasNavigatorItem<Id extends string = string> = {
  id: Id;
  label: string;
  color?: string;
  complete?: boolean;
};

export function CanvasNavigator<Id extends string>({
  items,
  selectedId,
  onSelect,
  onNudge,
  onRotate,
  onDock,
  zoomPercent,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onFit,
  completedCount,
  instruction,
}: {
  items: readonly CanvasNavigatorItem<Id>[];
  selectedId: Id | null;
  onSelect: (id: Id) => void;
  onNudge: (direction: CanvasDirection) => void;
  onRotate?: () => void;
  onDock?: () => void;
  zoomPercent: number;
  canZoomIn: boolean;
  canZoomOut: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  completedCount: number;
  instruction: string;
}) {
  const [helpOpen, setHelpOpen] = useState(false);
  const selected = items.find((item) => item.id === selectedId) ?? null;
  const progress = items.length ? (completedCount / items.length) * 100 : 0;

  return (
    <section className={styles.navigator} aria-label="Easy canvas controller">
      <div className={styles.topline}>
        <div>
          <b>{selected ? `${selected.label} is ready` : "Choose a shape"}</b>
          <span aria-live="polite">{instruction}</span>
        </div>
        <button
          className={styles.helpButton}
          onClick={() => setHelpOpen((value) => !value)}
          aria-expanded={helpOpen}
        >
          ? How to play
        </button>
      </div>

      {helpOpen && (
        <div className={styles.help} role="note">
          <span><b>1.</b> Pick a numbered shape.</span>
          <span><b>2.</b> Drag it or use the big arrows.</span>
          <span><b>3.</b> Rotate, then press Attach when it matches.</span>
        </div>
      )}

      <div className={styles.controls}>
        <div className={styles.picker} aria-label="Shapes on this canvas">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={clsx(
                styles.piece,
                selectedId === item.id && styles.selected,
                item.complete && styles.complete,
              )}
              aria-pressed={selectedId === item.id}
              style={{ "--piece-color": item.color ?? "#7351f5" } as CSSProperties}
            >
              <i>{item.complete ? "✓" : item.label.replace(/\D/g, "") || "◆"}</i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.moveGroup} aria-label="Move selected shape">
          <button onClick={() => onNudge("up")} disabled={!selected}>↑<span>Up</span></button>
          <button onClick={() => onNudge("left")} disabled={!selected}>←<span>Left</span></button>
          <button className={styles.center} disabled aria-hidden="true">✋</button>
          <button onClick={() => onNudge("right")} disabled={!selected}>→<span>Right</span></button>
          <button onClick={() => onNudge("down")} disabled={!selected}>↓<span>Down</span></button>
        </div>

        <div className={styles.actions}>
          {onRotate && <button onClick={onRotate} disabled={!selected}><b>↻</b> Rotate</button>}
          {onDock && <button className={styles.attach} onClick={onDock} disabled={!selected}><b>∪</b> Attach</button>}
        </div>

        <div className={styles.zoom} aria-label="Canvas zoom">
          <button onClick={onZoomOut} disabled={!canZoomOut} aria-label="Zoom out">−</button>
          <output aria-label="Current zoom">{zoomPercent}%</output>
          <button onClick={onZoomIn} disabled={!canZoomIn} aria-label="Zoom in">+</button>
          <button onClick={onFit}>Fit</button>
        </div>
      </div>

      <div className={styles.progress} aria-label={`${completedCount} of ${items.length} shapes attached`}>
        <span style={{ width: `${progress}%` }} />
      </div>
    </section>
  );
}

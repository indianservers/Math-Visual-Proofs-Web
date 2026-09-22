"use client";

import clsx from "clsx";
import {
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useCanvasViewport } from "../components/useProofCanvas";
import {
  CanvasNavigator,
  type CanvasNavigatorItem,
} from "./CanvasNavigator";
import type { CanvasDirection } from "./canvasEngine";
import { ProofToolBar, type ProofToolId } from "./ProofToolBar";
import styles from "./ProofCanvasHost.module.css";

export const VISUAL_PROOF_RESET_EVENT = "visual-proof-reset";
export const VISUAL_PROOF_WATCH_EVENT = "visual-proof-watch";

const EMBED_TOOLS: ProofToolId[] = [
  "select",
  "snap",
  "trace",
  "undo",
  "redo",
  "reset",
  "hint",
];

const DEFAULT_HINTS = [
  "Hint 1: use the numbered controls, then drag on the canvas.",
  "Hint 2: zoom in on a detail, then press Fit to see the whole argument.",
  "Hint 3: Reset restores the starting view without erasing the proof's own idea.",
];

type ProofCanvasHostProps<Id extends string = string> = {
  children: ReactNode;
  mode?: "embed" | "scene";
  tools?: readonly ProofToolId[];
  items?: readonly CanvasNavigatorItem<Id>[];
  selectedId?: Id | null;
  onSelect?: (id: Id) => void;
  onNudge?: (direction: CanvasDirection) => void;
  onRotate?: () => void;
  onDock?: () => void;
  completedCount?: number;
  instruction?: string;
  hints?: readonly string[];
  snap?: boolean;
  onSnap?: () => void;
  trace?: boolean;
  onTrace?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onWatch?: () => void;
  selected?: boolean;
  hintLevel?: number;
  onHint?: () => void;
  zoomPercent?: number;
  canZoomIn?: boolean;
  canZoomOut?: boolean;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onFit?: () => void;
};

export function ProofCanvasHost<Id extends string>({
  children,
  mode = "embed",
  tools,
  items,
  selectedId = null,
  onSelect,
  onNudge,
  onRotate,
  onDock,
  completedCount = 0,
  instruction,
  hints = DEFAULT_HINTS,
  snap,
  onSnap,
  trace,
  onTrace,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onReset,
  onWatch,
  selected,
  hintLevel,
  onHint,
  zoomPercent,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onFit,
}: ProofCanvasHostProps<Id>) {
  const viewport = useCanvasViewport(1000, 720, {
    minZoom: 1,
    maxZoom: 2.5,
    step: 0.25,
  });
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [localSnap, setLocalSnap] = useState(true);
  const [localTrace, setLocalTrace] = useState(false);
  const [localHint, setLocalHint] = useState(0);
  const [message, setMessage] = useState(
    instruction ??
      "Zoom, pan, and explore. This proof keeps its own shapes and steps.",
  );

  const snapOn = snap ?? localSnap;
  const traceOn = trace ?? localTrace;
  const hint = hintLevel ?? localHint;
  const embedItems = useMemo<CanvasNavigatorItem<Id>[]>(
    () =>
      items?.length
        ? [...items]
        : [{ id: "scene" as Id, label: "Canvas", color: "#7351f5" }],
    [items],
  );
  const activeId = (selectedId ?? embedItems[0]?.id ?? null) as Id | null;

  const zoomIn = onZoomIn ?? viewport.zoomIn;
  const zoomOut = onZoomOut ?? viewport.zoomOut;
  const fitView = onFit ?? (() => {
    viewport.fit();
    setPan({ x: 0, y: 0 });
  });
  const percent = zoomPercent ?? viewport.zoomPercent;

  const cycleHint = useCallback(() => {
    if (onHint) {
      onHint();
      return;
    }
    const next = hint >= hints.length ? 0 : hint + 1;
    setLocalHint(next);
    setMessage(
      next === 0
        ? "Hints hidden. Try the next move yourself."
        : (hints[next - 1] ?? DEFAULT_HINTS[0]),
    );
  }, [hint, hints, onHint]);

  const resetView = useCallback(() => {
    fitView();
    setLocalHint(0);
    window.dispatchEvent(new Event(VISUAL_PROOF_RESET_EVENT));
    onReset?.();
    setMessage("View reset. The proof's own starting state is restored.");
  }, [fitView, onReset]);

  const nudge = useCallback(
    (direction: CanvasDirection) => {
      if (onNudge) {
        onNudge(direction);
        return;
      }
      const step = 36;
      const delta = {
        left: { x: -step, y: 0 },
        right: { x: step, y: 0 },
        up: { x: 0, y: -step },
        down: { x: 0, y: step },
      }[direction];
      setPan((current) => ({ x: current.x + delta.x, y: current.y + delta.y }));
      setMessage("Moved the view. Press Fit to see the whole canvas.");
    },
    [onNudge],
  );

  const watch = onWatch
    ? onWatch
    : () => {
        window.dispatchEvent(new Event(VISUAL_PROOF_WATCH_EVENT));
        setMessage("If this proof has a guided tour, it starts from here.");
      };

  return (
    <div
      className={clsx(
        mode === "embed" && "engine-work-card",
        "proof-canvas-host",
        styles.host,
        styles.embedFill,
        mode === "scene" && styles.scene,
      )}
      aria-label="Interactive visual proof workspace"
    >
      <div className={clsx(styles.sideChrome, "proof-side-chrome")}>
      <ProofToolBar
        tools={tools ?? (mode === "embed" ? EMBED_TOOLS : undefined)}
        selected={selected ?? Boolean(activeId)}
        snap={snapOn}
        trace={traceOn}
        hintLevel={hint}
        canUndo={canUndo}
        canRedo={canRedo}
        onSelect={() => {
          if (activeId) onSelect?.(activeId);
          setMessage("Select a control on the canvas, then drag or use arrows.");
        }}
        onRotate={onRotate}
        onSnap={onSnap ?? (() => setLocalSnap((value) => !value))}
        onTrace={onTrace ?? (() => setLocalTrace((value) => !value))}
        onUndo={onUndo}
        onRedo={onRedo}
        onReset={resetView}
        onHint={cycleHint}
        onWatch={mode === "scene" ? onWatch : watch}
      />
      <div className="canvas-message" role="status" aria-live="polite">
        <span className="grab-cue">✋</span>
        {message}
      </div>
      <CanvasNavigator
        items={embedItems}
        selectedId={activeId}
        onSelect={(id) => {
          onSelect?.(id);
          setMessage(`${embedItems.find((item) => item.id === id)?.label ?? "Shape"} selected.`);
        }}
        onNudge={nudge}
        onRotate={onRotate}
        onDock={onDock}
        zoomPercent={percent}
        canZoomIn={canZoomIn ?? viewport.canZoomIn}
        canZoomOut={canZoomOut ?? viewport.canZoomOut}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFit={fitView}
        completedCount={completedCount}
        instruction={message}
      />
      </div>
      <div
        className={clsx(styles.stage, "proof-stage", snapOn && "has-snap-grid")}
        data-trace={traceOn ? "on" : "off"}
      >
        {snapOn && <div className={styles.gridOverlay} aria-hidden="true" />}
        {traceOn && <div className={styles.traceOverlay} aria-hidden="true" />}
        <div
          className={styles.stageInner}
          style={
            mode === "embed"
              ? {
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${viewport.zoom})`,
                }
              : undefined
          }
        >
          {children}
        </div>
      </div>
    </div>
  );
}

"use client";

import clsx from "clsx";

export type ProofToolId =
  | "select"
  | "rotate"
  | "snap"
  | "trace"
  | "undo"
  | "redo"
  | "reset"
  | "hint"
  | "watch";

const DEFAULT_TOOLS: ProofToolId[] = [
  "select",
  "rotate",
  "snap",
  "trace",
  "undo",
  "redo",
  "reset",
  "hint",
  "watch",
];

type ProofToolBarProps = {
  tools?: readonly ProofToolId[];
  selected?: boolean;
  snap?: boolean;
  trace?: boolean;
  hintLevel?: number;
  canUndo?: boolean;
  canRedo?: boolean;
  onSelect?: () => void;
  onRotate?: () => void;
  onSnap?: () => void;
  onTrace?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onReset?: () => void;
  onHint?: () => void;
  onWatch?: () => void;
};

export function ProofToolBar({
  tools = DEFAULT_TOOLS,
  selected = false,
  snap = false,
  trace = false,
  hintLevel = 0,
  canUndo = false,
  canRedo = false,
  onSelect,
  onRotate,
  onSnap,
  onTrace,
  onUndo,
  onRedo,
  onReset,
  onHint,
  onWatch,
}: ProofToolBarProps) {
  const enabled = new Set(tools);
  return (
    <div className="engine-toolbar" aria-label="Proof tools">
      {enabled.has("select") && (
        <button
          type="button"
          className={clsx("engine-tool", selected && "active")}
          onClick={onSelect}
        >
          <span>☝</span>Select
        </button>
      )}
      {enabled.has("rotate") && (
        <button
          type="button"
          className="engine-tool"
          onClick={onRotate}
          disabled={!onRotate}
        >
          <span>↻</span>Rotate
        </button>
      )}
      {enabled.has("snap") && (
        <button
          type="button"
          className={clsx("engine-tool", snap && "active")}
          aria-pressed={snap}
          onClick={onSnap}
          disabled={!onSnap}
        >
          <span>∪</span>Snap
        </button>
      )}
      {enabled.has("trace") && (
        <button
          type="button"
          className={clsx("engine-tool", trace && "active")}
          aria-pressed={trace}
          onClick={onTrace}
          disabled={!onTrace}
        >
          <span>⌁</span>Trace
        </button>
      )}
      {enabled.has("undo") && (
        <button
          type="button"
          className="engine-tool"
          disabled={!canUndo || !onUndo}
          onClick={onUndo}
        >
          <span>↶</span>Undo
        </button>
      )}
      {enabled.has("redo") && (
        <button
          type="button"
          className="engine-tool"
          disabled={!canRedo || !onRedo}
          onClick={onRedo}
        >
          <span>↷</span>Redo
        </button>
      )}
      {enabled.has("reset") && (
        <button type="button" className="engine-tool" onClick={onReset}>
          <span>⟲</span>Reset
        </button>
      )}
      {enabled.has("hint") && (
        <button
          type="button"
          className={clsx("engine-tool", hintLevel > 0 && "active")}
          onClick={onHint}
        >
          <span>?</span>Hint {hintLevel || ""}
        </button>
      )}
      {enabled.has("watch") && (
        <button
          type="button"
          className="engine-tool animate-tool"
          onClick={onWatch}
          disabled={!onWatch}
          aria-label="Watch the guided animated proof"
        >
          <span>▶</span>Watch proof
        </button>
      )}
    </div>
  );
}

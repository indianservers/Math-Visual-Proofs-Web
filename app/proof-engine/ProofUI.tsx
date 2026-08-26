"use client";

import clsx from "clsx";
import { PointerEvent, useEffect, useRef, useState } from "react";
import MathFormula from "../components/MathFormula";
import { useProofCanvas } from "../components/useProofCanvas";

export function InvariantIndicator({ icon, label, complete }: { icon: string; label: string; complete: boolean }) {
  return <div className={clsx("invariant-chip", complete && "complete")}><span>{complete ? "✓" : icon}</span>{label}</div>;
}

export function ProofStepNavigator({ labels, active }: { labels: readonly string[]; active: number }) {
  return <div className="steps proof-step-nav" aria-label={`Proof step ${active + 1} of ${labels.length}`}>
    {labels.map((label, index) => <span key={label} className="step-wrap"><span className={clsx("step", index === active && "active", index < active && "done")}><i>{index < active ? "✓" : index + 1}</i>{label}</span>{index < labels.length - 1 && <span className="step-line" />}</span>)}
  </div>;
}

type FormulaId = "a2" | "plus" | "b2" | "equals" | "c2";
const FORMULA_ORDER: FormulaId[] = ["a2", "plus", "b2", "equals", "c2"];
const FORMULA_LABELS: Record<FormulaId, string> = { a2: "a^2", plus: "+", b2: "b^2", equals: "=", c2: "c^2" };
const STARTS: Record<FormulaId, { x: number; y: number }> = { c2: { x: 18, y: 17 }, equals: { x: 88, y: 17 }, a2: { x: 158, y: 17 }, plus: { x: 228, y: 17 }, b2: { x: 298, y: 17 } };

export function FormulaDock({ enabled, resetKey, animationFillCount = 0, onComplete }: { enabled: boolean; resetKey?: number; animationFillCount?: number; onComplete: () => void }) {
  const [positions, setPositions] = useState(STARTS);
  const [placed, setPlaced] = useState<FormulaId[]>([]);
  const [selected, setSelected] = useState<FormulaId | null>(null);
  const [message, setMessage] = useState("Drag each area block into its matching dashed slot.");
  const offset = useRef({ x: 28, y: 20 });
  const latest = useRef(positions);
  const completedNotified = useRef(false);
  const canvas = useProofCanvas<FormulaId>(760, 118, (id, point) => {
    const next = { ...positions, [id]: { x: point.x - offset.current.x, y: point.y - offset.current.y } };
    latest.current = next;
    setPositions(next);
  }, (id) => {
    const slotIndex = FORMULA_ORDER.indexOf(id);
    const target = { x: 390 + slotIndex * 70, y: 67 };
    const current = latest.current[id];
    if (Math.hypot(current.x - target.x, current.y - target.y) <= 48) {
      const next = { ...latest.current, [id]: target };
      latest.current = next;
      setPositions(next);
      setPlaced((items) => items.includes(id) ? items : [...items, id]);
      setMessage(`${FORMULA_LABELS[id].replace("^2", " squared")} connected to its visible region.`);
    } else {
      const fallback = placed.includes(id) ? target : STARTS[id];
      const next = { ...latest.current, [id]: fallback };
      latest.current = next;
      setPositions(next);
      setMessage("That block belongs in a different slot. It returned to its last valid place.");
    }
  }, { disabled: !enabled });

  // A parent-issued reset is an external proof-engine command.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setPositions(STARTS); latest.current = STARTS; completedNotified.current = false; setPlaced([]); setSelected(null); }, [resetKey]);
  useEffect(() => {
    if (placed.length !== FORMULA_ORDER.length || completedNotified.current) return;
    completedNotified.current = true;
    onComplete();
  }, [onComplete, placed.length]);

  const animatedIds = animationFillCount > 0 ? FORMULA_ORDER.slice(0, animationFillCount) : [];
  const visiblePlaced = animationFillCount > 0 ? animatedIds : placed;
  const visiblePositions = animationFillCount > 0
    ? Object.fromEntries(Object.entries(positions).map(([key, value]) => {
        const id = key as FormulaId;
        const index = animatedIds.indexOf(id);
        return [id, index >= 0 ? { x: 390 + index * 70, y: 67 } : value];
      })) as Record<FormulaId, { x: number; y: number }>
    : positions;

  const placeByKeyboard = (id: FormulaId) => {
    if (!enabled) return;
    const index = FORMULA_ORDER.indexOf(id);
    const next = { ...positions, [id]: { x: 390 + index * 70, y: 67 } };
    latest.current = next; setPositions(next); setPlaced((items) => items.includes(id) ? items : [...items, id]);
  };

  return <div className={clsx("formula-dock", !enabled && "locked")}>
    <div className="formula-dock-head"><b>Build the final equation</b><span aria-live="polite">{enabled ? message : "Complete the rearrangement and compare the gaps first."}</span></div>
    <svg viewBox="0 0 760 118" className={canvas.canvasClassName("formula-svg", "interactive-svg")} {...canvas.canvasProps} aria-label="Draggable equation block workspace">
      <text x="18" y="108" className="formula-caption">AREA BLOCKS</text>
      {FORMULA_ORDER.map((id, index) => <g key={`slot-${id}`}><rect x={390 + index * 70} y="67" width="56" height="40" rx="8" className={clsx("formula-slot", visiblePlaced.includes(id) && "filled")} /><text x={418 + index * 70} y="93" textAnchor="middle" className="formula-slot-hint">{visiblePlaced.includes(id) ? "" : "?"}</text></g>)}
      {Object.keys(FORMULA_LABELS).map((key) => { const id = key as FormulaId; const pos = visiblePositions[id]; return <g key={id} data-testid={`formula-${id}`} transform={`translate(${pos.x} ${pos.y})`} className={clsx("formula-block-svg", selected === id && "selected", visiblePlaced.includes(id) && "placed")} onPointerDown={(event: PointerEvent<SVGGElement>) => { setSelected(id); canvas.beginDrag(id, event); }} tabIndex={enabled ? 0 : -1} role="button" aria-label={`Equation block ${FORMULA_LABELS[id]}`} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") placeByKeyboard(id); }}><rect width="56" height="40" rx="9" /><foreignObject x="1" y="5" width="54" height="30"><div className="formula-block-math"><MathFormula latex={FORMULA_LABELS[id]} /></div></foreignObject></g>; })}
    </svg>
  </div>;
}

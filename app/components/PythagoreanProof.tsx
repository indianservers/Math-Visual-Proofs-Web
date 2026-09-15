"use client";

import clsx from "clsx";
import Link from "next/link";
import {
  PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  FormulaDock,
  InvariantIndicator,
  ProofStepNavigator,
} from "../proof-engine/ProofUI";
import { CanvasNavigator } from "../proof-engine/CanvasNavigator";
import {
  constrainTransform,
  resolveDrop,
  type CanvasDirection,
} from "../proof-engine/canvasEngine";
import {
  INITIAL_PYTHAGOREAN_SCENE,
  PYTHAGOREAN_PIECES,
  PYTHAGOREAN_REASONING,
  PYTHAGOREAN_SLOTS,
  PYTHAGOREAN_STEPS,
  type PythagoreanPieceId,
} from "../proof-engine/pythagoreanConfig";
import type {
  ProofObjectState,
  ProofScene,
  ProofState,
} from "../proof-engine/types";
import { normalizeRotation } from "../proof-engine/validation";
import MathFormula from "./MathFormula";
import {
  useCanvasHistory,
  useCanvasViewport,
  useProofCanvas,
} from "./useProofCanvas";

const ANIMATION_STEPS = [
  {
    title: "Start with two equal squares",
    explanation:
      "Both outer squares have side a + b, so both have exactly the same total area.",
    formula: "\\text{left total area}=\\text{right total area}=(a+b)^2",
  },
  {
    title: "Use the same four triangles",
    explanation:
      "Each picture contains four identical right triangles. Every triangle has area ½ab.",
    formula:
      "\\text{triangle area}=\\frac12 ab\\quad\\Rightarrow\\quad\\text{four triangles}=2ab",
  },
  {
    title: "See the gap in Arrangement A",
    explanation:
      "The four hypotenuses surround the tilted centre square. Each side is c, so its area is c².",
    formula: "c\\times c=c^2",
  },
  {
    title: "Rearrange—do not resize",
    explanation:
      "Move and rotate the same four triangles into Arrangement B. Their total area does not change.",
    formula:
      "\\text{same outer square}-\\text{same four triangles}=\\text{same leftover area}",
  },
  {
    title: "See the gaps in Arrangement B",
    explanation:
      "The uncovered regions are squares: one has side a and the other has side b. Their total area is a² + b².",
    formula: "a\\times a+b\\times b=a^2+b^2",
  },
  {
    title: "Write both area equations",
    explanation:
      "Each outer square equals its four triangles plus its uncovered area.",
    formula: "(a+b)^2=c^2+2ab\\quad\\text{and}\\quad(a+b)^2=a^2+b^2+2ab",
  },
  {
    title: "Remove the equal triangle area",
    explanation:
      "Subtract the same 2ab from both equal totals. Only the uncovered areas remain.",
    formula: "c^2+\\cancel{2ab}=a^2+b^2+\\cancel{2ab}",
  },
  {
    title: "The remaining areas are equal",
    explanation:
      "The c-square has the same area as the a-square and b-square together. That is the Pythagorean theorem.",
    formula: "\\boxed{a^2+b^2=c^2}",
  },
] as const;

function Sidebar() {
  const [selected, setSelected] = useState("Explore");
  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-mark">✣</div>
      <div className="brand">
        MATHS
        <br />
        UNIVERSE
      </div>
      <nav className="side-nav">
        {[
          ["△", "Explore"],
          ["♧", "Proofs"],
          ["◇", "Practice"],
          ["▱", "Saved"],
        ].map(([icon, label]) =>
          label === "Proofs" ? (
            <Link key={label} href="/proofs" className="side-item">
              <span className="side-icon">{icon}</span>
              {label}
            </Link>
          ) : (
            <button
              key={label}
              onClick={() => setSelected(label)}
              aria-pressed={selected === label}
              className={`side-item ${selected === label ? "active" : ""}`}
            >
              <span className="side-icon">{icon}</span>
              {label}
            </button>
          ),
        )}
      </nav>
      <button
        onClick={() => setSelected("Settings")}
        aria-pressed={selected === "Settings"}
        className={`side-item settings ${selected === "Settings" ? "active" : ""}`}
      >
        <span className="side-icon">⚙</span>Settings
      </button>
    </aside>
  );
}

function phaseStep(phase: ProofState) {
  if (phase === "INITIAL" || phase === "OBSERVING_INVARIANTS") return 0;
  if (phase === "BUILDING_ARRANGEMENT") return 1;
  if (phase === "PARTIALLY_DOCKED") return 2;
  if (phase === "ARRANGEMENT_COMPLETE" || phase === "COMPARING_REGIONS")
    return 3;
  return 4;
}

function sceneAtAnimationStep(step: number): ProofScene<PythagoreanPieceId> {
  const scene: ProofScene<PythagoreanPieceId> = structuredClone(
    INITIAL_PYTHAGOREAN_SCENE,
  );
  if (step >= 1) scene.phase = "OBSERVING_INVARIANTS";
  if (step >= 2) scene.phase = "BUILDING_ARRANGEMENT";
  const docked = step >= 3 ? 4 : 0;
  PYTHAGOREAN_PIECES.slice(0, docked).forEach((piece, index) => {
    const slot = PYTHAGOREAN_SLOTS[index];
    scene.objects[piece.id] = {
      id: piece.id,
      ...slot.target,
      dockedSlotId: slot.id,
    };
  });
  if (docked > 0)
    scene.phase = docked === 4 ? "ARRANGEMENT_COMPLETE" : "PARTIALLY_DOCKED";
  if (step >= 4) scene.phase = "ARRANGEMENT_COMPLETE";
  if (step >= 5) {
    scene.phase = "COMPARING_REGIONS";
    scene.comparisonConfirmed = true;
  }
  if (step >= 6) scene.phase = "BUILDING_EQUATION";
  if (step >= 7) scene.phase = "PROOF_COMPLETE";
  return scene;
}

function Triangle({
  id,
  transform,
  gradientId,
  label,
  muted = false,
  active = false,
  onPointerDown,
  onKeyDown,
}: {
  id?: string;
  transform: { x: number; y: number; rotation: number };
  gradientId: string;
  label: string;
  muted?: boolean;
  active?: boolean;
  onPointerDown?: (event: PointerEvent<SVGGElement>) => void;
  onKeyDown?: React.KeyboardEventHandler<SVGGElement>;
}) {
  return (
    <g
      data-testid={id}
      transform={`translate(${transform.x} ${transform.y}) rotate(${transform.rotation})`}
      className={clsx(
        onPointerDown && "draggable-piece proof-object",
        muted && "muted",
        active && "selected",
      )}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      tabIndex={onPointerDown ? 0 : undefined}
      role={onPointerDown ? "button" : undefined}
      aria-label={
        onPointerDown
          ? `Movable triangle ${label}. Drag it, use arrow keys, press R to rotate, or Enter to dock.`
          : undefined
      }
    >
      <polygon
        points="0,0 120,0 0,140"
        fill={`url(#${gradientId})`}
        className="shape"
      />
      <path d="M0 15h15V0" className="right-angle-mark" />
      <text x="34" y="42" className="svg-num">
        {label}
      </text>
      <text x="55" y="-7" className="piece-side-label">
        a
      </text>
      <text x="-15" y="73" className="piece-side-label">
        b
      </text>
      <text x="66" y="78" className="piece-side-label">
        c
      </text>
    </g>
  );
}

export default function PythagoreanProof() {
  const history = useCanvasHistory<ProofScene<PythagoreanPieceId>>(
    INITIAL_PYTHAGOREAN_SCENE,
  );
  const [selected, setSelected] = useState<PythagoreanPieceId | null>(null);
  const [preview, setPreview] =
    useState<ProofObjectState<PythagoreanPieceId> | null>(null);
  const previewRef = useRef(preview);
  const dragOffset = useRef({ x: 0, y: 0 });
  const [snap, setSnap] = useState(true);
  const [trace, setTrace] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [message, setMessage] = useState(
    "Pick a numbered triangle. Its matching slot will light up.",
  );
  const [question, setQuestion] = useState(false);
  const [formulaReset, setFormulaReset] = useState(0);
  const [animationStep, setAnimationStep] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const viewport = useCanvasViewport(820, 420, {
    minZoom: 1,
    maxZoom: 2.25,
    step: 0.25,
  });

  const scene = history.state;
  const objects = useMemo(
    () =>
      preview ? { ...scene.objects, [preview.id]: preview } : scene.objects,
    [preview, scene.objects],
  );
  const dockedCount = Object.values(scene.objects).filter(
    (object) => object.dockedSlotId,
  ).length;
  const arrangementComplete = dockedCount === 4;
  const equationEnabled =
    scene.phase === "BUILDING_EQUATION" || scene.phase === "PROOF_COMPLETE";
  const proofComplete = scene.phase === "PROOF_COMPLETE";
  const activeConfig = selected
    ? (PYTHAGOREAN_PIECES.find((piece) => piece.id === selected) ?? null)
    : null;
  const activeSlot = activeConfig
    ? (PYTHAGOREAN_SLOTS.find((slot) =>
        activeConfig.compatibleSlotIds.includes(slot.id),
      ) ?? null)
    : null;
  const setPreviewValue = (
    value: ProofObjectState<PythagoreanPieceId> | null,
  ) => {
    previewRef.current = value;
    setPreview(value);
  };

  const canvas = useProofCanvas<PythagoreanPieceId>(
    820,
    420,
    (id, point) => {
      const object = scene.objects[id];
      setPreviewValue({
        ...object,
        ...constrainTransform(
          {
            ...object,
            x: point.x - dragOffset.current.x,
            y: point.y - dragOffset.current.y,
          },
          PYTHAGOREAN_PIECES.find((piece) => piece.id === id)?.constraints,
        ),
        dockedSlotId: null,
      });
    },
    (id) => {
      const candidate = previewRef.current ?? scene.objects[id];
      const config = PYTHAGOREAN_PIECES.find((piece) => piece.id === id)!;
      const result = snap
        ? resolveDrop({
            object: candidate,
            config,
            slots: PYTHAGOREAN_SLOTS,
            objects: scene.objects,
            lastValidTransform: scene.objects[id],
          })
        : {
            kind: "rejected" as const,
            reason: "distance" as const,
            transform: scene.objects[id],
            message: "Snap is off. Turn Snap on to attach pieces.",
          };
      if (result.kind === "docked") {
        history.commit((current) => {
          const nextObjects = {
            ...current.objects,
            [id]: {
              id,
              ...result.transform,
              dockedSlotId: result.slotId,
            },
          };
          const count = Object.values(nextObjects).filter(
            (object) => object.dockedSlotId,
          ).length;
          return {
            ...current,
            objects: nextObjects,
            phase: count === 4 ? "ARRANGEMENT_COMPLETE" : "PARTIALLY_DOCKED",
          };
        });
        setMessage(`${config.label} snapped in! ${result.message}`);
        if (navigator.vibrate) navigator.vibrate(20);
      } else {
        const reasons = {
          orientation:
            "Turn the triangle until its right-angle corner matches the slot.",
          distance: snap
            ? "Move closer to the glowing matching slot."
            : "Snap is off. Turn Snap on to attach pieces.",
          incompatible: "That outline belongs to another numbered triangle.",
          occupied: "That slot is already occupied.",
          valid: "",
        };
        setMessage(snap ? result.message : reasons[result.reason]);
      }
      setPreviewValue(null);
    },
    {
      onDragStart: (id, point) => {
        const object = scene.objects[id];
        dragOffset.current = { x: point.x - object.x, y: point.y - object.y };
        setSelected(id);
        setPreviewValue(object);
        setMessage(
          `Triangle ${id.at(-1)} selected. Rotate if needed, then drag to its glowing outline.`,
        );
        if (scene.phase === "INITIAL")
          history.commit((current) => ({
            ...current,
            phase: "BUILDING_ARRANGEMENT",
          }));
      },
    },
  );

  const rotateSelected = () => {
    if (!selected) {
      setMessage("Select a triangle first, then press Rotate.");
      return;
    }
    history.commit((current) => ({
      ...current,
      phase: "BUILDING_ARRANGEMENT",
      objects: {
        ...current.objects,
        [selected]: {
          ...current.objects[selected],
          rotation: normalizeRotation(current.objects[selected].rotation + 90),
          dockedSlotId: null,
        },
      },
    }));
    setMessage(
      `Triangle ${selected.at(-1)} rotated 90°. Its right-angle marker must match the slot.`,
    );
  };

  const dockPiece = (id: PythagoreanPieceId) => {
    const slot = PYTHAGOREAN_SLOTS.find((candidate) =>
      candidate.accepts.includes(id),
    )!;
    history.commit((current) => {
      const nextObjects = {
        ...current.objects,
        [id]: { id, ...slot.target, dockedSlotId: slot.id },
      };
      return {
        ...current,
        objects: nextObjects,
        phase:
          Object.values(nextObjects).filter((object) => object.dockedSlotId)
            .length === 4
            ? "ARRANGEMENT_COMPLETE"
            : "PARTIALLY_DOCKED",
      };
    });
    setSelected(id);
    setPreviewValue(null);
    setMessage(
      `Triangle ${id.at(-1)} attached. Great work—choose the next triangle.`,
    );
    if (navigator.vibrate) navigator.vibrate(20);
  };

  const nudgeSelected = (direction: CanvasDirection) => {
    if (!selected) {
      setMessage("Choose a numbered triangle first.");
      return;
    }
    const delta = 12;
    const movement: Record<CanvasDirection, [number, number]> = {
      left: [-delta, 0],
      right: [delta, 0],
      up: [0, -delta],
      down: [0, delta],
    };
    const [dx, dy] = movement[direction];
    const config = PYTHAGOREAN_PIECES.find((piece) => piece.id === selected)!;
    history.commit((current) => ({
      ...current,
      phase: "BUILDING_ARRANGEMENT",
      objects: {
        ...current.objects,
        [selected]: {
          ...current.objects[selected],
          ...constrainTransform(
            {
              ...current.objects[selected],
              x: current.objects[selected].x + dx,
              y: current.objects[selected].y + dy,
            },
            config.constraints,
          ),
          dockedSlotId: null,
        },
      },
    }));
    setMessage(
      `Triangle ${selected.at(-1)} moved ${direction}. Keep going toward its glowing outline.`,
    );
  };
  const resetAll = useCallback(() => {
    history.reset(INITIAL_PYTHAGOREAN_SCENE);
    setPreviewValue(null);
    setSelected(null);
    setHintLevel(0);
    setTrace(false);
    setAnimationStep(-1);
    setPlaying(false);
    setFormulaReset((value) => value + 1);
    setMessage("Construction reset. Pick any numbered triangle.");
  }, [history]);
  const startAnimation = () => {
    setFormulaReset((value) => value + 1);
    setAnimationStep(0);
    setPlaying(true);
    setSelected(null);
    history.reset(sceneAtAnimationStep(0));
    setMessage(ANIMATION_STEPS[0].title);
  };
  const goAnimation = useCallback(
    (step: number) => {
      const next = Math.max(0, Math.min(ANIMATION_STEPS.length - 1, step));
      setAnimationStep(next);
      history.reset(sceneAtAnimationStep(next));
      setMessage(ANIMATION_STEPS[next].title);
      if (next === ANIMATION_STEPS.length - 1) setPlaying(false);
    },
    [history],
  );
  useEffect(() => {
    if (
      !playing ||
      animationStep < 0 ||
      animationStep >= ANIMATION_STEPS.length - 1
    )
      return;
    const timer = window.setTimeout(
      () => goAnimation(animationStep + 1),
      4200 / speed,
    );
    return () => window.clearTimeout(timer);
  }, [animationStep, goAnimation, playing, speed]);

  const unlockCount = proofComplete
    ? 7
    : equationEnabled
      ? 6
      : scene.comparisonConfirmed
        ? 5
        : arrangementComplete
          ? 4
          : dockedCount > 0
            ? 3
            : scene.phase === "INITIAL"
              ? 1
              : 2;
  const hintPiece =
    PYTHAGOREAN_PIECES.find((piece) => !scene.objects[piece.id].dockedSlotId) ??
    null;
  const hintSlot = hintPiece
    ? (PYTHAGOREAN_SLOTS.find((slot) =>
        hintPiece.compatibleSlotIds.includes(slot.id),
      ) ?? null)
    : null;
  const animationFill = animationStep >= 7 ? 5 : 0;

  const keyboardMove = (
    id: PythagoreanPieceId,
    event: React.KeyboardEvent<SVGGElement>,
  ) => {
    const delta = event.shiftKey ? 10 : 4;
    const movement: Record<string, [number, number]> = {
      ArrowLeft: [-delta, 0],
      ArrowRight: [delta, 0],
      ArrowUp: [0, -delta],
      ArrowDown: [0, delta],
    };
    if (event.key.toLowerCase() === "r") {
      setSelected(id);
      history.commit((current) => ({
        ...current,
        objects: {
          ...current.objects,
          [id]: {
            ...current.objects[id],
            rotation: normalizeRotation(current.objects[id].rotation + 90),
            dockedSlotId: null,
          },
        },
      }));
      return;
    }
    if (event.key === "Enter") {
      dockPiece(id);
      return;
    }
    if (!movement[event.key]) return;
    event.preventDefault();
    const [dx, dy] = movement[event.key];
    setSelected(id);
    history.commit((current) => ({
      ...current,
      phase: "BUILDING_ARRANGEMENT",
      objects: {
        ...current.objects,
        [id]: {
          ...current.objects[id],
          x: current.objects[id].x + dx,
          y: current.objects[id].y + dy,
          dockedSlotId: null,
        },
      },
    }));
  };
  const onFormulaComplete = useCallback(
    () =>
      history.commit((current) => ({
        ...current,
        phase: "PROOF_COMPLETE",
        comparisonConfirmed: true,
      })),
    [history],
  );

  return (
    <main className="proof-app pythagorean-engine">
      <Sidebar />
      <header className="page-head">
        <div>
          <div className="crumb">Visual Proofs / Geometry</div>
          <h1>Pythagorean Theorem</h1>
          <code className="catalog-proof-id">ID: pythagorean-theorem</code>
          <div className="subtitle">Rearrange the evidence</div>
        </div>
        <div className="badges">
          <div className="pill">Intermediate</div>
          <div className="pill time">
            <span className="clock" />
            10 min
          </div>
        </div>
      </header>
      <section className="mission pyth-mission">
        <div className="target">◎</div>
        <div className="mission-copy">
          <b>Use the same four triangles to build Arrangement B.</b>
          <br />
          <span>Rotate, dock, then compare the uncovered areas.</span>
        </div>
        <div className="mission-invariants">
          <InvariantIndicator
            icon="□"
            label="same frame"
            complete={scene.phase !== "INITIAL"}
          />
          <InvariantIndicator
            icon="△"
            label="same pieces"
            complete={dockedCount > 0}
          />
          <InvariantIndicator
            icon="≍"
            label="compare gaps"
            complete={scene.comparisonConfirmed}
          />
        </div>
      </section>
      <div className="main-grid">
        <section
          className="work-card engine-work-card"
          aria-label="Interactive Pythagorean rearrangement workspace"
        >
          <div className="engine-toolbar" aria-label="Proof tools">
            <button
              className={clsx("engine-tool", selected && "active")}
              onClick={() =>
                setMessage("Select a triangle directly on the canvas.")
              }
            >
              <span>☝</span>Select
            </button>
            <button className="engine-tool" onClick={rotateSelected}>
              <span>↻</span>Rotate
            </button>
            <button
              className={clsx("engine-tool", snap && "active")}
              aria-pressed={snap}
              onClick={() => setSnap((value) => !value)}
            >
              <span>∪</span>Snap
            </button>
            <button
              className={clsx("engine-tool", trace && "active")}
              aria-pressed={trace}
              onClick={() => setTrace((value) => !value)}
            >
              <span>⌁</span>Trace
            </button>
            <button
              className="engine-tool"
              disabled={!history.canUndo}
              onClick={history.undo}
            >
              <span>↶</span>Undo
            </button>
            <button
              className="engine-tool"
              disabled={!history.canRedo}
              onClick={history.redo}
            >
              <span>↷</span>Redo
            </button>
            <button className="engine-tool" onClick={resetAll}>
              <span>⟲</span>Reset
            </button>
            <button
              className={clsx("engine-tool", hintLevel > 0 && "active")}
              onClick={() => {
                const next = hintLevel >= 3 ? 0 : hintLevel + 1;
                setHintLevel(next);
                setMessage(
                  next === 1
                    ? "Hint 1: matching piece and slot are glowing."
                    : next === 2
                      ? "Hint 2: follow the curved path and rotate."
                      : next === 3
                        ? "Hint 3: match the transparent ghost exactly."
                        : "Hints hidden. Try the next move yourself.",
                );
              }}
            >
              <span>?</span>Hint {hintLevel || ""}
            </button>
            <button
              className="engine-tool animate-tool"
              onClick={startAnimation}
              aria-label="Watch the guided animated proof"
            >
              <span>▶</span>Watch proof
            </button>
          </div>
          <div className="canvas-message" role="status" aria-live="polite">
            <span className="grab-cue">✋</span>
            {message}
          </div>
          <CanvasNavigator
            items={PYTHAGOREAN_PIECES.map((piece) => ({
              id: piece.id,
              label: piece.label,
              color: piece.color,
              complete: Boolean(scene.objects[piece.id].dockedSlotId),
            }))}
            selectedId={selected}
            onSelect={(id) => {
              setSelected(id);
              setMessage(
                `Triangle ${id.at(-1)} selected. Drag it, use the arrows, or press Attach.`,
              );
            }}
            onNudge={nudgeSelected}
            onRotate={rotateSelected}
            onDock={() => selected && dockPiece(selected)}
            zoomPercent={viewport.zoomPercent}
            canZoomIn={viewport.canZoomIn}
            canZoomOut={viewport.canZoomOut}
            onZoomIn={viewport.zoomIn}
            onZoomOut={viewport.zoomOut}
            onFit={viewport.fit}
            completedCount={dockedCount}
            instruction={message}
          />
          <svg
            className={canvas.canvasClassName(
              "pyth-svg",
              "interactive-svg",
              canvas.dragging && "has-active-drag",
            )}
            viewBox={viewport.viewBox}
            {...canvas.canvasProps}
            role="img"
            aria-label="Two identical square frames. Arrangement A is complete. Drag synchronized copies of its four numbered triangles into the dashed slots in empty Arrangement B."
          >
            <defs>
              <linearGradient id="p">
                <stop stopColor="#bd92fb" />
                <stop offset="1" stopColor="#7446df" />
              </linearGradient>
              <linearGradient id="u">
                <stop stopColor="#65cfff" />
                <stop offset="1" stopColor="#278fdc" />
              </linearGradient>
              <linearGradient id="t">
                <stop stopColor="#8ae4d3" />
                <stop offset="1" stopColor="#33b6a7" />
              </linearGradient>
              <linearGradient id="r">
                <stop stopColor="#ffa09f" />
                <stop offset="1" stopColor="#f75e63" />
              </linearGradient>
            </defs>
            <text x="155" y="20" className="svg-title">
              Arrangement A · reference
            </text>
            <text x="610" y="20" className="svg-title">
              Arrangement B · you build it
            </text>
            <g className="frame-dim">
              <line x1="70" y1="50" x2="330" y2="50" />
              <line x1="70" y1="44" x2="70" y2="57" />
              <line x1="330" y1="44" x2="330" y2="57" />
              <text x="184" y="56">
                a + b
              </text>
              <line x1="520" y1="50" x2="780" y2="50" />
              <line x1="520" y1="44" x2="520" y2="57" />
              <line x1="780" y1="44" x2="780" y2="57" />
              <text x="634" y="56">
                a + b
              </text>
            </g>
            <rect
              x="70"
              y="82"
              width="260"
              height="260"
              className="outer-frame"
            />
            <rect
              x="520"
              y="82"
              width="260"
              height="260"
              className="outer-frame"
            />
            {PYTHAGOREAN_PIECES.map((piece) => (
              <Triangle
                key={`source-${piece.id}`}
                transform={piece.initial}
                gradientId={piece.gradientId}
                label={piece.label}
                muted={
                  scene.objects[piece.id].x !== piece.initial.x ||
                  scene.objects[piece.id].y !== piece.initial.y
                }
              />
            ))}
            <polygon
              points="190,82 330,202 210,342 70,222"
              className={clsx(
                "c-region",
                scene.comparisonConfirmed && "region-focus",
              )}
            />
            <text x="184" y="222" className="region-label">
              c²
            </text>
            <text x="72" y="373" className="copy-note">
              Move the outlined copies — Arrangement A stays for comparison.
            </text>
            <rect
              x="520"
              y="82"
              width="120"
              height="120"
              className={clsx(
                "area-region a-region",
                arrangementComplete && "revealed",
              )}
            />
            <rect
              x="640"
              y="202"
              width="140"
              height="140"
              className={clsx(
                "area-region b-region",
                arrangementComplete && "revealed",
              )}
            />
            {arrangementComplete && (
              <>
                <text x="562" y="151" className="region-label">
                  a²
                </text>
                <text x="692" y="282" className="region-label">
                  b²
                </text>
              </>
            )}
            {PYTHAGOREAN_SLOTS.map((slot) => {
              const occupied = Object.values(scene.objects).some(
                (object) => object.dockedSlotId === slot.id,
              );
              const compatible = selected && slot.accepts.includes(selected);
              const near =
                preview &&
                compatible &&
                Math.hypot(
                  preview.x - slot.target.x,
                  preview.y - slot.target.y,
                ) < 100;
              const hinted = hintSlot?.id === slot.id && hintLevel > 0;
              return (
                <g
                  key={slot.id}
                  transform={`translate(${slot.target.x} ${slot.target.y}) rotate(${slot.requiredRotation})`}
                  className={clsx(
                    "docking-slot",
                    occupied && "occupied",
                    compatible && canvas.dragging && "compatible",
                    near && "nearest",
                    hinted && "hinted",
                  )}
                >
                  <polygon points="0,0 120,0 0,140" />
                  <text x="35" y="43">
                    {slot.accepts[0].at(-1)}
                  </text>
                  {((near && canvas.dragging) ||
                    (hinted && hintLevel >= 3)) && (
                    <polygon points="0,0 120,0 0,140" className="slot-ghost" />
                  )}
                </g>
              );
            })}
            {trace && selected && activeSlot && (
              <path
                d={`M${objects[selected].x},${objects[selected].y} Q430,30 ${activeSlot.target.x},${activeSlot.target.y}`}
                className="motion-path"
              />
            )}
            {hintLevel >= 2 && hintPiece && hintSlot && (
              <>
                <path
                  d={`M${objects[hintPiece.id].x},${objects[hintPiece.id].y} Q430,30 ${hintSlot.target.x},${hintSlot.target.y}`}
                  className="motion-path hint-path"
                />
                <text x="402" y="54" className="rotate-hint">
                  ↻ rotate to {hintSlot.requiredRotation}°
                </text>
              </>
            )}
            {PYTHAGOREAN_PIECES.map((piece) => {
              const object = objects[piece.id];
              return (
                <g
                  key={`moving-${piece.id}`}
                  className={clsx(
                    canvas.dragTarget &&
                      canvas.dragTarget !== piece.id &&
                      "unrelated",
                  )}
                >
                  <Triangle
                    id={`pyth-${piece.id}`}
                    transform={object}
                    gradientId={piece.gradientId}
                    label={piece.label}
                    active={selected === piece.id}
                    onPointerDown={(event) => canvas.beginDrag(piece.id, event)}
                    onKeyDown={(event) => keyboardMove(piece.id, event)}
                  />
                  <g
                    transform={`translate(${object.x} ${object.y})`}
                    className="piece-focus-ring"
                  >
                    <circle r="15" />
                  </g>
                </g>
              );
            })}
          </svg>
          <ProofStepNavigator
            labels={PYTHAGOREAN_STEPS}
            active={phaseStep(scene.phase)}
          />
        </section>
        <aside className="why-card engine-why">
          <h2 className="why-title">
            <span>✧</span>Why it works
          </h2>
          <button className="guided-proof-button" onClick={startAnimation}>
            <span>▶</span>
            <span>
              <b>Watch the proof</b>
              <small>8 slow, explained steps</small>
            </span>
          </button>
          <div className="reasoning-list">
            {PYTHAGOREAN_REASONING.map((text, index) => (
              <div
                key={text}
                className={clsx(
                  "reason engine-reason",
                  index >= unlockCount && "locked",
                )}
              >
                <div className="reason-head">
                  <i className="reason-no">
                    {index < unlockCount ? index + 1 : "🔒"}
                  </i>
                  <span>
                    {index < unlockCount
                      ? text
                      : "Complete the current step to unlock."}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <button
            className="select-row"
            onClick={() => setQuestion((value) => !value)}
            aria-expanded={question}
          >
            Why can we remove the triangles?<span>{question ? "⌃" : "⌄"}</span>
          </button>
          {question && (
            <div className="inline-answer">
              <b>Same whole − same pieces = same remainder.</b>
              <br />
              Both squares are equal, and both contain the same four triangles.
              Removing those equal triangle areas leaves c² on the left and a² +
              b² on the right.
            </div>
          )}
          <button
            className="primary"
            disabled={!arrangementComplete}
            onClick={() =>
              history.commit((current) => ({
                ...current,
                phase: "BUILDING_EQUATION",
                comparisonConfirmed: true,
              }))
            }
          >
            {arrangementComplete
              ? "Compare uncovered areas"
              : `Dock ${4 - dockedCount} more triangle${4 - dockedCount === 1 ? "" : "s"}`}
          </button>
          {proofComplete && (
            <div className="completion-mini">
              <MathFormula latex="a^2+b^2=c^2" />
              <span>✓ The remaining areas are equal.</span>
            </div>
          )}
        </aside>
      </div>
      {animationStep >= 0 && (
        <section
          className="animation-controller guided-animation"
          aria-label="Guided proof animation controls"
        >
          <div
            className="animation-progress"
            aria-label={`Step ${animationStep + 1} of ${ANIMATION_STEPS.length}`}
          >
            {ANIMATION_STEPS.map((step, index) => (
              <button
                key={step.title}
                className={clsx(
                  index === animationStep && "active",
                  index < animationStep && "done",
                )}
                onClick={() => {
                  setPlaying(false);
                  goAnimation(index);
                }}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                {index < animationStep ? "✓" : index + 1}
              </button>
            ))}
          </div>
          <div className="animation-explanation">
            <span className="animation-kicker">
              STEP {animationStep + 1} OF {ANIMATION_STEPS.length}
            </span>
            <h3>{ANIMATION_STEPS[animationStep].title}</h3>
            <p>{ANIMATION_STEPS[animationStep].explanation}</p>
            <div className="animation-formula">
              <MathFormula latex={ANIMATION_STEPS[animationStep].formula} />
            </div>
          </div>
          <div className="animation-actions">
            <button
              onClick={() => goAnimation(animationStep - 1)}
              disabled={animationStep === 0}
            >
              ← Previous
            </button>
            <button
              className="play-pause"
              onClick={() => {
                if (animationStep === ANIMATION_STEPS.length - 1) {
                  goAnimation(0);
                  setPlaying(true);
                } else {
                  setPlaying((value) => !value);
                }
              }}
            >
              {playing
                ? "❚❚ Pause"
                : animationStep === ANIMATION_STEPS.length - 1
                  ? "▶ Replay"
                  : "▶ Play"}
            </button>
            <button
              onClick={() => goAnimation(animationStep + 1)}
              disabled={animationStep === ANIMATION_STEPS.length - 1}
            >
              Next →
            </button>
            <button onClick={() => goAnimation(0)}>↺ Restart</button>
            <label>
              Speed{" "}
              <select
                value={speed}
                onChange={(event) => setSpeed(+event.target.value)}
              >
                <option value=".5">0.5×</option>
                <option value="1">1×</option>
                <option value="1.5">1.5×</option>
                <option value="2">2×</option>
              </select>
            </label>
            <button
              onClick={() => {
                setPlaying(false);
                setAnimationStep(-1);
                setMessage(
                  "Manual mode restored. Now try building the proof yourself.",
                );
              }}
            >
              Try it myself
            </button>
          </div>
        </section>
      )}
      <div className="bottom-row engine-bottom-row">
        <section className="bottom-card formula-card">
          <FormulaDock
            enabled={equationEnabled}
            resetKey={formulaReset}
            animationFillCount={animationFill}
            onComplete={onFormulaComplete}
          />
        </section>
        <section className="bottom-card explore-card">
          <div className="try-title">Explore a right triangle</div>
          <div className="inputs">
            <label>
              a<br />
              <input
                type="number"
                min="1"
                max="20"
                value={a}
                onChange={(event) => setA(+event.target.value)}
              />
            </label>
            <label>
              b<br />
              <input
                type="number"
                min="1"
                max="20"
                value={b}
                onChange={(event) => setB(+event.target.value)}
              />
            </label>
            <label>
              c<br />
              <input
                readOnly
                value={Math.sqrt(a * a + b * b)
                  .toFixed(2)
                  .replace(/\.00$/, "")}
              />
            </label>
          </div>
          <div className="live-equation">
            <MathFormula
              latex={`${a}^2+${b}^2=${a * a + b * b}=(${Math.sqrt(a * a + b * b).toFixed(2)})^2`}
            />
          </div>
          {proofComplete && (
            <div className="completion-actions">
              <button onClick={startAnimation}>Replay proof</button>
              <button
                onClick={() => {
                  resetAll();
                  setHintLevel(0);
                }}
              >
                Try without hints
              </button>
              <button onClick={resetAll}>Reset construction</button>
              <button onClick={() => setQuestion(true)}>
                Explain each step
              </button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

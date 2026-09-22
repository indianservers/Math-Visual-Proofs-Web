"use client";

import {
  ArrowRight,
  Check,
  Clock3,
  GraduationCap,
  Lightbulb,
  MousePointer2,
  Pause,
  Play,
  RefreshCcw,
  Split,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import ProofMainMenu from "./ProofMainMenu";
import styles from "./AngleSumTriangleProof.module.css";

type Point = { x: number; y: number };
type VertexName = "A" | "B" | "C";
type Vertices = Record<VertexName, Point>;

const WIDTH = 900;
const HEIGHT = 560;
const DEFAULT_VERTICES: Vertices = {
  A: { x: 475, y: 115 },
  B: { x: 175, y: 410 },
  C: { x: 765, y: 410 },
};
const COLORS = { A: "#6436e8", B: "#09a982", C: "#ff5b57" } as const;

function distance(a: Point, b: Point) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleAt(center: Point, first: Point, second: Point) {
  const u = { x: first.x - center.x, y: first.y - center.y };
  const v = { x: second.x - center.x, y: second.y - center.y };
  const divisor = Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y);
  if (divisor < 0.001) return 0;
  const cosine = Math.max(-1, Math.min(1, (u.x * v.x + u.y * v.y) / divisor));
  return (Math.acos(cosine) * 180) / Math.PI;
}

function displayedAngles(vertices: Vertices) {
  const precise = {
    A: angleAt(vertices.A, vertices.B, vertices.C),
    B: angleAt(vertices.B, vertices.A, vertices.C),
    C: angleAt(vertices.C, vertices.A, vertices.B),
  };
  const A = Math.round(precise.A);
  const B = Math.round(precise.B);
  return { precise, shown: { A, B, C: 180 - A - B } };
}

function sectorPath(center: Point, first: Point, second: Point, radius: number) {
  const startAngle = Math.atan2(first.y - center.y, first.x - center.x);
  const endAngle = Math.atan2(second.y - center.y, second.x - center.x);
  let delta = endAngle - startAngle;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const start = {
    x: center.x + Math.cos(startAngle) * radius,
    y: center.y + Math.sin(startAngle) * radius,
  };
  const end = {
    x: center.x + Math.cos(startAngle + delta) * radius,
    y: center.y + Math.sin(startAngle + delta) * radius,
  };
  return `M ${center.x} ${center.y} L ${start.x} ${start.y} A ${radius} ${radius} 0 0 ${delta > 0 ? 1 : 0} ${end.x} ${end.y} Z`;
}

function labelPoint(center: Point, first: Point, second: Point, radius: number) {
  const a = Math.atan2(first.y - center.y, first.x - center.x);
  const b = Math.atan2(second.y - center.y, second.x - center.x);
  let delta = b - a;
  while (delta > Math.PI) delta -= Math.PI * 2;
  while (delta < -Math.PI) delta += Math.PI * 2;
  const middle = a + delta / 2;
  return {
    x: center.x + Math.cos(middle) * radius,
    y: center.y + Math.sin(middle) * radius,
  };
}

function pointOnRay(origin: Point, direction: Point, length: number) {
  const magnitude = Math.hypot(direction.x, direction.y) || 1;
  return {
    x: origin.x + (direction.x / magnitude) * length,
    y: origin.y + (direction.y / magnitude) * length,
  };
}

export default function AngleSumTriangleProof() {
  const [vertices, setVertices] = useState<Vertices>(DEFAULT_VERTICES);
  const [dragging, setDragging] = useState<VertexName | null>(null);
  const [showParallel, setShowParallel] = useState(false);
  const [splitAngle, setSplitAngle] = useState(false);
  const [proofStep, setProofStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [answerState, setAnswerState] = useState<"idle" | "correct" | "wrong">("idle");
  const svgRef = useRef<SVGSVGElement>(null);
  const animationRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetFrameRef = useRef<number | null>(null);
  const { shown } = useMemo(() => displayedAngles(vertices), [vertices]);

  useEffect(() => {
    if (!playing) return;
    animationRef.current = setInterval(() => {
      setProofStep((step) => {
        if (step >= 7) {
          setPlaying(false);
          return 7;
        }
        return step + 1;
      });
    }, 780);
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, [playing]);

  useEffect(() => () => {
    if (animationRef.current) clearInterval(animationRef.current);
    if (resetFrameRef.current) cancelAnimationFrame(resetFrameRef.current);
  }, []);

  const updateVertex = useCallback((name: VertexName, point: Point) => {
    const next = {
      x: Math.max(65, Math.min(WIDTH - 65, point.x)),
      y: Math.max(65, Math.min(HEIGHT - 65, point.y)),
    };
    setVertices((current) => {
      const others = (Object.keys(current) as VertexName[]).filter((key) => key !== name);
      if (others.some((key) => distance(next, current[key]) < 70)) return current;
      return { ...current, [name]: next };
    });
    setProofStep(0);
  }, []);

  const eventPoint = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / rect.width) * WIDTH,
      y: ((event.clientY - rect.top) / rect.height) * HEIGHT,
    };
  };

  const handleKey = (name: VertexName, event: KeyboardEvent<SVGGElement>) => {
    const delta = event.shiftKey ? 12 : 5;
    const movement: Record<string, Point> = {
      ArrowLeft: { x: -delta, y: 0 },
      ArrowRight: { x: delta, y: 0 },
      ArrowUp: { x: 0, y: -delta },
      ArrowDown: { x: 0, y: delta },
    };
    if (!movement[event.key]) return;
    event.preventDefault();
    updateVertex(name, {
      x: vertices[name].x + movement[event.key].x,
      y: vertices[name].y + movement[event.key].y,
    });
  };

  const reset = () => {
    if (resetFrameRef.current) cancelAnimationFrame(resetFrameRef.current);
    const from = vertices;
    const start = performance.now();
    const animate = (now: number) => {
      const raw = Math.min(1, (now - start) / 480);
      const eased = 1 - Math.pow(1 - raw, 3);
      setVertices({
        A: {
          x: from.A.x + (DEFAULT_VERTICES.A.x - from.A.x) * eased,
          y: from.A.y + (DEFAULT_VERTICES.A.y - from.A.y) * eased,
        },
        B: {
          x: from.B.x + (DEFAULT_VERTICES.B.x - from.B.x) * eased,
          y: from.B.y + (DEFAULT_VERTICES.B.y - from.B.y) * eased,
        },
        C: {
          x: from.C.x + (DEFAULT_VERTICES.C.x - from.C.x) * eased,
          y: from.C.y + (DEFAULT_VERTICES.C.y - from.C.y) * eased,
        },
      });
      if (raw < 1) resetFrameRef.current = requestAnimationFrame(animate);
    };
    resetFrameRef.current = requestAnimationFrame(animate);
    setShowParallel(false);
    setSplitAngle(false);
    setProofStep(0);
    setPlaying(false);
  };

  const startProof = () => {
    setShowParallel(true);
    setSplitAngle(true);
    setProofStep(1);
    setPlaying(true);
  };

  const parallelVisible = showParallel || proofStep >= 1;
  const splitVisible = splitAngle || proofStep >= 3;
  const baseDirection = {
    x: vertices.C.x - vertices.B.x,
    y: vertices.C.y - vertices.B.y,
  };
  const parallelLeft = pointOnRay(vertices.A, { x: -baseDirection.x, y: -baseDirection.y }, 650);
  const parallelRight = pointOnRay(vertices.A, baseDirection, 650);

  const angleLabels = {
    A: labelPoint(vertices.A, vertices.B, vertices.C, 103),
    B: labelPoint(vertices.B, vertices.A, vertices.C, 91),
    C: labelPoint(vertices.C, vertices.A, vertices.B, 91),
  };
  const challengeExpected = shown.C;

  return (
    <main className={styles.page}>
      <ProofMainMenu />

      <header className={styles.header}>
        <div className={styles.headerCopy}>
          <nav aria-label="Breadcrumb"><span>◇</span> Visual Proofs <i>/</i> Geometry</nav>
          <h1>Angle Sum of a Triangle</h1>
          <p>Move the vertices to explore. What do you notice about the three angles?</p>
        </div>
        <div className={styles.headerActions}>
          <span className={styles.badge}>▥ <b>Intermediate</b></span>
          <span className={styles.badge}><Clock3 size={19} /> 10 min</span>
          <button className={styles.checkButton} onClick={() => {
            setAnswer("");
            setAnswerState("idle");
            setChallengeOpen(true);
          }}>
            Check understanding <ArrowRight size={19} />
          </button>
        </div>
      </header>

      <div className={styles.layout}>
        <section className={styles.canvasCard}>
          <div className={styles.tryCard}>
            <span><Lightbulb size={22} /></span>
            <div><b>Try this!</b><p>Drag the vertices A, B or C<br />to change the triangle.</p></div>
          </div>
          <div className={styles.dragNote}>Drag the points<br />and explore! ↙</div>

          <svg
            ref={svgRef}
            className={styles.triangleSvg}
            viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
            role="img"
            aria-label={`Interactive triangle. Angle A is ${shown.A} degrees, B is ${shown.B} degrees, and C is ${shown.C} degrees.`}
            onPointerMove={(event) => dragging && updateVertex(dragging, eventPoint(event))}
            onPointerUp={(event) => {
              if (dragging && event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              setDragging(null);
            }}
            onPointerCancel={() => setDragging(null)}
          >
            <defs>
              <linearGradient id="triangleFill" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#8a68f7" stopOpacity=".16" />
                <stop offset="1" stopColor="#4b34e8" stopOpacity=".035" />
              </linearGradient>
              <filter id="vertexGlow" x="-100%" y="-100%" width="300%" height="300%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {parallelVisible && (
              <g className={styles.parallelProof}>
                <line x1={parallelLeft.x} y1={parallelLeft.y} x2={parallelRight.x} y2={parallelRight.y} />
                <text x={Math.max(24, vertices.A.x - 360)} y={vertices.A.y - 18}>parallel to BC</text>
                <path d={`M ${vertices.A.x - 320} ${vertices.A.y - 9} l 12 -7 l -12 -7`} />
                <path d={`M ${vertices.A.x + 300} ${vertices.A.y - 9} l 12 -7 l -12 -7`} />
              </g>
            )}

            <polygon
              points={`${vertices.A.x},${vertices.A.y} ${vertices.B.x},${vertices.B.y} ${vertices.C.x},${vertices.C.y}`}
              fill="url(#triangleFill)"
              className={styles.triangle}
            />

            <path d={sectorPath(vertices.A, vertices.B, vertices.C, 57)} fill={COLORS.A} className={styles.angleSector} />
            <path d={sectorPath(vertices.B, vertices.A, vertices.C, 57)} fill={COLORS.B} className={`${styles.angleSector} ${proofStep === 2 ? styles.emphasis : ""}`} />
            <path d={sectorPath(vertices.C, vertices.A, vertices.B, 57)} fill={COLORS.C} className={`${styles.angleSector} ${proofStep === 4 ? styles.emphasis : ""}`} />

            {splitVisible && (
              <g className={styles.transferredAngles}>
                <path
                  d={sectorPath(vertices.A, parallelLeft, vertices.B, 72)}
                  fill={COLORS.B}
                  className={proofStep === 3 ? styles.emphasis : ""}
                />
                <path
                  d={sectorPath(vertices.A, vertices.C, parallelRight, 72)}
                  fill={COLORS.C}
                  className={proofStep === 5 ? styles.emphasis : ""}
                />
                <text x={vertices.A.x - 105} y={vertices.A.y + 8} fill={COLORS.B}>B</text>
                <text x={vertices.A.x + 88} y={vertices.A.y + 8} fill={COLORS.C}>C</text>
              </g>
            )}

            {proofStep >= 6 && (
              <g className={styles.straightAngle}>
                <path d={`M ${vertices.A.x - 94} ${vertices.A.y} A 94 94 0 0 1 ${vertices.A.x + 94} ${vertices.A.y}`} />
                <text x={vertices.A.x - 28} y={vertices.A.y - 85}>180°</text>
              </g>
            )}

            {(Object.keys(vertices) as VertexName[]).map((name) => {
              const point = vertices[name];
              const label = angleLabels[name];
              return (
                <g key={name}>
                  <text
                    x={label.x}
                    y={label.y}
                    textAnchor="middle"
                    fill={COLORS[name]}
                    className={styles.angleLabel}
                  >
                    {name} = {shown[name]}°
                  </text>
                  <g
                    className={`${styles.vertex} ${dragging === name ? styles.dragging : ""}`}
                    transform={`translate(${point.x} ${point.y})`}
                    tabIndex={0}
                    role="slider"
                    aria-label={`Move vertex ${name}`}
                    aria-valuetext={`x ${Math.round(point.x)}, y ${Math.round(point.y)}`}
                    onKeyDown={(event) => handleKey(name, event)}
                    onPointerDown={(event) => {
                      event.preventDefault();
                      svgRef.current?.setPointerCapture(event.pointerId);
                      setDragging(name);
                    }}
                  >
                    <circle r="21" fill={COLORS[name]} opacity=".12" filter="url(#vertexGlow)" />
                    <circle r="16" fill="white" stroke={COLORS[name]} strokeWidth="2" />
                    <circle r="8" fill="white" stroke={COLORS[name]} strokeWidth="4" />
                    <text y={name === "A" ? -26 : 43} textAnchor="middle" fill="#0b1445" className={styles.vertexName}>{name}</text>
                    <title>{`Drag vertex ${name}`}</title>
                  </g>
                </g>
              );
            })}
          </svg>

          <LiveEquation angles={shown} conclusion={proofStep >= 7} />
        </section>

        <aside className={styles.rightColumn}>
          <section className={styles.toolsCard}>
            <div className={styles.cardHeading}>
              <h2>🛠 <span>Tools</span></h2>
              <small>Interact and explore</small>
            </div>
            <div className={styles.toolGrid}>
              <ToolButton
                active={!showParallel && !splitAngle && proofStep === 0}
                icon={<MousePointer2 />}
                title="Drag vertices"
                subtitle="Move A, B or C"
                onClick={() => { setShowParallel(false); setSplitAngle(false); setProofStep(0); setPlaying(false); }}
              />
              <ToolButton
                active={showParallel}
                icon={<span className={styles.parallelIcon} />}
                title="Show parallel line"
                subtitle="See the proof"
                onClick={() => { setShowParallel((value) => !value); setProofStep(0); setPlaying(false); }}
              />
              <ToolButton
                active={splitAngle}
                icon={<Split />}
                title="Split angle"
                subtitle="Explore angles"
                onClick={() => { setSplitAngle((value) => !value); setShowParallel(true); setProofStep(0); setPlaying(false); }}
              />
              <ToolButton icon={<RefreshCcw />} title="Reset" subtitle="New triangle" onClick={reset} />
            </div>
            <button className={styles.animateButton} onClick={playing ? () => setPlaying(false) : startProof}>
              <span>{playing ? <Pause fill="currentColor" /> : <Play fill="currentColor" />}</span>
              <div><b>{playing ? "Pause proof" : proofStep >= 7 ? "Replay proof" : "Animate proof"}</b><small>Watch the reasoning</small></div>
            </button>
            <div className={styles.progress} aria-label={`Proof animation step ${proofStep} of 7`}>
              {Array.from({ length: 7 }, (_, index) => <i key={index} className={proofStep > index ? styles.done : ""} />)}
            </div>
          </section>

          <section className={styles.ideaCard}>
            <div className={styles.cardHeading}>
              <h2><GraduationCap /> <span>The idea (Visual Proof)</span></h2>
            </div>
            <ProofStep number={1} active={proofStep === 1} done={proofStep > 1}>Draw a line through A parallel to BC.</ProofStep>
            <ProofStep number={2} active={proofStep >= 2 && proofStep <= 5} done={proofStep > 5}>Each angle at A equals a corresponding angle at B or C (alternate angles).</ProofStep>
            <ProofStep number={3} active={proofStep === 6} done={proofStep > 6}>The three angles form a straight line, which is 180°.</ProofStep>
            <div className={`${styles.conclusion} ${proofStep >= 7 ? styles.conclusionActive : ""}`}>
              <Lightbulb />
              <div><b>So, <span>∠A + ∠B + ∠C = 180°</span></b><small>This is true for every triangle!</small></div>
            </div>
          </section>
        </aside>
      </div>

      {challengeOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setChallengeOpen(false);
        }}>
          <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="challenge-title">
            <button className={styles.closeButton} aria-label="Close challenge" onClick={() => setChallengeOpen(false)}><X /></button>
            <span className={styles.modalIcon}>?</span>
            <p className={styles.modalKicker}>CHECK UNDERSTANDING</p>
            <h2 id="challenge-title">Can you find the missing angle?</h2>
            <p>Every triangle has an angle sum of 180°.</p>
            <div className={styles.challengeEquation}>
              <span style={{ color: COLORS.A }}>A = {shown.A}°</span>
              <span style={{ color: COLORS.B }}>B = {shown.B}°</span>
              <span style={{ color: COLORS.C }}>C = ?</span>
            </div>
            <label>
              Angle C
              <div className={styles.answerRow}>
                <input
                  inputMode="numeric"
                  aria-label="Your answer for angle C"
                  value={answer}
                  onChange={(event) => { setAnswer(event.target.value.replace(/[^0-9]/g, "")); setAnswerState("idle"); }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") setAnswerState(Number(answer) === challengeExpected ? "correct" : "wrong");
                  }}
                />
                <span>°</span>
                <button onClick={() => setAnswerState(Number(answer) === challengeExpected ? "correct" : "wrong")}>Check</button>
              </div>
            </label>
            {answerState !== "idle" && (
              <div className={answerState === "correct" ? styles.correct : styles.wrong} role="status">
                {answerState === "correct" ? <><Check /> Correct — the angles total 180°.</> : <>Not quite. Subtract A and B from 180°.</>}
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}

function LiveEquation({ angles, conclusion }: { angles: Record<VertexName, number>; conclusion: boolean }) {
  return (
    <section className={`${styles.equationCard} ${conclusion ? styles.equationComplete : ""}`}>
      <div className={styles.successMark}><Check /></div>
      <div>
        <div className={styles.equation}>
          <span style={{ color: COLORS.A }}>∠A</span> + <span style={{ color: COLORS.B }}>∠B</span> + <span style={{ color: COLORS.C }}>∠C</span>
          <b>=</b>
          <span style={{ color: COLORS.A }}>{angles.A}°</span> + <span style={{ color: COLORS.B }}>{angles.B}°</span> + <span style={{ color: COLORS.C }}>{angles.C}°</span>
          <b>=</b> <strong>180°</strong>
        </div>
        <div className={styles.alwaysTrue}><b>Always true!</b><span>No matter how you move the vertices, the angles of a triangle always add up to 180°.</span></div>
      </div>
    </section>
  );
}

function ToolButton({ icon, title, subtitle, active = false, onClick }: { icon: ReactNode; title: string; subtitle: string; active?: boolean; onClick: () => void }) {
  return (
    <button className={`${styles.toolButton} ${active ? styles.toolActive : ""}`} onClick={onClick} aria-pressed={active}>
      <span>{icon}</span><div><b>{title}</b><small>{subtitle}</small></div>
    </button>
  );
}

function ProofStep({ number, active, done, children }: { number: number; active: boolean; done: boolean; children: ReactNode }) {
  return (
    <div className={`${styles.proofStep} ${active ? styles.stepActive : ""} ${done ? styles.stepDone : ""}`}>
      <span>{done ? "✓" : number}</span><p>{children}</p>
    </div>
  );
}

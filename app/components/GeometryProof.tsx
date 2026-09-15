"use client";
import Link from "next/link";
import { useState } from "react";
import MathFormula from "./MathFormula";
import { nearestSnap, useProofCanvas } from "./useProofCanvas";

type Kind = "area" | "angles" | "exterior" | "similar";
const proofIds: Record<Kind, string> = {
  area: "triangle-area",
  angles: "triangle-angle-sum",
  exterior: "exterior-angle-theorem",
  similar: "similar-triangles",
};
const meta = {
  area: {
    title: "Area of a Triangle",
    subtitle: "Why is it half of base × height?",
    difficulty: "Beginner",
    time: "7 min",
    mission: "Drag the apex. The triangle changes — but does its area?",
  },
  angles: {
    title: "Angle Sum of a Triangle",
    subtitle: "Lift the three corner angles. Can they fill a straight line?",
    difficulty: "Intermediate",
    time: "10 min",
    mission: "Lift the three corner angles. Can they fill a straight line?",
  },
  exterior: {
    title: "Exterior Angle Theorem",
    subtitle:
      "An exterior angle equals the sum of the two remote interior angles.",
    difficulty: "Intermediate",
    time: "8 minutes",
    mission:
      "Extend side BC to form exterior angle ∠ACD. Show that m∠ACD = m∠A + m∠B.",
  },
  similar: {
    title: "Similar Triangles and Proportional Sides",
    subtitle: "",
    difficulty: "Intermediate",
    time: "9 minutes",
    mission:
      "Drag the blue triangle to resize it. Watch the angles stay equal and the sides stay in proportion.",
  },
};

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
function Header({ kind }: { kind: Kind }) {
  const m = meta[kind];
  return (
    <>
      <header className="page-head">
        <div>
          <div className="crumb">
            Visual Proofs　/　Geometry
            {kind === "exterior" || kind === "similar" ? " Proofs" : ""}
          </div>
          <h1>{m.title}</h1>
          <code className="catalog-proof-id">ID: {proofIds[kind]}</code>
          {m.subtitle && <div className="subtitle">{m.subtitle}</div>}
        </div>
        <div className="badges">
          <div className="pill">{m.difficulty}</div>
          <div className="pill time">
            <span className="clock" />
            {m.time}
          </div>
        </div>
      </header>
      <section className="mission generic-mission">
        <div className="target">◎</div>
        <div className="mission-copy">
          <b>Mission:　</b>
          {m.mission}
        </div>
      </section>
    </>
  );
}
function Toolbar({
  kind,
  onAction,
  action,
}: {
  kind: Kind;
  onAction: (x: string) => void;
  action: string;
}) {
  const items =
    kind === "area"
      ? ["Move apex", "Clone", "Flip 180°", "Snap", "Reset"]
      : kind === "angles"
        ? ["Move vertex", "Lift angle", "Snap arcs", "Parallel line", "Reset"]
        : kind === "exterior"
          ? ["Vertex", "Extend Side", "Angle Arc", "Hide/Show", "Reset"]
          : ["Move Vertex", "Move Side", "Move Angle", "Show Guides", "Snap"];
  return (
    <div className="top-tools">
      {items.map((x, i) => (
        <button
          key={x}
          onClick={() => onAction(x)}
          aria-pressed={action === x}
          className={`compact-tool ${action === x ? "active" : ""}`}
        >
          <span>{["⌁", "↔", "◜", "∪", "↶"][i]}</span>
          {x}
        </button>
      ))}
    </div>
  );
}

function AreaSvg({
  apex,
  phase,
  onApex,
}: {
  apex: number;
  phase: number;
  onApex: (x: number) => void;
}) {
  const canvas = useProofCanvas<"apex">(
    940,
    390,
    (_target, point) => onApex(Math.max(0, Math.min(120, point.x - 80))),
    () => onApex(nearestSnap(apex, [0, 50, 120], 20)),
  );
  return (
    <svg
      className={canvas.canvasClassName("proof-svg", "interactive-svg")}
      viewBox="0 0 940 390"
      aria-label="Triangle duplicated and sheared into a rectangle"
      {...canvas.canvasProps}
    >
      <defs>
        <linearGradient id="coral">
          <stop stopColor="#ffaaa8" />
          <stop offset="1" stopColor="#ff6e6c" />
        </linearGradient>
        <linearGradient id="cyan">
          <stop stopColor="#a9edf1" />
          <stop offset="1" stopColor="#52c7d1" />
        </linearGradient>
      </defs>
      <path d="M22 72h280" stroke="#6f50ff" strokeDasharray="4 5" />
      <circle
        data-testid="area-apex-handle"
        data-value={apex}
        className="drag-handle"
        cx={80 + apex}
        cy="72"
        r="11"
        fill="#ff625c"
        stroke="white"
        strokeWidth="3"
        onPointerDown={(e) => canvas.beginDrag("apex", e)}
        tabIndex={0}
        role="slider"
        aria-label="Drag triangle apex"
        aria-valuemin={0}
        aria-valuemax={120}
        aria-valuenow={Math.round(apex)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onApex(Math.max(0, apex - 5));
          if (e.key === "ArrowRight") onApex(Math.min(120, apex + 5));
        }}
      />
      <text x="48" y="32" className="svg-title">
        1　Original triangle
      </text>
      <polygon
        points={`45,290 ${80 + apex},92 190,290`}
        fill="url(#coral)"
        stroke="#f04d51"
        className="shape"
      />
      <text x="108" y="225" className="svg-math">
        1
      </text>
      <line x1="30" y1="92" x2="30" y2="290" className="ghost" />
      <text x="16" y="195" className="svg-math">
        h
      </text>
      <text x="100" y="322" className="svg-math">
        b
      </text>
      <text x="252" y="32" className="svg-title">
        2　Clone
      </text>
      <polygon
        points="240,290 285,92 390,290"
        fill="url(#cyan)"
        stroke="#159aaa"
        strokeDasharray="6 5"
      />
      <text x="305" y="225" className="svg-math">
        2
      </text>
      <text x="433" y="32" className="svg-title">
        3　Flip to match
      </text>
      <g
        transform={`translate(${phase > 0 ? 18 : 0} 0) rotate(${phase > 1 ? 10 : 0} 480 195)`}
      >
        <polygon
          points="445,290 455,92 525,245"
          fill="url(#cyan)"
          stroke="#159aaa"
          strokeDasharray="6 5"
        />
      </g>
      <text x="470" y="225" className="svg-math">
        2
      </text>
      <text x="592" y="32" className="svg-title">
        4　Make parallelogram
      </text>
      <polygon
        points="610,290 640,92 790,92 760,290"
        fill="url(#cyan)"
        stroke="#087f95"
      />
      <polygon
        points="610,290 640,92 790,92"
        fill="url(#coral)"
        stroke="#e85155"
      />
      <text x="650" y="190" className="svg-math">
        1
      </text>
      <text x="718" y="230" className="svg-math">
        2
      </text>
      <text x="815" y="32" className="svg-title">
        5　Shear to rectangle
      </text>
      <rect
        x="815"
        y="92"
        width="112"
        height="198"
        fill="url(#cyan)"
        stroke="#087f95"
      />
      <path
        d="M815 92h25l-25 198"
        fill="url(#coral)"
        stroke="#e85155"
        strokeDasharray="5 4"
      />
      <text x="842" y="322" className="svg-math">
        b × h
      </text>
    </svg>
  );
}
function AnglesSvg({
  lift,
  vertexX,
  onVertex,
  onLift,
}: {
  lift: number;
  vertexX: number;
  onVertex: (x: number) => void;
  onLift: (v: number) => void;
}) {
  const canvas = useProofCanvas<"vertex" | "arc">(
    940,
    420,
    (target, point) => {
      if (target === "vertex") onVertex(Math.max(350, Math.min(590, point.x)));
      else onLift(Math.max(0, Math.min(220, 330 - point.y)));
    },
    (target) => {
      if (target === "arc") onLift(lift > 125 ? 220 : 0);
      else onVertex(nearestSnap(vertexX, [390, 470, 550], 28));
    },
  );
  const snapped = lift > 190;
  return (
    <svg
      className={canvas.canvasClassName(
        "proof-svg",
        "angles-svg",
        "interactive-svg",
      )}
      viewBox="0 0 940 420"
      aria-label="Three triangle angles lifted to a straight line"
      {...canvas.canvasProps}
    >
      <rect x="245" y="10" width="500" height="76" rx="18" className="ghost" />
      <line x1="265" y1="58" x2="725" y2="58" className="dim" />
      <text x="394" y="25" className="svg-title">
        Dock angles here to form a straight line
      </text>
      <path d="M330 58a45 45 0 0 1 90 0" fill="#a87af0" stroke="#7548e8" />
      <path d="M435 58a45 45 0 0 1 90 0" fill="#73d5c5" stroke="#18aa97" />
      <path
        d="M540 58a45 45 0 0 1 90 0"
        fill={snapped ? "#ff8a88" : "none"}
        stroke="#f15355"
        strokeDasharray={snapped ? "0" : "5 4"}
      />
      <polygon
        points={`230,330 ${vertexX},115 700,330`}
        fill="#a887ea20"
        stroke="#5537f0"
        strokeWidth="2"
      />
      <circle
        data-testid="angle-vertex-handle"
        data-value={vertexX}
        className="drag-handle"
        cx={vertexX}
        cy="115"
        r="11"
        fill="white"
        stroke="#7548e8"
        strokeWidth="3"
        onPointerDown={(e) => canvas.beginDrag("vertex", e)}
        tabIndex={0}
        role="slider"
        aria-label="Drag triangle vertex"
      />
      <path
        d={`M${vertexX - 33} 145a48 48 0 0 0 66 0`}
        fill="#9e70ed"
        stroke="#7548e8"
      />
      <path d="M230 330a58 58 0 0 1 38-54" fill="#65cfbf" stroke="#10aa96" />
      <path d="M700 330a58 58 0 0 0-38-54" fill="#ff817f" stroke="#f04448" />
      <text x={vertexX + 4} y="112" className="svg-math">
        A
      </text>
      <text x="198" y="351" className="svg-math">
        B
      </text>
      <text x="712" y="351" className="svg-math">
        C
      </text>
      {!snapped && (
        <path
          d="M690 277 Q755 215 585 90"
          fill="none"
          stroke="#6948ff"
          strokeWidth="3"
          strokeDasharray="5 6"
        />
      )}
      <g
        data-testid="angle-arc-handle"
        data-complete={snapped}
        className="draggable-piece"
        transform={snapped ? undefined : `translate(0 ${-lift})`}
        onPointerDown={(e) => canvas.beginDrag("arc", e)}
        tabIndex={0}
        role="slider"
        aria-label="Drag red angle to the straight line rail"
      >
        <path
          d={
            snapped ? "M540 58a45 45 0 0 1 90 0" : "M700 330a58 58 0 0 0-38-54"
          }
          fill="#ff817f"
          stroke="#f04448"
        />
        {!snapped && (
          <text x="654" y="268" className="drag-callout">
            Drag me
          </text>
        )}
      </g>
      <rect
        x="230"
        y="363"
        width="390"
        height="44"
        rx="12"
        fill={snapped ? "#f5fffa" : "#fafbff"}
        stroke={snapped ? "#56c997" : "#d9dcef"}
      />
      <text
        x="260"
        y="392"
        fill={snapped ? "#08a35f" : "#6d7494"}
        fontSize="20"
      >
        {snapped
          ? "✓　A + B + C = 180°　 The angles fit perfectly!"
          : "Drag the red angle up to the rail"}
      </text>
    </svg>
  );
}
function ExteriorSvg({
  extend,
  onExtend,
  showArcs,
  showLabels,
}: {
  extend: number;
  onExtend: (x: number) => void;
  showArcs: boolean;
  showLabels: boolean;
}) {
  const canvas = useProofCanvas<"point-d">(
    940,
    420,
    (_target, point) => onExtend(Math.max(0, Math.min(240, point.x - 650))),
    () => onExtend(extend > 145 ? 215 : nearestSnap(extend, [45, 100], 22)),
  );
  const d = 650 + extend;
  return (
    <svg
      className={canvas.canvasClassName("proof-svg", "interactive-svg")}
      viewBox="0 0 940 420"
      aria-label="Exterior angle equals the two remote interior angles"
      {...canvas.canvasProps}
    >
      <polygon
        points="320,54 155,335 515,335"
        fill="none"
        stroke="#3f28ef"
        strokeWidth="2"
      />
      <line
        x1="155"
        y1="335"
        x2={d}
        y2="335"
        stroke="#199d70"
        strokeWidth="2"
      />
      {showArcs && (
        <>
          <path
            d="M515 335a70 70 0 0 1 70-70v70"
            fill="#ff8f9a77"
            stroke="#ed3e68"
          />
          <path
            d="M515 335a50 50 0 0 0-45-49"
            fill="#6ed8b966"
            stroke="#109d72"
          />
          <path
            d="M155 335a48 48 0 0 1 34-46"
            fill="#8b6df066"
            stroke="#5434ee"
          />
          <path
            d="M296 95a45 45 0 0 0 48 0"
            fill="#6acfff55"
            stroke="#1b79e9"
          />
        </>
      )}
      <circle cx="320" cy="54" r="8" fill="#1765ee" />
      <circle cx="155" cy="335" r="8" fill="#5830ed" />
      <circle cx="515" cy="335" r="8" fill="#12a07d" />
      <circle
        data-testid="exterior-d-handle"
        data-value={extend}
        data-complete={extend > 175}
        className="drag-handle"
        cx={d}
        cy="335"
        r="13"
        fill="#6135ed"
        stroke="white"
        strokeWidth="4"
        onPointerDown={(e) => canvas.beginDrag("point-d", e)}
        tabIndex={0}
        role="slider"
        aria-label="Drag point D to extend side BC"
        aria-valuenow={Math.round(extend)}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") onExtend(Math.max(0, extend - 10));
          if (e.key === "ArrowRight") onExtend(Math.min(240, extend + 10));
        }}
      />
      {showLabels && (
        <>
          <text x="307" y="38" className="svg-math">
            A
          </text>
          <text x="126" y="369" className="svg-math">
            B
          </text>
          <text x="504" y="369" className="svg-math">
            C
          </text>
          <text x={d + 7} y="370" className="svg-math">
            D
          </text>
          <text
            x="492"
            y="272"
            fill="#ef3768"
            fontSize="28"
            fontFamily="Georgia"
            fontStyle="italic"
          >
            x
          </text>
        </>
      )}
      <text x={d - 22} y="310" className="drag-callout">
        Drag me ↔
      </text>
      <rect
        x="690"
        y="20"
        width="215"
        height="190"
        rx="16"
        fill="#ffffffcc"
        stroke="#e0e3f2"
      />
      <text x="706" y="48" fontSize="15">
        Live Measures
      </text>
      <text x="706" y="82" className="svg-math">
        m∠A　 =　62°
      </text>
      <text x="706" y="118" className="svg-math">
        m∠B　 =　48°
      </text>
      <text
        x="706"
        y="154"
        fill="#00a26a"
        fontFamily="Georgia"
        fontStyle="italic"
        fontSize="21"
      >
        m∠C　 =　70°
      </text>
      <text
        x="706"
        y="190"
        fill="#ee3263"
        fontFamily="Georgia"
        fontStyle="italic"
        fontSize="20"
      >
        m∠ACD = 110°
      </text>
    </svg>
  );
}
function SimilarSvg({
  scale,
  onScale,
  guides,
}: {
  scale: number;
  onScale: (x: number) => void;
  guides: boolean;
}) {
  const canvas = useProofCanvas<"scale">(
    940,
    430,
    (_target, point) =>
      onScale(Math.max(1, Math.min(2.5, (330 - point.y) / 145))),
    () => onScale(nearestSnap(scale, [1, 1.5, 2, 2.5], 0.18)),
  );
  const x = 610,
    y = 330,
    topX = 760,
    topY = 330 - 145 * scale,
    right = 610 + 165 * scale;
  return (
    <svg
      className={canvas.canvasClassName("proof-svg", "interactive-svg")}
      viewBox="0 0 940 430"
      aria-label="Similar triangles with proportional sides"
      {...canvas.canvasProps}
    >
      <defs>
        <linearGradient id="pur">
          <stop stopColor="#efe3ff" />
          <stop offset="1" stopColor="#b885f0" />
        </linearGradient>
        <linearGradient id="blu">
          <stop stopColor="#e9f3ff" />
          <stop offset="1" stopColor="#95c9ff" />
        </linearGradient>
      </defs>
      <text x="30" y="35" className="svg-title">
        Original Triangle △ABC
      </text>
      <polygon
        points="60,350 180,86 320,350"
        fill="url(#pur)"
        stroke="#5627dd"
        strokeWidth="2"
      />
      <path d="M60 350a40 40 0 0 1 29-38" fill="#59d2b9" stroke="#06a286" />
      <path d="M320 350a40 40 0 0 0-29-38" fill="#ff8a86" stroke="#ef4d50" />
      <path d="M161 128a40 40 0 0 0 39 0" fill="#a95ee6" stroke="#6b22d2" />
      <text x="164" y="147" fill="white" fontSize="22">
        70°
      </text>
      <text x="85" y="330" fill="white" fontSize="20">
        60°
      </text>
      <text x="270" y="330" fill="white" fontSize="20">
        50°
      </text>
      <text x="165" y="390" className="svg-math">
        10
      </text>
      <text x="88" y="220" className="svg-math">
        7
      </text>
      <text x="273" y="220" className="svg-math">
        8
      </text>
      <text x="500" y="35" className="svg-title">
        Scaled Copy △A′B′C′
      </text>
      {guides && (
        <>
          <line
            x1={topX}
            y1="35"
            x2={topX}
            y2="360"
            stroke="#21aa82"
            strokeDasharray="6 6"
          />
          <circle
            cx={topX}
            cy={topY}
            r="30"
            fill="none"
            stroke="#21aa82"
            strokeDasharray="6 5"
          />
        </>
      )}
      <polygon
        points={`${x},${y} ${topX},${topY} ${right},${y}`}
        fill="url(#blu)"
        stroke="#1768df"
        strokeWidth="2"
      />
      <circle
        data-testid="similar-scale-handle"
        data-value={scale.toFixed(2)}
        data-complete={scale >= 1.95}
        className="drag-handle"
        cx={topX}
        cy={topY}
        r="13"
        fill="white"
        stroke="#3158bf"
        strokeWidth="3"
        onPointerDown={(e) => canvas.beginDrag("scale", e)}
        tabIndex={0}
        role="slider"
        aria-label="Drag blue triangle apex to resize it"
        aria-valuemin={1}
        aria-valuemax={2.5}
        aria-valuenow={Number(scale.toFixed(1))}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp") onScale(Math.min(2.5, scale + 0.1));
          if (e.key === "ArrowDown") onScale(Math.max(1, scale - 0.1));
        }}
      />
      <circle
        cx={right}
        cy={y}
        r="8"
        fill="white"
        stroke="#3158bf"
        strokeWidth="2"
      />
      <circle
        cx={x}
        cy={y}
        r="8"
        fill="white"
        stroke="#3158bf"
        strokeWidth="2"
      />
      <text x={topX + 18} y={topY + 12} className="drag-callout">
        Drag me!
      </text>
      <text
        x="420"
        y="150"
        fill="#1554d3"
        fontSize="24"
        fontFamily="Georgia"
        fontStyle="italic"
      >
        k = {scale.toFixed(1).replace(".0", "")}
      </text>
      <text x="620" y="365" className="svg-math">
        B′
      </text>
      <text x={right - 8} y="365" className="svg-math">
        C′
      </text>
      <text x={topX - 4} y={topY - 15} className="svg-math">
        A′
      </text>
      <text x="720" y="390" className="svg-math">
        {Math.round(10 * scale)}
      </text>
      <text x="632" y="214" className="svg-math">
        {Math.round(7 * scale)}
      </text>
      <text x={right - 48} y="212" className="svg-math">
        {Math.round(8 * scale)}
      </text>
      <path
        d="M640 52q-80 55-62 172"
        fill="none"
        stroke="#2b64ef"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
    </svg>
  );
}

function Why({
  kind,
  revealed,
  setRevealed,
}: {
  kind: Kind;
  revealed: boolean;
  setRevealed: (x: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const rows =
    kind === "area"
      ? [
          "Two identical triangles",
          "Together they fill b × h",
          "One triangle is half",
        ]
      : kind === "angles"
        ? [
            "Copy the three corner angles.",
            "Align the angles next to each other.",
            "They form a straight angle.",
          ]
        : kind === "exterior"
          ? [
              "Exterior angle and interior angle form a linear pair",
              "So, x = 180° − C.",
              "Substitute to get x = A + B.",
            ]
          : [
              "Equal angles stay equal.",
              "Corresponding sides are scaled.",
              "All sides grow by the same factor.",
            ];
  const formula =
    kind === "area"
      ? "A=\\frac{1}{2}bh"
      : kind === "angles"
        ? "A+B+C=180^\\circ"
        : kind === "exterior"
          ? "m\\angle ACD=m\\angle A+m\\angle B"
          : "\\frac{A'B'}{AB}=\\frac{B'C'}{BC}=k";
  return (
    <aside className="why-card generic-why">
      <h2 className="why-title">
        <span>✧</span>
        {kind === "area" ? "Watch the area" : "Why it works"}
      </h2>
      {rows.map((r, i) => (
        <div className="reason compact-reason" key={r}>
          <div className="reason-head">
            <i className="reason-no">{i + 1}</i>
            {r}
          </div>
          <div className={`micro-demo demo-${kind}`}>
            {kind === "angles"
              ? i === 2
                ? "◠ ◠ ◠　180°"
                : "◜　◝　◞"
              : kind === "similar"
                ? i === 0
                  ? "70°　=　70°"
                  : i === 1
                    ? "7　→　14"
                    : "k = 2"
                : kind === "exterior"
                  ? "──────── ◜ x"
                  : kind === "area"
                    ? "△　＋　△"
                    : ""}
          </div>
        </div>
      ))}
      <button
        className="select-row"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {kind === "area"
          ? "Will moving the apex change the area?"
          : "What can we predict?"}
        <span>{open ? "⌃" : "⌄"}</span>
      </button>
      {open && (
        <div className="inline-answer">
          {kind === "area"
            ? "No. The base and perpendicular height stay the same."
            : kind === "angles"
              ? "The three angles will make exactly 180°."
              : kind === "exterior"
                ? "The exterior angle equals A + B."
                : "Every corresponding side uses the same scale factor."}
        </div>
      )}
      <button className="primary" onClick={() => setRevealed(!revealed)}>
        {revealed
          ? "Hide proof"
          : kind === "area"
            ? "Reveal formula"
            : "Reveal proof"}
      </button>
      {revealed && (
        <div className="proof-output">
          <MathFormula latex={formula} />
          <span>✓　You proved it!</span>
        </div>
      )}
    </aside>
  );
}

export default function GeometryProof({ kind }: { kind: Kind }) {
  const [revealed, setRevealed] = useState(true);
  const [action, setAction] = useState(
    kind === "area"
      ? "Move apex"
      : kind === "angles"
        ? "Move vertex"
        : kind === "exterior"
          ? "Vertex"
          : "Move Vertex",
  );
  const [apex, setApex] = useState(50);
  const [phase, setPhase] = useState(0);
  const [extend, setExtend] = useState(100);
  const [scale, setScale] = useState(2);
  const [vertexX, setVertexX] = useState(470);
  const [lift, setLift] = useState(0);
  const [showArcs, setShowArcs] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [guides, setGuides] = useState(true);
  const doAction = (x: string) => {
    setAction(x);
    if (kind === "area") {
      if (x === "Clone") setPhase(1);
      if (x === "Flip 180°") setPhase(2);
      if (x === "Snap") {
        setApex(50);
        setPhase(2);
      }
      if (x === "Reset") {
        setApex(50);
        setPhase(0);
        setAction("Move apex");
      }
    }
    if (kind === "angles") {
      if (x === "Lift angle") setLift((v) => (v > 0 ? 0 : 125));
      if (x === "Snap arcs") setLift(220);
      if (x === "Parallel line") setLift((v) => v);
      if (x === "Reset") {
        setVertexX(470);
        setLift(0);
        setAction("Move vertex");
      }
    }
    if (kind === "exterior") {
      if (x === "Extend Side") setExtend(215);
      if (x === "Angle Arc") setShowArcs((v) => !v);
      if (x === "Hide/Show") setShowLabels((v) => !v);
      if (x === "Reset") {
        setExtend(100);
        setShowArcs(true);
        setShowLabels(true);
        setAction("Vertex");
      }
    }
    if (kind === "similar") {
      if (x === "Move Vertex") setScale((s) => (s >= 2.4 ? 1.2 : s + 0.2));
      if (x === "Move Side") setScale(1.8);
      if (x === "Move Angle") setScale(2);
      if (x === "Show Guides") setGuides((v) => !v);
      if (x === "Snap") setScale(Math.round(scale * 2) / 2);
    }
  };
  return (
    <main className={`proof-app proof-${kind}`}>
      <Sidebar />
      <Header kind={kind} />
      <div className="main-grid">
        <section className="work-card generic-work">
          <Toolbar kind={kind} onAction={doAction} action={action} />
          {kind === "area" && (
            <>
              <input
                aria-label="Move apex"
                className="range-control"
                type="range"
                min="0"
                max="120"
                value={apex}
                onChange={(e) => setApex(+e.target.value)}
              />
              <AreaSvg apex={apex} phase={phase} onApex={setApex} />
              <label className="lower-slider">
                Shear to rectangle
                <input
                  type="range"
                  min="0"
                  max="2"
                  value={phase}
                  onChange={(e) => setPhase(+e.target.value)}
                />
              </label>
            </>
          )}
          {kind === "angles" && (
            <>
              <AnglesSvg
                lift={lift}
                vertexX={vertexX}
                onVertex={setVertexX}
                onLift={setLift}
              />
              <div className="animation-box">
                <b>Animation</b>
                <button
                  aria-label="Play fold animation"
                  onClick={() => setLift((v) => (v > 190 ? 0 : 220))}
                >
                  ▶
                </button>
                <input
                  aria-label="Fold progress"
                  type="range"
                  min="0"
                  max="220"
                  value={lift}
                  onChange={(e) => setLift(+e.target.value)}
                />
              </div>
            </>
          )}
          {kind === "exterior" && (
            <>
              <ExteriorSvg
                extend={extend}
                onExtend={setExtend}
                showArcs={showArcs}
                showLabels={showLabels}
              />
              <label className="lower-slider">
                Angle Lab Controls
                <input
                  aria-label="Extend BC"
                  type="range"
                  min="0"
                  max="240"
                  value={extend}
                  onChange={(e) => setExtend(+e.target.value)}
                />
              </label>
            </>
          )}
          {kind === "similar" && (
            <>
              <SimilarSvg scale={scale} onScale={setScale} guides={guides} />
              <label className="lower-slider">
                Scale factor k = {scale.toFixed(1)}
                <input
                  aria-label="Scale triangle"
                  type="range"
                  min="1"
                  max="2.5"
                  step=".1"
                  value={scale}
                  onChange={(e) => setScale(+e.target.value)}
                />
              </label>
            </>
          )}
        </section>
        <Why kind={kind} revealed={revealed} setRevealed={setRevealed} />
      </div>
      <Bottom kind={kind} scale={scale} />
    </main>
  );
}

function Bottom({ kind, scale }: { kind: Kind; scale: number }) {
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const expected =
    kind === "area"
      ? 24
      : kind === "angles"
        ? 180
        : kind === "exterior"
          ? 98
          : 27;
  const text =
    kind === "area"
      ? "The proof in one line　△ + △ = ▱ = b × h　÷ 2 = ½bh"
      : kind === "angles"
        ? "Lift the angles　　◜　◝　◞　 →　 Move to the rail　 →　 180°"
        : kind === "exterior"
          ? "One-line shape proof　　Exterior angle x = 180° − C = A + B"
          : `One-line proof builder　　AA Similarity　→　Common scale factor k = ${scale.toFixed(1)}　→　Corresponding sides are proportional.`;
  if (kind === "angles")
    return (
      <div className="generic-bottom angle-bottom">
        <section className="bottom-card proof-line">{text}</section>
      </div>
    );
  return (
    <div className="generic-bottom">
      <section className="bottom-card proof-line">{text}</section>
      <section className="bottom-card challenge">
        <b>
          {kind === "similar"
            ? "🏆 Your turn! Quick challenge"
            : "Quick Challenge"}
        </b>
        <div>
          {kind === "area"
            ? "Can you keep the area at 24?"
            : kind === "exterior"
              ? "If A = 57° and B = 41°, what is ∠ACD?"
              : "If BC = 9 and k = 3, what is B′C′?"}
        </div>
        <div className="challenge-input">
          <input
            aria-label="Challenge answer"
            placeholder="Enter answer"
            value={answer}
            onChange={(e) => {
              setAnswer(e.target.value);
              setChecked(false);
            }}
          />
          <button className="primary" onClick={() => setChecked(true)}>
            Check
          </button>
        </div>
        {checked && (
          <div
            className={Number(answer) === expected ? "answer-ok" : "answer-no"}
          >
            {Number(answer) === expected ? "✓ Correct!" : "Try again"}
          </div>
        )}
      </section>
    </div>
  );
}

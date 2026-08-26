"use client";

import { PointerEvent, useState } from "react";
import { useProofCanvas, withinSnapZone } from "./useProofCanvas";

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
        ].map(([icon, label]) => (
          <button
            key={label}
            onClick={() => setSelected(label)}
            aria-pressed={selected === label}
            className={`side-item ${selected === label ? "active" : ""}`}
          >
            <span className="side-icon">{icon}</span>
            {label}
          </button>
        ))}
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

export default function PythagoreanProof() {
  const start = { x: 378, y: 30, rotation: 15 };
  const [revealed, setRevealed] = useState(true);
  const [mode, setMode] = useState("Select");
  const [a, setA] = useState(3);
  const [b, setB] = useState(4);
  const [piece, setPiece] = useState(start);
  const [trace, setTrace] = useState(false);
  const [question, setQuestion] = useState(false);
  const canvas = useProofCanvas<"piece">(
    790,
    470,
    (_target, p) =>
      setPiece((v) => ({
        ...v,
        x: Math.max(345, Math.min(665, p.x - 55)),
        y: Math.max(24, Math.min(290, p.y - 65)),
      })),
    () => {
      setPiece((p) =>
        withinSnapZone(p, { x: 535, y: 82 }, 115)
          ? { x: 535, y: 82, rotation: Math.round(p.rotation / 90) * 90 }
          : p,
      );
    },
  );
  const runTool = (name: string) => {
    setMode(name);
    if (name === "Rotate")
      setPiece((p) => ({ ...p, rotation: p.rotation + 90 }));
    if (name === "Snap") setPiece({ x: 535, y: 82, rotation: 0 });
    if (name === "Trace") setTrace((v) => !v);
    if (name === "Reset") {
      setPiece(start);
      setTrace(false);
      setMode("Select");
    }
  };
  const down = (e: PointerEvent<SVGGElement>) => {
    if (mode !== "Select") setMode("Select");
    canvas.beginDrag("piece", e);
  };
  return (
    <main className="proof-app">
      <Sidebar />
      <header className="page-head">
        <div>
          <div className="crumb">Visual Proofs　/　Geometry</div>
          <h1>Pythagorean Theorem</h1>
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
      <section className="mission">
        <div className="target">◎</div>
        <div className="mission-copy">
          <b>Drag the same four triangles into a new arrangement.</b>
          <br />
          <span>Watch what happens to the empty area.</span>
        </div>
        <div className="mission-legend">
          <div className="legend-item">
            <span className="legend-swatch">
              <i className="mini-frame" />
            </span>
            same
            <br />
            frame
          </div>
          <div className="legend-item">
            <span className="legend-swatch">
              <i className="mini-pieces" />
            </span>
            same four
            <br />
            pieces
          </div>
          <div className="legend-item">
            <span className="legend-swatch">
              <i className="mini-gap" />
            </span>
            compare
            <br />
            gaps
          </div>
        </div>
      </section>
      <div className="main-grid">
        <section
          className="work-card"
          aria-label="Interactive Pythagorean rearrangement"
        >
          <div className="tool-rail">
            {[
              ["⌁", "Select"],
              ["⟳", "Rotate"],
              ["∪", "Snap"],
              ["▱", "Trace"],
              ["↶", "Reset"],
            ].map(([g, n]) => (
              <button
                key={n}
                onClick={() => runTool(n)}
                className={`tool-btn ${mode === n || (n === "Trace" && trace) ? "active" : ""}`}
              >
                <span className="tool-glyph">{g}</span>
                {n}
              </button>
            ))}
          </div>
          <svg
            className={`pyth-svg interactive-svg ${canvas.dragging ? "is-dragging" : ""}`}
            viewBox="0 0 790 470"
            role="img"
            aria-label="Four congruent right triangles rearranged to show that a squared plus b squared equals c squared"
            {...canvas.canvasProps}
          >
            <defs>
              <linearGradient id="p" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#b58af8" />
                <stop offset="1" stopColor="#7145dc" />
              </linearGradient>
              <linearGradient id="u">
                <stop stopColor="#56c8ff" />
                <stop offset="1" stopColor="#2f8be3" />
              </linearGradient>
              <linearGradient id="t">
                <stop stopColor="#84e2d1" />
                <stop offset="1" stopColor="#38b5a7" />
              </linearGradient>
              <linearGradient id="r">
                <stop stopColor="#ff9796" />
                <stop offset="1" stopColor="#fa5d5d" />
              </linearGradient>
            </defs>
            <text x="160" y="18" className="svg-title">
              Arrangement A
            </text>
            <text x="617" y="18" className="svg-title">
              Arrangement B
            </text>
            <line x1="80" y1="55" x2="330" y2="55" className="dim" />
            <line x1="80" y1="48" x2="80" y2="63" className="dim" />
            <line x1="330" y1="48" x2="330" y2="63" className="dim" />
            <text x="184" y="60" className="svg-math">
              a + b
            </text>
            <line x1="535" y1="55" x2="785" y2="55" className="dim" />
            <text x="646" y="60" className="svg-math">
              a + b
            </text>
            <polygon
              points="80,82 205,82 80,222"
              fill="url(#p)"
              stroke="#7442e5"
              className="shape"
            />
            <polygon
              points="210,82 330,82 330,222"
              fill="url(#u)"
              stroke="#208edb"
              className="shape"
            />
            <polygon
              points="80,228 80,367 205,367"
              fill="url(#t)"
              stroke="#17a997"
              className="shape"
            />
            <polygon
              points="330,228 210,367 330,367"
              fill="url(#r)"
              stroke="#ee4d4d"
              className="shape"
            />
            <polygon
              points="205,115 298,222 205,326 112,222"
              className="ghost"
            />
            <text x="189" y="235" className="svg-math">
              c²
            </text>
            <text x="103" y="122" className="svg-num">
              1
            </text>
            <text x="297" y="122" className="svg-num">
              2
            </text>
            <text x="103" y="347" className="svg-num">
              3
            </text>
            <text x="298" y="347" className="svg-num">
              4
            </text>
            <rect x="535" y="82" width="250" height="285" className="ghost" />
            <polygon
              points="685,82 785,82 785,218"
              fill="url(#u)"
              stroke="#208edb"
              className="shape"
            />
            <polygon
              points="535,225 535,367 650,367"
              fill="url(#t)"
              stroke="#17a997"
              className="shape"
            />
            <polygon
              points="785,225 685,225 685,367"
              fill="url(#r)"
              stroke="#ee4d4d"
              className="shape"
            />
            <path d="M535 82h110v90h-25v52h-34v40h-51z" className="ghost" />
            <text x="661" y="160" className="svg-math">
              a²
            </text>
            <text x="655" y="302" className="svg-math">
              b²
            </text>
            <text x="752" y="122" className="svg-num">
              2
            </text>
            <text x="560" y="347" className="svg-num">
              3
            </text>
            <text x="752" y="347" className="svg-num">
              4
            </text>
            <path
              d="M393 58 Q465 8 520 82"
              fill="none"
              stroke="#6f4bff"
              strokeWidth="2"
              strokeDasharray="6 5"
            />
            <path d="M510 74l10 8-4-13" fill="#6f4bff" />
            {trace && (
              <g
                opacity=".35"
                transform={`translate(${start.x} ${start.y}) rotate(${start.rotation})`}
              >
                <polygon
                  points="0,0 110,0 110,135"
                  fill="none"
                  stroke="#7442e5"
                  strokeWidth="3"
                  strokeDasharray="5 4"
                />
              </g>
            )}
            <g
              data-testid="pyth-piece"
              data-complete={piece.x > 520 && piece.y < 105}
              className="draggable-piece"
              transform={`translate(${piece.x} ${piece.y}) rotate(${piece.rotation})`}
              onPointerDown={down}
              tabIndex={0}
              role="button"
              aria-label="Draggable purple triangle. Drag it into Arrangement B."
              onKeyDown={(e) => {
                if (e.key === "ArrowLeft")
                  setPiece((p) => ({ ...p, x: p.x - 5 }));
                if (e.key === "ArrowRight")
                  setPiece((p) => ({ ...p, x: p.x + 5 }));
                if (e.key === "ArrowUp")
                  setPiece((p) => ({ ...p, y: p.y - 5 }));
                if (e.key === "ArrowDown")
                  setPiece((p) => ({ ...p, y: p.y + 5 }));
                if (e.key.toLowerCase() === "r")
                  setPiece((p) => ({ ...p, rotation: p.rotation + 90 }));
              }}
            >
              <polygon
                points="0,0 110,0 110,135"
                fill="url(#p)"
                stroke="#7442e5"
                className="shape"
              />
              <circle cx="100" cy="16" r="5" fill="#ff796e" />
              <text x="82" y="89" className="svg-label">
                c
              </text>
            </g>
            <g>
              <rect
                x="427"
                y="206"
                width="46"
                height="60"
                rx="20"
                fill="#6840eb"
              />
              <text x="436" y="245" fontSize="30" fill="white">
                ‹›
              </text>
            </g>
            <line x1="80" y1="410" x2="330" y2="410" className="dim" />
            <text x="185" y="418" className="svg-math">
              a + b
            </text>
            <line x1="535" y1="410" x2="785" y2="410" className="dim" />
            <text x="648" y="418" className="svg-math">
              a + b
            </text>
          </svg>
          <div className="steps">
            <div className={`step ${piece.x < 500 ? "active" : ""}`}>
              <i>1</i>Observe
            </div>
            <span className="step-line" />
            <div className={`step ${canvas.dragging ? "active" : ""}`}>
              <i>2</i>Move
            </div>
            <span className="step-line" />
            <div className={`step ${piece.x >= 500 ? "active" : ""}`}>
              <i>3</i>Compare
            </div>
            <span className="step-line" />
            <div
              className={`step ${piece.x > 520 && piece.y < 105 ? "active" : ""}`}
            >
              <i>4</i>Prove
            </div>
          </div>
        </section>
        <aside className="why-card">
          <h2 className="why-title">
            <span>✧</span>Why it works
          </h2>
          <div className="reason">
            <div className="reason-head">
              <i className="reason-no">1</i>Same outer square
            </div>
            <div className="reason-demo">
              <div className="square-demo">a + b</div>
            </div>
          </div>
          <div className="reason">
            <div className="reason-head">
              <i className="reason-no">2</i>Same four triangles
            </div>
            <div className="reason-demo tri-row">
              <i className="tri-sm" />
              <i className="tri-sm" />
              <i className="tri-sm" />
              <i className="tri-sm" />
            </div>
          </div>
          <div className="reason">
            <div className="reason-head">
              <i className="reason-no">3</i>So the empty areas match
            </div>
            <div className="reason-demo gap-equation">
              <span className="eq-box">c²</span>=
              <span className="eq-box">a²</span>+
              <span className="eq-box">b²</span>
            </div>
          </div>
          <button
            className="select-row"
            onClick={() => setQuestion((v) => !v)}
            aria-expanded={question}
          >
            What must be equal?<span>{question ? "⌃" : "⌄"}</span>
          </button>
          {question && (
            <div className="inline-answer">
              The uncovered areas: c² and a² + b².
            </div>
          )}
          <button className="primary" onClick={() => setRevealed(!revealed)}>
            {revealed ? "Hide proof" : "Reveal proof"}
          </button>
          {revealed && (
            <>
              <div className="proof-result">a² + b² = c²</div>
              <div className="success">✓　You proved it!</div>
            </>
          )}
        </aside>
      </div>
      <div className="bottom-row">
        <section className="bottom-card">
          <div className="formula-strip">
            <span className="formula-box">□ (a+b)²</span>
            <span>−</span>
            <span className="formula-box">△ 4 × ½ab</span>
            <span>=</span>
            <span className="formula-box">◇ c²</span>
            <span>→</span>
            <span className="formula-box dash">a² + b²</span>
          </div>
        </section>
        <section className="bottom-card">
          <div className="try-title">Try a 3–4–5 triangle</div>
          <div className="inputs">
            <label>
              a<br />
              <input
                type="number"
                value={a}
                onChange={(e) => setA(+e.target.value)}
              />
            </label>
            <label>
              b<br />
              <input
                type="number"
                value={b}
                onChange={(e) => setB(+e.target.value)}
              />
            </label>
            <label>
              c<br />
              <input
                readOnly
                value={Math.sqrt(a * a + b * b)
                  .toFixed(1)
                  .replace(".0", "")}
              />
            </label>
            <button
              className="primary"
              onClick={() => {
                setA(3);
                setB(4);
              }}
            >
              Load example
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./MatrixInverseUndoTransformationProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  ANIMATION_STAGES,
  AnimationStage,
} from "./matrix-inverse-undo-transformationConfig";
import {
  computeDeterminant,
  computeInverse,
  transformVector,
  computeUnitSquareParallelogram,
} from "./matrix-inverse-undo-transformationMath";
import {
  initialState,
  matrixInverseReducer,
} from "./matrix-inverse-undo-transformationReducer";
import { evaluateMatrixInverseProofProgress } from "./matrix-inverse-undo-transformationCompletion";

export default function MatrixInverseUndoTransformationProofPage() {
  const [state, dispatch] = useReducer(matrixInverseReducer, initialState);
  const [activeNavTab, setActiveNavTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateMatrixInverseProofProgress(state), [state]);

  const det = useMemo(() => computeDeterminant(state.matrixA), [state.matrixA]);
  const inv = useMemo(() => computeInverse(state.matrixA), [state.matrixA]);

  // Transformed points
  const pointAp = useMemo(
    () => transformVector(state.matrixA, state.pointP),
    [state.matrixA, state.pointP],
  );

  // Transformed basis vectors
  const Ae1 = useMemo(
    () => transformVector(state.matrixA, { x: 1, y: 0 }),
    [state.matrixA],
  );
  const Ae2 = useMemo(
    () => transformVector(state.matrixA, { x: 0, y: 1 }),
    [state.matrixA],
  );

  const parallelogram = useMemo(
    () => computeUnitSquareParallelogram(state.matrixA),
    [state.matrixA],
  );

  useEffect(() => {
    /* page title managed by host app */
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "RESET" });
    } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
      if (e.shiftKey) {
        dispatch({ type: "REDO" });
      } else {
        dispatch({ type: "UNDO" });
      }
    } else if (e.key === "y" && (e.ctrlKey || e.metaKey)) {
      dispatch({ type: "REDO" });
    }
  }, []);

  // SVG coordinate conversions: center (100, 100), scale 24 px per unit (-3 to 3)
  const toSvgX = (x: number) => 100 + x * 24;
  const toSvgY = (y: number) => 100 - y * 24;

  const polyPointsStr = parallelogram
    .map((p) => `${toSvgX(p.x)},${toSvgY(p.y)}`)
    .join(" ");

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Matrix Inverse as Undoing a Transformation workspace"
    >
      {/* Live Region for Screen Readers */}
      <div id={liveRegionId} aria-live="polite" className={styles.srOnly}>
        {state.liveAnnouncement}
      </div>

      {/* Left Sidebar */}
      <aside className={styles.sidebar} aria-label="Main Navigation">
        <div className={styles.sidebarTop}>
          <div className={styles.logoContainer}>
            <div className={styles.logoIcon}>✦</div>
            <div className={styles.logoText}>
              MATHS
              <br />
              UNIVERSE
            </div>
          </div>

          <nav className={styles.navGroup} aria-label="Sections">
            <button
              className={`${styles.navItem} ${activeNavTab === "Explore" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Explore")}
              aria-label="Explore"
            >
              <span className={styles.navIcon}>🧭</span>
              <span>Explore</span>
            </button>
            <button
              className={`${styles.navItem} ${activeNavTab === "Proofs" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Proofs")}
              aria-label="Proofs"
            >
              <span className={styles.navIcon}>💡</span>
              <span>Proofs</span>
            </button>
            <button
              className={`${styles.navItem} ${activeNavTab === "Practice" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Practice")}
              aria-label="Practice"
            >
              <span className={styles.navIcon}>📝</span>
              <span>Practice</span>
            </button>
            <button
              className={`${styles.navItem} ${activeNavTab === "Saved" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Saved")}
              aria-label="Saved"
            >
              <span className={styles.navIcon}>🔖</span>
              <span>Saved</span>
            </button>
            <button
              className={`${styles.navItem} ${activeNavTab === "Glossary" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Glossary")}
              aria-label="Glossary"
            >
              <span className={styles.navIcon}>📖</span>
              <span>Glossary</span>
            </button>
          </nav>
        </div>

        <div className={styles.sidebarBottom}>
          <button className={styles.navItem} aria-label="Settings">
            <span className={styles.navIcon}>⚙️</span>
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainWrapper}>
        {/* Header Row */}
        <header className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumbs}>Visual Proofs / Linear Algebra</div>
            <h1 className={styles.title}>{PROOF_META.title}</h1>
            <p className={styles.subtitle}>{PROOF_META.subtitle}</p>
          </div>

          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty} ⌵</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill}>Score: {progress.completionScore}%</span>
            <button className={styles.badgePill} style={{ cursor: "pointer" }}>
              🔖 Save proof
            </button>
          </div>
        </header>

        {/* Top Target Strip & Properties */}
        <section className={styles.propertiesCardStrip} aria-label="Determinant and Invertibility">
          <div className={styles.propertyBlock}>
            <span>🎯</span>
            <div>
              <span style={{ fontWeight: 800, color: "#1e1b4b" }}>Determinant </span>
              <span>
                <InlineMath math={`\\det(A) = ${det.toFixed(0)} \\neq 0`} />
              </span>{" "}
              <span className={styles.invertibleBadge}>Invertible</span>
            </div>
          </div>

          <div className={styles.dashedPropertyBox}>
            <span style={{ fontWeight: 700 }}>Interpretation</span>
            <span>
              Area scale factor <InlineMath math={`|\\det(A)| = ${Math.abs(det).toFixed(0)}`} />
            </span>
          </div>

          <div className={styles.propertyBlock}>
            <span style={{ color: "#4f46e5" }}>○</span>
            <span>
              Inverse <InlineMath math="A^{-1}" /> exists
            </span>
          </div>

          <div className={styles.dashedPropertyBox}>
            <span style={{ fontWeight: 700 }}>Undo check</span>
            <span>
              <InlineMath math="A^{-1}A = I" />
            </span>
          </div>
        </section>

        {/* Center Grid: Main Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Transformation Sequence Card */}
          <section className={styles.workspaceCard}>
            {/* Top Instructional Banner & Toggles */}
            <div className={styles.bannerControlsRow}>
              <div className={styles.bannerInstruction}>
                <span>🔄</span>
                <span>
                  Drag the matrix to transform the grid. Watch the path go out and come back.
                </span>
              </div>

              <div className={styles.showTogglesGroup}>
                <span>Show:</span>
                <button
                  className={`${styles.toggleBtn} ${state.showGrid ? styles.toggleBtnActive : ""}`}
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_GRID" })}
                >
                  ▦ Grid
                </button>
                <button
                  className={`${styles.toggleBtn} ${state.showPath ? styles.toggleBtnActive : ""}`}
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_PATH" })}
                >
                  ⤹ Path
                </button>
                <button
                  className={`${styles.toggleBtn} ${state.showBasis ? styles.toggleBtnActive : ""}`}
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_BASIS" })}
                >
                  ➔ Basis
                </button>
                <button
                  className={`${styles.toggleBtn} ${state.showArea ? styles.toggleBtnActive : ""}`}
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_AREA" })}
                >
                  ▢ Area
                </button>
              </div>
            </div>

            {/* Sequence 4-Column Grid: 1) Apply A | Canvas 1 | Canvas 2 | 2) Apply A⁻¹ */}
            <div className={styles.sequenceColumnsGrid}>
              {/* Step 1: Apply A */}
              <div className={styles.stepMatrixCard}>
                <span className={styles.stepMatrixHeader}>1) Apply A</span>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>A =</span>
                  <div className={styles.matrixBracketsBox}>
                    <input
                      type="number"
                      className={styles.matrixInputCell}
                      value={state.matrixA.a}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_MATRIX_A_ENTRY",
                          payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                        })
                      }
                    />
                    <input
                      type="number"
                      className={styles.matrixInputCell}
                      value={state.matrixA.b}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_MATRIX_A_ENTRY",
                          payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                        })
                      }
                    />
                    <input
                      type="number"
                      className={styles.matrixInputCell}
                      value={state.matrixA.c}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_MATRIX_A_ENTRY",
                          payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                        })
                      }
                    />
                    <input
                      type="number"
                      className={styles.matrixInputCell}
                      value={state.matrixA.d}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_MATRIX_A_ENTRY",
                          payload: { key: "d", value: parseFloat(e.target.value) || 0 },
                        })
                      }
                    />
                  </div>
                  <span style={{ color: "#8b5cf6" }}>⠶</span>
                </div>
                <span style={{ fontSize: "9px", color: "#64748b" }}>Drag to transform 👆</span>

                {state.showBasis && (
                  <div className={styles.basisVectorsBox}>
                    <span style={{ fontSize: "8px", color: "#64748b" }}>Basis vectors</span>
                    <span style={{ color: "#7c3aed" }}>e₁ = [ 1, 0 ]ᵀ ➔</span>
                    <span style={{ color: "#0d9488" }}>e₂ = [ 0, 1 ]ᵀ ➔</span>
                  </div>
                )}
              </div>

              {/* Canvas 1: Before */}
              <div className={styles.canvasBox}>
                <span className={styles.canvasTitle}>Before</span>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Grid Lines (-3 to 3) */}
                  {state.showGrid &&
                    [-3, -2, -1, 0, 1, 2, 3].map((val) => (
                      <g key={`grid-before-${val}`}>
                        <line
                          x1={toSvgX(val)}
                          y1={toSvgY(-3)}
                          x2={toSvgX(val)}
                          y2={toSvgY(3)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        <line
                          x1={toSvgX(-3)}
                          y1={toSvgY(val)}
                          x2={toSvgX(3)}
                          y2={toSvgY(val)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        {val !== 0 && (
                          <>
                            <text
                              x={toSvgX(val) - 4}
                              y={toSvgY(0) + 10}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                            <text
                              x={toSvgX(0) - 10}
                              y={toSvgY(val) + 3}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                          </>
                        )}
                      </g>
                    ))}

                  {/* Axes labels */}
                  <text x="190" y={toSvgY(0) + 10} fontSize="8" fill="#475569" fontWeight="700">
                    x
                  </text>
                  <text x={toSvgX(0) + 4} y="10" fontSize="8" fill="#475569" fontWeight="700">
                    y
                  </text>

                  {/* Unit Square */}
                  {state.showArea && (
                    <rect
                      x={toSvgX(0)}
                      y={toSvgY(1)}
                      width={24}
                      height={24}
                      fill="#ede9fe"
                      fillOpacity="0.5"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Basis vectors */}
                  {state.showBasis && (
                    <>
                      <line
                        x1={toSvgX(0)}
                        y1={toSvgY(0)}
                        x2={toSvgX(1)}
                        y2={toSvgY(0)}
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                      />
                      <circle cx={toSvgX(1)} cy={toSvgY(0)} r="3" fill="#7c3aed" />

                      <line
                        x1={toSvgX(0)}
                        y1={toSvgY(0)}
                        x2={toSvgX(0)}
                        y2={toSvgY(1)}
                        stroke="#0d9488"
                        strokeWidth="2.5"
                      />
                      <circle cx={toSvgX(0)} cy={toSvgY(1)} r="3" fill="#0d9488" />
                    </>
                  )}

                  {/* Point p */}
                  <circle
                    cx={toSvgX(state.pointP.x)}
                    cy={toSvgY(state.pointP.y)}
                    r="5"
                    fill="#6366f1"
                  />
                  <text
                    x={toSvgX(state.pointP.x) - 10}
                    y={toSvgY(state.pointP.y) + 4}
                    fill="#4338ca"
                    fontSize="11"
                    fontWeight="800"
                  >
                    p
                  </text>
                </svg>

                {/* Arrow pointing right */}
                <div
                  style={{
                    position: "absolute",
                    right: "-12px",
                    top: "50%",
                    color: "#8b5cf6",
                    fontWeight: 700,
                    fontSize: "18px",
                  }}
                >
                  ➔
                </div>
              </div>

              {/* Canvas 2: After A */}
              <div className={styles.canvasBox}>
                <span className={styles.canvasTitle}>After A</span>
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Grid Lines (-3 to 3) */}
                  {state.showGrid &&
                    [-3, -2, -1, 0, 1, 2, 3].map((val) => (
                      <g key={`grid-after-${val}`}>
                        <line
                          x1={toSvgX(val)}
                          y1={toSvgY(-3)}
                          x2={toSvgX(val)}
                          y2={toSvgY(3)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        <line
                          x1={toSvgX(-3)}
                          y1={toSvgY(val)}
                          x2={toSvgX(3)}
                          y2={toSvgY(val)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        {val !== 0 && (
                          <>
                            <text
                              x={toSvgX(val) - 4}
                              y={toSvgY(0) + 10}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                            <text
                              x={toSvgX(0) - 10}
                              y={toSvgY(val) + 3}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                          </>
                        )}
                      </g>
                    ))}

                  {/* Axes labels */}
                  <text x="190" y={toSvgY(0) + 10} fontSize="8" fill="#475569" fontWeight="700">
                    x
                  </text>
                  <text x={toSvgX(0) + 4} y="10" fontSize="8" fill="#475569" fontWeight="700">
                    y
                  </text>

                  {/* Transformed Parallelogram */}
                  {state.showArea && (
                    <polygon
                      points={polyPointsStr}
                      fill="#ede9fe"
                      fillOpacity="0.6"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                    />
                  )}

                  {/* Transformed Basis Vectors */}
                  {state.showBasis && (
                    <>
                      <line
                        x1={toSvgX(0)}
                        y1={toSvgY(0)}
                        x2={toSvgX(Ae1.x)}
                        y2={toSvgY(Ae1.y)}
                        stroke="#7c3aed"
                        strokeWidth="2.5"
                      />
                      <circle cx={toSvgX(Ae1.x)} cy={toSvgY(Ae1.y)} r="3" fill="#7c3aed" />

                      <line
                        x1={toSvgX(0)}
                        y1={toSvgY(0)}
                        x2={toSvgX(Ae2.x)}
                        y2={toSvgY(Ae2.y)}
                        stroke="#0d9488"
                        strokeWidth="2.5"
                      />
                      <circle cx={toSvgX(Ae2.x)} cy={toSvgY(Ae2.y)} r="3" fill="#0d9488" />
                    </>
                  )}

                  {/* Transformed Point Ap */}
                  <line
                    x1={toSvgX(0)}
                    y1={toSvgY(0)}
                    x2={toSvgX(pointAp.x)}
                    y2={toSvgY(pointAp.y)}
                    stroke="#6366f1"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                  <circle
                    cx={toSvgX(pointAp.x)}
                    cy={toSvgY(pointAp.y)}
                    r="5"
                    fill="#6366f1"
                  />
                  <text
                    x={toSvgX(pointAp.x) - 4}
                    y={toSvgY(pointAp.y) - 8}
                    fill="#4338ca"
                    fontSize="11"
                    fontWeight="800"
                  >
                    Ap
                  </text>
                </svg>
              </div>

              {/* Step 2: Apply A⁻¹ */}
              <div className={styles.stepInverseCard}>
                <span className={styles.stepMatrixHeader}>2) Apply A⁻¹</span>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <InlineMath math="A^{-1} =" />
                  {inv.inverse ? (
                    <InlineMath math={inv.inverseTex} />
                  ) : (
                    <span style={{ fontSize: "10px", color: "#dc2626" }}>No inverse</span>
                  )}
                  <span style={{ color: "#8b5cf6" }}>⠶</span>
                </div>
                <span style={{ fontSize: "9px", color: "#64748b" }}>Undo transform</span>

                <div className={styles.resultBadgeCard}>
                  <span style={{ fontSize: "8px", color: "#64748b" }}>Result</span>
                  <span>
                    <InlineMath math="A^{-1}Ap = p" /> ✓
                  </span>
                  <span style={{ fontSize: "8px", color: "#166534" }}>Back to start!</span>
                </div>

                {/* Visually Highlighted Identity Matrix when completed */}
                {state.stage === "result" && (
                  <div
                    style={{
                      background: "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)",
                      border: "2px solid #7c3aed",
                      borderRadius: "10px",
                      padding: "6px 8px",
                      marginTop: "4px",
                      boxShadow: "0 0 14px rgba(124, 58, 237, 0.35)",
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <span style={{ fontSize: "8px", fontWeight: 800, color: "#6d28d9" }}>
                      ✨ IDENTITY MATRIX ✨
                    </span>
                    <span style={{ fontSize: "11px", fontWeight: 800 }}>
                      <InlineMath math="I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}" />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Animation / Playback Bar */}
            <div className={styles.playbackBar}>
              <button
                className={styles.playPauseBtn}
                onClick={() => dispatch({ type: "TOGGLE_PLAY" })}
              >
                {state.isPlaying ? "❚❚" : "▶"}
              </button>

              <div className={styles.speedSliderGroup}>
                <span>Speed</span>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.5"
                  value={state.speed}
                  onChange={(e) =>
                    dispatch({ type: "SET_SPEED", payload: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className={styles.stagePillsList}>
                {ANIMATION_STAGES.map((st) => (
                  <button
                    key={st.id}
                    className={`${styles.stagePill} ${
                      state.stage === st.id ? styles.stagePillActive : ""
                    }`}
                    onClick={() => dispatch({ type: "SET_STAGE", payload: st.id as AnimationStage })}
                  >
                    <span>●</span> {st.label}
                  </button>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <label style={{ fontSize: "10px", fontWeight: 600, color: "#64748b" }}>
                  <input
                    type="checkbox"
                    checked={state.autoPlay}
                    onChange={() => dispatch({ type: "TOGGLE_AUTO_PLAY" })}
                  />{" "}
                  Auto-play
                </label>
                <button
                  className={styles.resetBtn}
                  onClick={() => dispatch({ type: "RESET" })}
                >
                  ⟲ Reset
                </button>
              </div>
            </div>
          </section>

          {/* Right Column: Why it works + Quiz */}
          <div className={styles.rightColumn}>
            {/* Why It Works Card */}
            <div className={styles.whyItWorksCard}>
              <div className={styles.cardHeader}>
                <span>✨</span>
                <span>Why it works</span>
              </div>

              {/* Step 1 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>1</div>
                  <div className={styles.stepInstructionTitle}>
                    Invertible (goes out and back)
                  </div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="\det(A) \neq 0" /> so A has an inverse. The grid keeps its
                  shape (sheared & scaled).
                </p>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>
                    Undoing the transformation
                  </div>
                </div>
                <p className={styles.stepInstructionText}>
                  Applying <InlineMath math="A^{-1}" /> reverses every stretch, shear and rotation
                  of A.
                </p>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>Back to identity</div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="A^{-1}A = I" /> so every point returns exactly to where it
                  started.
                </p>
              </div>
            </div>

            {/* Quiz Card */}
            <div className={styles.quizCard}>
              <div className={styles.cardHeader}>
                <span>❓</span>
                <span>
                  What will <InlineMath math="A^{-1}Ap" /> be?
                </span>
              </div>

              <div className={styles.quizOptionsList}>
                <label className={styles.quizOptionLabel}>
                  <input
                    type="radio"
                    name="quizChoice"
                    value="new_point"
                    checked={state.quizChoice === "new_point"}
                    onChange={() =>
                      dispatch({ type: "SET_QUIZ_CHOICE", payload: "new_point" })
                    }
                  />
                  <span>A new point</span>
                </label>

                <label className={styles.quizOptionLabel}>
                  <input
                    type="radio"
                    name="quizChoice"
                    value="original_p"
                    checked={state.quizChoice === "original_p"}
                    onChange={() =>
                      dispatch({ type: "SET_QUIZ_CHOICE", payload: "original_p" })
                    }
                  />
                  <span>The original point p</span>
                </label>
              </div>

              <button
                className={styles.revealProofBtn}
                onClick={() => dispatch({ type: "TOGGLE_QUIZ_REVEAL" })}
              >
                Reveal proof
              </button>

              {state.quizRevealed && (
                <div className={styles.proofSuccessBox}>
                  <div style={{ fontSize: "14px", fontWeight: 800, color: "#1e1b4b" }}>
                    <InlineMath math="A^{-1}A = I" />
                  </div>
                  <div style={{ fontSize: "11px", fontWeight: 700, color: "#166534" }}>
                    Correct! You've proved it. ✓
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof + Challenge */}
        <div className={styles.bottomGrid}>
          {/* Card 1: Visual Proof Pipeline */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>Visual proof</span>
            </div>

            <div className={styles.visualProofFlow}>
              {/* Stage 1 */}
              <div className={styles.flowStepCard}>
                <InlineMath
                  math={`A = \\begin{bmatrix} ${state.matrixA.a} & ${state.matrixA.b} \\\\ ${state.matrixA.c} & ${state.matrixA.d} \\end{bmatrix}`}
                />
                <span style={{ fontSize: "8px", color: "#166534", fontWeight: 700 }}>
                  Invertible det = {det.toFixed(0)} ≠ 0 ✓
                </span>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Stage 2 */}
              <div className={styles.flowStepCard}>
                <span style={{ fontWeight: 700 }}>Av</span>
                <span style={{ fontSize: "8px", color: "#64748b" }}>Transforms v ("Goes out")</span>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Stage 3 */}
              <div className={styles.flowStepCard}>
                <InlineMath
                  math={
                    inv.inverse
                      ? `A^{-1} = ${inv.inverseTex}`
                      : "A^{-1}"
                  }
                />
                <span style={{ fontSize: "8px", color: "#166534", fontWeight: 700 }}>
                  Inverse exists ✓
                </span>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Stage 4 */}
              <div className={styles.flowStepCard}>
                <span style={{ fontWeight: 700 }}>
                  <InlineMath math="A^{-1}Av" />
                </span>
                <span style={{ fontSize: "8px", color: "#64748b" }}>
                  Returns to v ("Comes back")
                </span>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Stage 5 (Identity Matrix Highlight) */}
              <div
                className={styles.flowStepCard}
                style={{
                  background:
                    state.stage === "result"
                      ? "linear-gradient(135deg, #ede9fe 0%, #f5f3ff 100%)"
                      : "#f8fafc",
                  border:
                    state.stage === "result"
                      ? "2px solid #7c3aed"
                      : "1px solid #e2e8f0",
                  boxShadow:
                    state.stage === "result"
                      ? "0 0 16px rgba(124, 58, 237, 0.4)"
                      : undefined,
                  transform: state.stage === "result" ? "scale(1.05)" : undefined,
                  transition: "all 0.3s ease",
                }}
              >
                <InlineMath math="A^{-1}A = I = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}" />
                <span
                  style={{
                    fontSize: "8px",
                    color: state.stage === "result" ? "#6d28d9" : "#166534",
                    fontWeight: 800,
                  }}
                >
                  {state.stage === "result"
                    ? "✨ Identity Matrix I Active! ✨"
                    : "Proof complete ✓"}
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Challenge (Exact) */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Challenge (exact)</span>
            </div>

            <div style={{ fontSize: "10px", color: "#475569" }}>
              Given <InlineMath math="A = \begin{bmatrix} 3 & -1 \\ 2 & 1 \end{bmatrix}" />, find <InlineMath math="A^{-1}" /> (exact values):
            </div>

            <div className={styles.challengeInputsRow}>
              <InlineMath math="A^{-1} =" />
              <div className={styles.challengeMatrixBox}>
                <input
                  type="text"
                  className={styles.challengeCellInput}
                  placeholder="1/5"
                  value={state.challenge.a}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_ENTRY",
                      payload: { key: "a", value: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  className={styles.challengeCellInput}
                  placeholder="1/5"
                  value={state.challenge.b}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_ENTRY",
                      payload: { key: "b", value: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  className={styles.challengeCellInput}
                  placeholder="-2/5"
                  value={state.challenge.c}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_ENTRY",
                      payload: { key: "c", value: e.target.value },
                    })
                  }
                />
                <input
                  type="text"
                  className={styles.challengeCellInput}
                  placeholder="3/5"
                  value={state.challenge.d}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_ENTRY",
                      payload: { key: "d", value: e.target.value },
                    })
                  }
                />
              </div>

              <button
                className={styles.challengeCheckBtn}
                onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
              >
                Check
              </button>
            </div>

            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  color: state.challengeCorrect ? "#166534" : "#dc2626",
                }}
              >
                {state.challengeCorrect
                  ? "✓ Correct! Inverse entries verified."
                  : "✗ Check your calculations: (1/5) * [[1, 1], [-2, 3]]."}
              </div>
            )}
          </div>
        </div>

        {/* Guided Step Navigator & Hint Drawer */}
        <section className={styles.guidedBar} aria-label="Guided Proof Steps">
          <div className={styles.guidedSteps}>
            <span style={{ fontSize: "12px", fontWeight: "700", color: "#1e1b4b" }}>
              Proof Steps:
            </span>
            {PROOF_STEPS.map((step, idx) => (
              <button
                key={step.id}
                className={`${styles.stepPill} ${
                  state.activeStep === idx
                    ? styles.stepPillActive
                    : state.activeStep > idx
                    ? styles.stepPillDone
                    : ""
                }`}
                onClick={() => dispatch({ type: "SET_ACTIVE_STEP", payload: idx })}
              >
                <span>{step.title}</span>
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
            <button
              className={styles.resetBtn}
              onClick={() =>
                dispatch({
                  type: "SET_HINT_TIER",
                  payload: (state.hintTier % HINTS.length) + 1,
                })
              }
            >
              💡 Hint ({state.hintTier > 0 ? `${state.hintTier}/${HINTS.length}` : "Get"})
            </button>
            <button
              className={styles.resetBtn}
              onClick={() => dispatch({ type: "RESET" })}
            >
              ⟲ Reset Proof
            </button>
          </div>
        </section>

        {/* Active Hint Box */}
        {state.hintTier > 0 && (
          <div
            style={{
              background: "#ede9fe",
              border: "1px solid #c4b5fd",
              borderRadius: "14px",
              padding: "12px 18px",
              fontSize: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong>{HINTS[state.hintTier - 1].title}: </strong>
              <span>{HINTS[state.hintTier - 1].content}</span>
            </div>
            <button
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                cursor: "pointer",
              }}
              onClick={() => dispatch({ type: "SET_HINT_TIER", payload: 0 })}
            >
              ✕
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

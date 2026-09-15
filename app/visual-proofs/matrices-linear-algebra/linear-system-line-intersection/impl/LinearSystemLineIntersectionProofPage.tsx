import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./LinearSystemLineIntersectionProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  PREDICT_OPTIONS,
  DEFAULT_CHALLENGE_TARGET,
  PredictOutcome,
} from "./linear-system-line-intersectionConfig";
import {
  solveLinearSystem,
  computeLineSegment,
  computeStepByStepReduction,
  computeRowReducedEchelon,
  formatEquation,
  formatDeterminantCalculationTex,
  formatRowOpEliminateLabel,
} from "./linear-system-line-intersectionMath";
import {
  initialState,
  linearSystemReducer,
} from "./linear-system-line-intersectionReducer";
import { evaluateSystemProofProgress } from "./linear-system-line-intersectionCompletion";

export default function LinearSystemLineIntersectionProofPage() {
  const [state, dispatch] = useReducer(linearSystemReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateSystemProofProgress(state), [state]);

  const solution = useMemo(
    () => solveLinearSystem(state.eq1, state.eq2),
    [state.eq1, state.eq2],
  );

  const line1Seg = useMemo(() => computeLineSegment(state.eq1, 7), [state.eq1]);
  const line2Seg = useMemo(() => computeLineSegment(state.eq2, 7), [state.eq2]);
  const rowReduced = useMemo(
    () => computeRowReducedEchelon(state.eq1, state.eq2),
    [state.eq1, state.eq2],
  );

  const reductionSteps = useMemo(
    () => computeStepByStepReduction(state.eq1, state.eq2),
    [state.eq1, state.eq2],
  );
  const [activeReductionStep, setActiveReductionStep] = useState(0);

  // Keep activeReductionStep within valid bounds if equations change
  const currentReductionStep = reductionSteps[
    Math.min(activeReductionStep, reductionSteps.length - 1)
  ] || reductionSteps[0];

  const rowOpEliminateLabel = useMemo(
    () => formatRowOpEliminateLabel(state.eq1, state.eq2),
    [state.eq1, state.eq2],
  );
  const detCalculationTex = useMemo(
    () => formatDeterminantCalculationTex(state.eq1, state.eq2),
    [state.eq1, state.eq2],
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

  // SVG coordinate conversions: center (160, 160), scale 22 px per math unit
  const toSvgX = (x: number) => 160 + x * 22;
  const toSvgY = (y: number) => 160 - y * 22;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Solving 2x2 Linear Systems as Line Intersection workspace"
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
              className={`${styles.navItem} ${activeTab === "Explore" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("Explore")}
              aria-label="Explore"
            >
              <span className={styles.navIcon}>🧭</span>
              <span>Explore</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "Proofs" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("Proofs")}
              aria-label="Proofs"
            >
              <span className={styles.navIcon}>💡</span>
              <span>Proofs</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "Practice" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("Practice")}
              aria-label="Practice"
            >
              <span className={styles.navIcon}>📝</span>
              <span>Practice</span>
            </button>
            <button
              className={`${styles.navItem} ${activeTab === "Saved" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("Saved")}
              aria-label="Saved"
            >
              <span className={styles.navIcon}>🔖</span>
              <span>Saved</span>
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
            <div className={styles.breadcrumbs}>Visual Proofs / Algebra / Linear Systems</div>
            <h1 className={styles.title}>{PROOF_META.title}</h1>
            <p className={styles.subtitle}>{PROOF_META.subtitle}</p>
          </div>

          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill}>Score: {progress.completionScore}%</span>
          </div>
        </header>

        {/* Top Objective & Legend Strip */}
        <section className={styles.objectiveLegendCard} aria-label="Proof Objective and Legend">
          <div className={styles.objectiveBlock}>
            <div className={styles.targetIconBadge}>🎯</div>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#1e1b4b" }}>
                Objective
              </span>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>
                Relate systems, matrices, and line intersection through structure and
                transformation.
              </p>
            </div>
          </div>

          <div className={styles.dragHelpBlock}>
            <span style={{ fontSize: "20px" }}>🔄</span>
            <div>
              <span style={{ fontSize: "12px", fontWeight: 800, color: "#6366f1" }}>
                Drag a coefficient
              </span>
              <p style={{ margin: 0, fontSize: "10px", color: "#64748b" }}>
                Drag any coefficient below to update the lines, intersection, and matrix.
              </p>
            </div>
          </div>

          <div className={styles.legendBlock}>
            <span style={{ fontWeight: 700 }}>Legend</span>
            <span style={{ color: "#7c3aed" }}>
              — Eq. 1: {formatEquation(state.eq1)}
            </span>
            <span style={{ color: "#0d9488" }}>
              — Eq. 2: {formatEquation(state.eq2)}
            </span>
            <span style={{ color: "#4f46e5" }}>○ Intersection (solution)</span>
          </div>
        </section>

        {/* Center Grid: 3-Column Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main 3-Column Workspace Card */}
          <section className={styles.workspaceCard}>
            {/* Column 1: System & Matrix */}
            <div className={styles.colSystemMatrix}>
              <div className={styles.sectionHeaderSmall}>
                <div className={styles.stepBadgeCircle}>1</div>
                <span>SYSTEM & MATRIX</span>
              </div>

              {/* System of Equations Inputs */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>
                  System of Equations
                </span>

                {/* Eq 1 */}
                <div className={styles.eqRow}>
                  <input
                    type="number"
                    className={`${styles.coeffInput} ${styles.coeffInputPurple}`}
                    value={state.eq1.a}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ1_COEFF",
                        payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <span>x +</span>
                  <input
                    type="number"
                    className={`${styles.coeffInput} ${styles.coeffInputPurple}`}
                    value={state.eq1.b}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ1_COEFF",
                        payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <span>y =</span>
                  <input
                    type="number"
                    className={styles.coeffInput}
                    value={state.eq1.c}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ1_COEFF",
                        payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>

                {/* Eq 2 */}
                <div className={styles.eqRow}>
                  <input
                    type="number"
                    className={`${styles.coeffInput} ${styles.coeffInputTeal}`}
                    value={state.eq2.a}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ2_COEFF",
                        payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <span>x +</span>
                  <input
                    type="number"
                    className={`${styles.coeffInput} ${styles.coeffInputTeal}`}
                    value={state.eq2.b}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ2_COEFF",
                        payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <span>y =</span>
                  <input
                    type="number"
                    className={styles.coeffInput}
                    value={state.eq2.c}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_EQ2_COEFF",
                        payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
              </div>

              {/* Coefficient Matrix A & Vector b */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>
                  Coefficient Matrix A and Vector b
                </span>

                <div className={styles.matrixBracketsBox}>
                  <span>A =</span>
                  <div className={styles.matrixAOnly}>
                    <span style={{ color: "#7c3aed" }}>{state.eq1.a}</span>
                    <span style={{ color: "#7c3aed" }}>{state.eq1.b}</span>
                    <span style={{ color: "#0d9488" }}>{state.eq2.a}</span>
                    <span style={{ color: "#0d9488" }}>{state.eq2.b}</span>
                  </div>

                  <span>b =</span>
                  <div className={styles.vectorBOnly}>
                    <span style={{ color: "#7c3aed" }}>{state.eq1.c}</span>
                    <span style={{ color: "#0d9488" }}>{state.eq2.c}</span>
                  </div>
                </div>
              </div>

              {/* Determinant Card */}
              <div className={styles.detBox}>
                <span style={{ fontWeight: 700, color: "#475569" }}>Determinant</span>
                <span style={{ fontSize: "12px", fontWeight: 700 }}>
                  <InlineMath math={detCalculationTex} />
                </span>
                <div className={styles.uniqueBadge}>
                  {solution.type === "unique"
                    ? "det(A) ≠ 0 → Unique Solution"
                    : solution.type === "parallel"
                    ? "det(A) = 0 → Parallel (No Solution)"
                    : "det(A) = 0 → Coincident (Infinite Solutions)"}
                </div>
              </div>
            </div>

            {/* Column 2: Graph Canvas */}
            <div className={styles.colGraphCanvas}>
              <div className={styles.sectionHeaderSmall}>
                <div className={styles.stepBadgeCircle}>2</div>
                <span>GRAPH: Line Intersection Model</span>
              </div>

              <div className={styles.graphSvgContainer}>
                <svg width="320" height="320" viewBox="0 0 320 320">
                  {/* Grid Lines */}
                  {[-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6].map((val) => (
                    <g key={`grid-${val}`}>
                      {/* Vertical line */}
                      <line
                        x1={toSvgX(val)}
                        y1={toSvgY(-6)}
                        x2={toSvgX(val)}
                        y2={toSvgY(6)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.5 : 1}
                      />
                      {/* Horizontal line */}
                      <line
                        x1={toSvgX(-6)}
                        y1={toSvgY(val)}
                        x2={toSvgX(6)}
                        y2={toSvgY(val)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.5 : 1}
                      />
                    </g>
                  ))}

                  {/* Axes labels */}
                  <text x="312" y={toSvgY(0) + 12} fontSize="11" fill="#475569" fontWeight="700">
                    x
                  </text>
                  <text x={toSvgX(0) + 6} y="14" fontSize="11" fill="#475569" fontWeight="700">
                    y
                  </text>

                  {/* Line 1 (Purple) */}
                  <line
                    x1={toSvgX(line1Seg.x1)}
                    y1={toSvgY(line1Seg.y1)}
                    x2={toSvgX(line1Seg.x2)}
                    y2={toSvgY(line1Seg.y2)}
                    stroke="#7c3aed"
                    strokeWidth="2.5"
                  />

                  {/* Line 1 Label Badge */}
                  <text
                    x={toSvgX(-3)}
                    y={toSvgY((-state.eq1.a * -3 + state.eq1.c) / (state.eq1.b || 1)) - 8}
                    fill="#7c3aed"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {formatEquation(state.eq1)}
                  </text>

                  {/* Line 2 (Teal) */}
                  <line
                    x1={toSvgX(line2Seg.x1)}
                    y1={toSvgY(line2Seg.y1)}
                    x2={toSvgX(line2Seg.x2)}
                    y2={toSvgY(line2Seg.y2)}
                    stroke="#0d9488"
                    strokeWidth="2.5"
                  />

                  {/* Line 2 Label Badge */}
                  <text
                    x={toSvgX(-3)}
                    y={toSvgY((-state.eq2.a * -3 + state.eq2.c) / (state.eq2.b || 1)) + 14}
                    fill="#0d9488"
                    fontSize="10"
                    fontWeight="700"
                  >
                    {formatEquation(state.eq2)}
                  </text>

                  {/* Intersection Point */}
                  {solution.intersection && (
                    <g>
                      <circle
                        cx={toSvgX(solution.intersection.x)}
                        cy={toSvgY(solution.intersection.y)}
                        r="8"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2"
                      />
                      <circle
                        cx={toSvgX(solution.intersection.x)}
                        cy={toSvgY(solution.intersection.y)}
                        r="4"
                        fill="#4338ca"
                      />
                      <text
                        x={toSvgX(solution.intersection.x) + 10}
                        y={toSvgY(solution.intersection.y) - 10}
                        fill="#1e1b4b"
                        fontSize="12"
                        fontWeight="800"
                      >
                        ({solution.intersection.x.toFixed(1)}, {solution.intersection.y.toFixed(1)})
                      </text>
                    </g>
                  )}
                </svg>

                {/* Solution Card Overlay */}
                {solution.intersection ? (
                  <div className={styles.solutionCardOverlay}>
                    <span style={{ color: "#64748b", fontWeight: 700 }}>Solution</span>
                    <span className={styles.solutionPtText}>
                      ({solution.intersection.x.toFixed(1)}, {solution.intersection.y.toFixed(1)})
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>Satisfies both:</span>
                    <span style={{ color: "#166534", fontSize: "10px" }}>
                      ✓ {state.eq1.a}({solution.intersection.x.toFixed(1)}) + {state.eq1.b}(
                      {solution.intersection.y.toFixed(1)}) = {state.eq1.c}
                    </span>
                    <span style={{ color: "#166534", fontSize: "10px" }}>
                      ✓ {state.eq2.a}({solution.intersection.x.toFixed(1)}) + {state.eq2.b}(
                      {solution.intersection.y.toFixed(1)}) = {state.eq2.c}
                    </span>
                  </div>
                ) : (
                  <div className={styles.solutionCardOverlay}>
                    <span style={{ color: "#dc2626", fontWeight: 700 }}>
                      {solution.type === "parallel" ? "No Solution" : "Infinite Solutions"}
                    </span>
                    <span style={{ fontSize: "10px", color: "#64748b" }}>
                      {solution.type === "parallel"
                        ? "Lines are parallel"
                        : "Lines are coincident"}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.graphControlsRow}>
                <button className={styles.smallIconBtn}>+</button>
                <button className={styles.smallIconBtn}>-</button>
                <button className={styles.smallIconBtn}>⛶</button>
              </div>
            </div>

            {/* Column 3: Transformations */}
            <div className={styles.colTransformations}>
              <div className={styles.sectionHeaderSmall}>
                <div className={styles.stepBadgeCircle}>3</div>
                <span>TRANSFORMATIONS</span>
              </div>

              {/* Row Operations */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b" }}>
                  Row Operations (preserve solution)
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button
                    className={styles.transformActionBtn}
                    onClick={() => dispatch({ type: "APPLY_ROW_OP_ELIMINATE" })}
                  >
                    {rowOpEliminateLabel}
                  </button>
                  <button
                    className={styles.transformActionBtn}
                    onClick={() => dispatch({ type: "APPLY_ROW_OP_SWAP" })}
                  >
                    Swap R₁ ↔ R₂
                  </button>
                </div>
              </div>

              {/* Column Operations */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: 700, color: "#64748b" }}>
                  Column Operations (structure insight)
                </span>
                <div style={{ display: "flex", gap: "4px" }}>
                  <button className={styles.transformActionBtn}>C₁ ↔ C₂</button>
                  <button className={styles.transformActionBtn}>C₁ → C₁ + C₂</button>
                </div>
              </div>

              {/* Step-by-Step Matrix Transformation Viewer */}
              <div
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #818cf8",
                  borderRadius: "14px",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", fontWeight: 800, color: "#312e81" }}>
                    Matrix Transformation Steps
                  </span>
                  <span
                    style={{
                      background: "#ede9fe",
                      color: "#4f46e5",
                      borderRadius: "12px",
                      padding: "2px 8px",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    Step {currentReductionStep.stepIndex + 1}/{reductionSteps.length}
                  </span>
                </div>

                {/* Step selector pills */}
                <div style={{ display: "flex", gap: "4px" }}>
                  {reductionSteps.map((step, idx) => (
                    <button
                      key={step.title}
                      onClick={() => setActiveReductionStep(idx)}
                      style={{
                        flex: 1,
                        background:
                          currentReductionStep.stepIndex === idx ? "#4f46e5" : "#ffffff",
                        color:
                          currentReductionStep.stepIndex === idx ? "#ffffff" : "#64748b",
                        border: "1px solid #cbd5e1",
                        borderRadius: "6px",
                        padding: "3px 0",
                        fontSize: "9px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Step {idx}
                    </button>
                  ))}
                </div>

                {/* Current operation label */}
                <div
                  style={{
                    background: "#ede9fe",
                    border: "1px solid #c7d2fe",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#4338ca",
                    textAlign: "center",
                  }}
                >
                  {currentReductionStep.operationLabel}
                </div>

                {/* Live Matrix at this step */}
                <div style={{ textAlign: "center", padding: "4px 0" }}>
                  <InlineMath math={currentReductionStep.matrixTex} />
                </div>

                {/* Step explanation */}
                <p style={{ margin: 0, fontSize: "10px", color: "#475569", lineHeight: 1.35 }}>
                  {currentReductionStep.explanation}
                </p>

                {/* Step Stepper Navigation */}
                <div style={{ display: "flex", justifyContent: "space-between", gap: "6px", marginTop: "2px" }}>
                  <button
                    disabled={currentReductionStep.stepIndex === 0}
                    onClick={() => setActiveReductionStep((s) => Math.max(0, s - 1))}
                    style={{
                      flex: 1,
                      background: "#ffffff",
                      border: "1px solid #cbd5e1",
                      borderRadius: "6px",
                      padding: "4px 0",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: currentReductionStep.stepIndex === 0 ? "#cbd5e1" : "#475569",
                      cursor: currentReductionStep.stepIndex === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    ◀ Prev Step
                  </button>
                  <button
                    disabled={currentReductionStep.stepIndex === reductionSteps.length - 1}
                    onClick={() =>
                      setActiveReductionStep((s) =>
                        Math.min(reductionSteps.length - 1, s + 1),
                      )
                    }
                    style={{
                      flex: 1,
                      background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                      border: "none",
                      borderRadius: "6px",
                      padding: "4px 0",
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "#ffffff",
                      cursor:
                        currentReductionStep.stepIndex === reductionSteps.length - 1
                          ? "not-allowed"
                          : "pointer",
                      opacity:
                        currentReductionStep.stepIndex === reductionSteps.length - 1
                          ? 0.5
                          : 1,
                    }}
                  >
                    Next Step ▶
                  </button>
                </div>
              </div>

              {/* Geometric Effect */}
              <div className={styles.geometricEffectBox}>
                <span style={{ fontWeight: 700, color: "#1e1b4b" }}>Geometric Effect</span>
                <span>Row ops slide/tilt lines without changing their intersection.</span>
              </div>
            </div>
          </section>

          {/* Right Column: Why it works + Predict + Reveal */}
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
                  <div className={styles.stepInstructionTitle}>Determinant check</div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="\det(A) \neq 0" /> implies the lines are not parallel → one
                  intersection.
                </p>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>Geometric meaning</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Each equation is a line. The solution is the point satisfying both.
                </p>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>Matrix link</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Row operations change the representation, not the solution. The structure
                  controls the geometry.
                </p>
              </div>
            </div>

            {/* Predict Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🔮</span>
                <span>Predict</span>
              </div>
              <div style={{ fontSize: "11px", color: "#475569" }}>
                What happens if <InlineMath math="\det(A) = 0" />?
              </div>
              <select
                className={styles.predictSelect}
                value={state.predictionChoice}
                onChange={(e) =>
                  dispatch({
                    type: "SET_PREDICTION_CHOICE",
                    payload: e.target.value as PredictOutcome,
                  })
                }
              >
                <option value="">Choose outcome</option>
                {PREDICT_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <button
                className={styles.predictBtn}
                onClick={() => dispatch({ type: "CHECK_PREDICTION" })}
              >
                Check
              </button>

              {state.predictionChecked && (
                <div
                  style={{
                    background:
                      state.predictionChoice === "none_or_infinite" ? "#f0fdf4" : "#fef2f2",
                    border: `1px solid ${
                      state.predictionChoice === "none_or_infinite" ? "#bbf7d0" : "#fecaca"
                    }`,
                    borderRadius: "8px",
                    padding: "6px 10px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color:
                      state.predictionChoice === "none_or_infinite" ? "#166534" : "#dc2626",
                    textAlign: "center",
                  }}
                >
                  {state.predictionChoice === "none_or_infinite"
                    ? "✓ Correct! When det(A) = 0, lines are parallel or coincident."
                    : state.predictionChoice === ""
                    ? "Please select an outcome first."
                    : "✗ Incorrect. When det(A) = 0, lines have the same slope (parallel or coincident)."}
                </div>
              )}
            </div>

            {/* Reveal Card */}
            <div className={styles.revealCard}>
              <div className={styles.cardHeader}>
                <span>⟲</span>
                <span>Reveal (neutral)</span>
              </div>
              {state.predictionRevealed ? (
                <div
                  style={{
                    background: "#f8fafc",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <p style={{ margin: 0, lineHeight: 1.35 }}>
                    If <InlineMath math="\det(A) = 0" />, the lines are either parallel (no
                    solution) or coincident (infinitely many solutions).
                  </p>
                </div>
              ) : (
                <p style={{ margin: 0, lineHeight: 1.35, color: "#64748b" }}>
                  Click reveal to see what happens geometrically when <InlineMath math="\det(A) = 0" />.
                </p>
              )}
              <button
                style={{
                  background: "#f8fafc",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  width: "fit-content",
                }}
                onClick={() => dispatch({ type: "TOGGLE_PREDICTION_REVEAL" })}
              >
                {state.predictionRevealed ? "✕ Hide" : "👁 Reveal"}
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof + Challenge */}
        <div className={styles.bottomGrid}>
          {/* Card 1: Visual Proof Pipeline */}
          <div className={styles.visualProofCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>Visual Proof</span>
            </div>

            <div className={styles.visualProofFlow}>
              {/* Step 1 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>System</span>
                <span style={{ fontSize: "8px" }}>{formatEquation(state.eq1)}</span>
                <span style={{ fontSize: "8px" }}>{formatEquation(state.eq2)}</span>
              </div>

              <div className={styles.flowArrow}>➔</div>

              {/* Step 2 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>Lines</span>
                <span style={{ fontSize: "14px" }}>✕</span>
              </div>

              <div className={styles.flowArrow}>➔</div>

              {/* Step 3 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>Intersection</span>
                <span style={{ fontWeight: 800, color: "#6d28d9" }}>
                  {solution.intersection
                    ? `(${solution.intersection.x.toFixed(1)}, ${solution.intersection.y.toFixed(1)})`
                    : "None"}
                </span>
              </div>

              <div className={styles.flowArrow}>➔</div>

              {/* Step 4 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>Matrix</span>
                <span style={{ fontSize: "8px" }}>
                  [[{state.eq1.a}, {state.eq1.b}, {state.eq1.c}], [{state.eq2.a}, {state.eq2.b}, {state.eq2.c}]]
                </span>
              </div>

              <div className={styles.flowArrow}>➔</div>

              {/* Step 5 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>Row-Reduced</span>
                <span style={{ fontSize: "8px" }}>
                  [{rowReduced.r1Tex[0]}, {rowReduced.r1Tex[1]}, {rowReduced.r1Tex[2]}; {rowReduced.r2Tex[0]}, {rowReduced.r2Tex[1]}, {rowReduced.r2Tex[2]}]
                </span>
              </div>

              <div className={styles.flowArrow}>➔</div>

              {/* Step 6 */}
              <div className={styles.flowStepBox}>
                <span style={{ fontWeight: 700 }}>Back-Substitute</span>
                <span style={{ fontSize: "8px" }}>
                  {solution.intersection
                    ? `y = ${solution.intersection.y.toFixed(1)}, x = ${solution.intersection.x.toFixed(1)}`
                    : "No solution"}
                </span>
              </div>
            </div>

            <div style={{ fontSize: "10px", color: "#64748b", fontStyle: "italic" }}>
              Same solution, different views. Structure connects algebra and geometry.
            </div>
          </div>

          {/* Card 2: Your Challenge */}
          <div className={styles.challengeCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Your Challenge</span>
            </div>
            <div style={{ fontSize: "11px", color: "#475569" }}>
              Adjust coefficients to make the intersection at (
              {DEFAULT_CHALLENGE_TARGET.targetX}, {DEFAULT_CHALLENGE_TARGET.targetY}).
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div className={styles.eqRow}>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq1.a}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ1",
                      payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
                <span>x +</span>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq1.b}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ1",
                      payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
                <span>y =</span>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq1.c}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ1",
                      payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
              </div>

              <div className={styles.eqRow}>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq2.a}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ2",
                      payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
                <span>x +</span>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq2.b}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ2",
                      payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
                <span>y =</span>
                <input
                  type="number"
                  className={styles.coeffInput}
                  value={state.challengeEq2.c}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_EQ2",
                      payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                    })
                  }
                />
              </div>
            </div>

            <div className={styles.challengeButtonsRow}>
              <button
                className={styles.transformActionBtn}
                onClick={() => dispatch({ type: "RANDOMIZE_CHALLENGE" })}
              >
                Randomize
              </button>
              <button
                className={styles.challengeActionBtn}
                onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
              >
                Check Answer
              </button>
            </div>

            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: state.challengeCorrect ? "#166534" : "#dc2626",
                  background: state.challengeCorrect ? "#f0fdf4" : "#fef2f2",
                  border: `1px solid ${state.challengeCorrect ? "#bbf7d0" : "#fecaca"}`,
                  borderRadius: "8px",
                  padding: "6px 10px",
                  marginTop: "6px",
                  textAlign: "center",
                }}
              >
                {state.challengeCorrect
                  ? "✓ Correct! Both lines pass through (-1, 3)."
                  : "✗ Check your equations: both must equal c when substituting x = -1, y = 3."}
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
              className={styles.transformActionBtn}
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
              className={styles.transformActionBtn}
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

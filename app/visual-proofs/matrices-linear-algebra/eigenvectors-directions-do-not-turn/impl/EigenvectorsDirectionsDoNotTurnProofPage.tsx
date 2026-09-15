import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./EigenvectorsDirectionsDoNotTurnProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  MATRIX_PRESETS,
  PREDICT_OPTIONS,
} from "./eigenvectors-directions-do-not-turnConfig";
import {
  computeEigensystem,
  transformVector,
  generateEllipsePath,
} from "./eigenvectors-directions-do-not-turnMath";
import {
  initialState,
  eigenvectorsReducer,
} from "./eigenvectors-directions-do-not-turnReducer";
import { evaluateEigenvectorsProofProgress } from "./eigenvectors-directions-do-not-turnCompletion";

export default function EigenvectorsDirectionsDoNotTurnProofPage() {
  const [state, dispatch] = useReducer(eigenvectorsReducer, initialState);
  const [activeNavTab, setActiveNavTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateEigenvectorsProofProgress(state), [state]);

  const eigen = useMemo(() => computeEigensystem(state.matrix), [state.matrix]);

  // Transformed vectors
  const transformedV1 = useMemo(
    () => transformVector(state.matrix, eigen.v1Display),
    [state.matrix, eigen.v1Display],
  );
  const transformedV2 = useMemo(
    () => transformVector(state.matrix, eigen.v2Display),
    [state.matrix, eigen.v2Display],
  );

  const ellipsePath = useMemo(
    () => generateEllipsePath(state.matrix, 16, { x: 110, y: 110 }),
    [state.matrix],
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

  // Left SVG coordinate conversions: center (110, 110), scale 30 px per unit (-3 to 3)
  const toLeftSvgX = (x: number) => 110 + x * 30;
  const toLeftSvgY = (y: number) => 110 - y * 30;

  // Right SVG coordinate conversions: center (110, 110), scale 16 px per unit (-6 to 6)
  const toRightSvgX = (x: number) => 110 + x * 16;
  const toRightSvgY = (y: number) => 110 - y * 16;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Eigenvectors as Directions That Do Not Turn workspace"
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
              className={`${styles.navItem} ${activeNavTab === "Tools" ? styles.navItemActive : ""}`}
              onClick={() => setActiveNavTab("Tools")}
              aria-label="Tools"
            >
              <span className={styles.navIcon}>✂️</span>
              <span>Tools</span>
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
            <p className={styles.subtitle}>{PROOF_META.mission}</p>
          </div>

          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>📊 {PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill}>Score: {progress.completionScore}%</span>
            <div className={styles.avatarIcon}>👤</div>
          </div>
        </header>

        {/* Top Transformation Matrix Strip */}
        <section className={styles.matrixControlsStrip} aria-label="Matrix and Display Controls">
          <div className={styles.matrixInputGroup}>
            <span className={styles.matrixLabel}>Transformation Matrix A</span>
            <div className={styles.matrixBracketsBox}>
              <input
                type="number"
                className={styles.matrixInputCell}
                value={state.matrix.a}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                  })
                }
              />
              <input
                type="number"
                className={styles.matrixInputCell}
                value={state.matrix.b}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                  })
                }
              />
              <input
                type="number"
                className={styles.matrixInputCell}
                value={state.matrix.c}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                  })
                }
              />
              <input
                type="number"
                className={styles.matrixInputCell}
                value={state.matrix.d}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "d", value: parseFloat(e.target.value) || 0 },
                  })
                }
              />
            </div>
          </div>

          <div className={styles.viewModeToggles}>
            <button
              className={`${styles.viewModeBtn} ${state.viewMode === "grid" ? styles.viewModeBtnActive : ""}`}
              onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "grid" })}
            >
              <span>▦</span> Grid
            </button>
            <button
              className={`${styles.viewModeBtn} ${state.viewMode === "vector" ? styles.viewModeBtnActive : ""}`}
              onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "vector" })}
            >
              <span>➔</span> Vector
            </button>
            <button
              className={`${styles.viewModeBtn} ${state.viewMode === "both" ? styles.viewModeBtnActive : ""}`}
              onClick={() => dispatch({ type: "SET_VIEW_MODE", payload: "both" })}
            >
              <span>⊞</span> Both
            </button>
          </div>

          <div className={styles.presetSelectGroup}>
            <span>Apply to</span>
            <select
              className={styles.presetSelect}
              onChange={(e) => {
                const preset = MATRIX_PRESETS.find((p) => p.id === e.target.value);
                if (preset) dispatch({ type: "SET_MATRIX", payload: preset.matrix });
              }}
            >
              {MATRIX_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Center Grid: Dual-Grid Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Dual-Grid Transformation Canvas */}
          <section className={styles.workspaceCard}>
            {/* Left Canvas: Before Transformation */}
            <div className={styles.gridSubpanel}>
              <span className={styles.gridHeaderTitle}>Before transformation</span>

              <div className={styles.svgCanvasContainer}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                  {/* Grid Lines (-3 to 3) */}
                  {state.showGrid &&
                    [-3, -2, -1, 0, 1, 2, 3].map((val) => (
                      <g key={`grid-left-${val}`}>
                        <line
                          x1={toLeftSvgX(val)}
                          y1={toLeftSvgY(-3)}
                          x2={toLeftSvgX(val)}
                          y2={toLeftSvgY(3)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        <line
                          x1={toLeftSvgX(-3)}
                          y1={toLeftSvgY(val)}
                          x2={toLeftSvgX(3)}
                          y2={toLeftSvgY(val)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        {val !== 0 && (
                          <>
                            <text
                              x={toLeftSvgX(val) - 4}
                              y={toLeftSvgY(0) + 10}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                            <text
                              x={toLeftSvgX(0) - 10}
                              y={toLeftSvgY(val) + 3}
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
                  <text
                    x="210"
                    y={toLeftSvgY(0) + 12}
                    fontSize="9"
                    fill="#475569"
                    fontWeight="700"
                  >
                    x₁
                  </text>
                  <text
                    x={toLeftSvgX(0) + 4}
                    y="12"
                    fontSize="9"
                    fill="#475569"
                    fontWeight="700"
                  >
                    x₂
                  </text>

                  {/* Unit Circle */}
                  {state.showUnitCircle && (
                    <circle
                      cx={toLeftSvgX(0)}
                      cy={toLeftSvgY(0)}
                      r={30}
                      fill="none"
                      stroke="#cbd5e1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Span Line 1 (Blue) */}
                  <line
                    x1={toLeftSvgX(-3 * eigen.v1.x)}
                    y1={toLeftSvgY(-3 * eigen.v1.y)}
                    x2={toLeftSvgX(3 * eigen.v1.x)}
                    y2={toLeftSvgY(3 * eigen.v1.y)}
                    stroke="#93c5fd"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Eigenvector 1 (Blue Arrow) */}
                  <line
                    x1={toLeftSvgX(0)}
                    y1={toLeftSvgY(0)}
                    x2={toLeftSvgX(eigen.v1Display.x)}
                    y2={toLeftSvgY(eigen.v1Display.y)}
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={toLeftSvgX(eigen.v1Display.x)}
                    cy={toLeftSvgY(eigen.v1Display.y)}
                    r="4"
                    fill="#2563eb"
                  />
                  <text
                    x={toLeftSvgX(eigen.v1Display.x) + 4}
                    y={toLeftSvgY(eigen.v1Display.y) - 4}
                    fill="#1d4ed8"
                    fontSize="11"
                    fontWeight="800"
                  >
                    v₁
                  </text>

                  {/* Span Line 2 (Green) */}
                  <line
                    x1={toLeftSvgX(-3 * eigen.v2.x)}
                    y1={toLeftSvgY(-3 * eigen.v2.y)}
                    x2={toLeftSvgX(3 * eigen.v2.x)}
                    y2={toLeftSvgY(3 * eigen.v2.y)}
                    stroke="#86efac"
                    strokeWidth="1.5"
                    strokeDasharray="3 3"
                  />

                  {/* Eigenvector 2 (Green Arrow) */}
                  <line
                    x1={toLeftSvgX(0)}
                    y1={toLeftSvgY(0)}
                    x2={toLeftSvgX(eigen.v2Display.x)}
                    y2={toLeftSvgY(eigen.v2Display.y)}
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={toLeftSvgX(eigen.v2Display.x)}
                    cy={toLeftSvgY(eigen.v2Display.y)}
                    r="4"
                    fill="#16a34a"
                  />
                  <text
                    x={toLeftSvgX(eigen.v2Display.x) + 4}
                    y={toLeftSvgY(eigen.v2Display.y) - 4}
                    fill="#15803d"
                    fontSize="11"
                    fontWeight="800"
                  >
                    v₂
                  </text>
                </svg>

                {/* Left Card Overlays */}
                <div className={styles.eigenvectorsCardOverlay}>
                  <span style={{ fontSize: "9px", color: "#64748b" }}>Eigenvectors</span>
                  <span style={{ color: "#2563eb" }}>
                    — v₁ = [ {eigen.v1.x.toFixed(1)}, {eigen.v1.y.toFixed(1)} ]
                  </span>
                  <span style={{ color: "#16a34a" }}>
                    — v₂ = [ {eigen.v2.x.toFixed(1)}, {eigen.v2.y.toFixed(1)} ]
                  </span>
                </div>

                <div className={styles.stretchFactorsOverlay}>
                  <span style={{ fontSize: "9px", fontWeight: 700 }}>Stretch factors</span>
                  <span>λ₁ = {eigen.lambda1.toFixed(3)}</span>
                  <span>λ₂ = {eigen.lambda2.toFixed(3)}</span>
                </div>

                <div className={styles.gridTogglesOverlay}>
                  <label className={styles.toggleRow}>
                    <input
                      type="checkbox"
                      checked={state.showGrid}
                      onChange={() => dispatch({ type: "TOGGLE_SHOW_GRID" })}
                    />
                    <span>Show grid</span>
                  </label>
                  <label className={styles.toggleRow}>
                    <input
                      type="checkbox"
                      checked={state.showUnitCircle}
                      onChange={() => dispatch({ type: "TOGGLE_UNIT_CIRCLE" })}
                    />
                    <span>Show unit circle</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Center Conduit */}
            <div className={styles.centerConduit}>
              <div className={styles.draggingPill}>
                <span>●</span> Dragging A... <span>👆</span>
              </div>
              <div className={styles.floatingMatrixCard}>A</div>
            </div>

            {/* Right Canvas: After Transformation */}
            <div className={styles.gridSubpanel}>
              <span className={styles.gridHeaderTitle}>
                After transformation <InlineMath math="y = Ax" />
              </span>

              <div className={styles.svgCanvasContainer}>
                <svg width="220" height="220" viewBox="0 0 220 220">
                  {/* Grid Lines (-6 to 6) */}
                  {state.showGrid &&
                    [-6, -4, -2, 0, 2, 4, 6].map((val) => (
                      <g key={`grid-right-${val}`}>
                        <line
                          x1={toRightSvgX(val)}
                          y1={toRightSvgY(-6)}
                          x2={toRightSvgX(val)}
                          y2={toRightSvgY(6)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        <line
                          x1={toRightSvgX(-6)}
                          y1={toRightSvgY(val)}
                          x2={toRightSvgX(6)}
                          y2={toRightSvgY(val)}
                          stroke={val === 0 ? "#475569" : "#f1f5f9"}
                          strokeWidth={val === 0 ? 1.2 : 1}
                        />
                        {val !== 0 && (
                          <>
                            <text
                              x={toRightSvgX(val) - 4}
                              y={toRightSvgY(0) + 10}
                              fontSize="8"
                              fill="#64748b"
                            >
                              {val}
                            </text>
                            <text
                              x={toRightSvgX(0) - 10}
                              y={toRightSvgY(val) + 3}
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
                  <text
                    x="210"
                    y={toRightSvgY(0) + 12}
                    fontSize="9"
                    fill="#475569"
                    fontWeight="700"
                  >
                    y₁
                  </text>
                  <text
                    x={toRightSvgX(0) + 4}
                    y="12"
                    fontSize="9"
                    fill="#475569"
                    fontWeight="700"
                  >
                    y₂
                  </text>

                  {/* Transformed Ellipse */}
                  <path d={ellipsePath} fill="none" stroke="#cbd5e1" strokeDasharray="3 3" />

                  {/* Transformed Vector 1 (Av1 = lambda1 * v1) */}
                  <line
                    x1={toRightSvgX(0)}
                    y1={toRightSvgY(0)}
                    x2={toRightSvgX(transformedV1.x)}
                    y2={toRightSvgY(transformedV1.y)}
                    stroke="#2563eb"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={toRightSvgX(transformedV1.x)}
                    cy={toRightSvgY(transformedV1.y)}
                    r="4"
                    fill="#2563eb"
                  />
                  <text
                    x={toRightSvgX(transformedV1.x) + 4}
                    y={toRightSvgY(transformedV1.y) - 4}
                    fill="#1d4ed8"
                    fontSize="11"
                    fontWeight="800"
                  >
                    Av₁ = λ₁v₁
                  </text>

                  {/* Transformed Vector 2 (Av2 = lambda2 * v2) */}
                  <line
                    x1={toRightSvgX(0)}
                    y1={toRightSvgY(0)}
                    x2={toRightSvgX(transformedV2.x)}
                    y2={toRightSvgY(transformedV2.y)}
                    stroke="#16a34a"
                    strokeWidth="2.5"
                  />
                  <circle
                    cx={toRightSvgX(transformedV2.x)}
                    cy={toRightSvgY(transformedV2.y)}
                    r="4"
                    fill="#16a34a"
                  />
                  <text
                    x={toRightSvgX(transformedV2.x) - 48}
                    y={toRightSvgY(transformedV2.y) + 14}
                    fill="#15803d"
                    fontSize="11"
                    fontWeight="800"
                  >
                    Av₂ = λ₂v₂
                  </text>
                </svg>

                {/* Right Card Overlays */}
                <div className={styles.mappingCardOverlay}>
                  <span style={{ fontSize: "9px", color: "#64748b" }}>Vector mapping</span>
                  <span style={{ color: "#2563eb" }}>
                    — v₁ maps to λ₁v₁ (λ₁ = {eigen.lambda1.toFixed(3)})
                  </span>
                  <span style={{ color: "#16a34a" }}>
                    — v₂ maps to λ₂v₂ (λ₂ = {eigen.lambda2.toFixed(3)})
                  </span>
                </div>

                <div className={styles.directionUnchangedBadge}>
                  <div>✧ Direction unchanged.</div>
                  <div>Only length scales.</div>
                </div>
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
                  <div className={styles.stepInstructionTitle}>Eigenvector equation</div>
                </div>
                <p className={styles.stepInstructionText}>
                  If <InlineMath math="Av = \lambda v" />, then A scales v by <InlineMath math="\lambda" />.
                </p>
                <div className={styles.formulaBoxMini}>
                  <InlineMath math="Av = \lambda v" />
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>Direction preserved</div>
                </div>
                <p className={styles.stepInstructionText}>
                  The image <InlineMath math="Av" /> is a scalar multiple of v, so they are collinear.
                </p>
                <div style={{ textAlign: "center", padding: "4px 0" }}>
                  <svg width="180" height="24" viewBox="0 0 180 24">
                    <line x1="20" y1="12" x2="80" y2="12" stroke="#2563eb" strokeWidth="2.5" />
                    <line x1="80" y1="12" x2="160" y2="12" stroke="#8b5cf6" strokeWidth="2.5" />
                    <text x="50" y="22" fontSize="9" fill="#2563eb" fontWeight="700">v</text>
                    <text x="120" y="22" fontSize="9" fill="#8b5cf6" fontWeight="700">λv</text>
                  </svg>
                </div>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>Only length changes</div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="\lambda" /> determines the stretch (or shrink) along that direction.
                </p>
                <div className={styles.stretchComparisonRow}>
                  <div className={styles.stretchBadgeItem}>
                    <strong>|λ| &gt; 1</strong>
                    <span style={{ color: "#2563eb" }}>stretch</span>
                  </div>
                  <div className={styles.stretchBadgeItem}>
                    <strong>|λ| = 1</strong>
                    <span style={{ color: "#64748b" }}>same</span>
                  </div>
                  <div className={styles.stretchBadgeItem}>
                    <strong>|λ| &lt; 1</strong>
                    <span style={{ color: "#dc2626" }}>shrink</span>
                  </div>
                </div>
              </div>

              {/* Step 4: Simple Explanation of A^-1 A = I */}
              <div
                className={styles.whyStepItem}
                style={{
                  background: "#f5f3ff",
                  border: "1px solid #ddd6fe",
                }}
              >
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle} style={{ background: "#7c3aed" }}>
                    4
                  </div>
                  <div className={styles.stepInstructionTitle} style={{ color: "#5b21b6" }}>
                    Why A⁻¹A = Identity (I)?
                  </div>
                </div>
                <p className={styles.stepInstructionText} style={{ color: "#4c1d95" }}>
                  A scales an eigenvector by <InlineMath math="\lambda" />. Its inverse{" "}
                  <InlineMath math="A^{-1}" /> scales by <InlineMath math="1/\lambda" />.
                </p>
                <div
                  style={{
                    background: "#ffffff",
                    border: "1px solid #c4b5fd",
                    borderRadius: "8px",
                    padding: "6px",
                    fontSize: "11px",
                    textAlign: "center",
                    fontWeight: 700,
                  }}
                >
                  <InlineMath math="A^{-1}(Av) = A^{-1}(\lambda v) = \frac{1}{\lambda}(\lambda v) = 1 \cdot v = v" />
                </div>
                <p style={{ margin: 0, fontSize: "10px", color: "#6d28d9", fontWeight: 600 }}>
                  Since every vector returns unchanged, <InlineMath math="A^{-1}A = I" />!
                </p>
              </div>
            </div>

            {/* Predict Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🧠</span>
                <span>Prediction</span>
              </div>
              <div style={{ fontSize: "11px", color: "#475569" }}>
                Pick a vector and see what happens.
              </div>

              <div className={styles.predictControlsRow}>
                <select
                  className={styles.predictSelect}
                  value={state.selectedVector}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_SELECTED_VECTOR",
                      payload: e.target.value as "v1" | "v2" | "arbitrary",
                    })
                  }
                >
                  {PREDICT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.predictActionBtn}
                  onClick={() => dispatch({ type: "CHECK_PREDICT" })}
                >
                  Predict
                </button>
              </div>
            </div>

            {/* Reveal Card */}
            <div className={styles.revealCard}>
              <div className={styles.cardHeader}>
                <span>👁</span>
                <span>Reveal (accurate)</span>
              </div>
              <div style={{ fontSize: "12px", fontWeight: 800, color: "#1e1b4b" }}>
                <InlineMath
                  math={`Av_1 = ${eigen.lambda1.toFixed(3)} v_1`}
                />
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                Direction unchanged. Length scaled by {eigen.lambda1.toFixed(3)}.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Matrix View + One Line Proof + Challenge */}
        <div className={styles.bottomGrid}>
          {/* Card 1: Matrix View: See the Structure */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: "12px", fontWeight: 800 }}>
                Matrix View: See the Structure
              </span>
            </div>

            <div className={styles.tabsRow}>
              <button
                className={`${styles.tabBtn} ${state.activeMatrixTab === "entries" ? styles.tabBtnActive : ""}`}
                onClick={() => dispatch({ type: "SET_MATRIX_TAB", payload: "entries" })}
              >
                Entries
              </button>
              <button
                className={`${styles.tabBtn} ${state.activeMatrixTab === "row_column" ? styles.tabBtnActive : ""}`}
                onClick={() => dispatch({ type: "SET_MATRIX_TAB", payload: "row_column" })}
              >
                Row-Column
              </button>
              <button
                className={`${styles.tabBtn} ${state.activeMatrixTab === "systems" ? styles.tabBtnActive : ""}`}
                onClick={() => dispatch({ type: "SET_MATRIX_TAB", payload: "systems" })}
              >
                Systems
              </button>
              <button
                className={`${styles.tabBtn} ${state.activeMatrixTab === "transformation" ? styles.tabBtnActive : ""}`}
                onClick={() => dispatch({ type: "SET_MATRIX_TAB", payload: "transformation" })}
              >
                Transformation
              </button>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" }}>
              <div>
                <InlineMath
                  math={`A = \\begin{bmatrix} ${state.matrix.a} & ${state.matrix.b} \\\\ ${state.matrix.c} & ${state.matrix.d} \\end{bmatrix}`}
                />
              </div>
              <div style={{ fontSize: "10px", color: "#475569", lineHeight: 1.4 }}>
                <div style={{ color: "#8b5cf6" }}>Column 1 → image of e₁</div>
                <div style={{ color: "#16a34a" }}>Column 2 → image of e₂</div>
                <div style={{ color: "#2563eb" }}>Row 1 → x-component</div>
                <div style={{ color: "#db2777" }}>Row 2 → y-component</div>
              </div>
            </div>

            <div style={{ fontSize: "10px", color: "#64748b" }}>
              Columns show where basis vectors go: Ae₁ = [{state.matrix.a}, {state.matrix.c}]ᵀ, Ae₂ = [{state.matrix.b}, {state.matrix.d}]ᵀ
            </div>
          </div>

          {/* Card 2: Visual Proof in One Line */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: "12px", fontWeight: 800 }}>
                Visual Proof in One Line
              </span>
            </div>

            <div className={styles.annotatedEquationContainer}>
              <div style={{ fontSize: "20px", fontWeight: 800 }}>
                <InlineMath math="Av = \lambda v" />
              </div>

              <div className={styles.annotationLabelsRow}>
                <div className={`${styles.annotationPill} ${styles.annotationPurple}`}>
                  Image of v
                </div>
                <div className={`${styles.annotationPill} ${styles.annotationBlue}`}>
                  Stretch factor
                </div>
                <div className={`${styles.annotationPill} ${styles.annotationGreen}`}>
                  Same direction
                </div>
              </div>
            </div>

            <div style={{ fontSize: "11px", fontWeight: 700, color: "#6d28d9", textAlign: "center" }}>
              Eigenvectors are the directions that do not turn.
            </div>
          </div>

          {/* Card 3: Challenge (Exact) */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ fontSize: "12px", fontWeight: 800 }}>
                Challenge (Exact)
              </span>
            </div>

            <div style={{ fontSize: "10px", color: "#475569" }}>
              For <InlineMath math="A = \begin{bmatrix} 2 & 1 \\ 1 & 3 \end{bmatrix}" />, find both eigenvalues and eigenvectors:
            </div>

            <div className={styles.challengeInputsRow}>
              <div className={styles.challengeRowItem}>
                <span>λ₁ =</span>
                <input
                  type="text"
                  className={styles.challengeTextInput}
                  placeholder="3.618"
                  value={state.challenge.lambda1}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_INPUT",
                      payload: { key: "lambda1", value: e.target.value },
                    })
                  }
                />
                <span>with v₁ =</span>
                <span>[ 1, 1.618 ]ᵀ</span>
              </div>

              <div className={styles.challengeRowItem}>
                <span>λ₂ =</span>
                <input
                  type="text"
                  className={styles.challengeTextInput}
                  placeholder="1.382"
                  value={state.challenge.lambda2}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_INPUT",
                      payload: { key: "lambda2", value: e.target.value },
                    })
                  }
                />
                <span>with v₂ =</span>
                <span>[ 1, -0.618 ]ᵀ</span>
              </div>
            </div>

            <button
              className={styles.challengeCheckBtn}
              onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
            >
              Check answers
            </button>

            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: state.challengeCorrect ? "#166534" : "#dc2626",
                }}
              >
                {state.challengeCorrect
                  ? "✓ Correct! Eigenvalues λ = (5 ± √5)/2 verified."
                  : "✗ Check your eigenvalue formulas: solve det(A - λI) = 0."}
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

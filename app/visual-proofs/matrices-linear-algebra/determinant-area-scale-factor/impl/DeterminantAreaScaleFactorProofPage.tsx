import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./DeterminantAreaScaleFactorProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  QUICK_PRESETS,
} from "./determinant-area-scale-factorConfig";
import {
  calculateDeterminant,
  calculateAreaScale,
  getOrientation,
  computeParallelogramVertices,
} from "./determinant-area-scale-factorMath";
import {
  initialState,
  determinantProofReducer,
} from "./determinant-area-scale-factorReducer";
import { evaluateDetProofProgress } from "./determinant-area-scale-factorCompletion";

export default function DeterminantAreaScaleFactorProofPage() {
  const [state, dispatch] = useReducer(determinantProofReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateDetProofProgress(state), [state]);

  // Smooth matrix interpolation from Identity to A based on animProgress
  const currentMatrix = useMemo(() => {
    const t = state.animProgress;
    return {
      a: (1 - t) * 1 + t * state.matrixA.a,
      b: (1 - t) * 0 + t * state.matrixA.b,
      c: (1 - t) * 0 + t * state.matrixA.c,
      d: (1 - t) * 1 + t * state.matrixA.d,
    };
  }, [state.animProgress, state.matrixA]);

  const detA = useMemo(() => calculateDeterminant(currentMatrix), [currentMatrix]);
  const areaScale = useMemo(() => calculateAreaScale(currentMatrix), [currentMatrix]);
  const orientation = useMemo(() => getOrientation(currentMatrix), [currentMatrix]);
  const vertices = useMemo(() => computeParallelogramVertices(currentMatrix), [currentMatrix]);

  useEffect(() => {
    if (!state.isAnimating) return;
    let animFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const speed = state.animSpeed || 0.5;
      const nextProgress = state.animProgress + delta * speed;
      if (nextProgress >= 1) {
        dispatch({ type: "SET_ANIM_PROGRESS", payload: 1 });
        dispatch({ type: "TOGGLE_PLAY_ANIMATION" });
      } else {
        dispatch({ type: "SET_ANIM_PROGRESS", payload: nextProgress });
        animFrameId = requestAnimationFrame(loop);
      }
    };

    animFrameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animFrameId);
  }, [state.isAnimating, state.animProgress, state.animSpeed]);

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

  // SVG coordinate conversions: center (130, 120), scale 40 px per math unit
  const toSvgX = (x: number) => 130 + x * 40;
  const toSvgY = (y: number) => 120 - y * 40;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Determinant as Area Scale Factor visual proof workspace"
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
            <button
              className={`${styles.navItem} ${activeTab === "Library" ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab("Library")}
              aria-label="Library"
            >
              <span className={styles.navIcon}>🗂️</span>
              <span>Library</span>
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

          <div className={styles.missionBadgeCenter}>
            <span>🎯</span>
            <span>Mission: Make linear algebra visual, intuitive and undeniable.</span>
          </div>

          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill}>Score: {progress.completionScore}%</span>
          </div>
        </header>

        {/* Top Controls Strip */}
        <section className={styles.topControlsStrip} aria-label="Matrix and Determinant Controls">
          {/* Matrix A Editor */}
          <div className={styles.matrixAContainer}>
            <span className={styles.matrixALabel}>A =</span>
            <div className={styles.matrixABrackets}>
              <input
                type="number"
                step="0.1"
                className={styles.matrixInputCell}
                value={state.matrixA.a}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                  })
                }
                title="Entry a (row 1, col 1)"
              />
              <input
                type="number"
                step="0.1"
                className={styles.matrixInputCell}
                value={state.matrixA.b}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                  })
                }
                title="Entry b (row 1, col 2)"
              />
              <input
                type="number"
                step="0.1"
                className={styles.matrixInputCell}
                value={state.matrixA.c}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                  })
                }
                title="Entry c (row 2, col 1)"
              />
              <input
                type="number"
                step="0.1"
                className={styles.matrixInputCell}
                value={state.matrixA.d}
                onChange={(e) =>
                  dispatch({
                    type: "SET_MATRIX_ENTRY",
                    payload: { key: "d", value: parseFloat(e.target.value) || 0 },
                  })
                }
                title="Entry d (row 2, col 2)"
              />
            </div>
          </div>

          {/* Determinant & Orientation Status */}
          <div className={styles.detStatusCol}>
            <div className={styles.detHeadingValue}>
              det(A) = {detA >= 0 ? `+${detA.toFixed(2)}` : detA.toFixed(2)}
            </div>
            <div className={styles.detScaleText}>Area scale = {areaScale.toFixed(2)}×</div>
            <div className={styles.detOrientationText} style={{ color: orientation.color }}>
              Orientation = {orientation.status}
            </div>
            <button
              className={styles.randomMatrixBtn}
              onClick={() => dispatch({ type: "RANDOMIZE_MATRIX" })}
            >
              <span>🔀</span>
              <span>Random matrix</span>
            </button>
          </div>

          {/* Quick Matrices Presets */}
          <div className={styles.quickMatricesCol}>
            <span className={styles.quickMatricesTitle}>Quick matrices</span>
            <div className={styles.quickButtonsRow}>
              {QUICK_PRESETS.slice(1).map((preset) => (
                <button
                  key={preset.id}
                  className={`${styles.quickBtn} ${
                    state.activePreset === preset.id ? styles.quickBtnActive : ""
                  }`}
                  onClick={() => dispatch({ type: "APPLY_PRESET", payload: preset.id })}
                  title={preset.description}
                >
                  <span className={styles.quickLetter}>{preset.letter}</span>
                  <span className={styles.quickSublabel}>{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Play / Pause Transformation Animation Control Bar */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "14px",
            flexWrap: "wrap",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
          }}
          aria-label="Play and Pause Transformation Animation"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => dispatch({ type: "TOGGLE_PLAY_ANIMATION" })}
              style={{
                background: state.isAnimating
                  ? "#fef2f2"
                  : "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                color: state.isAnimating ? "#dc2626" : "#ffffff",
                border: state.isAnimating ? "1px solid #fecaca" : "none",
                borderRadius: "10px",
                padding: "7px 14px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                boxShadow: "0 2px 5px rgba(79, 70, 229, 0.2)",
              }}
            >
              <span>{state.isAnimating ? "⏸ Pause" : "▶ Play Transformation"}</span>
            </button>

            <button
              onClick={() => dispatch({ type: "SET_ANIM_PROGRESS", payload: 0 })}
              style={{
                background: "#f8fafc",
                border: "1px solid #cbd5e1",
                borderRadius: "8px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
              }}
            >
              ⏮ Unit Square (t=0)
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1, maxWidth: "320px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#475569" }}>
              Area Morph: {Math.round(state.animProgress * 100)}%
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={state.animProgress}
              onChange={(e) =>
                dispatch({ type: "SET_ANIM_PROGRESS", payload: parseFloat(e.target.value) })
              }
              style={{ flex: 1, accentColor: "#6366f1", cursor: "pointer" }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>Speed:</span>
            {[0.25, 0.5, 1.0].map((spd) => (
              <button
                key={spd}
                onClick={() => dispatch({ type: "SET_ANIM_SPEED", payload: spd })}
                style={{
                  background:
                    Math.abs((state.animSpeed || 0.5) - spd) < 0.1 ? "#ede9fe" : "#f8fafc",
                  color:
                    Math.abs((state.animSpeed || 0.5) - spd) < 0.1 ? "#4f46e5" : "#475569",
                  border:
                    Math.abs((state.animSpeed || 0.5) - spd) < 0.1
                      ? "1px solid #c4b5fd"
                      : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </section>

        {/* Center Grid: Dual Canvases + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Dual Canvases Card */}
          <section className={styles.workspaceCard}>
            <div className={styles.dualCanvasesRow}>
              {/* Left Canvas: Before Unit Square */}
              <div className={styles.canvasBox}>
                <span className={styles.canvasBoxHeader}>Before: unit square</span>

                <div className={styles.svgViewport}>
                  <svg width="260" height="240" viewBox="0 0 260 240">
                    {/* Grid Lines */}
                    {[-2, -1, 0, 1, 2].map((x) => (
                      <line
                        key={`before-x-${x}`}
                        x1={toSvgX(x)}
                        y1={toSvgY(-2)}
                        x2={toSvgX(x)}
                        y2={toSvgY(2)}
                        stroke={x === 0 ? "#475569" : "#e2e8f0"}
                        strokeWidth={x === 0 ? 1.5 : 1}
                      />
                    ))}
                    {[-2, -1, 0, 1, 2].map((y) => (
                      <line
                        key={`before-y-${y}`}
                        x1={toSvgX(-2)}
                        y1={toSvgY(y)}
                        x2={toSvgX(2)}
                        y2={toSvgY(y)}
                        stroke={y === 0 ? "#475569" : "#e2e8f0"}
                        strokeWidth={y === 0 ? 1.5 : 1}
                      />
                    ))}

                    {/* Unit Square (0,0) -> (1,0) -> (1,1) -> (0,1) */}
                    <polygon
                      points={`${toSvgX(0)},${toSvgY(0)} ${toSvgX(1)},${toSvgY(0)} ${toSvgX(1)},${toSvgY(1)} ${toSvgX(0)},${toSvgY(1)}`}
                      fill="rgba(196, 181, 253, 0.45)"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />

                    {/* Circular Direction Arrow inside unit square */}
                    <path
                      d={`M ${toSvgX(0.7)} ${toSvgY(0.5)} A 12 12 0 1 0 ${toSvgX(0.4)} ${toSvgY(0.7)}`}
                      fill="none"
                      stroke="#6366f1"
                      strokeWidth="1.5"
                    />
                    <polygon
                      points={`${toSvgX(0.4)},${toSvgY(0.7)} ${toSvgX(0.4) - 3},${toSvgY(0.7) - 5} ${toSvgX(0.4) + 4},${toSvgY(0.7) - 4}`}
                      fill="#6366f1"
                    />

                    {/* Label Area = 1 */}
                    <text
                      x={toSvgX(0.5)}
                      y={toSvgY(0.5) + 4}
                      fill="#4338ca"
                      fontSize="12"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      Area = 1
                    </text>

                    {/* Vertices Dots */}
                    <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(1)} cy={toSvgY(0)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(1)} cy={toSvgY(1)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(0)} cy={toSvgY(1)} r="4" fill="#7c3aed" />
                  </svg>
                </div>

                <div className={styles.basisVectorsBar}>
                  <span>Basis vectors</span>
                  <span style={{ color: "#7c3aed" }}>e₁ = (1, 0) ➔</span>
                  <span style={{ color: "#16a34a" }}>e₂ = (0, 1) ↑</span>
                </div>
              </div>

              {/* Middle Morphing Path Column */}
              <div className={styles.middleMorphCol}>
                <span className={styles.transformArrowTitle}>Transform by A ➔</span>

                <div className={styles.morphingSquareBox} title="Intermediate morphed square">
                  <span style={{ fontSize: "18px" }}>📐</span>
                </div>

                <div className={styles.signedAreaPill}>
                  <span>Signed area change</span>
                  <span className={styles.signedScaleBold}>{orientation.signText}</span>
                  <span>Area = {areaScale.toFixed(2)} ⓘ</span>
                </div>

                <label className={styles.showPathToggleRow}>
                  <input
                    type="checkbox"
                    checked={state.showPath}
                    onChange={() => dispatch({ type: "TOGGLE_SHOW_PATH" })}
                  />
                  <span>Show path</span>
                </label>
              </div>

              {/* Right Canvas: After Transformed Parallelogram */}
              <div className={styles.canvasBox}>
                <span className={styles.canvasBoxHeader}>After: transformed parallelogram</span>

                <div className={styles.svgViewport}>
                  <svg width="260" height="240" viewBox="0 0 260 240">
                    {/* Grid Lines */}
                    {[-2, -1, 0, 1, 2].map((x) => (
                      <line
                        key={`after-x-${x}`}
                        x1={toSvgX(x)}
                        y1={toSvgY(-2)}
                        x2={toSvgX(x)}
                        y2={toSvgY(2)}
                        stroke={x === 0 ? "#475569" : "#e2e8f0"}
                        strokeWidth={x === 0 ? 1.5 : 1}
                      />
                    ))}
                    {[-2, -1, 0, 1, 2].map((y) => (
                      <line
                        key={`after-y-${y}`}
                        x1={toSvgX(-2)}
                        y1={toSvgY(y)}
                        x2={toSvgX(2)}
                        y2={toSvgY(y)}
                        stroke={y === 0 ? "#475569" : "#e2e8f0"}
                        strokeWidth={y === 0 ? 1.5 : 1}
                      />
                    ))}

                    {/* Transformed Parallelogram */}
                    <polygon
                      points={`${toSvgX(vertices.p0.x)},${toSvgY(vertices.p0.y)} ${toSvgX(
                        vertices.p1.x,
                      )},${toSvgY(vertices.p1.y)} ${toSvgX(vertices.p2.x)},${toSvgY(
                        vertices.p2.y,
                      )} ${toSvgX(vertices.p3.x)},${toSvgY(vertices.p3.y)}`}
                      fill="rgba(196, 181, 253, 0.45)"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />

                    {/* Label Area = AreaScale */}
                    <text
                      x={toSvgX(vertices.p2.x / 2)}
                      y={toSvgY(vertices.p2.y / 2)}
                      fill="#4338ca"
                      fontSize="12"
                      fontWeight="800"
                      textAnchor="middle"
                    >
                      Area = {areaScale.toFixed(2)}
                    </text>

                    {/* Corner Labels: C' and D' */}
                    <text
                      x={toSvgX(vertices.p2.x) + 4}
                      y={toSvgY(vertices.p2.y) - 4}
                      fill="#1e1b4b"
                      fontSize="11"
                      fontWeight="700"
                    >
                      C'
                    </text>
                    <text
                      x={toSvgX(vertices.p3.x) - 12}
                      y={toSvgY(vertices.p3.y) - 4}
                      fill="#1e1b4b"
                      fontSize="11"
                      fontWeight="700"
                    >
                      D'
                    </text>

                    {/* Basis Images Ae1 and Ae2 */}
                    <circle cx={toSvgX(vertices.p1.x)} cy={toSvgY(vertices.p1.y)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(vertices.p2.x)} cy={toSvgY(vertices.p2.y)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(vertices.p3.x)} cy={toSvgY(vertices.p3.y)} r="4" fill="#7c3aed" />
                    <circle cx={toSvgX(0)} cy={toSvgY(0)} r="4" fill="#7c3aed" />
                  </svg>
                </div>

                <div className={styles.basisVectorsBar}>
                  <span style={{ color: "#7c3aed" }}>
                    Ae₁ = ({vertices.p1.x.toFixed(2)}, {vertices.p1.y.toFixed(2)})
                  </span>
                  <span style={{ color: "#16a34a" }}>
                    Ae₂ = ({vertices.p3.x.toFixed(2)}, {vertices.p3.y.toFixed(2)})
                  </span>
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
                  <div className={styles.stepInstructionTitle}>Area scales by determinant</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Any linear map <InlineMath math="T" /> scales area by{" "}
                  <InlineMath math="|\det(A)|" />.
                </p>
                <div style={{ textAlign: "center", fontSize: "11px" }}>
                  <InlineMath math="\text{Area}(T(P)) = |\det(A)| \cdot \text{Area}(P)" />
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>Sign shows orientation</div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="\det(A) > 0" /> preserves orientation;{" "}
                  <InlineMath math="\det(A) < 0" /> reverses (flips) it.
                </p>
                <div className={styles.orientationDiagramsRow}>
                  <div className={styles.orientationDiagramBlock}>
                    <span>↺</span>
                    <span>det(A) &gt; 0</span>
                    <span style={{ color: "#166534" }}>Preserved</span>
                  </div>
                  <div className={styles.orientationDiagramBlock}>
                    <span>↻</span>
                    <span>det(A) &lt; 0</span>
                    <span style={{ color: "#d97706" }}>Reversed</span>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>From entries to effect</div>
                </div>
                <p className={styles.stepInstructionText}>
                  The entries control how basis vectors move, which determines area scale and
                  orientation.
                </p>
              </div>
            </div>

            {/* Predict Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🪄</span>
                <span>Predict</span>
              </div>
              <div style={{ fontSize: "12px", color: "#475569" }}>
                What will the determinant be?
              </div>
              <div className={styles.predictInputRow}>
                <input
                  type="text"
                  placeholder="e.g. 2, -1.5, √2..."
                  className={styles.predictInput}
                  value={state.predictionInput}
                  onChange={(e) =>
                    dispatch({ type: "SET_PREDICTION_INPUT", payload: e.target.value })
                  }
                />
                <button
                  className={styles.predictCheckBtn}
                  onClick={() => dispatch({ type: "CHECK_PREDICTION" })}
                >
                  Check
                </button>
              </div>
            </div>

            {/* Reveal Card */}
            <div className={styles.revealCard}>
              <div className={styles.cardHeader}>
                <span>⟲</span>
                <span>Reveal</span>
              </div>
              <div className={styles.revealExactRow}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>Exact value:</span>
                <span className={styles.revealExactValue}>
                  det(A) = {detA >= 0 ? `+${detA.toFixed(2)}` : detA.toFixed(2)}
                </span>
              </div>
              <div
                style={{
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  padding: "4px 8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#166534",
                  textAlign: "center",
                }}
              >
                ✓ Correct!
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof 2D + Challenge */}
        <div className={styles.bottomGrid}>
          {/* Card 1: Visual proof (2D) */}
          <div className={styles.visualProof2DCard}>
            <div className={styles.cardHeader}>
              <span>Visual proof (2D)</span>
            </div>

            <div className={styles.visualProof2DFlow}>
              {/* Original Square */}
              <div className={styles.flowItemBlock}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    border: "1.5px solid #8b5cf6",
                    background: "rgba(196, 181, 253, 0.3)",
                    borderRadius: "4px",
                  }}
                />
                <span>Area(original) = 1</span>
              </div>

              <div className={styles.arrowFlow}>➔</div>

              {/* Linear Map */}
              <div className={styles.flowItemBlock}>
                <div style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1" }}>
                  Linear map A
                </div>
              </div>

              <div className={styles.arrowFlow}>➔</div>

              {/* Transformed Parallelogram */}
              <div className={styles.flowItemBlock}>
                <div
                  style={{
                    width: "36px",
                    height: "24px",
                    border: "1.5px solid #8b5cf6",
                    background: "rgba(196, 181, 253, 0.4)",
                    borderRadius: "4px",
                    transform: "skewX(-20deg)",
                  }}
                />
                <span>Area(image) = |det(A)|</span>
              </div>

              <div className={styles.arrowFlow}>➔</div>

              {/* Formula */}
              <div className={styles.flowItemBlock}>
                <InlineMath math="\det(A) = \begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc" />
                <span style={{ fontSize: "9px", color: "#166534" }}>
                  Signed area scale (orientation by sign)
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Challenge */}
          <div className={styles.challengeCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Challenge</span>
            </div>
            <div style={{ fontSize: "11px", color: "#475569" }}>
              Find A that maps the unit square to the shown parallelogram.
            </div>

            <div className={styles.challengeBodyRow}>
              {/* Mini Target Parallelogram SVG */}
              <svg width="100" height="70" viewBox="0 0 100 70">
                <polygon
                  points="20,60 70,50 85,15 35,25"
                  fill="rgba(196, 181, 253, 0.4)"
                  stroke="#7c3aed"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="60" r="3" fill="#7c3aed" />
                <circle cx="70" cy="50" r="3" fill="#7c3aed" />
                <circle cx="85" cy="15" r="3" fill="#7c3aed" />
                <circle cx="35" cy="25" r="3" fill="#7c3aed" />
              </svg>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700 }}>A =</span>
                <div className={styles.challengeMatrixInputs}>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="a"
                    className={styles.challengeCellInput}
                    value={state.challengeMatrix.a || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CHALLENGE_ENTRY",
                        payload: { key: "a", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="b"
                    className={styles.challengeCellInput}
                    value={state.challengeMatrix.b || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CHALLENGE_ENTRY",
                        payload: { key: "b", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="c"
                    className={styles.challengeCellInput}
                    value={state.challengeMatrix.c || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CHALLENGE_ENTRY",
                        payload: { key: "c", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    step="0.5"
                    placeholder="d"
                    className={styles.challengeCellInput}
                    value={state.challengeMatrix.d || ""}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_CHALLENGE_ENTRY",
                        payload: { key: "d", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                </div>
                <button
                  className={styles.predictCheckBtn}
                  onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
                >
                  Check
                </button>
              </div>
            </div>

            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: state.challengeCorrect ? "#166534" : "#dc2626",
                  textAlign: "center",
                }}
              >
                {state.challengeCorrect
                  ? "✓ Correct! Matrix [[2, 0.5], [0.5, 1.5]] maps unit square to target."
                  : "✗ Set a=2, b=0.5, c=0.5, d=1.5 to match vertices."}
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
              className={styles.randomMatrixBtn}
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
              className={styles.randomMatrixBtn}
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

        {/* Bottom Tip Bar */}
        <footer className={styles.bottomTipBar}>
          <div>
            💡 <strong>Tip:</strong> Drag matrix entries, basis vectors, or corners. Watch area,
            orientation, and path update in real time.
          </div>
          <div className={styles.tipButtonsRight}>
            <button className={styles.tipSmallBtn}>⌨ Keyboard</button>
            <button className={styles.tipSmallBtn}>? Help</button>
          </div>
        </footer>
      </main>
    </div>
  );
}

import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./MatrixLinearTransformationGridProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  PRESETS,
  DEFAULT_CHALLENGE,
} from "./matrix-linear-transformation-gridConfig";
import {
  transformVector,
  computeDeterminant,
  computeAreaScale,
  getOrientationStatus,
  generateCartesianGrid,
  generateTransformedGrid,
} from "./matrix-linear-transformation-gridMath";
import {
  initialState,
  linearTransformReducer,
} from "./matrix-linear-transformation-gridReducer";
import { evaluateTransformProofProgress } from "./matrix-linear-transformation-gridCompletion";

export default function MatrixLinearTransformationGridProofPage() {
  const [state, dispatch] = useReducer(linearTransformReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateTransformProofProgress(state), [state]);

  // Smooth matrix interpolation from Identity to A based on animProgress
  const currentMatrix = useMemo(() => {
    const t = state.animProgress;
    return {
      a: (1 - t) * 1 + t * state.matrixA.a,
      c: (1 - t) * 0 + t * state.matrixA.c,
      b: (1 - t) * 0 + t * state.matrixA.b,
      d: (1 - t) * 1 + t * state.matrixA.d,
    };
  }, [state.animProgress, state.matrixA]);

  const Ae1 = useMemo(
    () => transformVector(currentMatrix, { x: 1, y: 0 }),
    [currentMatrix],
  );
  const Ae2 = useMemo(
    () => transformVector(currentMatrix, { x: 0, y: 1 }),
    [currentMatrix],
  );
  const Av = useMemo(
    () => transformVector(currentMatrix, state.vectorV),
    [currentMatrix, state.vectorV],
  );
  const detA = useMemo(
    () => computeDeterminant(currentMatrix),
    [currentMatrix],
  );
  const areaScale = useMemo(
    () => computeAreaScale(currentMatrix),
    [currentMatrix],
  );
  const orientation = useMemo(
    () => getOrientationStatus(currentMatrix),
    [currentMatrix],
  );

  const beforeGridLines = useMemo(() => generateCartesianGrid(3, 1), []);
  const afterGridLines = useMemo(
    () => generateTransformedGrid(currentMatrix, 3, 1),
    [currentMatrix],
  );

  useEffect(() => {
    if (!state.isAnimating) return;
    let animFrameId: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;
      const speed = state.animSpeed || 0.3;
      const nextProgress = state.animProgress + delta * speed;
      if (nextProgress >= 1) {
        dispatch({ type: "SET_ANIM_PROGRESS", payload: 1 });
        dispatch({ type: "TOGGLE_ANIMATION" });
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

  // SVG coordinate conversions: center (140, 125), scale 38 px per math unit
  const toSvgX = (x: number) => 140 + x * 38;
  const toSvgY = (y: number) => 125 - y * 38;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Matrix as Linear Transformation visual proof workspace"
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
            <div className={styles.breadcrumbs}>Visual Proofs / Linear Algebra</div>
            <h1 className={styles.title}>{PROOF_META.title}</h1>
            <p className={styles.subtitle}>{PROOF_META.subtitle}</p>
          </div>
          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill}>Score: {progress.completionScore}%</span>
          </div>
        </header>

        {/* Presets Strip */}
        <section className={styles.presetsCard} aria-label="Transformation Presets">
          <div className={styles.presetsLeft}>
            <div className={styles.targetIconBadge}>🎯</div>
            <div className={styles.presetsTextGroup}>
              <span className={styles.presetsTitle}>Drag the matrix or the vector v.</span>
              <span className={styles.presetsSubtitle}>
                Watch how the grid, basis, and any vector move.
              </span>
            </div>
          </div>

          <div className={styles.presetsButtonsList}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>Presets</span>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                className={`${styles.presetBtn} ${
                  state.activePreset === preset.id ? styles.presetBtnActive : ""
                }`}
                onClick={() => dispatch({ type: "APPLY_PRESET", payload: preset.id })}
                title={preset.description}
              >
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Slow-Motion Transformation Control Bar (Kid Friendly) */}
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
          aria-label="Slow-Motion Transformation Controls"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              onClick={() => dispatch({ type: "TOGGLE_ANIMATION" })}
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
              <span>{state.isAnimating ? "⏸ Pause" : "▶ Slow-Motion Morph"}</span>
            </button>

            <button
              onClick={() => {
                dispatch({ type: "SET_ANIM_PROGRESS", payload: 0 });
              }}
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
              ⏮ Reset to Identity (t=0)
            </button>
          </div>

          {/* Speed Selector (0.25x Kid Mode, 0.5x, 1x) */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>
              Kid Speed:
            </span>
            {[
              { label: "🐌 0.25x Extra Slow", speed: 0.2 },
              { label: "🐢 0.5x Slow", speed: 0.4 },
              { label: "🐇 1x Normal", speed: 0.8 },
            ].map((s) => (
              <button
                key={s.label}
                onClick={() => dispatch({ type: "SET_ANIM_SPEED", payload: s.speed })}
                style={{
                  background:
                    Math.abs((state.animSpeed || 0.3) - s.speed) < 0.1
                      ? "#ede9fe"
                      : "#f8fafc",
                  color:
                    Math.abs((state.animSpeed || 0.3) - s.speed) < 0.1
                      ? "#4f46e5"
                      : "#475569",
                  border:
                    Math.abs((state.animSpeed || 0.3) - s.speed) < 0.1
                      ? "1px solid #c4b5fd"
                      : "1px solid #e2e8f0",
                  borderRadius: "8px",
                  padding: "5px 10px",
                  fontSize: "11px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Transformation Progress Slider */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "220px" }}>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>
              Progress: {Math.round(state.animProgress * 100)}%
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
        </section>

        {/* Center Grid: Dual Canvas + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Dual Canvas Card */}
          <section className={styles.workspaceCard}>
            <div className={styles.dualCanvasLayout}>
              {/* Left Canvas: Before Transformation */}
              <div className={styles.canvasBox}>
                <div className={styles.canvasHeader}>
                  <span className={styles.canvasTitle}>Before transformation</span>
                </div>

                <div className={styles.svgGridContainer}>
                  <svg width="280" height="250" viewBox="0 0 280 250">
                    {/* Grid Lines */}
                    {state.showGrid &&
                      beforeGridLines.map((line, idx) => (
                        <line
                          key={`before-grid-${idx}`}
                          x1={toSvgX(line.x1)}
                          y1={toSvgY(line.y1)}
                          x2={toSvgX(line.x2)}
                          y2={toSvgY(line.y2)}
                          stroke={line.isAxis ? "#475569" : "#e2e8f0"}
                          strokeWidth={line.isAxis ? 1.5 : 1}
                        />
                      ))}

                    {/* Coordinate tick labels */}
                    {state.showCoordinates &&
                      [-2, -1, 1, 2].map((val) => (
                        <g key={`before-tick-${val}`}>
                          <text
                            x={toSvgX(val)}
                            y={toSvgY(0) + 12}
                            fontSize="9"
                            fill="#94a3b8"
                            textAnchor="middle"
                          >
                            {val}
                          </text>
                          <text
                            x={toSvgX(0) - 8}
                            y={toSvgY(val) + 3}
                            fontSize="9"
                            fill="#94a3b8"
                            textAnchor="end"
                          >
                            {val}
                          </text>
                        </g>
                      ))}

                    {/* Basis Vectors e1 (red) and e2 (blue) */}
                    {state.showBasis && (
                      <g>
                        {/* e1 (1, 0) */}
                        <line
                          x1={toSvgX(0)}
                          y1={toSvgY(0)}
                          x2={toSvgX(1)}
                          y2={toSvgY(0)}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${toSvgX(1)},${toSvgY(0)} ${toSvgX(1) - 6},${toSvgY(0) - 4} ${toSvgX(1) - 6},${toSvgY(0) + 4}`}
                          fill="#ef4444"
                        />
                        <text
                          x={toSvgX(1) + 4}
                          y={toSvgY(0) + 12}
                          fill="#ef4444"
                          fontSize="11"
                          fontWeight="700"
                        >
                          e₁
                        </text>

                        {/* e2 (0, 1) */}
                        <line
                          x1={toSvgX(0)}
                          y1={toSvgY(0)}
                          x2={toSvgX(0)}
                          y2={toSvgY(1)}
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${toSvgX(0)},${toSvgY(1)} ${toSvgX(0) - 4},${toSvgY(1) + 6} ${toSvgX(0) + 4},${toSvgY(1) + 6}`}
                          fill="#3b82f6"
                        />
                        <text
                          x={toSvgX(0) - 14}
                          y={toSvgY(1) - 4}
                          fill="#3b82f6"
                          fontSize="11"
                          fontWeight="700"
                        >
                          e₂
                        </text>
                      </g>
                    )}

                    {/* Vector v (purple) */}
                    <line
                      x1={toSvgX(0)}
                      y1={toSvgY(0)}
                      x2={toSvgX(state.vectorV.x)}
                      y2={toSvgY(state.vectorV.y)}
                      stroke="#8b5cf6"
                      strokeWidth="2"
                      strokeDasharray={state.showPath ? "4 3" : undefined}
                    />
                    <circle
                      cx={toSvgX(state.vectorV.x)}
                      cy={toSvgY(state.vectorV.y)}
                      r="6"
                      fill="#7c3aed"
                      stroke="#ffffff"
                      strokeWidth="2"
                      style={{ cursor: "grab" }}
                    />
                    <text
                      x={toSvgX(state.vectorV.x) + 8}
                      y={toSvgY(state.vectorV.y) - 6}
                      fill="#7c3aed"
                      fontSize="11"
                      fontWeight="700"
                    >
                      v ({state.vectorV.x.toFixed(1)}, {state.vectorV.y.toFixed(1)})
                    </text>
                  </svg>

                  {/* Basis Card at bottom-right */}
                  <div className={styles.basisInfoCard}>
                    <span style={{ fontWeight: 700, color: "#1e1b4b" }}>Basis</span>
                    <span style={{ color: "#ef4444" }}>e₁ = (1, 0)</span>
                    <span style={{ color: "#3b82f6" }}>e₂ = (0, 1)</span>
                  </div>
                </div>

                <div className={styles.checkboxesRow}>
                  <span>Show</span>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showGrid}
                      onChange={() => dispatch({ type: "TOGGLE_GRID" })}
                    />
                    Grid
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showBasis}
                      onChange={() => dispatch({ type: "TOGGLE_BASIS" })}
                    />
                    Basis
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showPath}
                      onChange={() => dispatch({ type: "TOGGLE_PATH" })}
                    />
                    Path
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showCoordinates}
                      onChange={() => dispatch({ type: "TOGGLE_COORDINATES" })}
                    />
                    Coordinates
                  </label>
                </div>
              </div>

              {/* Middle Column: Matrix A & Determinant */}
              <div className={styles.middleMatrixCol}>
                <div style={{ fontSize: "18px", color: "#6366f1", fontWeight: 800 }}>➔</div>

                <div className={styles.matrixCard}>
                  <div className={styles.matrixCardHeader}>
                    <span>Matrix A</span>
                    <span style={{ cursor: "pointer" }}>?</span>
                  </div>

                  <div className={styles.matrixInputsGrid}>
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
                      title="a_11"
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
                      title="a_12"
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
                      title="a_21"
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
                      title="a_22"
                    />
                  </div>

                  <span className={styles.dragPromptText}>Drag any entry or the matrix</span>
                </div>

                <div className={styles.determinantCard}>
                  <span style={{ fontWeight: 700, color: "#64748b" }}>Determinant</span>
                  <span className={styles.detValue}>det(A) = {detA.toFixed(2)}</span>
                  <span style={{ color: "#64748b" }}>Area scale ≈ {areaScale.toFixed(2)}×</span>
                  <span
                    className={styles.orientationBadge}
                    style={{ color: orientation.color }}
                  >
                    Orientation: {orientation.status}
                  </span>
                </div>
              </div>

              {/* Right Canvas: After Transformation */}
              <div className={styles.canvasBox}>
                <div className={styles.canvasHeader}>
                  <span className={styles.canvasTitle}>After transformation y' = Av</span>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b" }}
                    title="Expand View"
                  >
                    ⛶
                  </button>
                </div>

                <div className={styles.svgGridContainer}>
                  <svg width="280" height="250" viewBox="0 0 280 250">
                    {/* Transformed Grid Lines */}
                    {state.showGrid &&
                      afterGridLines.map((line, idx) => (
                        <line
                          key={`after-grid-${idx}`}
                          x1={toSvgX(line.x1)}
                          y1={toSvgY(line.y1)}
                          x2={toSvgX(line.x2)}
                          y2={toSvgY(line.y2)}
                          stroke={line.isAxis ? "#475569" : "#e2e8f0"}
                          strokeWidth={line.isAxis ? 1.5 : 1}
                        />
                      ))}

                    {/* Transformed Basis Ae1 (red) and Ae2 (blue) */}
                    {state.showBasis && (
                      <g>
                        {/* Ae1 */}
                        <line
                          x1={toSvgX(0)}
                          y1={toSvgY(0)}
                          x2={toSvgX(Ae1.x)}
                          y2={toSvgY(Ae1.y)}
                          stroke="#ef4444"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${toSvgX(Ae1.x)},${toSvgY(Ae1.y)} ${toSvgX(Ae1.x) - 6},${toSvgY(Ae1.y) - 4} ${toSvgX(Ae1.x) - 6},${toSvgY(Ae1.y) + 4}`}
                          fill="#ef4444"
                        />
                        <text
                          x={toSvgX(Ae1.x) + 4}
                          y={toSvgY(Ae1.y) + 4}
                          fill="#ef4444"
                          fontSize="11"
                          fontWeight="700"
                        >
                          Ae₁
                        </text>

                        {/* Ae2 */}
                        <line
                          x1={toSvgX(0)}
                          y1={toSvgY(0)}
                          x2={toSvgX(Ae2.x)}
                          y2={toSvgY(Ae2.y)}
                          stroke="#3b82f6"
                          strokeWidth="2.5"
                        />
                        <polygon
                          points={`${toSvgX(Ae2.x)},${toSvgY(Ae2.y)} ${toSvgX(Ae2.x) - 4},${toSvgY(Ae2.y) + 6} ${toSvgX(Ae2.x) + 4},${toSvgY(Ae2.y) + 6}`}
                          fill="#3b82f6"
                        />
                        <text
                          x={toSvgX(Ae2.x) - 14}
                          y={toSvgY(Ae2.y) - 4}
                          fill="#3b82f6"
                          fontSize="11"
                          fontWeight="700"
                        >
                          Ae₂
                        </text>
                      </g>
                    )}

                    {/* Transformed Vector Av (purple) */}
                    <line
                      x1={toSvgX(0)}
                      y1={toSvgY(0)}
                      x2={toSvgX(Av.x)}
                      y2={toSvgY(Av.y)}
                      stroke="#8b5cf6"
                      strokeWidth="2.5"
                    />
                    <circle
                      cx={toSvgX(Av.x)}
                      cy={toSvgY(Av.y)}
                      r="6"
                      fill="#7c3aed"
                      stroke="#ffffff"
                      strokeWidth="2"
                    />
                    <text
                      x={toSvgX(Av.x) + 6}
                      y={toSvgY(Av.y) - 6}
                      fill="#7c3aed"
                      fontSize="11"
                      fontWeight="700"
                    >
                      Av ({Av.x.toFixed(2)}, {Av.y.toFixed(2)})
                    </text>

                    {/* Trajectory Arc from v to Av */}
                    {state.showPath && (
                      <path
                        d={`M ${toSvgX(state.vectorV.x)} ${toSvgY(state.vectorV.y)} Q ${
                          (toSvgX(state.vectorV.x) + toSvgX(Av.x)) / 2
                        } ${toSvgY(Math.max(state.vectorV.y, Av.y) + 0.5)} ${toSvgX(
                          Av.x,
                        )} ${toSvgY(Av.y)}`}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                    )}
                  </svg>

                  {/* Columns of A info card */}
                  <div className={styles.basisInfoCard}>
                    <span style={{ fontWeight: 700, color: "#1e1b4b" }}>Columns of A</span>
                    <span style={{ color: "#ef4444" }}>
                      Ae₁ = ({Ae1.x.toFixed(2)}, {Ae1.y.toFixed(2)})
                    </span>
                    <span style={{ color: "#3b82f6" }}>
                      Ae₂ = ({Ae2.x.toFixed(2)}, {Ae2.y.toFixed(2)})
                    </span>
                  </div>
                </div>

                <div className={styles.checkboxesRow}>
                  <span>Show</span>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showGrid}
                      onChange={() => dispatch({ type: "TOGGLE_GRID" })}
                    />
                    Grid
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showBasis}
                      onChange={() => dispatch({ type: "TOGGLE_BASIS" })}
                    />
                    Basis
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showPath}
                      onChange={() => dispatch({ type: "TOGGLE_PATH" })}
                    />
                    Path
                  </label>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={state.showCoordinates}
                      onChange={() => dispatch({ type: "TOGGLE_COORDINATES" })}
                    />
                    Coordinates
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Right Column: Why it works + Predict */}
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
                  <div className={styles.stepInstructionTitle}>Basis maps to columns</div>
                </div>
                <p className={styles.stepInstructionText}>
                  <InlineMath math="Ae_1" /> and <InlineMath math="Ae_2" /> are the first and second
                  columns of <InlineMath math="A" />.
                </p>
                <div style={{ fontSize: "11px", textAlign: "center" }}>
                  <InlineMath math="A \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} a_{11} \\ a_{21} \end{bmatrix}, \quad A \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} a_{12} \\ a_{22} \end{bmatrix}" />
                </div>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>Any vector is a combination</div>
                </div>
                <p className={styles.stepInstructionText}>
                  If <InlineMath math="v = x e_1 + y e_2" />, then{" "}
                  <InlineMath math="Av = x Ae_1 + y Ae_2" />.
                </p>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>Structure is preserved</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Lines stay lines. Area scales by <InlineMath math="|\det(A)|" />.
                </p>
              </div>
            </div>

            {/* Predict & Reveal Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🔮</span>
                <span>Predict & reveal</span>
              </div>
              <div className={styles.predictValuesRow}>
                <div>
                  <InlineMath math={`v = (${state.vectorV.x.toFixed(1)}, ${state.vectorV.y.toFixed(1)})`} />
                </div>
                <div>
                  <InlineMath math={`Av = (${Av.x.toFixed(2)}, ${Av.y.toFixed(2)})`} />
                </div>
              </div>
              <button
                className={styles.newVectorBtn}
                onClick={() => dispatch({ type: "RANDOMIZE_VECTOR" })}
              >
                <span>⟲</span>
                <span>New vector</span>
              </button>
              <div className={styles.successPill}>
                <span>✓ Correct! Great intuition.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: 3 Panels */}
        <div className={styles.bottomGrid}>
          {/* Card 1: The visual proof */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>The visual proof</span>
            </div>
            <div style={{ fontSize: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ color: "#8b5cf6", fontWeight: 800 }}>v</span>
                <span>➔</span>
                <span>
                  <InlineMath math="x e_1 + y e_2" />
                </span>
                <span>➔</span>
                <span>
                  <InlineMath math="A(x e_1 + y e_2) = x Ae_1 + y Ae_2 = Av" />
                </span>
              </div>
              <div
                style={{
                  background: "#f5f3ff",
                  padding: "8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  color: "#6d28d9",
                }}
              >
                Matrix acts by where it sends the basis. Everything else follows by combination.
              </div>
            </div>
          </div>

          {/* Card 2: Matrix ↔ actions */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span>Matrix ↔ actions</span>
            </div>
            <div className={styles.actionTabsRow}>
              {(["Entries", "Row ops", "Systems", "Transformations"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.actionTabBtn} ${
                    state.activeActionTab === tab ? styles.actionTabBtnActive : ""
                  }`}
                  onClick={() => dispatch({ type: "SET_ACTION_TAB", payload: tab })}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div className={styles.actionRowItem}>
                <span>Scale x by 2</span>
                <InlineMath math="\begin{bmatrix} 2 & 0 \\ 0 & 1 \end{bmatrix}" />
              </div>
              <div className={styles.actionRowItem}>
                <span>Shear x by y</span>
                <InlineMath math="\begin{bmatrix} 1 & 1 \\ 0 & 1 \end{bmatrix}" />
              </div>
              <div className={styles.actionRowItem}>
                <span>Rotate 30°</span>
                <InlineMath math="\begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}" />
              </div>
            </div>
          </div>

          {/* Card 3: Challenge (exact) */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Challenge (exact)</span>
            </div>
            <div style={{ fontSize: "11px", color: "#475569" }}>
              Given <InlineMath math="A = \begin{bmatrix} 1 & 2 \\ -1 & 3 \end{bmatrix}" /> and{" "}
              <InlineMath math="v = \begin{bmatrix} 2 \\ -1 \end{bmatrix}" />, what is{" "}
              <InlineMath math="Av" />?
            </div>

            <div className={styles.challengeOptionsGrid}>
              {DEFAULT_CHALLENGE.options.map((opt) => (
                <button
                  key={opt.id}
                  className={`${styles.challengeOptionBtn} ${
                    state.challengeChoice === opt.id ? styles.challengeOptionBtnSelected : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "SELECT_CHALLENGE_CHOICE", payload: opt.id });
                    dispatch({ type: "CHECK_CHALLENGE" });
                  }}
                >
                  <span>{opt.id}</span>
                  <InlineMath
                    math={`\\begin{bmatrix} ${opt.vector.x} \\\\ ${opt.vector.y} \\end{bmatrix}`}
                  />
                </button>
              ))}
            </div>

            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: state.challengeChoice === "A" ? "#166534" : "#dc2626",
                  textAlign: "center",
                }}
              >
                {state.challengeChoice === "A"
                  ? "✓ Correct! Av = 2[1, -1] + (-1)[2, 3] = [0, -5]."
                  : "✗ Check your matrix-vector product calculation."}
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
              className={styles.newVectorBtn}
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
              className={styles.newVectorBtn}
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

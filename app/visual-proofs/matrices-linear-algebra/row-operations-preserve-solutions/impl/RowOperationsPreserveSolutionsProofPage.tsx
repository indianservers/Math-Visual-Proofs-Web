import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./RowOperationsPreserveSolutionsProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
  ROW_OPERATIONS,
  PREDICT_OPTIONS,
  DEFAULT_CHALLENGE_TARGET,
} from "./row-operations-preserve-solutionsConfig";
import {
  solveAugmentedSystem,
  computeLineSegment,
  formatEquation,
} from "./row-operations-preserve-solutionsMath";
import {
  initialState,
  rowOpsProofReducer,
} from "./row-operations-preserve-solutionsReducer";
import { evaluateRowOpsProofProgress } from "./row-operations-preserve-solutionsCompletion";

export default function RowOperationsPreserveSolutionsProofPage() {
  const [state, dispatch] = useReducer(rowOpsProofReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateRowOpsProofProgress(state), [state]);

  const sol1 = useMemo(() => solveAugmentedSystem(state.system1), [state.system1]);
  const sol2 = useMemo(() => solveAugmentedSystem(state.system2), [state.system2]);

  const sys1Line1 = useMemo(() => computeLineSegment(state.system1.row1, 5), [state.system1.row1]);
  const sys1Line2 = useMemo(() => computeLineSegment(state.system1.row2, 5), [state.system1.row2]);

  const sys2Line1 = useMemo(() => computeLineSegment(state.system2.row1, 5), [state.system2.row1]);
  const sys2Line2 = useMemo(() => computeLineSegment(state.system2.row2, 5), [state.system2.row2]);

  const [workflowStage, setWorkflowStage] = useState<"original" | "transformed" | "restored">("transformed");

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

  // SVG coordinate conversions: center (110, 90), scale 20 px per math unit
  const toSvgX = (x: number) => 110 + x * 20;
  const toSvgY = (y: number) => 90 - y * 20;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Row Operations Preserve Solution Set workspace"
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
            <button className={styles.badgePill} style={{ cursor: "pointer" }}>
              ☰ Menu
            </button>
          </div>
        </header>

        {/* Top Target Strip & Legend */}
        <section className={styles.targetLegendCard} aria-label="Target and Legend">
          <div className={styles.targetLeftBlock}>
            <div className={styles.targetIconBadge}>🎯</div>
            <div className={styles.targetTextGroup}>
              <span className={styles.targetTitle}>
                Drag a row operation or entry to the matrix
              </span>
              <span className={styles.targetSubtitle}>
                See how the system and lines change — the intersection stays the same.
              </span>
            </div>
          </div>

          <div className={styles.legendList}>
            <div className={styles.legendItem}>
              <div className={styles.dashedRectIcon} />
              <span>Row operation</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.circleIcon} />
              <span>Entry</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.pivotSquareIcon} />
              <span>Pivot</span>
            </div>
            <div className={styles.legendItem}>
              <span style={{ color: "#8b5cf6", fontWeight: 700 }}>---&gt;</span>
              <span>Move path</span>
            </div>
          </div>
        </section>

        {/* 3-Stage Visual Workflow Navigation Bar (Original -> Transformed -> Restored) */}
        <section
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "16px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.03)",
          }}
          aria-label="3-Stage Transformation Workflow"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "11px", fontWeight: 800, color: "#1e1b4b" }}>
              Visual Stage:
            </span>
            <button
              onClick={() => setWorkflowStage("original")}
              style={{
                background: workflowStage === "original" ? "#2563eb" : "#eff6ff",
                color: workflowStage === "original" ? "#ffffff" : "#1d4ed8",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🔵 1. Original System</span>
            </button>

            <button
              onClick={() => setWorkflowStage("transformed")}
              style={{
                background: workflowStage === "transformed" ? "#7c3aed" : "#f5f3ff",
                color: workflowStage === "transformed" ? "#ffffff" : "#6d28d9",
                border: "1px solid #ddd6fe",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🟣 2. Transformed System</span>
            </button>

            <button
              onClick={() => setWorkflowStage("restored")}
              style={{
                background: workflowStage === "restored" ? "#16a34a" : "#f0fdf4",
                color: workflowStage === "restored" ? "#ffffff" : "#15803d",
                border: "1px solid #bbf7d0",
                borderRadius: "10px",
                padding: "6px 12px",
                fontSize: "11px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>🟢 3. Restored & Invariant</span>
            </button>
          </div>

          <div style={{ fontSize: "11px", fontWeight: 600, color: "#475569" }}>
            {workflowStage === "original"
              ? "Showing initial System 1 with lines intersecting at (2, 1)."
              : workflowStage === "transformed"
              ? "Applying row operation — lines pivot and tilt, but intersection (2, 1) is preserved!"
              : "Reversing row operation restores original lines exactly. Solution set is invariant!"}
          </div>
        </section>

        {/* Center Grid: 3-Part Dual System Canvas + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Dual-System Card */}
          <section className={styles.workspaceCard}>
            {/* Left Subpanel: System 1 (Original) */}
            <div
              className={styles.systemSubpanel}
              style={{
                border: workflowStage === "original" ? "2px solid #3b82f6" : undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={styles.systemHeaderTitle}>System 1</span>
                <span
                  style={{
                    background: "#dbeafe",
                    color: "#1d4ed8",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "9px",
                    fontWeight: 800,
                  }}
                >
                  ORIGINAL
                </span>
              </div>

              {/* Augmented Matrix [A | b] */}
              <div className={styles.augmentedMatrixCard}>
                <div className={styles.matrixBracketBox}>
                  {/* Row 1 */}
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row1.a}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row1", key: "a", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row1.b}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row1", key: "b", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row1.c}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row1", key: "c", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />

                  {/* Row 2 */}
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row2.a}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row2", key: "a", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row2.b}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row2", key: "b", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />
                  <input
                    type="number"
                    className={styles.matrixCellInput}
                    value={state.system1.row2.c}
                    onChange={(e) =>
                      dispatch({
                        type: "SET_SYS1_ENTRY",
                        payload: { row: "row2", key: "c", value: parseFloat(e.target.value) || 0 },
                      })
                    }
                  />

                  {/* Drag highlight circle on first entry */}
                  <div className={styles.dragHandleCircle} />
                </div>
                <span className={styles.matrixUnderlabel}>Augmented matrix [A | b]</span>
              </div>

              {/* Equations List */}
              <div className={styles.equationsList}>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>
                  Equations
                </span>
                <span style={{ color: "#2563eb" }}>— {formatEquation(state.system1.row1)}</span>
                <span style={{ color: "#dc2626" }}>— {formatEquation(state.system1.row2)}</span>
              </div>

              {/* Graph 1 */}
              <div className={styles.svgGraphBox}>
                <svg width="220" height="180" viewBox="0 0 220 180">
                  {/* Grid Lines */}
                  {[-4, -2, 0, 2, 4].map((val) => (
                    <g key={`grid1-${val}`}>
                      <line
                        x1={toSvgX(val)}
                        y1={toSvgY(-4)}
                        x2={toSvgX(val)}
                        y2={toSvgY(4)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.2 : 1}
                      />
                      <line
                        x1={toSvgX(-4)}
                        y1={toSvgY(val)}
                        x2={toSvgX(4)}
                        y2={toSvgY(val)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.2 : 1}
                      />
                      {val !== 0 && (
                        <>
                          <text
                            x={toSvgX(val) - 4}
                            y={toSvgY(0) + 12}
                            fontSize="8"
                            fill="#64748b"
                          >
                            {val}
                          </text>
                          <text
                            x={toSvgX(0) - 12}
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
                  <text x="210" y={toSvgY(0) + 12} fontSize="9" fill="#475569" fontWeight="700">
                    x
                  </text>
                  <text x={toSvgX(0) + 4} y="12" fontSize="9" fill="#475569" fontWeight="700">
                    y
                  </text>

                  {/* Line 1 (Blue) */}
                  <line
                    x1={toSvgX(sys1Line1.x1)}
                    y1={toSvgY(sys1Line1.y1)}
                    x2={toSvgX(sys1Line1.x2)}
                    y2={toSvgY(sys1Line1.y2)}
                    stroke="#2563eb"
                    strokeWidth="2"
                  />

                  {/* Line 2 (Red) */}
                  <line
                    x1={toSvgX(sys1Line2.x1)}
                    y1={toSvgY(sys1Line2.y1)}
                    x2={toSvgX(sys1Line2.x2)}
                    y2={toSvgY(sys1Line2.y2)}
                    stroke="#dc2626"
                    strokeWidth="2"
                  />

                  {/* Intersection point */}
                  {sol1.intersection && (
                    <g>
                      <circle
                        cx={toSvgX(sol1.intersection.x)}
                        cy={toSvgY(sol1.intersection.y)}
                        r="6"
                        fill="#7c3aed"
                      />
                      <circle
                        cx={toSvgX(sol1.intersection.x)}
                        cy={toSvgY(sol1.intersection.y)}
                        r="10"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Solution Badge Card */}
                {sol1.intersection && (
                  <div className={styles.solutionBadgeCard}>
                    <span>Solution</span>
                    <span>
                      ({sol1.intersection.x.toFixed(0)}, {sol1.intersection.y.toFixed(0)}) ✓
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle Column: Row Operations (Transformed) */}
            <div className={styles.middleOpsCol}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                <span className={styles.opsHeaderTitle}>Row operations</span>
                <span
                  style={{
                    background: "#ede9fe",
                    color: "#6d28d9",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "9px",
                    fontWeight: 800,
                  }}
                >
                  TRANSFORMED
                </span>
              </div>

              <div className={styles.opsButtonsList}>
                {ROW_OPERATIONS.map((op) => (
                  <button
                    key={op.id}
                    className={`${styles.rowOpCardBtn} ${
                      state.activeOp === op.id ? styles.rowOpCardBtnActive : ""
                    }`}
                    onClick={() =>
                      dispatch({
                        type: "APPLY_ROW_OP",
                        payload: { op: op.id, k: op.defaultK },
                      })
                    }
                  >
                    <span className={styles.rowOpMainText}>{op.title}</span>
                    <span className={styles.rowOpSubtext}>{op.sublabel}</span>
                  </button>
                ))}
              </div>

              {/* Connecting arrow & active op */}
              <div className={styles.arrowConnectIndicator}>
                <div className={styles.activeOpPill}>
                  {state.activeOp === "swap"
                    ? "R₁ ↔ R₂"
                    : state.activeOp === "add_k_r2_to_r1"
                    ? "R₁ → R₁ + kR₂"
                    : "R₂ → R₂ + kR₁"}
                </div>
                <div className={styles.equivalentBadge}>✓ Equivalent system</div>
              </div>

              <button
                className={styles.resetBtn}
                onClick={() => dispatch({ type: "RESET" })}
              >
                ⟲ Reset all
              </button>
            </div>

            {/* Right Subpanel: System 2 (Restored/Preserved Invariant) */}
            <div
              className={styles.systemSubpanel}
              style={{
                border: workflowStage === "restored" ? "2px solid #16a34a" : undefined,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className={styles.systemHeaderTitle}>System 2</span>
                <span
                  style={{
                    background: "#dcfce7",
                    color: "#15803d",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontSize: "9px",
                    fontWeight: 800,
                  }}
                >
                  RESTORED / INVARIANT
                </span>
              </div>

              {/* Augmented Matrix [A' | b'] */}
              <div className={styles.augmentedMatrixCard}>
                <div className={styles.matrixBracketBox}>
                  {/* Row 1 */}
                  <div className={styles.matrixCellInput}>{state.system2.row1.a}</div>
                  <div className={styles.matrixCellInput}>{state.system2.row1.b}</div>
                  <div className={styles.matrixCellInput}>{state.system2.row1.c}</div>

                  {/* Row 2 */}
                  <div className={styles.matrixCellInput}>{state.system2.row2.a}</div>
                  <div className={styles.matrixCellInput}>{state.system2.row2.b}</div>
                  <div className={styles.matrixCellInput}>{state.system2.row2.c}</div>
                </div>
                <span className={styles.matrixUnderlabel}>Augmented matrix [A' | b']</span>
              </div>

              {/* Equations List */}
              <div className={styles.equationsList}>
                <span style={{ fontSize: "10px", color: "#64748b", fontWeight: 700 }}>
                  Equations
                </span>
                <span style={{ color: "#2563eb" }}>— {formatEquation(state.system2.row1)}</span>
                <span style={{ color: "#dc2626" }}>— {formatEquation(state.system2.row2)}</span>
              </div>

              {/* Graph 2 */}
              <div className={styles.svgGraphBox}>
                <svg width="220" height="180" viewBox="0 0 220 180">
                  {/* Grid Lines */}
                  {[-4, -2, 0, 2, 4].map((val) => (
                    <g key={`grid2-${val}`}>
                      <line
                        x1={toSvgX(val)}
                        y1={toSvgY(-4)}
                        x2={toSvgX(val)}
                        y2={toSvgY(4)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.2 : 1}
                      />
                      <line
                        x1={toSvgX(-4)}
                        y1={toSvgY(val)}
                        x2={toSvgX(4)}
                        y2={toSvgY(val)}
                        stroke={val === 0 ? "#475569" : "#f1f5f9"}
                        strokeWidth={val === 0 ? 1.2 : 1}
                      />
                      {val !== 0 && (
                        <>
                          <text
                            x={toSvgX(val) - 4}
                            y={toSvgY(0) + 12}
                            fontSize="8"
                            fill="#64748b"
                          >
                            {val}
                          </text>
                          <text
                            x={toSvgX(0) - 12}
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
                  <text x="210" y={toSvgY(0) + 12} fontSize="9" fill="#475569" fontWeight="700">
                    x
                  </text>
                  <text x={toSvgX(0) + 4} y="12" fontSize="9" fill="#475569" fontWeight="700">
                    y
                  </text>

                  {/* Line 1 (Blue) */}
                  <line
                    x1={toSvgX(sys2Line1.x1)}
                    y1={toSvgY(sys2Line1.y1)}
                    x2={toSvgX(sys2Line1.x2)}
                    y2={toSvgY(sys2Line1.y2)}
                    stroke="#2563eb"
                    strokeWidth="2"
                  />

                  {/* Line 2 (Red) */}
                  <line
                    x1={toSvgX(sys2Line2.x1)}
                    y1={toSvgY(sys2Line2.y1)}
                    x2={toSvgX(sys2Line2.x2)}
                    y2={toSvgY(sys2Line2.y2)}
                    stroke="#dc2626"
                    strokeWidth="2"
                  />

                  {/* Intersection point */}
                  {sol2.intersection && (
                    <g>
                      <circle
                        cx={toSvgX(sol2.intersection.x)}
                        cy={toSvgY(sol2.intersection.y)}
                        r="6"
                        fill="#7c3aed"
                      />
                      <circle
                        cx={toSvgX(sol2.intersection.x)}
                        cy={toSvgY(sol2.intersection.y)}
                        r="10"
                        fill="none"
                        stroke="#a78bfa"
                        strokeWidth="1.5"
                      />
                    </g>
                  )}
                </svg>

                {/* Solution Badge Card */}
                {sol2.intersection && (
                  <div className={styles.solutionBadgeCard}>
                    <span>Same solution</span>
                    <span>
                      ({sol2.intersection.x.toFixed(0)}, {sol2.intersection.y.toFixed(0)}) ✓
                    </span>
                  </div>
                )}
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
                  <div className={styles.stepInstructionTitle}>
                    Row operations produce an equivalent system.
                  </div>
                </div>
                <p className={styles.stepInstructionText}>
                  They change equations' form, not the solution set.
                </p>
              </div>

              {/* Step 2 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>
                    Each operation corresponds to a legal transformation of lines.
                  </div>
                </div>
                <p className={styles.stepInstructionText}>
                  Swap, add a multiple — intersections are preserved.
                </p>
              </div>

              {/* Step 3 */}
              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>
                    Thus, the intersection is unchanged.
                  </div>
                </div>
                <p className={styles.stepInstructionText}>
                  Same solution satisfies both systems.
                </p>
              </div>
            </div>

            {/* Predict Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>❓</span>
                <span>Predict</span>
              </div>
              <div style={{ fontSize: "11px", color: "#475569" }}>
                After swapping rows, where is the solution?
              </div>

              <div className={styles.predictOptionsList}>
                {PREDICT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    className={`${styles.predictOptionBtn} ${
                      state.predictChoice === opt.id ? styles.predictOptionBtnActive : ""
                    }`}
                    onClick={() => {
                      dispatch({
                        type: "SET_PREDICT_CHOICE",
                        payload: opt.id as "A" | "B" | "C",
                      });
                      dispatch({ type: "CHECK_PREDICT" });
                    }}
                  >
                    <span>
                      ({opt.id}) {opt.label}
                    </span>
                    {state.predictChoice === opt.id && <span>✓</span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Reveal Card */}
            <div className={styles.revealCard}>
              <div className={styles.cardHeader}>
                <span>👁</span>
                <span>Reveal</span>
              </div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "#1e1b4b" }}>
                The solution remains (2, 1).
              </div>
              <div style={{ fontSize: "10px", color: "#64748b" }}>
                Row operations preserve the solution set.
              </div>
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  color: "#166534",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  fontWeight: 800,
                  alignSelf: "flex-end",
                }}
              >
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof + Challenge + Steps */}
        <div className={styles.bottomGrid}>
          {/* Card 1: Visual Proof Pipeline */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>Visual Proof</span>
            </div>

            <div className={styles.visualProofFlow}>
              {/* Augmented Matrix */}
              <div style={{ textAlign: "center" }}>
                <InlineMath math="[A \mid b]" />
                <div style={{ fontSize: "8px", color: "#64748b" }}>Ax = b</div>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Elementary Matrix */}
              <div style={{ textAlign: "center" }}>
                <InlineMath math="E" />
                <div style={{ fontSize: "8px", color: "#64748b" }}>Elementary matrix</div>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* EAx = Eb */}
              <div style={{ textAlign: "center" }}>
                <InlineMath math="EAx = Eb" />
                <div style={{ fontSize: "8px", color: "#64748b" }}>
                  <InlineMath math="A'x = b'" />
                </div>
              </div>

              <span style={{ color: "#6366f1", fontWeight: 700 }}>➔</span>

              {/* Same intersection */}
              <div style={{ textAlign: "center" }}>
                <span style={{ fontSize: "14px" }}>✕</span>
                <div style={{ fontSize: "8px", color: "#166534", fontWeight: 700 }}>
                  Same intersection
                </div>
              </div>
            </div>

            <div className={styles.elementaryNoteBox}>
              Elementary row operations left-multiply by E. Since E is <strong>invertible</strong>,
              solutions are unchanged.
            </div>
          </div>

          {/* Card 2: Your Challenge */}
          <div className={styles.bottomPanelCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#eab308" }}>🏆</span>
              <span>Your Challenge</span>
            </div>

            <div style={{ fontSize: "11px", color: "#475569" }}>
              Make the systems equivalent using allowed row operations.
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "11px", fontWeight: 700 }}>Target:</span>
              <InlineMath
                math={`\\begin{bmatrix} ${DEFAULT_CHALLENGE_TARGET.row1.a} & ${DEFAULT_CHALLENGE_TARGET.row1.b} & ${DEFAULT_CHALLENGE_TARGET.row1.c} \\\\ ${DEFAULT_CHALLENGE_TARGET.row2.a} & ${DEFAULT_CHALLENGE_TARGET.row2.b} & ${DEFAULT_CHALLENGE_TARGET.row2.c} \\end{bmatrix}`}
              />
            </div>

            <button
              className={styles.challengeCheckBtn}
              onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
            >
              Check my steps
            </button>

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
                  ? "✓ Correct! Systems are equivalent."
                  : "✗ Check your steps to reach the target matrix."}
              </div>
            )}
          </div>

          {/* Card 3: Steps List */}
          <div className={styles.bottomPanelCard}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: "#1e1b4b" }}>Steps</span>
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() => dispatch({ type: "RESET_CHALLENGE_STEPS" })}
              >
                ⟲
              </button>
            </div>

            <div className={styles.stepsList}>
              <div className={styles.stepSlotItem}>
                <span className={styles.stepNumberCircle}>1</span>
                <span>
                  {state.challengeSteps[0] ? (
                    <InlineMath math={state.challengeSteps[0].label} />
                  ) : (
                    "—"
                  )}
                </span>
              </div>

              <div className={styles.stepSlotItem}>
                <span className={styles.stepNumberCircle}>2</span>
                <span>
                  {state.challengeSteps[1] ? (
                    <InlineMath math={state.challengeSteps[1].label} />
                  ) : (
                    ""
                  )}
                </span>
              </div>

              <div className={styles.stepSlotItem}>
                <span className={styles.stepNumberCircle}>3</span>
                <span>
                  {state.challengeSteps[2] ? (
                    <InlineMath math={state.challengeSteps[2].label} />
                  ) : (
                    ""
                  )}
                </span>
              </div>
            </div>
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

import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./MatrixMultiplicationRowColumnProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./matrix-multiplication-row-columnConfig";
import {
  computePairwiseProducts,
  formatDotProductTex,
  formatTargetEntryTex,
} from "./matrix-multiplication-row-columnMath";
import {
  initialState,
  matrixMultReducer,
} from "./matrix-multiplication-row-columnReducer";
import { evaluateMultProofProgress } from "./matrix-multiplication-row-columnCompletion";

export default function MatrixMultiplicationRowColumnProofPage() {
  const [state, dispatch] = useReducer(matrixMultReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateMultProofProgress(state), [state]);
  const pairwiseTerms = useMemo(
    () => computePairwiseProducts(state.selectedRow, state.selectedCol),
    [state.selectedRow, state.selectedCol],
  );
  const dotProductTex = useMemo(
    () => formatDotProductTex(state.selectedRow, state.selectedCol),
    [state.selectedRow, state.selectedCol],
  );
  const targetEntryTex = useMemo(
    () => formatTargetEntryTex(state.selectedRow, state.selectedCol),
    [state.selectedRow, state.selectedCol],
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

  // Top positions for row capsule in Matrix A: row 1 -> 8px, row 2 -> 58px, row 3 -> 108px
  const rowCapsuleTop = 8 + (state.selectedRow - 1) * 50;
  // Left positions for col capsule in Matrix B: col 1 -> 12px, col 2 -> 66px, col 3 -> 120px
  const colCapsuleLeft = 12 + (state.selectedCol - 1) * 54;

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Matrix Multiplication as Row-by-Column Dot Product workspace"
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
            <button className={styles.iconBtnSmall} aria-label="Theme toggle">
              ☀️
            </button>
            <button className={styles.iconBtnSmall} aria-label="Menu">
              ☰
            </button>
          </div>
        </header>

        {/* Control Toolbar */}
        <section className={styles.controlToolbar} aria-label="Selection Controls">
          <button className={styles.selectBtn}>
            <span>↖</span>
            <span>Select</span>
          </button>

          <div className={styles.selectorGroup}>
            <span>Row of A</span>
            {[1, 2, 3].map((r) => (
              <button
                key={`row-${r}`}
                className={`${styles.selectorPill} ${
                  state.selectedRow === r ? styles.selectorPillActive : ""
                }`}
                onClick={() => dispatch({ type: "SELECT_ROW", payload: r })}
                aria-label={`Select Row ${r}`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className={styles.selectorGroup}>
            <span>Column of B</span>
            {[1, 2, 3].map((c) => (
              <button
                key={`col-${c}`}
                className={`${styles.selectorPill} ${
                  state.selectedCol === c ? styles.selectorPillActive : ""
                }`}
                onClick={() => dispatch({ type: "SELECT_COL", payload: c })}
                aria-label={`Select Column ${c}`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className={styles.toggleContainer}>
            <span>Highlight products</span>
            <div
              className={`${styles.toggleSwitch} ${
                !state.highlightProducts ? styles.toggleSwitchOff : ""
              }`}
              onClick={() => dispatch({ type: "TOGGLE_HIGHLIGHT_PRODUCTS" })}
              role="switch"
              aria-checked={state.highlightProducts}
              tabIndex={0}
            >
              <div
                className={`${styles.toggleKnob} ${
                  !state.highlightProducts ? styles.toggleKnobOff : ""
                }`}
              />
            </div>
          </div>

          <button
            className={styles.resetBtn}
            onClick={() => dispatch({ type: "RESET" })}
            aria-label="Reset state"
          >
            <span>⟲</span>
            <span>Reset</span>
          </button>
        </section>

        {/* Center Grid: Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Matrix Multiplication Flow Canvas */}
          <section className={styles.workspaceCard}>
            <div className={styles.equationRowFlow}>
              {/* Matrix A */}
              <div className={styles.matrixColWrapper}>
                <span className={styles.matrixTitle}>Matrix A (m × n)</span>
                <div className={styles.matrixBracketBox}>
                  {state.highlightProducts && (
                    <div
                      className={styles.highlightRowCapsule}
                      style={{ top: `${rowCapsuleTop}px` }}
                    />
                  )}
                  {[1, 2, 3].map((r) =>
                    [1, 2, 3].map((c) => (
                      <div
                        key={`a-${r}-${c}`}
                        className={styles.symbolCell}
                        onClick={() => dispatch({ type: "SELECT_ROW", payload: r })}
                        title={`Row ${r}, Column ${c}: a_${r}${c}`}
                      >
                        <InlineMath math={`a_{${r}${c}}`} />
                      </div>
                    )),
                  )}
                </div>
                <div className={styles.dimensionPill}>
                  Row {state.selectedRow} 1 × n
                </div>
              </div>

              {/* Operator Times */}
              <div className={styles.operatorTimes}>×</div>

              {/* Matrix B */}
              <div className={styles.matrixColWrapper}>
                <span className={styles.matrixTitle}>Matrix B (n × p)</span>
                <div className={styles.matrixBracketBox}>
                  {state.highlightProducts && (
                    <div
                      className={styles.highlightColCapsule}
                      style={{ left: `${colCapsuleLeft}px` }}
                    />
                  )}
                  {[1, 2, 3].map((r) =>
                    [1, 2, 3].map((c) => (
                      <div
                        key={`b-${r}-${c}`}
                        className={styles.symbolCell}
                        onClick={() => dispatch({ type: "SELECT_COL", payload: c })}
                        title={`Row ${r}, Column ${c}: b_${r}${c}`}
                      >
                        <InlineMath math={`b_{${r}${c}}`} />
                      </div>
                    )),
                  )}
                </div>
                <div className={styles.dimensionPill}>
                  Column {state.selectedCol} n × 1
                </div>
              </div>

              {/* Pairwise Products Column */}
              <div className={styles.pairwiseColumnCard}>
                <span className={styles.pairwiseHeader}>
                  Pairwise products
                  <br />
                  (row {state.selectedRow} • column {state.selectedCol})
                </span>

                <div className={styles.pairwisePill}>
                  <InlineMath math={pairwiseTerms[0].productTex} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1" }}>+</span>
                <div className={styles.pairwisePill}>
                  <InlineMath math={pairwiseTerms[1].productTex} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1" }}>+</span>
                <div className={styles.pairwisePill}>
                  <InlineMath math={pairwiseTerms[2].productTex} />
                </div>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#6366f1" }}>=</span>

                <div className={styles.sumResultPill}>
                  <InlineMath math={targetEntryTex} />
                  <span className={styles.sumUnderlabel}>Sum</span>
                </div>
              </div>

              {/* Product AB Matrix */}
              <div className={styles.matrixColWrapper}>
                <span className={styles.matrixTitle}>Product AB (m × p)</span>
                <div className={styles.matrixBracketBox}>
                  {[1, 2, 3].map((r) =>
                    [1, 2, 3].map((c) => {
                      const isTarget =
                        state.selectedRow === r && state.selectedCol === c;
                      return (
                        <div
                          key={`ab-${r}-${c}`}
                          className={`${styles.symbolCell} ${
                            isTarget ? styles.highlightTargetCell : ""
                          }`}
                          onClick={() =>
                            dispatch({
                              type: "SET_ROW_AND_COL",
                              payload: { row: r, col: c },
                            })
                          }
                          title={`Product entry (AB)_${r}${c}`}
                        >
                          <InlineMath math={`(AB)_{${r}${c}}`} />
                        </div>
                      );
                    }),
                  )}
                </div>
                <div className={styles.dimensionPill}>
                  Entry ({state.selectedRow}, {state.selectedCol})
                </div>
              </div>
            </div>

            {/* SVG Connecting Flow Lines */}
            {state.highlightProducts && (
              <svg className={styles.flowSvgOverlay} viewBox="0 0 740 260">
                {/* Arrow from Matrix A Row to Pairwise */}
                <path
                  d="M 170 60 Q 260 20, 340 70"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <polygon points="345,70 338,64 338,76" fill="#8b5cf6" />

                {/* Arrow from Matrix B Col to Pairwise */}
                <path
                  d="M 270 120 Q 300 110, 335 110"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                />
                <polygon points="340,110 333,105 333,115" fill="#8b5cf6" />

                {/* Arrow from Sum to Product AB */}
                <path
                  d="M 440 180 Q 480 180, 520 120"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2"
                />
                <polygon points="520,115 514,124 524,124" fill="#22c55e" />
              </svg>
            )}

            {/* Bottom Explanation Bar */}
            <div className={styles.explanationBar}>
              Each entry (i, j) of AB is the dot product of row i of A with column j of B.
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

              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>1</div>
                  <div className={styles.stepInstructionTitle}>Choose position (i, j)</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Select row <InlineMath math="i" /> of <InlineMath math="A" /> and column{" "}
                  <InlineMath math="j" /> of <InlineMath math="B" />.
                </p>
                <div style={{ textAlign: "center", padding: "4px 0" }}>
                  <InlineMath math="\begin{bmatrix} \cdots & \text{row } i & \cdots \end{bmatrix} \cdot \begin{bmatrix} \vdots \\ \text{col } j \\ \vdots \end{bmatrix}" />
                </div>
              </div>

              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>2</div>
                  <div className={styles.stepInstructionTitle}>Multiply & add</div>
                </div>
                <p className={styles.stepInstructionText}>
                  Multiply corresponding entries and add the results.
                </p>
                <div style={{ fontSize: "11px", textAlign: "center", padding: "2px 0" }}>
                  <InlineMath math="a_{i1}b_{1j} + a_{i2}b_{2j} + \dots + a_{in}b_{nj}" />
                </div>
              </div>

              <div className={styles.whyStepItem}>
                <div className={styles.whyStepHeader}>
                  <div className={styles.stepNumberCircle}>3</div>
                  <div className={styles.stepInstructionTitle}>Place in AB</div>
                </div>
                <p className={styles.stepInstructionText}>
                  The sum is the entry <InlineMath math="(i, j)" /> of <InlineMath math="AB" />.
                </p>
                <div style={{ textAlign: "center", fontSize: "11px" }}>
                  <InlineMath math="(AB)_{ij} = \sum_{k=1}^n a_{ik}b_{kj}" />
                </div>
              </div>
            </div>

            {/* Predict then Reveal Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🔮</span>
                <span>Predict then reveal</span>
              </div>
              <div className={styles.predictPrompt}>
                Predict <InlineMath math={`(AB)_{${state.selectedRow}${state.selectedCol}}`} />, then reveal.
              </div>
              <input
                type="text"
                placeholder="Type your expression..."
                className={styles.predictInput}
                value={state.predictionInput}
                onChange={(e) =>
                  dispatch({ type: "SET_PREDICTION_INPUT", payload: e.target.value })
                }
              />
              <button
                className={styles.revealBtn}
                onClick={() => dispatch({ type: "TOGGLE_PREDICTION_REVEAL" })}
              >
                <span>👁</span>
                <span>{state.predictionRevealed ? "Hide Formula" : "Reveal"}</span>
              </button>

              {state.predictionRevealed && (
                <div
                  style={{
                    background: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    textAlign: "center",
                  }}
                >
                  <InlineMath
                    math={`(AB)_{${state.selectedRow}${state.selectedCol}} = ${dotProductTex}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof Flow + Challenge */}
        <div className={styles.bottomGrid}>
          {/* Visual Proof Flow Card */}
          <div className={styles.visualProofCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>Visual Proof</span>
            </div>

            <div className={styles.visualProofFlowRow}>
              {/* Step 1 */}
              <div className={styles.stepBlock}>
                <div className={styles.stepBlockLabel}>Row 1 of A</div>
                <div className={styles.rowPillSmall}>
                  <InlineMath math="a_{11} \quad a_{12} \quad a_{13}" />
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 2 */}
              <div className={styles.stepBlock}>
                <div className={styles.stepBlockLabel}>Pick column 2 of B</div>
                <div className={styles.colPillSmall}>
                  <InlineMath math="b_{12}" />
                  <InlineMath math="b_{22}" />
                  <InlineMath math="b_{32}" />
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 3 */}
              <div className={styles.stepBlock}>
                <div className={styles.stepBlockLabel}>Multiply pairwise</div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    fontSize: "10px",
                  }}
                >
                  <InlineMath math="a_{11} \times b_{12}" />
                  <InlineMath math="a_{12} \times b_{22}" />
                  <InlineMath math="a_{13} \times b_{32}" />
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 4 */}
              <div className={styles.stepBlock}>
                <div className={styles.stepBlockLabel}>Add the products</div>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "4px 8px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    fontSize: "10px",
                  }}
                >
                  <div>
                    <InlineMath math="a_{11} \times b_{12}" /> +
                  </div>
                  <div>
                    <InlineMath math="a_{12} \times b_{22}" /> +
                  </div>
                  <div>
                    <InlineMath math="a_{13} \times b_{32}" />
                  </div>
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 5 */}
              <div className={styles.stepBlock}>
                <div className={styles.stepBlockLabel}>Entry (1, 2) of AB</div>
                <div
                  style={{
                    background: "#dcfce7",
                    border: "1.5px solid #22c55e",
                    borderRadius: "8px",
                    padding: "6px 12px",
                    fontWeight: 800,
                    color: "#166534",
                  }}
                >
                  <InlineMath math="(AB)_{12}" />
                </div>
              </div>
            </div>
          </div>

          {/* Challenge Card */}
          <div className={styles.challengeCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Challenge</span>
            </div>
            <div style={{ fontSize: "12px", color: "#475569" }}>
              Compute <InlineMath math="(AB)_{23}" /> using the same idea.
            </div>

            <div className={styles.challengeSelectsRow}>
              <div className={styles.selectField}>
                <span>Row of A</span>
                <select
                  className={styles.selectDropdown}
                  value={state.challengeRow}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_ROW",
                      payload: parseInt(e.target.value, 10),
                    })
                  }
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>

              <div className={styles.selectField}>
                <span>Column of B</span>
                <select
                  className={styles.selectDropdown}
                  value={state.challengeCol}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_COL",
                      payload: parseInt(e.target.value, 10),
                    })
                  }
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
            </div>

            <button
              className={styles.startChallengeBtn}
              onClick={() => dispatch({ type: "START_CHALLENGE" })}
            >
              <span>▶</span>
              <span>Start challenge</span>
            </button>

            {state.challengeStarted && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: state.challengeCompleted ? "#166534" : "#dc2626",
                  background: state.challengeCompleted ? "#f0fdf4" : "#fef2f2",
                  padding: "6px 10px",
                  borderRadius: "8px",
                  textAlign: "center",
                }}
              >
                {state.challengeCompleted
                  ? "✓ Correct! Row 2 × Col 3 forms (AB)_23."
                  : "✗ Set Row=2 and Column=3 to compute (AB)_23."}
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

        {/* Footer Mission Banner */}
        <div className={styles.missionFooterBanner}>
          Mission: Make the logic of maths visible.
        </div>
      </main>
    </div>
  );
}

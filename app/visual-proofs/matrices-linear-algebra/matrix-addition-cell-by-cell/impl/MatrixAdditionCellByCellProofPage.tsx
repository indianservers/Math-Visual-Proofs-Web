import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./MatrixAdditionCellByCellProofPage.module.css";
import {
  PROOF_META,
  PROOF_STEPS,
  HINTS,
} from "./matrix-addition-cell-by-cellConfig";
import {
  formatCellSumString,
  formatCellSumExpression,
  addMatrices,
} from "./matrix-addition-cell-by-cellMath";
import {
  initialState,
  matrixProofReducer,
} from "./matrix-addition-cell-by-cellReducer";
import { evaluateMatrixProofProgress } from "./matrix-addition-cell-by-cellCompletion";

export default function MatrixAdditionCellByCellProofPage() {
  const [state, dispatch] = useReducer(matrixProofReducer, initialState);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const progress = useMemo(() => evaluateMatrixProofProgress(state), [state]);
  const fullResultMatrix = useMemo(
    () => addMatrices(state.matrixA, state.matrixB)!,
    [state.matrixA, state.matrixB],
  );

  useEffect(() => {
    document.title = `${PROOF_META.title} — Maths Universe Visual Proofs`;
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      dispatch({ type: "SELECT_CELL", payload: { row: 0, col: 0 } });
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

  const selectedA = state.matrixA.data[state.selectedCell.row][state.selectedCell.col];
  const selectedB = state.matrixB.data[state.selectedCell.row][state.selectedCell.col];
  const selectedSumStr = formatCellSumString(selectedA, selectedB);

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Matrix Addition as Cell-by-Cell Addition visual proof workspace"
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
            <div className={styles.breadcrumbs}>Visual Proofs / Algebra</div>
            <h1 className={styles.title}>{PROOF_META.title}</h1>
            <p className={styles.subtitle}>{PROOF_META.subtitle}</p>
          </div>
          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <button className={styles.helpCircleBtn} aria-label="Help & Guide">
              ?
            </button>
          </div>
        </header>

        {/* Mission & Legend Strip */}
        <section className={styles.missionCard} aria-label="Mission & Legend">
          <div className={styles.missionLeft}>
            <div className={styles.targetIconBadge}>🎯</div>
            <div className={styles.missionTextGroup}>
              <span className={styles.missionTitle}>Build C = A + B</span>
              <span className={styles.missionSubtitle}>
                Drag a sum cell into each dashed target to complete the result matrix.
              </span>
            </div>
          </div>

          <div className={styles.legendChips}>
            <div className={styles.legendChipA}>
              <span style={{ fontWeight: 800 }}>A</span>
              <span>Matrix A</span>
            </div>
            <div className={styles.legendChipB}>
              <span style={{ fontWeight: 800 }}>B</span>
              <span>Matrix B</span>
            </div>
            <div className={styles.legendChipSum}>
              <span>A + B</span>
              <span style={{ fontSize: "10px", color: "#6d28d9" }}>Sum cell</span>
            </div>
            <div className={styles.legendChipTarget}>
              <span>Target cell</span>
            </div>
          </div>
        </section>

        {/* Center Grid: Main Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Matrix Addition Canvas */}
          <section className={styles.workspaceCard}>
            <div className={styles.matrixEquationRow}>
              {/* Matrix A */}
              <div className={styles.matrixWrapper}>
                <span className={styles.matrixTitleA}>Matrix A</span>
                <div className={styles.matrixContainer}>
                  <div className={styles.colLabelsRow}>
                    <div className={styles.colLabel}>1</div>
                    <div className={styles.colLabel}>2</div>
                    <div className={styles.colLabel}>3</div>
                  </div>
                  <div className={styles.matrixBodyWithRowLabels}>
                    <div className={styles.rowLabelsCol}>
                      <div className={styles.rowLabel}>1</div>
                      <div className={styles.rowLabel}>2</div>
                    </div>
                    <div className={styles.bracketBoxA}>
                      {state.matrixA.data.map((rowArr, r) =>
                        rowArr.map((val, c) => {
                          const isSelected =
                            state.selectedCell.row === r && state.selectedCell.col === c;
                          return (
                            <div
                              key={`a-${r}-${c}`}
                              className={`${styles.cellTileA} ${
                                isSelected ? styles.cellTileSelectedA : ""
                              }`}
                              onClick={() =>
                                dispatch({ type: "SELECT_CELL", payload: { row: r, col: c } })
                              }
                              title={`A(${r + 1}, ${c + 1}) = ${val}`}
                            >
                              {val}
                            </div>
                          );
                        }),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operator Plus */}
              <div className={styles.operatorSymbol}>+</div>

              {/* Matrix B */}
              <div className={styles.matrixWrapper}>
                <span className={styles.matrixTitleB}>Matrix B</span>
                <div className={styles.matrixContainer}>
                  <div className={styles.colLabelsRow}>
                    <div className={styles.colLabel}>1</div>
                    <div className={styles.colLabel}>2</div>
                    <div className={styles.colLabel}>3</div>
                  </div>
                  <div className={styles.matrixBodyWithRowLabels}>
                    <div className={styles.rowLabelsCol}>
                      <div className={styles.rowLabel}>1</div>
                      <div className={styles.rowLabel}>2</div>
                    </div>
                    <div className={styles.bracketBoxB}>
                      {state.matrixB.data.map((rowArr, r) =>
                        rowArr.map((val, c) => {
                          const isSelected =
                            state.selectedCell.row === r && state.selectedCell.col === c;
                          return (
                            <div
                              key={`b-${r}-${c}`}
                              className={`${styles.cellTileB} ${
                                isSelected ? styles.cellTileSelectedB : ""
                              }`}
                              onClick={() =>
                                dispatch({ type: "SELECT_CELL", payload: { row: r, col: c } })
                              }
                              title={`B(${r + 1}, ${c + 1}) = ${val}`}
                            >
                              {val}
                            </div>
                          );
                        }),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operator Equals */}
              <div className={styles.operatorSymbol}>=</div>

              {/* Matrix C */}
              <div className={styles.matrixWrapper}>
                <span className={styles.matrixTitleC}>Matrix C = A + B</span>
                <div className={styles.matrixContainer}>
                  <div className={styles.colLabelsRow}>
                    <div className={styles.colLabel}>1</div>
                    <div className={styles.colLabel}>2</div>
                    <div className={styles.colLabel}>3</div>
                  </div>
                  <div className={styles.matrixBodyWithRowLabels}>
                    <div className={styles.rowLabelsCol}>
                      <div className={styles.rowLabel}>1</div>
                      <div className={styles.rowLabel}>2</div>
                    </div>
                    <div className={styles.bracketBoxC}>
                      {Array.from({ length: 2 }, (_, r) =>
                        Array.from({ length: 3 }, (_, c) => {
                          const key = `${r},${c}`;
                          const isPlaced = state.placedCells[key] !== undefined;
                          const placedVal = state.placedCells[key];
                          const isSelected =
                            state.selectedCell.row === r && state.selectedCell.col === c;

                          if (isPlaced) {
                            return (
                              <div
                                key={`c-${r}-${c}`}
                                className={styles.cellTilePlacedC}
                                onClick={() =>
                                  dispatch({
                                    type: "SELECT_CELL",
                                    payload: { row: r, col: c },
                                  })
                                }
                                title={`C(${r + 1}, ${c + 1}) = ${placedVal}`}
                              >
                                {placedVal}
                              </div>
                            );
                          }

                          return (
                            <div
                              key={`c-${r}-${c}`}
                              className={`${styles.cellTargetDashed} ${
                                isSelected ? styles.cellTargetSelected : ""
                              }`}
                              onClick={() => {
                                dispatch({
                                  type: "PLACE_CELL",
                                  payload: { row: r, col: c },
                                });
                              }}
                              title={`Click to compute C(${r + 1}, ${c + 1})`}
                            />
                          );
                        }),
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Canvas Actions */}
              <div className={styles.canvasActions}>
                <button
                  className={styles.canvasBtn}
                  onClick={() => dispatch({ type: "CLEAR_C" })}
                  aria-label="Clear Matrix C"
                >
                  <span>⟲</span>
                  <span>Clear C</span>
                </button>
                <button
                  className={styles.canvasBtn}
                  onClick={() => dispatch({ type: "AUTO_FILL_ALL" })}
                  aria-label="Check and auto-fill"
                >
                  <span>✓</span>
                  <span>Check</span>
                </button>
                <button
                  className={styles.canvasBtn}
                  onClick={() => dispatch({ type: "TOGGLE_SHOW_PATH" })}
                  aria-label="Toggle trajectory path"
                >
                  <span>👁</span>
                  <span>{state.showPath ? "Hide Path" : "Show Path"}</span>
                </button>
              </div>
            </div>

            {/* SVG Curved Trajectory Path */}
            {state.showPath && (
              <svg className={styles.pathSvgOverlay} viewBox="0 0 700 240">
                <path
                  d="M 120 75 Q 220 120, 275 75 T 460 75"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                />
                <polygon points="465,75 455,70 455,80" fill="#8b5cf6" />
              </svg>
            )}

            {/* Bottom Rule Strip */}
            <div className={styles.ruleStrip}>
              <div className={styles.ruleLeft}>
                <span className={styles.ruleBulb}>💡</span>
                <span>Rule: Add the entries in the same position.</span>
              </div>
              <div className={styles.rulePillBox}>
                <div className={styles.equationPill}>
                  <InlineMath math={selectedSumStr} />
                </div>
                <div className={styles.positionPill}>
                  goes to position ({state.selectedCell.row + 1}, {state.selectedCell.col + 1})
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

              <div className={styles.whyStepsList}>
                {/* Step 1 */}
                <div className={styles.whyStepItem}>
                  <div className={styles.whyStepHeader}>
                    <div className={styles.stepNumberCircle}>1</div>
                    <div className={styles.stepInstructionTitle}>Same dimensions</div>
                  </div>
                  <p className={styles.stepInstructionText}>
                    <InlineMath math="A" /> and <InlineMath math="B" /> are both{" "}
                    <InlineMath math="2 \times 3" />, so their sum is defined.
                  </p>
                  <div className={styles.gridMatchDiagram}>
                    <div className={styles.miniGridA} />
                    <span style={{ fontSize: "14px", fontWeight: 800 }}>=</span>
                    <div className={styles.miniGridB} />
                    <div className={styles.checkMarkCircle}>✓</div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={styles.whyStepItem}>
                  <div className={styles.whyStepHeader}>
                    <div className={styles.stepNumberCircle}>2</div>
                    <div className={styles.stepInstructionTitle}>Cell-by-cell rule</div>
                  </div>
                  <p className={styles.stepInstructionText}>
                    Add the entries in the same position.
                  </p>
                  <div className={styles.algebraicRuleRow}>
                    <div className={styles.pillAij}>
                      <InlineMath math="a_{ij}" />
                    </div>
                    <span>+</span>
                    <div className={styles.pillBij}>
                      <InlineMath math="b_{ij}" />
                    </div>
                    <span>=</span>
                    <div className={styles.pillCij}>
                      <InlineMath math="c_{ij}" />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={styles.whyStepItem}>
                  <div className={styles.whyStepHeader}>
                    <div className={styles.stepNumberCircle}>3</div>
                    <div className={styles.stepInstructionTitle}>Result matrix</div>
                  </div>
                  <p className={styles.stepInstructionText}>
                    Placing each sum in the same position gives{" "}
                    <InlineMath math="C = A + B" />.
                  </p>
                </div>
              </div>
            </div>

            {/* Predict Card */}
            <div className={styles.predictCard}>
              <div className={styles.cardHeader}>
                <span>🪄</span>
                <span>Predict</span>
              </div>
              <div className={styles.predictPrompt}>
                What should go in <InlineMath math="C(2, 3)" />?
              </div>
              <div className={styles.predictInputRow}>
                <input
                  type="text"
                  placeholder="Enter your answer"
                  value={state.predictionInput}
                  onChange={(e) =>
                    dispatch({ type: "SET_PREDICTION_INPUT", payload: e.target.value })
                  }
                  className={styles.predictInput}
                />
                <button
                  className={styles.predictCheckBtn}
                  onClick={() => dispatch({ type: "CHECK_PREDICTION" })}
                >
                  Check
                </button>
              </div>
              {state.predictionChecked && (
                <div
                  style={{
                    fontSize: "12px",
                    fontWeight: "600",
                    color: state.predictionCorrect ? "#166534" : "#dc2626",
                    background: state.predictionCorrect ? "#f0fdf4" : "#fef2f2",
                    padding: "6px 10px",
                    borderRadius: "8px",
                  }}
                >
                  {state.predictionCorrect
                    ? "✓ Correct! C(2, 3) = 5 + 2 = 7."
                    : "✗ Try again: A(2, 3)=5, B(2, 3)=2."}
                </div>
              )}
            </div>

            {/* Reveal Proof Button */}
            <button
              className={styles.revealProofBtn}
              onClick={() => dispatch({ type: "TOGGLE_REVEAL_PROOF" })}
            >
              <span>👁</span>
              <span>{state.revealFullProof ? "Hide Full Proof" : "Reveal proof"}</span>
            </button>
          </div>
        </div>

        {/* Bottom Grid: Visual Proof + Exact Challenge */}
        <div className={styles.bottomGrid}>
          {/* Visual Proof Card */}
          <div className={styles.visualProofCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#6366f1" }}>✨</span>
              <span>Visual Proof</span>
            </div>

            <div className={styles.visualProofStepper}>
              {/* Step 1 */}
              <div className={styles.visualProofStepCol}>
                <div className={styles.visualProofStepLabel}>
                  (1) Add corresponding cells
                </div>
                <div className={styles.miniMatrixDisplay}>
                  <InlineMath math="\begin{pmatrix} 1 & -2 & 3 \\ 4 & 0 & 5 \end{pmatrix} + \begin{pmatrix} 2 & 7 & -1 \\ -3 & 6 & 2 \end{pmatrix}" />
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 2 */}
              <div className={styles.visualProofStepCol}>
                <div className={styles.visualProofStepLabel}>(2) Compute the sums</div>
                <div className={styles.miniMatrixDisplay}>
                  <InlineMath
                    math={`\\begin{pmatrix} ${formatCellSumExpression(
                      1,
                      2,
                    )} & ${formatCellSumExpression(-2, 7)} & ${formatCellSumExpression(
                      3,
                      -1,
                    )} \\\\ ${formatCellSumExpression(4, -3)} & ${formatCellSumExpression(
                      0,
                      6,
                    )} & ${formatCellSumExpression(5, 2)} \\end{pmatrix}`}
                  />
                </div>
              </div>

              <div className={styles.arrowRightSymbol}>➔</div>

              {/* Step 3 */}
              <div className={styles.visualProofStepCol}>
                <div className={styles.visualProofStepLabel}>
                  (3) Place sums in the same positions
                </div>
                <div className={styles.miniMatrixDisplay}>
                  <InlineMath
                    math={`\\begin{pmatrix} ${fullResultMatrix.data[0].join(
                      " & ",
                    )} \\\\ ${fullResultMatrix.data[1].join(" & ")} \\end{pmatrix} = C`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Exact Challenge Card */}
          <div className={styles.challengeCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>🎯</span>
              <span>Exact Challenge</span>
            </div>
            <div className={styles.challengePrompt}>
              Complete <InlineMath math="C = A + B" />:
            </div>

            <div className={styles.challengeEquation}>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700 }}>A = </span>
                <InlineMath math="\begin{pmatrix} 3 & -1 \\ 2 & 5 \end{pmatrix}" />
              </div>
              <span style={{ fontWeight: 800 }}>+</span>
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700 }}>B = </span>
                <InlineMath math="\begin{pmatrix} 4 & 6 \\ -1 & 2 \end{pmatrix}" />
              </div>
              <span style={{ fontWeight: 800 }}>=</span>
              <div className={styles.miniGrid2x2Input}>
                <input
                  type="text"
                  placeholder="?"
                  className={styles.cellInput2x2}
                  value={state.challengeCells["0,0"]}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_CELL",
                      payload: { key: "0,0", value: e.target.value },
                    })
                  }
                  title="C(1, 1)"
                />
                <input
                  type="text"
                  placeholder="?"
                  className={styles.cellInput2x2}
                  value={state.challengeCells["0,1"]}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_CELL",
                      payload: { key: "0,1", value: e.target.value },
                    })
                  }
                  title="C(1, 2)"
                />
                <input
                  type="text"
                  placeholder="?"
                  className={styles.cellInput2x2}
                  value={state.challengeCells["1,0"]}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_CELL",
                      payload: { key: "1,0", value: e.target.value },
                    })
                  }
                  title="C(2, 1)"
                />
                <input
                  type="text"
                  placeholder="?"
                  className={styles.cellInput2x2}
                  value={state.challengeCells["1,1"]}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_CHALLENGE_CELL",
                      payload: { key: "1,1", value: e.target.value },
                    })
                  }
                  title="C(2, 2)"
                />
              </div>
            </div>

            <div className={styles.challengeBottomRow}>
              <div style={{ fontSize: "11px", color: "#64748b" }}>
                💡 <strong>Hint:</strong> Remember: same position!
              </div>
              <button
                className={styles.predictCheckBtn}
                onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
              >
                Check
              </button>
            </div>
            {state.challengeChecked && (
              <div
                style={{
                  fontSize: "12px",
                  fontWeight: "700",
                  color: state.challengeCorrect ? "#166534" : "#dc2626",
                }}
              >
                {state.challengeCorrect
                  ? "✓ Correct! Matrix sum is [[7, 5], [1, 7]]."
                  : "✗ Check your arithmetic for each position."}
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
              className={styles.canvasBtn}
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
              className={styles.canvasBtn}
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

        {/* Footer Strip */}
        <footer className={styles.footerStrip}>
          <div className={styles.footerItem}>
            <span>🪐</span>
            <span>Our Mission: Make mathematics visual, interactive and deeply intuitive</span>
          </div>
          <div className={styles.footerItem}>
            <span>🛡️</span>
            <span>Concept: Matrix Addition</span>
          </div>
          <div className={styles.footerItem}>
            <span>⭐</span>
            <span>Skills: Algebraic Reasoning</span>
          </div>
          <div className={styles.footerItem}>
            <span>📊</span>
            <span>Confidence: Building ({progress.completionScore}%)</span>
          </div>
        </footer>
      </main>
    </div>
  );
}

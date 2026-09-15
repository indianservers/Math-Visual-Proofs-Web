import { useCallback, useEffect, useId, useMemo, useReducer, useState } from "react";
import { InlineMath } from "react-katex";
import styles from "./EvenOddPairingProofPage.module.css";
import {
  PROOF_META,
  MODEL_OPTIONS,
  PROOF_STEPS,
  HINTS,
  getCounterTheme,
  DEFAULT_CHALLENGE,
} from "./even-odd-pairingConfig";
import {
  calculateParity,
  computePairSlots,
  computeArrayGrid,
  computeRemainderLaneJumps,
} from "./even-odd-pairingMath";
import {
  initialState,
  proofReducer,
} from "./even-odd-pairingReducer";
import { evaluateProofProgress } from "./even-odd-pairingCompletion";

export default function EvenOddPairingProofPage() {
  const [state, dispatch] = useReducer(proofReducer, initialState);
  const [draggingCounterId, setDraggingCounterId] = useState<number | null>(null);
  const [hoveredSocket, setHoveredSocket] = useState<{ slotIndex: number; socketIndex: 0 | 1 } | null>(null);
  const [activeTab, setActiveTab] = useState("Explore");

  const liveRegionId = useId();
  const parity = useMemo(() => calculateParity(state.n), [state.n]);
  const pairSlots = useMemo(
    () => computePairSlots(state.n, state.placedCounters, state.leftoverCounterId),
    [state.n, state.placedCounters, state.leftoverCounterId],
  );
  const progress = useMemo(() => evaluateProofProgress(state), [state]);
  const arrayGrid = useMemo(() => computeArrayGrid(state.n), [state.n]);
  const remainderJumps = useMemo(() => computeRemainderLaneJumps(state.n), [state.n]);

  // Set document title
  useEffect(() => {
    /* page title managed by host app */
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setDraggingCounterId(null);
        dispatch({ type: "PICK_UP_COUNTER", payload: null });
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        if (e.shiftKey) {
          dispatch({ type: "REDO" });
        } else {
          dispatch({ type: "UNDO" });
        }
      } else if (e.key === "y" && (e.ctrlKey || e.metaKey)) {
        dispatch({ type: "REDO" });
      }
    },
    [],
  );

  // Pointer drag handling
  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    counterId: number,
  ) => {
    e.preventDefault();
    setDraggingCounterId(counterId);
    dispatch({ type: "PICK_UP_COUNTER", payload: counterId });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingCounterId === null) return;

    // Hit-testing drop targets
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    let foundSocket: { slotIndex: number; socketIndex: 0 | 1 } | null = null;

    for (const el of elements) {
      const slotAttr = el.getAttribute("data-slot-index");
      const socketAttr = el.getAttribute("data-socket-index");
      if (slotAttr !== null && socketAttr !== null) {
        foundSocket = {
          slotIndex: parseInt(slotAttr, 10),
          socketIndex: parseInt(socketAttr, 10) as 0 | 1,
        };
        break;
      }
    }
    setHoveredSocket(foundSocket);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (draggingCounterId === null) return;

    if (hoveredSocket) {
      const isOddLastSlot =
        hoveredSocket.slotIndex === Math.ceil(state.n / 2) - 1 && state.n % 2 !== 0;

      if (isOddLastSlot && hoveredSocket.socketIndex === 1) {
        dispatch({ type: "MARK_LEFTOVER", payload: draggingCounterId });
      } else {
        dispatch({
          type: "PLACE_COUNTER",
          payload: {
            counterId: draggingCounterId,
            slotIndex: hoveredSocket.slotIndex,
            socketIndex: hoveredSocket.socketIndex,
          },
        });
      }
    }

    setDraggingCounterId(null);
    setHoveredSocket(null);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  const unplacedCounters = useMemo(() => {
    const placedIds = new Set(
      Object.keys(state.placedCounters).map(Number),
    );
    if (state.leftoverCounterId !== null) {
      placedIds.add(state.leftoverCounterId);
    }
    const allIds = Array.from({ length: state.n }, (_, i) => i + 1);
    const missing = allIds.filter((id) => !placedIds.has(id));
    return missing;
  }, [state.n, state.placedCounters, state.leftoverCounterId]);

  return (
    <div
      className={styles.pageContainer}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Even and Odd Numbers as Pairing Patterns visual proof workspace"
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
        {/* Header Strip */}
        <header className={styles.headerRow}>
          <div className={styles.headerLeft}>
            <div className={styles.breadcrumbs}>Visual Proofs / Number Theory</div>
            <h1 className={styles.title}>{PROOF_META.title}</h1>
            <p className={styles.subtitle}>{PROOF_META.subtitle}</p>
          </div>
          <div className={styles.headerBadges}>
            <span className={styles.badgePill}>{PROOF_META.difficulty}</span>
            <span className={styles.badgePill}>⏱ {PROOF_META.durationMinutes} min</span>
            <span className={styles.badgePill} title="Proof mastery completion score">
              Score: {progress.completionScore}%
            </span>
          </div>
        </header>

        {/* Controls Strip: Number Chooser + Models */}
        <section className={styles.controlStrip} aria-label="Proof Controls">
          <div className={styles.numberChooser}>
            <span>Choose a number</span>
            <div className={styles.stepperContainer}>
              <span className={styles.stepperValue}>{state.n}</span>
              <div className={styles.stepperBtns}>
                <button
                  className={styles.stepperBtn}
                  onClick={() => dispatch({ type: "SET_NUMBER", payload: state.n + 1 })}
                  disabled={state.n >= 24}
                  aria-label="Increase number"
                >
                  ▲
                </button>
                <button
                  className={styles.stepperBtn}
                  onClick={() => dispatch({ type: "SET_NUMBER", payload: state.n - 1 })}
                  disabled={state.n <= 0}
                  aria-label="Decrease number"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>

          <div className={styles.modelSelector}>
            <span>Model</span>
            <div className={styles.modelPills} role="tablist">
              {MODEL_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  role="tab"
                  aria-selected={state.model === opt.id}
                  className={`${styles.modelPill} ${state.model === opt.id ? styles.modelPillActive : ""}`}
                  onClick={() => dispatch({ type: "SELECT_MODEL", payload: opt.id })}
                >
                  <span>
                    {opt.id === "pairs" && "🔗"}
                    {opt.id === "array" && "⊞"}
                    {opt.id === "clock" && "🕒"}
                    {opt.id === "remainder" && "◫"}
                    {opt.id === "factor" && "ᛦ"}
                  </span>
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.controlActions}>
            <button
              className={styles.actionBtnSmall}
              onClick={() => dispatch({ type: "AUTO_PAIR_STEP" })}
              aria-label="Step pair"
              title="Pair one counter step-by-step"
            >
              ▶ Step
            </button>
            <button
              className={styles.actionBtnSmall}
              onClick={() => dispatch({ type: "AUTO_PAIR_ALL" })}
              aria-label="Auto-pair all counters"
            >
              ⚡ Auto-pair
            </button>
            <button
              className={styles.actionBtnSmall}
              onClick={() => dispatch({ type: "UNDO" })}
              disabled={state.history.length === 0}
              aria-label="Undo"
            >
              ↩ Undo
            </button>
            <button
              className={styles.actionBtnSmall}
              onClick={() => dispatch({ type: "REDO" })}
              disabled={state.future.length === 0}
              aria-label="Redo"
            >
              ↪ Redo
            </button>
          </div>
        </section>

        {/* Central Workspace + Right Column */}
        <div className={styles.centerGrid}>
          {/* Main Visual Model Card */}
          <section className={styles.workspaceCard}>
            {state.model === "pairs" && (
              <div className={styles.pairingWorkspaceSplit}>
                {/* Left Counters Subpanel */}
                <div className={styles.countersSubpanel}>
                  <div className={styles.countersHeader}>
                    <span className={styles.countersTitle}>Counters</span>
                    <span className={styles.countersSubtitle}>Drag a counter to the pairs.</span>
                  </div>

                  <div className={styles.countersPool}>
                    {unplacedCounters.map((id) => {
                      const theme = getCounterTheme(id);
                      return (
                        <div
                          key={id}
                          className={styles.counterToken}
                          style={{
                            background: theme.bgGradient,
                            color: theme.textColor,
                            boxShadow: `0 4px 10px ${theme.shadowColor}`,
                          }}
                          onPointerDown={(e) => handlePointerDown(e, id)}
                          onPointerMove={handlePointerMove}
                          onPointerUp={handlePointerUp}
                          role="button"
                          tabIndex={0}
                          aria-label={`Counter ${id}`}
                          onClick={() => {
                            dispatch({ type: "AUTO_PAIR_STEP" });
                          }}
                        >
                          {id}
                        </div>
                      );
                    })}
                    {unplacedCounters.length === 0 && (
                      <div
                        style={{
                          gridColumn: "1 / -1",
                          color: "#94a3b8",
                          fontSize: "12px",
                          textAlign: "center",
                          padding: "20px 0",
                        }}
                      >
                        All {state.n} counters placed!
                      </div>
                    )}
                  </div>

                  <button
                    className={styles.shuffleBtn}
                    onClick={() => dispatch({ type: "SHUFFLE_COUNTERS" })}
                    aria-label="Shuffle counters"
                  >
                    🔀 Shuffle
                  </button>
                </div>

                {/* Right Pairing Area */}
                <div className={styles.pairingSubpanel}>
                  <div className={styles.pairingHeader}>
                    <span className={styles.pairingTitle}>Pairing area (make pairs)</span>
                    <button
                      className={styles.clearBtn}
                      onClick={() => dispatch({ type: "CLEAR_ALL" })}
                      aria-label="Clear all counters"
                    >
                      🗑️ Clear all
                    </button>
                  </div>

                  {/* Grid of Pair Slots */}
                  <div className={styles.pairBoxesGrid}>
                    {pairSlots.map((slot) => {
                      const isComplete = slot.isComplete;

                      return (
                        <div
                          key={slot.slotIndex}
                          className={`${styles.pairBox} ${isComplete ? styles.pairBoxComplete : ""}`}
                        >
                          {isComplete && <div className={styles.checkmarkBadge}>✓</div>}

                          {/* Left Socket */}
                          <div
                            data-slot-index={slot.slotIndex}
                            data-socket-index={0}
                            className={`${styles.socketPlaceholder} ${
                              hoveredSocket?.slotIndex === slot.slotIndex &&
                              hoveredSocket?.socketIndex === 0
                                ? styles.socketHighlight
                                : ""
                            }`}
                            onClick={() => {
                              if (slot.socket0CounterId !== null) {
                                dispatch({
                                  type: "RETURN_TO_BANK",
                                  payload: slot.socket0CounterId,
                                });
                              }
                            }}
                          >
                            {slot.socket0CounterId !== null ? (
                              <div
                                className={styles.counterToken}
                                style={{
                                  background: getCounterTheme(slot.socket0CounterId).bgGradient,
                                  color: getCounterTheme(slot.socket0CounterId).textColor,
                                  boxShadow: `0 4px 10px ${
                                    getCounterTheme(slot.socket0CounterId).shadowColor
                                  }`,
                                }}
                                onPointerDown={(e) =>
                                  handlePointerDown(e, slot.socket0CounterId!)
                                }
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                              >
                                {slot.socket0CounterId}
                              </div>
                            ) : null}
                          </div>

                          {/* Connector Line */}
                          <div className={styles.pairConnectorLine} />

                          {/* Right Socket */}
                          <div
                            data-slot-index={slot.slotIndex}
                            data-socket-index={1}
                            className={`${styles.socketPlaceholder} ${
                              hoveredSocket?.slotIndex === slot.slotIndex &&
                              hoveredSocket?.socketIndex === 1
                                ? styles.socketHighlight
                                : ""
                            }`}
                            onClick={() => {
                              if (slot.socket1CounterId !== null) {
                                dispatch({
                                  type: "RETURN_TO_BANK",
                                  payload: slot.socket1CounterId,
                                });
                              }
                            }}
                          >
                            {slot.socket1CounterId !== null ? (
                              <div
                                className={styles.counterToken}
                                style={{
                                  background: getCounterTheme(slot.socket1CounterId).bgGradient,
                                  color: getCounterTheme(slot.socket1CounterId).textColor,
                                  boxShadow: `0 4px 10px ${
                                    getCounterTheme(slot.socket1CounterId).shadowColor
                                  }`,
                                }}
                                onPointerDown={(e) =>
                                  handlePointerDown(e, slot.socket1CounterId!)
                                }
                                onPointerMove={handlePointerMove}
                                onPointerUp={handlePointerUp}
                              >
                                {slot.socket1CounterId}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}

                    {/* SVG Curved hint arrow when leftover present */}
                    {state.n % 2 !== 0 && state.leftoverCounterId !== null && (
                      <div className={styles.curvedArrowContainer}>
                        <svg
                          width="240"
                          height="80"
                          style={{ position: "absolute", top: "140px", left: "160px" }}
                        >
                          <path
                            d="M 10 30 Q 80 5, 160 30"
                            fill="none"
                            stroke="#8b5cf6"
                            strokeWidth="2.5"
                            strokeDasharray="6 4"
                          />
                          <polygon points="165,30 152,24 154,34" fill="#8b5cf6" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Status Banner */}
                  <div className={styles.statusBanner}>
                    <div className={styles.statusLeft}>
                      <div className={styles.bulbIcon}>💡</div>
                      <div className={styles.statusText}>
                        {state.n % 2 === 0 ? (
                          <>
                            All counters form complete pairs.{" "}
                            <span className={styles.statusTextBold}>{state.n} is even.</span>
                          </>
                        ) : (
                          <>
                            One counter is left without a pair.{" "}
                            <span className={styles.statusTextBold}>{state.n} is odd.</span>
                          </>
                        )}
                      </div>
                    </div>
                    {state.n % 2 !== 0 && state.leftoverCounterId !== null && (
                      <div className={styles.leftoverBadge}>
                        <span>Leftover</span>
                        <div className={styles.leftoverMiniToken}>
                          {state.leftoverCounterId}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Array Model View */}
            {state.model === "array" && (
              <div className={styles.alternateModelContainer}>
                <div className={styles.countersTitle}>2-Row Array Representation</div>
                <p className={styles.countersSubtitle}>
                  Even numbers form a perfect rectangle. Odd numbers have 1 protruding counter.
                </p>
                <div className={styles.arrayGridVisual}>
                  <div className={styles.arrayRow}>
                    {arrayGrid
                      .filter((item) => item.row === 0)
                      .map((item) => {
                        const theme = getCounterTheme(item.id);
                        return (
                          <div
                            key={item.id}
                            className={styles.counterToken}
                            style={{
                              background: theme.bgGradient,
                              color: theme.textColor,
                              border: item.isLeftover ? "3px solid #f59e0b" : undefined,
                            }}
                          >
                            {item.id}
                          </div>
                        );
                      })}
                  </div>
                  <div className={styles.arrayRow}>
                    {arrayGrid
                      .filter((item) => item.row === 1)
                      .map((item) => {
                        const theme = getCounterTheme(item.id);
                        return (
                          <div
                            key={item.id}
                            className={styles.counterToken}
                            style={{
                              background: theme.bgGradient,
                              color: theme.textColor,
                            }}
                          >
                            {item.id}
                          </div>
                        );
                      })}
                  </div>
                </div>
                <div className={styles.formulaGeneralPill}>
                  {parity.isEven
                    ? `2 rows × ${parity.pairs} columns = ${state.n} (Even)`
                    : `2 rows × ${parity.pairs} + 1 extra = ${state.n} (Odd)`}
                </div>
              </div>
            )}

            {/* Clock Model View */}
            {state.model === "clock" && (
              <div className={styles.alternateModelContainer}>
                <div className={styles.countersTitle}>Modulo-2 Parity Clock</div>
                <p className={styles.countersSubtitle}>
                  Every 2 steps return to 0 (Even). Stepping {state.n} times lands on{" "}
                  {state.n % 2} ({state.n % 2 === 0 ? "Even" : "Odd"}).
                </p>
                <div className={styles.clockVisual}>
                  <svg width="220" height="220" viewBox="0 0 220 220">
                    <circle cx="110" cy="110" r="80" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
                    {/* Node 0 (Even) */}
                    <circle cx="110" cy="40" r="24" fill={state.clockStep % 2 === 0 ? "#10b981" : "#e2e8f0"} />
                    <text x="110" y="46" textAnchor="middle" fill={state.clockStep % 2 === 0 ? "#ffffff" : "#475569"} fontWeight="800" fontSize="16">
                      0
                    </text>
                    <text x="110" y="16" textAnchor="middle" fill="#166534" fontWeight="700" fontSize="11">
                      EVEN
                    </text>

                    {/* Node 1 (Odd) */}
                    <circle cx="110" cy="180" r="24" fill={state.clockStep % 2 === 1 ? "#8b5cf6" : "#e2e8f0"} />
                    <text x="110" y="186" textAnchor="middle" fill={state.clockStep % 2 === 1 ? "#ffffff" : "#475569"} fontWeight="800" fontSize="16">
                      1
                    </text>
                    <text x="110" y="214" textAnchor="middle" fill="#5b21b6" fontWeight="700" fontSize="11">
                      ODD
                    </text>

                    {/* Animated Pointer Needle */}
                    <line
                      x1="110"
                      y1="110"
                      x2={110}
                      y2={state.clockStep % 2 === 0 ? 55 : 165}
                      stroke="#4f46e5"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                    <circle cx="110" cy="110" r="8" fill="#1e1b4b" />
                  </svg>
                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      className={styles.actionBtnSmall}
                      onClick={() => dispatch({ type: "STEP_CLOCK" })}
                    >
                      Step ({state.clockStep}/{state.n})
                    </button>
                    <button
                      className={styles.actionBtnSmall}
                      onClick={() => dispatch({ type: "SET_CLOCK_STEP", payload: state.n })}
                    >
                      Fast Forward to {state.n}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Remainder Lane Model View */}
            {state.model === "remainder" && (
              <div className={styles.alternateModelContainer}>
                <div className={styles.countersTitle}>Remainder Lane Number Line</div>
                <p className={styles.countersSubtitle}>
                  Jump by 2s along the number line. Notice if the landing matches or leaves a remainder of 1.
                </p>
                <div className={styles.remainderLaneVisual}>
                  <svg width="100%" height="120" viewBox="0 0 600 120">
                    <line x1="20" y1="90" x2="580" y2="90" stroke="#94a3b8" strokeWidth="2" />
                    {Array.from({ length: 13 }, (_, i) => i * 2).map((val) => {
                      const x = 30 + (val / 24) * 520;
                      return (
                        <g key={val}>
                          <line x1={x} y1="85" x2={x} y2="95" stroke="#64748b" strokeWidth="2" />
                          <text x={x} y="110" textAnchor="middle" fontSize="11" fill="#475569" fontWeight="600">
                            {val}
                          </text>
                        </g>
                      );
                    })}

                    {remainderJumps.map((jump, idx) => {
                      const startX = 30 + (jump.from / 24) * 520;
                      const endX = 30 + (jump.to / 24) * 520;
                      const midX = (startX + endX) / 2;
                      const arcH = jump.isRemainder ? 30 : 45;

                      return (
                        <g key={idx}>
                          <path
                            d={`M ${startX} 90 Q ${midX} ${90 - arcH} ${endX} 90`}
                            fill="none"
                            stroke={jump.isRemainder ? "#f59e0b" : "#6366f1"}
                            strokeWidth="3"
                          />
                          <text
                            x={midX}
                            y={90 - arcH - 5}
                            textAnchor="middle"
                            fontSize="11"
                            fontWeight="700"
                            fill={jump.isRemainder ? "#b45309" : "#4338ca"}
                          >
                            {jump.isRemainder ? "+1" : "+2"}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
                <div className={styles.formulaGeneralPill}>
                  {state.n} = {parity.pairs} jumps of 2 + {parity.remainder} remainder
                </div>
              </div>
            )}

            {/* Factor Tree Model View */}
            {state.model === "factor" && (
              <div className={styles.alternateModelContainer}>
                <div className={styles.countersTitle}>Parity Division Tree</div>
                <p className={styles.countersSubtitle}>
                  Decomposing {state.n} into a product of 2 and an integer, plus remainder.
                </p>
                <div className={styles.factorTreeVisual}>
                  <svg width="280" height="180" viewBox="0 0 280 180">
                    {/* Root Node n */}
                    <circle cx="140" cy="35" r="24" fill="#ede9fe" stroke="#8b5cf6" strokeWidth="2.5" />
                    <text x="140" y="42" textAnchor="middle" fontWeight="800" fontSize="16" fill="#1e1b4b">
                      {state.n}
                    </text>

                    {/* Left Branch to 2 */}
                    <line x1="125" y1="55" x2="70" y2="120" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="70" cy="135" r="20" fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
                    <text x="70" y="141" textAnchor="middle" fontWeight="800" fontSize="14" fill="#166534">
                      2
                    </text>

                    {/* Right Branch to Pairs k */}
                    <line x1="155" y1="55" x2="210" y2="120" stroke="#cbd5e1" strokeWidth="2" />
                    <circle cx="210" cy="135" r="20" fill="#ede9fe" stroke="#6366f1" strokeWidth="2" />
                    <text x="210" y="141" textAnchor="middle" fontWeight="800" fontSize="14" fill="#4338ca">
                      {parity.pairs}
                    </text>
                  </svg>
                  <div className={styles.formulaGeneralPill}>
                    {parity.isEven ? `${state.n} = 2 × ${parity.pairs}` : `${state.n} = 2 × ${parity.pairs} + 1`}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Right Column: Why it works + Prediction + Reveal Formula */}
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
                    <div className={styles.stepInstructionText}>Make pairs of two.</div>
                  </div>
                  <div className={styles.stepDiagramRow}>
                    <div className={styles.dotPairMini}>
                      <div className={styles.miniDot} />
                      <div className={styles.miniDotLine} />
                      <div className={styles.miniDot} />
                    </div>
                    <div className={styles.dotPairMini}>
                      <div className={styles.miniDot} />
                      <div className={styles.miniDotLine} />
                      <div className={styles.miniDot} />
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={styles.whyStepItem}>
                  <div className={styles.whyStepHeader}>
                    <div className={styles.stepNumberCircle}>2</div>
                    <div className={styles.stepInstructionText}>
                      If all counters are paired, none are left over.
                    </div>
                  </div>
                  <div className={styles.stepDiagramRow}>
                    <div className={styles.dotPairMini}>
                      <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                      <div className={styles.miniDotLine} />
                      <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                    </div>
                    <div className={styles.dotPairMini}>
                      <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                      <div className={styles.miniDotLine} />
                      <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className={styles.whyStepItem}>
                  <div className={styles.whyStepHeader}>
                    <div className={styles.stepNumberCircle}>3</div>
                    <div className={styles.stepInstructionText}>
                      If one counter is left over, it isn't part of a pair.
                    </div>
                  </div>
                  <div className={styles.stepDiagramRow}>
                    <div className={styles.dotPairMini}>
                      <div className={styles.miniDot} />
                      <div className={styles.miniDotLine} />
                      <div className={styles.miniDot} />
                    </div>
                    <div className={styles.dotPairMini}>
                      <div className={styles.miniDot} />
                      <div className={styles.miniDotLine} />
                      <div className={styles.miniDot} />
                    </div>
                    <div className={`${styles.miniDot} ${styles.miniDotAmber}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Make a prediction Card */}
            <div className={styles.predictionCard}>
              <div className={styles.cardHeader}>
                <span>🔮</span>
                <span>Make a prediction</span>
              </div>
              <div className={styles.predictionPrompt}>What will 14 be?</div>
              <div className={styles.predictionButtons}>
                <button
                  className={`${styles.predictBtn} ${
                    state.predictionChoice === "even" ? styles.predictBtnActive : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "SELECT_PREDICTION", payload: "even" });
                    dispatch({ type: "REVEAL_PREDICTION" });
                  }}
                >
                  Even
                </button>
                <button
                  className={`${styles.predictBtn} ${
                    state.predictionChoice === "odd" ? styles.predictBtnActive : ""
                  }`}
                  onClick={() => {
                    dispatch({ type: "SELECT_PREDICTION", payload: "odd" });
                    dispatch({ type: "REVEAL_PREDICTION" });
                  }}
                >
                  Odd
                </button>
              </div>
              {state.predictionRevealed && state.predictionFeedback && (
                <div className={styles.predictFeedback}>{state.predictionFeedback}</div>
              )}
            </div>

            {/* Reveal / Formula Card */}
            <div className={styles.revealCard}>
              <button
                className={styles.revealBtn}
                onClick={() => dispatch({ type: "TOGGLE_REVEAL_FORMULA" })}
              >
                <span>👁️</span>
                <span>{state.revealFormula ? "Formula Breakdown" : "Reveal"}</span>
              </button>

              {state.revealFormula && (
                <div className={styles.formulaDisplayArea}>
                  <div className={styles.formulaMain}>
                    <InlineMath math={parity.formulaTex} />
                  </div>
                  <div className={styles.formulaExplanation}>{parity.explanation}</div>
                  <div className={styles.formulaGeneralPill}>
                    <span>In general: </span>
                    <InlineMath math={parity.generalFormulaTex} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: One-line visual proof + Challenge */}
        <div className={styles.bottomGrid}>
          {/* One-line visual proof Card */}
          <div className={styles.oneLineProofCard}>
            <div className={styles.cardHeader}>
              <span style={{ color: "#7c3aed" }}>✔</span>
              <span>One-line visual proof</span>
            </div>

            <div className={styles.oneLineContent}>
              {/* Left Base Diagram */}
              <div className={styles.oneLineDiagramBase}>
                <div className={styles.sixDotsGroup}>
                  <div className={styles.vertPair}>
                    <div className={styles.miniDot} />
                    <div className={styles.miniDot} />
                  </div>
                  <div className={styles.vertPair}>
                    <div className={styles.miniDot} />
                    <div className={styles.miniDot} />
                  </div>
                  <div className={styles.vertPair}>
                    <div className={styles.miniDot} />
                    <div className={styles.miniDot} />
                  </div>
                </div>
                <div className={styles.oneLineSubtext}>Make pairs of two.</div>
              </div>

              <div className={styles.arrowSymbol}>→</div>

              {/* Even Case Branch */}
              <div className={styles.branchCardEven}>
                <div className={styles.branchTitleEven}>Even case</div>
                <div className={styles.dotPairMini}>
                  <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                  <div className={styles.miniDotLine} />
                  <div className={`${styles.miniDot} ${styles.miniDotGreen}`} />
                </div>
                <div style={{ fontSize: "10px", color: "#166534" }}>No leftovers.</div>
                <div className={styles.branchFormula}>
                  <InlineMath math="n = 2k" />
                </div>
              </div>

              <div className={styles.orDividerBadge}>OR</div>

              {/* Odd Case Branch */}
              <div className={styles.branchCardOdd}>
                <div className={styles.branchTitleOdd}>Odd case</div>
                <div className={styles.dotPairMini}>
                  <div className={styles.miniDot} />
                  <div className={styles.miniDotLine} />
                  <div className={styles.miniDot} />
                  <div className={`${styles.miniDot} ${styles.miniDotAmber}`} />
                </div>
                <div style={{ fontSize: "10px", color: "#5b21b6" }}>One leftover.</div>
                <div className={styles.branchFormula}>
                  <InlineMath math="n = 2k + 1" />
                </div>
              </div>

              <div className={styles.arrowSymbol}>=</div>

              {/* Conclusion Badge */}
              <div className={styles.conclusionTextBadge}>
                <span>Every whole number is either even or odd.</span>
                <span>🎯</span>
              </div>
            </div>
          </div>

          {/* Challenge Card */}
          <div className={styles.challengeCard}>
            <div className={styles.challengeLeft}>
              <div className={styles.cardHeader}>
                <span>🏆</span>
                <span>Challenge</span>
              </div>
              <div className={styles.challengePrompt}>
                {DEFAULT_CHALLENGE.question}
                <br />
                <span style={{ fontSize: "11px", color: "#64748b" }}>
                  {DEFAULT_CHALLENGE.subquestion}
                </span>
              </div>
              <div className={styles.challengeControls}>
                <div className={styles.stepperContainer}>
                  <span className={styles.stepperValue}>
                    {state.challengeUserLeftover}
                  </span>
                  <div className={styles.stepperBtns}>
                    <button
                      className={styles.stepperBtn}
                      onClick={() =>
                        dispatch({
                          type: "SET_CHALLENGE_LEFTOVER",
                          payload: state.challengeUserLeftover + 1,
                        })
                      }
                      aria-label="Increase leftover"
                    >
                      ▲
                    </button>
                    <button
                      className={styles.stepperBtn}
                      onClick={() =>
                        dispatch({
                          type: "SET_CHALLENGE_LEFTOVER",
                          payload: state.challengeUserLeftover - 1,
                        })
                      }
                      disabled={state.challengeUserLeftover <= 0}
                      aria-label="Decrease leftover"
                    >
                      ▼
                    </button>
                  </div>
                </div>
                <button
                  className={styles.checkBtn}
                  onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
                >
                  Check answer
                </button>
                {state.challengeChecked && (
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      color: state.challengeCorrect ? "#166534" : "#dc2626",
                    }}
                  >
                    {state.challengeCorrect ? "✓ Correct!" : "✗ Try 1"}
                  </span>
                )}
              </div>
            </div>

            {/* Right Dots Visualization (23 dots: 11 pairs of 2 + 1 leftover) */}
            <div className={styles.challengeDotsGrid}>
              {Array.from({ length: 23 }, (_, i) => {
                const isLeftover = i === 22;
                return (
                  <div
                    key={i}
                    className={`${styles.challengeDot} ${
                      isLeftover ? styles.challengeDotLeftover : ""
                    }`}
                    title={`Dot ${i + 1}${isLeftover ? " (Leftover)" : ""}`}
                  />
                );
              })}
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
              className={styles.actionBtnSmall}
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
              className={styles.actionBtnSmall}
              onClick={() => dispatch({ type: "RESET" })}
            >
              ⟲ Reset Proof
            </button>
          </div>
        </section>

        {/* Active Hint Banner */}
        {state.hintTier > 0 && (
          <div className={styles.hintBox}>
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

import { useCallback, useEffect, useId, useMemo, useReducer, useRef, useState } from "react";
import { BlockMath, InlineMath } from "react-katex";
import styles from "./IntegrationByPartsVisualProofPage.module.css";
import {
  HINTS,
  PROOF_META,
  PROOF_STEPS,
  QUIZ_OPTIONS,
  WHY_IT_WORKS_STEPS,
  ONE_LINE_PROOF,
  GraphViewMode,
} from "./integration-by-parts-visual-proofConfig";
import {
  buildPolyline,
  computeApproximationStrips,
  computeProductGeometry,
  computeSecantLine,
  computeTangentLine,
  formatX,
  integrationByPartsValues,
  mapRange,
  sampleCurve,
  u,
  uPrime,
  v,
  vPrime,
} from "./integration-by-parts-visual-proofMath";
import {
  initialState,
  proofReducer,
} from "./integration-by-parts-visual-proofReducer";
import { evaluateProofProgress } from "./integration-by-parts-visual-proofCompletion";

export default function IntegrationByPartsVisualProofPage() {
  const [state, dispatch] = useReducer(proofReducer, initialState);
  const [isPointerDragging, setIsPointerDragging] = useState(false);
  const [activeTab, setActiveTab] = useState("Explore");
  const [infoTooltip, setInfoTooltip] = useState<string | null>(null);

  const rectSvgRef = useRef<SVGSVGElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());
  const liveRegionId = useId();

  // Mathematical state derived from current inputs
  const geom = useMemo(
    () => computeProductGeometry(state.a, state.x, state.b),
    [state.a, state.x, state.b],
  );

  const ibp = useMemo(
    () => integrationByPartsValues(state.a, state.b),
    [state.a, state.b],
  );

  const progress = useMemo(() => evaluateProofProgress(state), [state]);

  const uPoints = useMemo(
    () => sampleCurve(u, state.a, state.b, 90),
    [state.a, state.b],
  );

  const vPoints = useMemo(
    () => sampleCurve((t) => v(t, state.a), state.a, state.b, 90),
    [state.a, state.b],
  );

  const approximationStrips = useMemo(
    () => computeApproximationStrips(state.a, state.x, 8),
    [state.a, state.x],
  );

  const uTangent = useMemo(
    () => computeTangentLine(state.x, u, uPrime, (state.b - state.a) * 0.12),
    [state.x, state.a, state.b],
  );

  const vTangent = useMemo(
    () =>
      computeTangentLine(
        state.x,
        (t) => v(t, state.a),
        vPrime,
        (state.b - state.a) * 0.12,
      ),
    [state.x, state.a, state.b],
  );

  const uSecant = useMemo(
    () => computeSecantLine(state.a, state.x, u),
    [state.a, state.x],
  );

  const vSecant = useMemo(
    () => computeSecantLine(state.a, state.x, (t) => v(t, state.a)),
    [state.a, state.x],
  );

  // SVG coordinate dimensions & mappers
  const rectW = 340;
  const rectH = 260;
  const maxU = Math.max(u(state.b) * 1.15, 1);
  const maxV = Math.max(v(state.b, state.a) * 1.15, 1.2);

  const mapUx = useCallback(
    (val: number) => mapRange(val, 0, maxV, 45, rectW - 25),
    [maxV, rectW],
  );
  const mapUy = useCallback(
    (val: number) => mapRange(val, 0, maxU, rectH - 28, 25),
    [maxU, rectH],
  );

  const graphW = 380;
  const graphH = 270;
  const maxGraphU = Math.max(u(state.b) * 1.15, 1);
  const maxGraphV = Math.max(v(state.b, state.a) * 1.2, 1.2);

  const gx = useCallback(
    (val: number) => mapRange(val, state.a, state.b, 35, graphW - 25),
    [state.a, state.b, graphW],
  );
  const gu = useCallback(
    (val: number) => mapRange(val, 0, maxGraphU, graphH * 0.48, 22),
    [maxGraphU, graphH],
  );
  const gv = useCallback(
    (val: number) => mapRange(val, 0, maxGraphV, graphH - 26, graphH * 0.54),
    [maxGraphV, graphH],
  );

  // Pointer drag calculation for product rectangle handle
  const handlePointerDrag = useCallback(
    (clientY: number) => {
      const svg = rectSvgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const clampedY = Math.max(rect.top, Math.min(rect.bottom, clientY));
      const relY = 1 - (clampedY - rect.top) / rect.height;
      const targetU = Math.max(0, relY * maxU);
      // Inverse of u(x) = x² => x = sqrt(u)
      const calculatedX = Math.sqrt(targetU);
      dispatch({ type: "SET_X", value: calculatedX });
    },
    [maxU],
  );

  // Animation ticker loop
  useEffect(() => {
    if (!state.isPlayingAnimation) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    lastTimeRef.current = performance.now();

    const loop = (now: number) => {
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;
      dispatch({ type: "TICK_ANIMATION", dt });
      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [state.isPlayingAnimation]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
        return;
      }
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        dispatch({ type: "NUDGE_X", delta: e.shiftKey ? 0.2 : 0.04 });
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        dispatch({ type: "NUDGE_X", delta: e.shiftKey ? -0.2 : -0.04 });
      } else if (e.key === "z" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (e.shiftKey) {
          dispatch({ type: "REDO" });
        } else {
          dispatch({ type: "UNDO" });
        }
      } else if (e.key === " ") {
        e.preventDefault();
        if (state.isPlayingAnimation) {
          dispatch({ type: "PAUSE_ANIMATION" });
        } else {
          dispatch({ type: "START_ANIMATION" });
        }
      } else if (e.key === "Escape") {
        dispatch({ type: "CLOSE_HINT" });
        setInfoTooltip(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [state.isPlayingAnimation]);

  const navItems = [
    {
      id: "Explore",
      label: "Explore",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      id: "Proofs",
      label: "Proofs",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
        </svg>
      ),
    },
    {
      id: "Practice",
      label: "Practice",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
      ),
    },
    {
      id: "Saved",
      label: "Saved",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      ),
    },
  ];

  const graphViews: { id: GraphViewMode; label: string }[] = [
    { id: "curve", label: "Curve" },
    { id: "secant", label: "Secant" },
    { id: "tangent", label: "Tangent" },
    { id: "strips", label: "Strips" },
  ];

  return (
    <div className={styles.pageContainer}>
      {/* Top Mac Window Chrome */}
      <div className={styles.windowBar}>
        <div className={styles.windowControls} aria-hidden>
          <span className={`${styles.windowDot} ${styles.dotClose}`} />
          <span className={`${styles.windowDot} ${styles.dotMinimize}`} />
          <span className={`${styles.windowDot} ${styles.dotMaximize}`} />
        </div>
        <div className={styles.windowBreadcrumb}>
          <span className={styles.crumbDomain}>Maths Universe</span>
          <span className={styles.crumbDivider}>/</span>
          <span className={styles.crumbPage}>Visual Proofs</span>
        </div>
        <div className={styles.windowActions}>
          <div className={styles.difficultyPill}>
            <span>{PROOF_META.difficulty}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
          <div className={styles.timePill}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{PROOF_META.durationMinutes} min</span>
          </div>
          <button
            type="button"
            className={styles.shareBtn}
            onClick={() => {
              navigator.clipboard?.writeText?.(window.location.href);
              alert("Proof link copied to clipboard!");
            }}
            aria-label="Share visual proof"
          >
            Share
          </button>
        </div>
      </div>

      <div className={styles.appBody}>
        {/* Left Navigation Sidebar */}
        <aside className={styles.sidebar} aria-label="Application navigation">
          <div className={styles.brand}>
            <div className={styles.brandIcon} aria-hidden>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3v18M3 12h18M7.5 7.5l9 9M7.5 16.5l9-9" />
              </svg>
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>MATHS</span>
              <span className={styles.brandSubtitle}>UNIVERSE</span>
            </div>
          </div>

          <nav className={styles.navStack}>
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navButton} ${isActive ? styles.navButtonActive : ""}`}
                  onClick={() => setActiveTab(item.id)}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className={styles.navIconBox}>{item.icon}</div>
                  <span className={styles.navLabel}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.sidebarFooter}>
            <button
              type="button"
              className={styles.settingsButton}
              onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", value: true })}
              aria-label="Open settings and proof help"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              <span>Settings</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {/* Header Title & Mission */}
          <header className={styles.contentHeader}>
            <div className={styles.headerTitles}>
              <h1 className={styles.mainTitle}>{PROOF_META.title}</h1>
              <div className={styles.subtitleMissionRow}>
                <span className={styles.subTitle}>{PROOF_META.subtitle}</span>
                <div className={styles.missionPill} role="status">
                  <div className={styles.missionIcon} aria-hidden>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="6" />
                      <circle cx="12" cy="12" r="2" />
                    </svg>
                  </div>
                  <strong className={styles.missionHeading}>Mission:</strong>
                  <span className={styles.missionText}>{PROOF_META.mission}</span>
                </div>
              </div>
            </div>
          </header>

          {/* Workspace Layout Grid: Models & Reasoning Sidebar */}
          <div className={styles.workspaceGrid}>
            <section className={styles.leftWorkspace}>
              {/* Top Row: Dual Visual Models with Connecting Link */}
              <div className={styles.dualModelRow}>
                {/* Model 1: Product Rectangle */}
                <div className={styles.modelCard}>
                  <div className={styles.cardTopHeader}>
                    <div className={styles.cardTitleWrap}>
                      <span className={styles.modelStepNumber}>1</span>
                      <h2 className={styles.modelCardHeading}>Rectangle (Product) Model</h2>
                      <button
                        type="button"
                        className={styles.infoCircleBtn}
                        onClick={() =>
                          setInfoTooltip(
                            "The area of rectangle u(x)·v(x) decomposes into horizontal strip v Δu and vertical strip u Δv.",
                          )
                        }
                        aria-label="Information about Rectangle Model"
                      >
                        ?
                      </button>
                    </div>
                  </div>
                  <p className={styles.modelSubtext}>Balance: uv equals two differential area strips.</p>

                  <div className={styles.mathBanner}>
                    <BlockMath math="d(uv) = u\,dv + v\,du" />
                  </div>

                  {/* SVG Canvas for Rectangle Model */}
                  <div className={styles.svgContainer}>
                    <svg
                      ref={rectSvgRef}
                      viewBox={`0 0 ${rectW} ${rectH}`}
                      className={styles.modelSvg}
                      role="img"
                      aria-label="Interactive Product Rectangle showing uv area split into v du and u dv strips"
                    >
                      <title>Rectangle Model Area Decomposition</title>
                      <defs>
                        <linearGradient id="uvAreaGrad" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#ede9fe" stopOpacity="0.8" />
                          <stop offset="100%" stopColor="#e0e7ff" stopOpacity="0.9" />
                        </linearGradient>
                        <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                          <line x1="0" y1="0" x2="0" y2="8" stroke="#8b5cf6" strokeWidth="1" strokeOpacity="0.3" />
                        </pattern>
                      </defs>

                      {/* Axes */}
                      <line x1="45" y1={rectH - 28} x2={rectW - 15} y2={rectH - 28} stroke="#cbd5e1" strokeWidth="1.5" />
                      <line x1="45" y1="20" x2="45" y2={rectH - 28} stroke="#cbd5e1" strokeWidth="1.5" />
                      {/* Axis Arrows */}
                      <path d={`M ${rectW - 15} ${rectH - 28} l -5 -3 l 0 6 z`} fill="#94a3b8" />
                      <path d="M 45 20 l -3 5 l 6 0 z" fill="#94a3b8" />

                      {/* Axis Labels */}
                      {state.showLabels && (
                        <>
                          <text x="14" y="24" className={styles.svgAxisLabel}>
                            u(x)
                          </text>
                          <text x="24" y="36" className={styles.svgAxisArrow}>
                            ↑
                          </text>
                          <text x={rectW - 32} y={rectH - 10} className={styles.svgAxisLabel}>
                            v(x)
                          </text>
                          <text x={rectW - 8} y={rectH - 10} className={styles.svgAxisArrow}>
                            →
                          </text>
                        </>
                      )}

                      {/* Reference Dashed Lines for Boundaries */}
                      <line
                        x1="45"
                        y1={mapUy(geom.u1)}
                        x2={mapUx(geom.v2)}
                        y2={mapUy(geom.u1)}
                        stroke="#7c3aed"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />
                      <line
                        x1="45"
                        y1={mapUy(geom.u2)}
                        x2={mapUx(geom.v2)}
                        y2={mapUy(geom.u2)}
                        stroke="#7c3aed"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />
                      <line
                        x1={mapUx(geom.v1)}
                        y1={mapUy(geom.u2)}
                        x2={mapUx(geom.v1)}
                        y2={rectH - 28}
                        stroke="#3b82f6"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />
                      <line
                        x1={mapUx(geom.v2)}
                        y1={mapUy(geom.u2)}
                        x2={mapUx(geom.v2)}
                        y2={rectH - 28}
                        stroke="#7c3aed"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />

                      {/* Base u·v Rectangle Area */}
                      <rect
                        x={mapUx(0)}
                        y={mapUy(geom.u2)}
                        width={Math.max(0, mapUx(geom.v2) - mapUx(0))}
                        height={Math.max(0, mapUy(0) - mapUy(geom.u2))}
                        fill="url(#uvAreaGrad)"
                        stroke="#8b5cf6"
                        strokeWidth="1.5"
                        rx="2"
                      />

                      {/* Top Horizontal Strip: v Δu */}
                      <rect
                        x={mapUx(0)}
                        y={mapUy(geom.u2)}
                        width={Math.max(0, mapUx(geom.v2) - mapUx(0))}
                        height={Math.max(0, mapUy(geom.u1) - mapUy(geom.u2))}
                        fill="#d8b4fe"
                        fillOpacity="0.45"
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />

                      {/* Right Vertical Strip: u Δv */}
                      <rect
                        x={mapUx(geom.v1)}
                        y={mapUy(geom.u1)}
                        width={Math.max(0, mapUx(geom.v2) - mapUx(geom.v1))}
                        height={Math.max(0, mapUy(0) - mapUy(geom.u1))}
                        fill="#bae6fd"
                        fillOpacity="0.45"
                        stroke="#0284c7"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />

                      {/* Dimension Bracket for Δu on Left Axis */}
                      <g className={styles.dimensionBracket}>
                        <line x1="28" y1={mapUy(geom.u1)} x2="38" y2={mapUy(geom.u1)} stroke="#94a3b8" strokeWidth="1" />
                        <line x1="28" y1={mapUy(geom.u2)} x2="38" y2={mapUy(geom.u2)} stroke="#94a3b8" strokeWidth="1" />
                        <line x1="33" y1={mapUy(geom.u1)} x2="33" y2={mapUy(geom.u2)} stroke="#94a3b8" strokeWidth="1" />
                        <text x="20" y={(mapUy(geom.u1) + mapUy(geom.u2)) / 2 + 4} className={styles.deltaLabel}>
                          Δu
                        </text>
                      </g>

                      {/* Labels inside rect & strips */}
                      {state.showLabels && (
                        <>
                          <text
                            x={(mapUx(0) + mapUx(geom.v2)) / 2}
                            y={(mapUy(geom.u1) + mapUy(geom.u2)) / 2 + 4}
                            className={styles.stripMathLabelPurple}
                          >
                            v Δu
                          </text>
                          <text
                            x={(mapUx(geom.v1) + mapUx(geom.v2)) / 2}
                            y={(mapUy(0) + mapUy(geom.u1)) / 2 - 6}
                            className={styles.stripMathLabelBlue}
                          >
                            u
                          </text>
                          <text
                            x={(mapUx(geom.v1) + mapUx(geom.v2)) / 2}
                            y={(mapUy(0) + mapUy(geom.u1)) / 2 + 10}
                            className={styles.stripMathLabelBlue}
                          >
                            Δv
                          </text>
                          <text
                            x={mapUx(geom.v2) - 8}
                            y={mapUy(geom.u1) + 14}
                            className={styles.muSymbol}
                          >
                            μ
                          </text>
                          <text
                            x={(mapUx(0) + mapUx(geom.v2)) / 2}
                            y={(mapUy(0) + mapUy(geom.u1)) / 2 - 2}
                            className={styles.uvCenterLabel}
                          >
                            u · v
                          </text>
                          <text
                            x={(mapUx(0) + mapUx(geom.v2)) / 2}
                            y={(mapUy(0) + mapUy(geom.u1)) / 2 + 14}
                            className={styles.areaSubLabel}
                          >
                            (area)
                          </text>

                          {/* Axis Tick Values */}
                          <text x="12" y={mapUy(geom.u2) + 4} className={styles.axisTickText}>
                            u(x₂)
                          </text>
                          <text x="12" y={mapUy(geom.u1) + 4} className={styles.axisTickText}>
                            u(x₁)
                          </text>
                          <text x={mapUx(0)} y={rectH - 12} className={styles.axisTickText}>
                            a
                          </text>
                          <text x={mapUx(geom.v2) - 18} y={rectH - 12} className={styles.axisTickText}>
                            x
                          </text>
                          <text x={mapUx(geom.v2)} y={rectH - 12} className={styles.axisTickText}>
                            b
                          </text>
                        </>
                      )}

                      {/* Curved connecting arrow flowing out towards right edge */}
                      <path
                        d={`M ${mapUx(geom.v2)} ${mapUy(geom.u2)} C ${mapUx(geom.v2) + 30} ${mapUy(geom.u2) + 20}, ${rectW - 15} ${rectH * 0.45}, ${rectW} ${rectH * 0.5}`}
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />

                      {/* Interactive Drag Handle at (v2, u2) */}
                      <g className={styles.dragHandleGroup}>
                        <circle
                          cx={mapUx(geom.v2)}
                          cy={mapUy(geom.u2)}
                          r="20"
                          fill="transparent"
                          className={styles.invisibleHitCircle}
                          onPointerDown={(e) => {
                            e.currentTarget.setPointerCapture(e.pointerId);
                            setIsPointerDragging(true);
                          }}
                          onPointerMove={(e) => {
                            if (!isPointerDragging) return;
                            handlePointerDrag(e.clientY);
                          }}
                          onPointerUp={(e) => {
                            try {
                              e.currentTarget.releasePointerCapture(e.pointerId);
                            } catch {
                              // Ignore pointer capture release exceptions
                            }
                            setIsPointerDragging(false);
                          }}
                        />
                        <circle
                          cx={mapUx(geom.v2)}
                          cy={mapUy(geom.u2)}
                          r="7"
                          fill="#7c3aed"
                          stroke="#ffffff"
                          strokeWidth="2.5"
                          className={styles.visibleHandleCircle}
                        />

                        {/* Dragging Tooltip Callout */}
                        <g transform={`translate(${mapUx(geom.v2) + 12}, ${mapUy(geom.u2) - 18})`}>
                          <rect x="0" y="0" width="80" height="28" rx="6" fill="#ede9fe" stroke="#c4b5fd" strokeWidth="1" />
                          <text x="8" y="12" className={styles.tooltipHeading}>
                            Dragging x₂
                          </text>
                          <text x="8" y="22" className={styles.tooltipSubtext}>
                            Move vertically
                          </text>
                        </g>

                        {/* Hand cursor icon */}
                        <g transform={`translate(${mapUx(geom.v2) - 12}, ${mapUy(geom.u2) + 6})`}>
                          <path
                            d="M6 1a1 1 0 0 1 1 1v4h1a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v3a4 4 0 0 1-4 4H5a4 4 0 0 1-4-4v-4a1 1 0 0 1 1-1h1V2a1 1 0 0 1 1-1z"
                            fill="#1e1b4b"
                            stroke="#fff"
                            strokeWidth="1"
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                  <p className={styles.cardBottomCaption}>
                    Move <span className={styles.purpleMath}>x₂</span> to change{" "}
                    <span className={styles.purpleMath}>Δu</span> and{" "}
                    <span className={styles.purpleMath}>Δv</span>
                  </p>
                </div>

                {/* Central Connecting Link Badge & Curved Connecting Arrow */}
                <div className={styles.centerLinkWrap}>
                  <div className={styles.linkBadge} title="Models are linked through parameter x">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                  </div>
                </div>

                {/* Model 2: Graph (Motion) Model */}
                <div className={styles.modelCard}>
                  <div className={styles.cardTopHeader}>
                    <div className={styles.cardTitleWrap}>
                      <span className={styles.modelStepNumber}>2</span>
                      <h2 className={styles.modelCardHeading}>Graph (Motion) Model</h2>
                      <button
                        type="button"
                        className={styles.infoCircleBtn}
                        onClick={() =>
                          setInfoTooltip(
                            "The purple curve u(x) provides heights while the blue curve v(x) accumulates area under v′(x).",
                          )
                        }
                        aria-label="Information about Graph Model"
                      >
                        ?
                      </button>
                    </div>
                  </div>
                  <p className={styles.modelSubtext}>Slope = rate of change. Area = accumulation.</p>

                  {/* View Mode Toggle Button Group */}
                  <div className={styles.graphViewControlsRow}>
                    <span className={styles.viewLabel}>View:</span>
                    <div className={styles.viewButtonGroup} role="tablist" aria-label="Graph display mode">
                      {graphViews.map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          role="tab"
                          aria-selected={state.graphView === mode.id}
                          className={`${styles.viewToggleBtn} ${
                            state.graphView === mode.id ? styles.viewToggleBtnActive : ""
                          }`}
                          onClick={() => dispatch({ type: "SET_GRAPH_VIEW", value: mode.id })}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.gearMiniBtn}
                      onClick={() => dispatch({ type: "TOGGLE_LABELS" })}
                      title="Toggle graph details"
                    >
                      ⚙️
                    </button>
                  </div>

                  {/* SVG Canvas for Graph Model */}
                  <div className={styles.svgContainer}>
                    <svg
                      viewBox={`0 0 ${graphW} ${graphH}`}
                      className={styles.modelSvg}
                      role="img"
                      aria-label="Graph showing functions u(x) and accumulated v(x) with slope and secant overlays"
                    >
                      <title>Motion and Accumulation Model</title>

                      {/* Curved connecting arrow entering from left edge */}
                      <path
                        d={`M 0 ${graphH * 0.5} C 15 ${graphH * 0.45}, ${gx(state.x) - 25} ${gu(u(state.x)) + 20}, ${gx(state.x)} ${gu(u(state.x))}`}
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                        strokeDasharray="4 4"
                      />

                      {/* Axes */}
                      <line x1="30" y1={graphH - 26} x2={graphW - 15} y2={graphH - 26} stroke="#cbd5e1" strokeWidth="1.5" />
                      <line x1="35" y1="18" x2="35" y2={graphH - 26} stroke="#cbd5e1" strokeWidth="1.5" />
                      <path d={`M ${graphW - 15} ${graphH - 26} l -5 -3 l 0 6 z`} fill="#94a3b8" />
                      <path d="M 35 18 l -3 5 l 6 0 z" fill="#94a3b8" />

                      {/* Axis Labels */}
                      <text x="24" y="24" className={styles.svgAxisLabel}>
                        u
                      </text>
                      <text x={graphW - 20} y={graphH - 12} className={styles.svgAxisLabel}>
                        x
                      </text>

                      {/* Strips Approximation View */}
                      {state.graphView === "strips" && (
                        <g>
                          {approximationStrips.map((strip) => (
                            <rect
                              key={strip.index}
                              x={gx(strip.xLeft)}
                              y={gu(strip.heightU)}
                              width={Math.max(0, gx(strip.xRight) - gx(strip.xLeft))}
                              height={Math.max(0, graphH * 0.48 - gu(strip.heightU))}
                              fill="rgba(139, 92, 246, 0.2)"
                              stroke="#8b5cf6"
                              strokeWidth="0.8"
                            />
                          ))}
                        </g>
                      )}

                      {/* Curve 1: y = u(x) (Purple Curve) */}
                      <path
                        d={buildPolyline(uPoints, gx, gu)}
                        fill="none"
                        stroke="#7c3aed"
                        strokeWidth="2.8"
                      />

                      {/* Curve 2: v(x) = ∫ v'(t) dt (Blue Curve) */}
                      <path
                        d={buildPolyline(vPoints, gx, gv)}
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.8"
                      />

                      {/* Vertical Guidelines for a, x, b */}
                      <line
                        x1={gx(state.a)}
                        y1="22"
                        x2={gx(state.a)}
                        y2={graphH - 26}
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />
                      <line
                        x1={gx(state.x)}
                        y1="20"
                        x2={gx(state.x)}
                        y2={graphH - 26}
                        stroke="#7c3aed"
                        strokeWidth="1.5"
                        strokeDasharray="4 3"
                      />
                      <line
                        x1={gx(state.b)}
                        y1="22"
                        x2={gx(state.b)}
                        y2={graphH - 26}
                        stroke="#94a3b8"
                        strokeWidth="1"
                        strokeDasharray="3 3"
                      />

                      {/* Horizontal Guideline for u(x) to Y-axis */}
                      <line
                        x1="35"
                        y1={gu(u(state.x))}
                        x2={gx(state.x)}
                        y2={gu(u(state.x))}
                        stroke="#7c3aed"
                        strokeWidth="1.2"
                        strokeDasharray="4 3"
                      />

                      {/* Tangent Mode Lines */}
                      {state.graphView === "tangent" && (
                        <g>
                          <line
                            x1={gx(uTangent.x1)}
                            y1={gu(uTangent.y1)}
                            x2={gx(uTangent.x2)}
                            y2={gu(uTangent.y2)}
                            stroke="#7c3aed"
                            strokeWidth="2"
                            strokeDasharray="5 3"
                          />
                          <line
                            x1={gx(vTangent.x1)}
                            y1={gv(vTangent.y1)}
                            x2={gx(vTangent.x2)}
                            y2={gv(vTangent.y2)}
                            stroke="#2563eb"
                            strokeWidth="2"
                            strokeDasharray="5 3"
                          />
                        </g>
                      )}

                      {/* Secant Mode Lines */}
                      {state.graphView === "secant" && (
                        <g>
                          <line
                            x1={gx(uSecant.x1)}
                            y1={gu(uSecant.y1)}
                            x2={gx(uSecant.x2)}
                            y2={gu(uSecant.y2)}
                            stroke="#7c3aed"
                            strokeWidth="2"
                          />
                          <line
                            x1={gx(vSecant.x1)}
                            y1={gv(vSecant.y1)}
                            x2={gx(vSecant.x2)}
                            y2={gv(vSecant.y2)}
                            stroke="#2563eb"
                            strokeWidth="2"
                          />
                        </g>
                      )}

                      {/* Sample Points on curves at x */}
                      <circle cx={gx(state.x)} cy={gu(u(state.x))} r="6" fill="#7c3aed" stroke="#fff" strokeWidth="2" />
                      <circle cx={gx(state.x)} cy={gv(v(state.x, state.a))} r="6" fill="#2563eb" stroke="#fff" strokeWidth="2" />

                      {/* Formula Pills & Labels on Canvas */}
                      {state.showLabels && (
                        <>
                          <text x="45" y="32" className={styles.curveMathLabelPurple}>
                            y = u(x)
                          </text>

                          <g transform={`translate(45, ${graphH * 0.48 + 4})`}>
                            <rect x="0" y="0" width="130" height="26" rx="6" fill="#f0f9ff" stroke="#bae6fd" strokeWidth="1" />
                            <text x="8" y="17" className={styles.formulaPillBlue}>
                              v(x) = ∫ₐˣ v′(t) dt
                            </text>
                          </g>

                          {/* Slope Callout Badge for u */}
                          <g transform={`translate(${Math.min(gx(state.x) - 100, 110)}, ${gu(u(state.x)) - 18})`}>
                            <rect x="0" y="0" width="92" height="24" rx="12" fill="#f5f3ff" stroke="#ddd6fe" strokeWidth="1" />
                            <text x="12" y="16" className={styles.slopeBadgeTextPurple}>
                              Slope = u′(x)
                            </text>
                          </g>

                          {/* Slope Callout Badge for v */}
                          <g transform={`translate(${Math.min(gx(state.x) + 12, graphW - 90)}, ${gv(v(state.x, state.a)) - 14})`}>
                            <rect x="0" y="0" width="48" height="22" rx="11" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="1" />
                            <text x="10" y="15" className={styles.slopeBadgeTextGreen}>
                              v′(x)
                            </text>
                          </g>

                          {/* Axis Ticks */}
                          <text x="10" y={gu(u(state.x)) + 4} className={styles.axisTickText}>
                            u(x)
                          </text>
                          <text x={gx(state.a) - 4} y={graphH - 10} className={styles.axisTickText}>
                            a
                          </text>
                          <text x={gx(state.x) - 4} y={graphH - 10} className={styles.axisTickTextHighlight}>
                            x
                          </text>
                          <text x={gx(state.b) - 4} y={graphH - 10} className={styles.axisTickText}>
                            b
                          </text>
                        </>
                      )}

                      {/* Right accumulation direction arrows */}
                      <path d={`M ${graphW - 30} ${gv(v(state.b, state.a))} l 8 0 m -3 -3 l 3 3 l -3 3`} stroke="#2563eb" strokeWidth="1.5" fill="none" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Card: One-line Visual Proof */}
              <div className={styles.oneLineProofCard}>
                <h3 className={styles.oneLineProofTitle}>One-line visual proof</h3>
                <div className={styles.proofFlowContainer}>
                  {ONE_LINE_PROOF.map((item, idx) => {
                    if (item.kind === "rect") {
                      return (
                        <div key={idx} className={styles.symbolicBlock}>
                          <div className={styles.symbolicSquare} />
                          <span className={styles.symbolicLabel}>{item.label}</span>
                        </div>
                      );
                    }
                    if (item.kind === "strip-h") {
                      return (
                        <div key={idx} className={styles.symbolicBlock}>
                          <div className={styles.symbolicStripH} />
                          <span className={styles.symbolicLabel}>
                            <InlineMath math="v\,du" />
                          </span>
                        </div>
                      );
                    }
                    if (item.kind === "strip-v") {
                      return (
                        <div key={idx} className={styles.symbolicBlock}>
                          <div className={styles.symbolicStripV} />
                          <span className={styles.symbolicLabel}>
                            <InlineMath math="u\,dv" />
                          </span>
                        </div>
                      );
                    }
                    if (item.kind === "equals") {
                      return (
                        <span key={idx} className={styles.symbolicOperator}>
                          =
                        </span>
                      );
                    }
                    if (item.kind === "plus") {
                      return (
                        <span key={idx} className={styles.symbolicOperator}>
                          +
                        </span>
                      );
                    }
                    if (item.kind === "arrow") {
                      return (
                        <div key={idx} className={styles.symbolicArrowWrap}>
                          {item.label && <span className={styles.arrowAnnotation}>{item.label}</span>}
                          <span className={styles.flowArrow}>→</span>
                        </div>
                      );
                    }
                    const isFinalTheorem = idx === ONE_LINE_PROOF.length - 1;
                    return (
                      <div
                        key={idx}
                        className={`${styles.formulaBox} ${isFinalTheorem ? styles.formulaBoxHighlighted : ""}`}
                      >
                        <InlineMath math={item.label ?? ""} />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controls Bar */}
              <div className={styles.controlsBar}>
                <div className={styles.controlsLeft}>
                  <div className={styles.controlsIconGroup}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="4" y1="21" x2="4" y2="14" />
                      <line x1="4" y1="10" x2="4" y2="3" />
                      <line x1="12" y1="21" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12" y2="3" />
                      <line x1="20" y1="21" x2="20" y2="16" />
                      <line x1="20" y1="12" x2="20" y2="3" />
                      <line x1="1" y1="14" x2="7" y2="14" />
                      <line x1="9" y1="8" x2="15" y2="8" />
                      <line x1="17" y1="16" x2="23" y2="16" />
                    </svg>
                    <span className={styles.controlsText}>Controls</span>
                  </div>

                  <label className={styles.paramInputPill}>
                    <span className={styles.paramName}>a</span>
                    <input
                      type="number"
                      step="0.1"
                      min={0}
                      max={state.b - 0.2}
                      value={state.a}
                      onChange={(e) => dispatch({ type: "SET_A", value: Number(e.target.value) })}
                      aria-label="Lower bound a"
                    />
                  </label>

                  <label className={styles.paramInputPill}>
                    <span className={styles.paramName}>b</span>
                    <input
                      type="number"
                      step="0.1"
                      min={state.a + 0.2}
                      max={6.28}
                      value={state.b === Math.PI ? 3.14 : state.b}
                      onChange={(e) => dispatch({ type: "SET_B", value: Number(e.target.value) })}
                      aria-label="Upper bound b"
                    />
                  </label>

                  {/* Slider for x */}
                  <div className={styles.sliderWrap}>
                    <span className={styles.sliderLabel}>x</span>
                    <input
                      type="range"
                      min={state.a + 0.02}
                      max={state.b}
                      step="0.01"
                      value={state.x}
                      onChange={(e) => dispatch({ type: "SET_X", value: Number(e.target.value), recordHistory: true })}
                      aria-label="Current evaluation coordinate x"
                      className={styles.rangeInput}
                    />
                    <span className={styles.sliderValueBox}>{formatX(state.x)}</span>
                  </div>
                </div>

                <div className={styles.controlsRight}>
                  {/* Custom Modern Switch Toggles */}
                  <label className={styles.togglePill}>
                    <span>Show labels</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.showLabels}
                      className={`${styles.customToggle} ${state.showLabels ? styles.customToggleChecked : ""}`}
                      onClick={() => dispatch({ type: "TOGGLE_LABELS" })}
                      aria-label="Toggle show labels"
                    >
                      <span className={styles.customToggleThumb} />
                    </button>
                  </label>

                  <label className={styles.togglePill}>
                    <span>Snap to key points</span>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.snapEnabled}
                      className={`${styles.customToggle} ${state.snapEnabled ? styles.customToggleChecked : ""}`}
                      onClick={() => dispatch({ type: "TOGGLE_SNAP" })}
                      aria-label="Toggle snap to key points"
                    >
                      <span className={styles.customToggleThumb} />
                    </button>
                  </label>

                  {/* Playback Controls */}
                  <div className={styles.playbackControls}>
                    <button
                      type="button"
                      className={styles.playbackBtn}
                      onClick={() =>
                        state.isPlayingAnimation
                          ? dispatch({ type: "PAUSE_ANIMATION" })
                          : dispatch({ type: "START_ANIMATION" })
                      }
                      title={state.isPlayingAnimation ? "Pause animation" : "Play animation"}
                      aria-label={state.isPlayingAnimation ? "Pause animation" : "Play animation"}
                    >
                      {state.isPlayingAnimation ? "⏸" : "▶"}
                    </button>
                    <button
                      type="button"
                      className={styles.playbackBtn}
                      onClick={() => dispatch({ type: "UNDO" })}
                      disabled={state.history.length === 0}
                      title="Undo"
                      aria-label="Undo"
                    >
                      ↺
                    </button>
                    <button
                      type="button"
                      className={styles.playbackBtn}
                      onClick={() => dispatch({ type: "RESET_ALL" })}
                      title="Reset proof state"
                      aria-label="Reset proof state"
                    >
                      ⟲
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Right Sidebar: Why It Works, Prediction & Challenge */}
            <aside className={styles.rightSidebar} aria-label="Proof reasoning and challenges">
              <div className={styles.reasoningCard}>
                <div className={styles.reasoningHeader}>
                  <span className={styles.sparkleIcon} aria-hidden>
                    ✨
                  </span>
                  <h2 className={styles.reasoningHeading}>Why it works</h2>
                </div>

                {/* 3 Step Breakdown */}
                <div className={styles.reasoningSteps}>
                  {WHY_IT_WORKS_STEPS.map((step, idx) => (
                    <div key={idx} className={styles.stepItem}>
                      <div className={styles.stepHeaderRow}>
                        <span className={styles.stepBadgeNum}>{idx + 1}</span>
                        <h3 className={styles.stepTitle}>{step.title}</h3>
                      </div>
                      <div className={styles.stepMathBox}>
                        <BlockMath math={step.latex} />
                      </div>

                      {/* Mini Visual for Step 1 */}
                      {idx === 0 && (
                        <div className={styles.miniDiagramBox}>
                          <div className={styles.miniProductSquare} />
                          <span className={styles.miniEquals}>=</span>
                          <div className={styles.miniStripHoriz} />
                          <span className={styles.miniTimes}>× dv</span>
                          <span className={styles.miniPlus}>+</span>
                          <div className={styles.miniStripVert} />
                          <span className={styles.miniTimes}>× du</span>
                        </div>
                      )}

                      {/* Mini Visual for Step 2 */}
                      {idx === 1 && (
                        <div className={styles.miniIntegralVisual}>
                          <svg width="100%" height="45" viewBox="0 0 180 45">
                            <path d="M 10 35 Q 45 15 85 20 L 85 35 Z" fill="#ede9fe" stroke="#7c3aed" strokeWidth="1" />
                            <path d="M 95 35 Q 135 30 170 15 L 170 35 Z" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
                            <line x1="5" y1="35" x2="175" y2="35" stroke="#cbd5e1" strokeWidth="1" />
                            <text x="10" y="43" fontSize="8" fill="#64748b">
                              t
                            </text>
                            <text x="170" y="43" fontSize="8" fill="#64748b">
                              x
                            </text>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Predict Before Reveal Section */}
                <div className={styles.quizSection}>
                  <h4 className={styles.quizHeading}>Predict before reveal</h4>
                  <p className={styles.quizPrompt}>
                    What is <InlineMath math="\int_a^b u\,dv" /> equal to?
                  </p>

                  <select
                    className={styles.predictionSelect}
                    value={state.quizChoice}
                    onChange={(e) => dispatch({ type: "SET_QUIZ", value: e.target.value })}
                    aria-label="Predict the isolated integral formula"
                  >
                    <option value="">Your prediction...</option>
                    {QUIZ_OPTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    className={styles.revealAnswerBtn}
                    onClick={() => dispatch({ type: "REVEAL_QUIZ" })}
                    disabled={!state.quizChoice}
                  >
                    Reveal Answer
                  </button>

                  {state.quizRevealed && (
                    <div className={styles.quizFeedbackRow}>
                      {QUIZ_OPTIONS.find((o) => o.id === state.quizChoice)?.correct ? (
                        <span className={styles.matchSuccess}>
                          ✅ Match! <span aria-hidden>🎉 🎊</span>
                        </span>
                      ) : (
                        <div className={styles.matchError}>
                          <p>❌ Not quite.</p>
                          {state.misconceptionMessage && (
                            <p className={styles.misconceptionText}>{state.misconceptionMessage}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Challenge Section */}
                <div className={styles.challengeSection}>
                  <div className={styles.challengeHeader}>
                    <span className={styles.targetIcon} aria-hidden>
                      🎯
                    </span>
                    <h4 className={styles.challengeTitle}>Challenge</h4>
                  </div>
                  <p className={styles.challengeDesc}>
                    Verify with <InlineMath math="u(x)=x^2" /> and <InlineMath math="v'(x)=\cos x" /> on{" "}
                    <InlineMath math="[0,\pi]" />.
                  </p>

                  {state.challengeChecked && (
                    <div className={styles.challengeResults}>
                      <div className={styles.calcRow}>
                        <span>
                          <InlineMath math="[uv]_0^\pi" />
                        </span>
                        <strong>{ibp.uvBoundary.toFixed(3)}</strong>
                      </div>
                      <div className={styles.calcRow}>
                        <span>
                          <InlineMath math="\int_0^\pi x^2 \cos x\,dx" />
                        </span>
                        <strong>{ibp.integralUDv.toFixed(3)}</strong>
                      </div>
                      <div className={styles.calcRow}>
                        <span>
                          <InlineMath math="\int_0^\pi 2x \sin x\,dx" />
                        </span>
                        <strong>{ibp.integralVDu.toFixed(3)}</strong>
                      </div>
                      <p className={styles.exactBalanceText}>
                        Exact balance: <InlineMath math="-2\pi = 0 - 2\pi" /> (Difference: {ibp.difference.toFixed(4)})
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className={styles.checkWorkBtn}
                    onClick={() => dispatch({ type: "CHECK_CHALLENGE" })}
                  >
                    Check my work
                  </button>
                </div>

                {/* 5-Tier Hint Coach Button & Modal */}
                <div className={styles.hintCoachSection}>
                  <button
                    type="button"
                    className={styles.hintCoachBtn}
                    onClick={() => dispatch({ type: "SET_HINT_INDEX", value: 0 })}
                  >
                    💡 Open 5-Tier Hint Coach
                  </button>

                  {state.activeHintIndex >= 0 && (
                    <div className={styles.hintModalOverlay} role="dialog" aria-modal="true" aria-labelledby="hint-title">
                      <div className={styles.hintModalContent}>
                        <div className={styles.hintModalHeader}>
                          <h3 id="hint-title">{HINTS[state.activeHintIndex]?.title}</h3>
                          <button
                            type="button"
                            className={styles.closeBtn}
                            onClick={() => dispatch({ type: "CLOSE_HINT" })}
                            aria-label="Close hint modal"
                          >
                            ✕
                          </button>
                        </div>
                        <p className={styles.hintModalBody}>{HINTS[state.activeHintIndex]?.content}</p>
                        <div className={styles.hintModalFooter}>
                          <span className={styles.hintIndexIndicator}>
                            Hint {state.activeHintIndex + 1} of {HINTS.length}
                          </span>
                          {state.activeHintIndex < HINTS.length - 1 ? (
                            <button
                              type="button"
                              className={styles.nextHintBtn}
                              onClick={() => dispatch({ type: "NEXT_HINT" })}
                            >
                              Next Hint →
                            </button>
                          ) : (
                            <button
                              type="button"
                              className={styles.nextHintBtn}
                              onClick={() => dispatch({ type: "CLOSE_HINT" })}
                            >
                              Got it!
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>

          {/* Guided Proof Step Ribbon */}
          <nav className={styles.proofStepsRibbon} aria-label="Guided proof progress steps">
            {PROOF_STEPS.map((step, idx) => {
              const isCurrent = state.activeStep === idx;
              const isDone = state.activeStep > idx;
              return (
                <button
                  key={step.id}
                  type="button"
                  className={`${styles.stepPill} ${isCurrent ? styles.stepPillActive : ""} ${
                    isDone ? styles.stepPillDone : ""
                  }`}
                  onClick={() => dispatch({ type: "SET_PROOF_STEP", stepIndex: idx })}
                >
                  <span className={styles.stepPillNum}>{idx + 1}</span>
                  <span className={styles.stepPillLabel}>{step.title}</span>
                </button>
              );
            })}
          </nav>
        </main>
      </div>

      {/* Screen Reader Live Announcement */}
      <div id={liveRegionId} role="status" aria-live="polite" className={styles.srOnly}>
        {state.announcement}
      </div>

      {/* Info Tooltip Popup */}
      {infoTooltip && (
        <div className={styles.infoModalOverlay} onClick={() => setInfoTooltip(null)}>
          <div className={styles.infoModalCard} onClick={(e) => e.stopPropagation()}>
            <p>{infoTooltip}</p>
            <button type="button" className={styles.infoCloseBtn} onClick={() => setInfoTooltip(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {state.isSettingsOpen && (
        <div className={styles.settingsModalOverlay} role="dialog" aria-modal="true" aria-labelledby="settings-title">
          <div className={styles.settingsModalCard}>
            <div className={styles.settingsModalHeader}>
              <h3 id="settings-title">Proof Settings & Preferences</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", value: false })}
              >
                ✕
              </button>
            </div>
            <div className={styles.settingsOptionsList}>
              <label className={styles.settingsOptionRow}>
                <span>High-contrast labels</span>
                <input
                  type="checkbox"
                  checked={state.showLabels}
                  onChange={() => dispatch({ type: "TOGGLE_LABELS" })}
                />
              </label>
              <label className={styles.settingsOptionRow}>
                <span>Magnetic snapping</span>
                <input
                  type="checkbox"
                  checked={state.snapEnabled}
                  onChange={() => dispatch({ type: "TOGGLE_SNAP" })}
                />
              </label>
              <div className={styles.settingsOptionRow}>
                <span>Animation Speed</span>
                <select
                  value={state.animationSpeed}
                  onChange={(e) => dispatch({ type: "SET_ANIMATION_SPEED", value: Number(e.target.value) })}
                >
                  <option value={0.5}>0.5×</option>
                  <option value={1}>1.0×</option>
                  <option value={1.5}>1.5×</option>
                </select>
              </div>
              <div className={styles.scoreBox}>
                <span>Proof Mastery Score: </span>
                <strong>{progress.completionScore}%</strong>
              </div>
            </div>
            <button
              type="button"
              className={styles.saveSettingsBtn}
              onClick={() => dispatch({ type: "SET_SETTINGS_OPEN", value: false })}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

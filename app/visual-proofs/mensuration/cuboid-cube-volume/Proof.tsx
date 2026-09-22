"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Box, CheckCircle2, Clock3, Grid3X3, Layers, Lightbulb, Pause, Play, RotateCcw, Ruler } from "lucide-react";
import ProofMainMenu from "../../../components/ProofMainMenu";
import { animationStep, cubeDimensions, cuboidMeasures, visibleCubesAtProgress, wholeDimension } from "../../../lib/cuboidVolumeMath";
import CuboidScene from "./CuboidScene";
import { proofConfig } from "./proof.config";
import styles from "./CuboidVolumeProof.module.css";

type Mode = "cuboid" | "cube";
type Playback = "idle" | "playing" | "paused" | "done";
type Challenge = 0 | 1 | 2;

const animationNarration = [
  "Start with an empty unit-square base.",
  "Count one row: length l unit cubes.",
  "Fill the base: l × w cubes in one layer.",
  "Stack identical layers upward.",
  "All layers are filled: V = l × w × h.",
];

function DimensionControl({ label, symbol, value, color, onChange, inputRef }: {
  label: string;
  symbol: string;
  value: number;
  color: string;
  onChange: (value: number) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}) {
  return <label className={styles.dimensionControl} style={{ "--dimension-color": color } as React.CSSProperties}>
    <span><b>{label} <i>({symbol})</i></b><output>{value}</output></span>
    <input ref={inputRef} type="range" min="1" max="10" step="1" value={value} aria-label={`${label} ${symbol}`} aria-valuetext={`${value} units`} onChange={(event) => onChange(wholeDimension(Number(event.target.value)))} />
    <small><span>1</span><span>10</span></small>
  </label>;
}

function Tool({ title, subtitle, icon, onClick, active, primary }: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  primary?: boolean;
}) {
  return <button type="button" className={`${styles.tool}${active ? ` ${styles.activeTool}` : ""}${primary ? ` ${styles.primaryTool}` : ""}`} onClick={onClick} aria-pressed={active}>
    <span className={styles.toolIcon}>{icon}</span><span><b>{title}</b><small>{subtitle}</small></span>
  </button>;
}

export default function Proof() {
  const [mode, setMode] = useState<Mode>("cuboid");
  const [length, setLength] = useState(4);
  const [width, setWidth] = useState(3);
  const [height, setHeight] = useState(2);
  const [side, setSide] = useState(3);
  const [showUnitCubes, setShowUnitCubes] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [separated, setSeparated] = useState(false);
  const [playback, setPlayback] = useState<Playback>("idle");
  const [progress, setProgress] = useState(1);
  const [resetViewToken, setResetViewToken] = useState(0);
  const [challengeOpen, setChallengeOpen] = useState(false);
  const [challenge, setChallenge] = useState<Challenge>(0);
  const [answers, setAnswers] = useState(["", ""]);
  const [challengeFeedback, setChallengeFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const elapsedRef = useRef(0);
  const rafRef = useRef(0);
  const firstSliderRef = useRef<HTMLInputElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);
  const ideaRef = useRef<HTMLElement>(null);
  const challengeRef = useRef<HTMLElement>(null);

  const dimensions = mode === "cube" ? cubeDimensions(side) : { length, width, height };
  const { baseArea, layers, volume } = cuboidMeasures(dimensions);
  const visibleCount = playback === "idle" || playback === "done" ? volume : visibleCubesAtProgress(progress, dimensions);
  const activeStep = playback === "idle" ? -1 : animationStep(progress);

  useEffect(() => {
    if (playback !== "playing") return;
    const duration = 8500;
    const start = performance.now() - elapsedRef.current;
    const tick = (now: number) => {
      elapsedRef.current = Math.min(duration, now - start);
      setProgress(elapsedRef.current / duration);
      if (elapsedRef.current >= duration) {
        setPlayback("done");
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playback]);

  const stopForEdit = () => {
    elapsedRef.current = 0;
    setProgress(1);
    setPlayback("idle");
  };
  const startAnimation = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      setPlayback("done");
      return;
    }
    elapsedRef.current = 0;
    setProgress(0);
    setSeparated(false);
    setShowUnitCubes(true);
    setPlayback("playing");
  };
  const toggleAnimation = () => {
    if (playback === "playing") setPlayback("paused");
    else if (playback === "paused") setPlayback("playing");
    else startAnimation();
  };
  const changeMode = (next: Mode) => {
    stopForEdit();
    setMode(next);
    setSeparated(false);
  };
  const reset = () => {
    stopForEdit();
    setMode("cuboid");
    setLength(4);
    setWidth(3);
    setHeight(2);
    setSide(3);
    setShowUnitCubes(true);
    setShowDimensions(true);
    setShowGrid(true);
    setSeparated(false);
    setChallengeOpen(false);
    setAnswers(["", ""]);
    setChallengeFeedback("idle");
    setResetViewToken((token) => token + 1);
  };
  const adjustDimensions = () => {
    controlsRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    firstSliderRef.current?.focus();
  };
  const openChallenge = () => {
    setChallengeOpen(true);
    requestAnimationFrame(() => challengeRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };
  const chooseChallenge = (next: Challenge) => {
    setChallenge(next);
    setAnswers(["", ""]);
    setChallengeFeedback("idle");
  };
  const checkChallenge = () => {
    const correct = challenge === 0 ? Number(answers[0]) === 10 && Number(answers[1]) === 30
      : challenge === 1 ? Number(answers[0]) === 64 : Number(answers[0]) === 4;
    const filled = challenge === 0 ? answers[0] !== "" && answers[1] !== "" : answers[0] !== "";
    setChallengeFeedback(filled && correct ? "correct" : "wrong");
  };
  const loadChallengeModel = () => {
    stopForEdit();
    if (challenge === 0) { setMode("cuboid"); setLength(5); setWidth(2); setHeight(3); }
    if (challenge === 1) { setMode("cube"); setSide(4); }
  };

  return <main className={`proof-app ${styles.app}`}>
    <ProofMainMenu />
    <header className={styles.header}>
      <div className={styles.heading}>
        <nav aria-label="Breadcrumb"><Link href="/proofs">Visual Proofs</Link><span aria-hidden="true"> / </span><span>Mensuration</span></nav>
        <h1>{proofConfig.title}</h1>
        <p>{proofConfig.description}</p>
      </div>
      <div className={styles.headerActions}>
        <span className={styles.beginner}>Beginner</span>
        <span className={styles.time}><Clock3 size={17} aria-hidden="true" /> 8 min</span>
        <button type="button" className={styles.headerPrimary} onClick={openChallenge}>Check understanding</button>
        <button type="button" className={styles.headerSecondary} onClick={() => ideaRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" })}>Why it works</button>
      </div>
    </header>

    <div className={styles.workspace}>
      <div className={styles.mainColumn}>
        <section className={styles.mainCard} aria-label="Interactive cuboid volume proof">
          <div className={styles.stageGrid}>
            <div className={styles.stageArea} data-testid="visual-proof-primary-visual">
              <div className={styles.modeSwitch} role="group" aria-label="Shape mode">
                <button type="button" className={mode === "cuboid" ? styles.selectedMode : ""} aria-pressed={mode === "cuboid"} onClick={() => changeMode("cuboid")}><Box size={21} aria-hidden="true" /> Cuboid</button>
                <button type="button" className={mode === "cube" ? styles.selectedMode : ""} aria-pressed={mode === "cube"} onClick={() => changeMode("cube")}><Box size={21} aria-hidden="true" /> Cube</button>
              </div>
              <div className={styles.sceneWrap}>
                <div className={styles.sceneCallout}><b>{playback === "idle" ? "Drag the sliders" : animationNarration[activeStep]}</b><span>{playback === "idle" ? "Change a dimension, then orbit the model to count its cubes." : `${visibleCount} of ${volume} unit cubes in place`}</span></div>
                <CuboidScene dimensions={dimensions} visibleCount={visibleCount} showUnitCubes={showUnitCubes} showGrid={showGrid} showDimensions={showDimensions} separated={separated} resetViewToken={resetViewToken} />
              </div>
              {playback !== "idle" && <div className={styles.playbackBar} role="status" aria-live="polite"><span>Step {activeStep + 1} / 5: {animationNarration[activeStep]}</span><div><button type="button" onClick={toggleAnimation}>{playback === "playing" ? <Pause size={16} /> : <Play size={16} />}{playback === "playing" ? "Pause" : playback === "paused" ? "Resume" : "Replay"}</button><button type="button" onClick={stopForEdit}>Show all</button></div></div>}
            </div>

            <div ref={controlsRef} className={styles.controls} aria-label="Dimensions and display settings">
              {mode === "cuboid" ? <>
                <DimensionControl label="Length" symbol="l" value={length} color="#6841ec" inputRef={firstSliderRef} onChange={(value) => { stopForEdit(); setLength(value); }} />
                <DimensionControl label="Width" symbol="w" value={width} color="#13a57d" onChange={(value) => { stopForEdit(); setWidth(value); }} />
                <DimensionControl label="Height" symbol="h" value={height} color="#ed5261" onChange={(value) => { stopForEdit(); setHeight(value); }} />
              </> : <>
                <DimensionControl label="Side" symbol="s" value={side} color="#6841ec" inputRef={firstSliderRef} onChange={(value) => { stopForEdit(); setSide(value); }} />
                <p className={styles.cubeNote}>All three dimensions are equal: l = w = h = s.</p>
              </>}
              <div className={styles.switches}>
                <label><span>Show unit cubes</span><input type="checkbox" checked={showUnitCubes} onChange={(event) => { stopForEdit(); setShowUnitCubes(event.target.checked); }} /></label>
                <label><span>Show dimensions</span><input type="checkbox" checked={showDimensions} onChange={(event) => setShowDimensions(event.target.checked)} /></label>
                <label><span>Show grid</span><input type="checkbox" checked={showGrid} onChange={(event) => setShowGrid(event.target.checked)} /></label>
              </div>
              <button type="button" className={styles.resetControl} onClick={reset}><RotateCcw size={17} aria-hidden="true" /> Reset</button>
            </div>
          </div>

          <div className={styles.resultCard}>
            <div className={styles.resultTitle}><Box size={28} aria-hidden="true" /><div><h2>Volume of a {mode === "cube" ? "Cube" : "Cuboid"}</h2><p>One layer has {baseArea} unit cubes. Stack {layers} {layers === 1 ? "layer" : "layers"}.</p></div></div>
            {mode === "cuboid" ? <p className={styles.equation}>V = <em>l</em> × <em>w</em> × <em>h</em> = <strong className={styles.purple}>{length}</strong> × <strong className={styles.green}>{width}</strong> × <strong className={styles.red}>{height}</strong> = <b>{volume} cubic units</b></p>
              : <p className={styles.equation}>V = s × s × s = s³ = {side}³ = <b>{volume} cubic units</b></p>}
            <div className={styles.resultSummary}><CheckCircle2 size={22} aria-hidden="true" /> Each small cube has volume 1 cubic unit. The {mode} contains <b>{volume} unit cubes.</b></div>
          </div>

          <div className={styles.breakdown}>
            <div><h3>Length × Width (base area)</h3><p><span className={styles.purple}>{dimensions.length}</span> × <span className={styles.green}>{dimensions.width}</span> = <b>{baseArea} square units</b></p></div>
            <div><h3>Number of layers</h3><p><span className={styles.red}>{layers}</span> {layers === 1 ? "layer" : "layers"}</p></div>
            <div><h3>Total volume</h3><p><span className={styles.purple}>{baseArea}</span> × <span className={styles.red}>{layers}</span> = <b>{volume} cubic units</b></p></div>
          </div>
        </section>
      </div>

      <aside className={styles.sideColumn}>
        <section className={styles.sideCard}><h2>Tools</h2><div className={styles.toolList}>
          <Tool title="Adjust dimensions" subtitle="Change length, width or height" icon={<Ruler size={21} />} onClick={adjustDimensions} primary />
          <Tool title="Show unit cubes" subtitle="See how the cuboid is built" icon={<Grid3X3 size={21} />} onClick={() => { stopForEdit(); setShowUnitCubes(!showUnitCubes); }} active={showUnitCubes} />
          <Tool title={separated ? "Recombine layers" : "Separate layers"} subtitle="See each l × w layer" icon={<Layers size={21} />} onClick={() => { stopForEdit(); setSeparated(!separated); setShowUnitCubes(true); }} active={separated} />
          <Tool title={mode === "cube" ? "Switch to cuboid" : "Switch to cube"} subtitle="Explore l = w = h" icon={<Box size={21} />} onClick={() => changeMode(mode === "cube" ? "cuboid" : "cube")} active={mode === "cube"} />
          <Tool title={playback === "playing" ? "Pause proof" : playback === "paused" ? "Resume proof" : playback === "done" ? "Replay proof" : "Animate proof"} subtitle="Watch the volume being built" icon={playback === "playing" ? <Pause size={21} /> : <Play size={21} />} onClick={toggleAnimation} active={playback === "playing"} />
          <Tool title="Reset" subtitle="Return to default values" icon={<RotateCcw size={21} />} onClick={reset} />
          <Tool title="Reset view" subtitle="Restore the camera angle" icon={<RotateCcw size={21} />} onClick={() => setResetViewToken((token) => token + 1)} />
        </div></section>

        <section ref={ideaRef} className={styles.sideCard}><h2>The idea <span>(Visual Proof)</span></h2><ol className={styles.ideaList}>
          {[
            <>A cuboid can be filled with <b>unit cubes</b>.</>,
            <>Each layer has <b>l × w = {baseArea}</b> cubes.</>,
            <>There are <b>h = {layers}</b> such layers.</>,
            <>Total cubes: <b>{baseArea} × {layers} = {volume}</b>.</>,
            <>Each cube has volume 1, so <b>V = {mode === "cube" ? "s³" : "l × w × h"}</b>.</>,
          ].map((step, index) => <li key={index} className={activeStep === index ? styles.activeIdea : ""}><span>{index + 1}</span><p>{step}</p></li>)}
        </ol></section>

        <button type="button" className={styles.specialCard} onClick={() => changeMode("cube")}><Lightbulb size={26} aria-hidden="true" /><span><b>Special case: Cube</b><small>If l = w = h = s, then V = s × s × s = s³. Click to explore.</small></span></button>

        {challengeOpen && <section ref={challengeRef} className={styles.sideCard} id="cuboid-challenge"><h2>Check understanding</h2><div className={styles.challengeTabs} role="group" aria-label="Challenge type">{([0, 1, 2] as Challenge[]).map((index) => <button key={index} type="button" aria-pressed={challenge === index} onClick={() => chooseChallenge(index)}>Task {index + 1}</button>)}</div>
          {challenge === 0 ? <><p>Build a cuboid with l = 5, w = 2, h = 3. How many cubes are in one layer, then in the whole cuboid?</p><button className={styles.loadModel} type="button" onClick={loadChallengeModel}>Build 5 × 2 × 3</button><label>One layer <input type="number" inputMode="numeric" value={answers[0]} onChange={(event) => { setAnswers([event.target.value, answers[1]]); setChallengeFeedback("idle"); }} /></label><label>Total cubes <input type="number" inputMode="numeric" value={answers[1]} onChange={(event) => { setAnswers([answers[0], event.target.value]); setChallengeFeedback("idle"); }} /></label></>
            : challenge === 1 ? <><p>For a cube with side s = 4, what is its volume?</p><button className={styles.loadModel} type="button" onClick={loadChallengeModel}>Build a 4 × 4 × 4 cube</button><label>Volume in cubic units <input type="number" inputMode="numeric" value={answers[0]} onChange={(event) => { setAnswers([event.target.value, ""]); setChallengeFeedback("idle"); }} /></label></>
              : <><p>A cuboid has V = 48 cubic units, l = 4 and w = 3. How many layers high is it?</p><label>Height h <input type="number" inputMode="numeric" value={answers[0]} onChange={(event) => { setAnswers([event.target.value, ""]); setChallengeFeedback("idle"); }} /></label></>}
          <button type="button" className={styles.checkButton} onClick={checkChallenge}>Check answer</button>
          {challengeFeedback !== "idle" && <p className={challengeFeedback === "correct" ? styles.correct : styles.wrong} role="status">{challengeFeedback === "correct" ? "Correct — the unit cubes match your answer." : "Not quite. Count the cubes in one layer, then multiply by the number of layers."}</p>}
        </section>}
      </aside>
    </div>
    <p className={styles.screenReaderSummary} aria-live="polite">A {mode} of length {dimensions.length}, width {dimensions.width} and height {dimensions.height} contains {volume} unit cubes and has volume {volume} cubic units.</p>
  </main>;
}

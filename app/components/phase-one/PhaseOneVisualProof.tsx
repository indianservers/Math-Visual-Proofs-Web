"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Clock3, Lightbulb, Play, RotateCcw, Wrench } from "lucide-react";
import ProofMainMenu from "../ProofMainMenu";
import styles from "./PhaseOneVisualProof.module.css";

export type ProofMeta = {
  title: string;
  catalogTitle?: string;
  category: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
};

export type ProofStep = { title: string; body: ReactNode };

type PageProps = {
  meta: ProofMeta;
  children: ReactNode;
  tools: ReactNode;
  steps: ProofStep[];
  activeStep?: number;
  result: ReactNode;
  challenge: ReactNode;
};

export function PhaseOneVisualProof({
  meta,
  children,
  tools,
  steps,
  activeStep = -1,
  result,
  challenge,
}: PageProps) {
  return (
    <main className={`proof-app ${styles.app}`}>
      <ProofMainMenu />
      <header className={styles.header}>
        {meta.catalogTitle && <span className={styles.catalogTitle}>{meta.catalogTitle}</span>}
        <div className={styles.heading}>
          <nav aria-label="Breadcrumb">
            <Link href="/proofs">Visual Proofs</Link>
            <span aria-hidden="true"> / </span>
            <span>{meta.category}</span>
          </nav>
          <h1>{meta.title}</h1>
          <p>{meta.description}</p>
        </div>
        <div className={styles.badges} aria-label="Proof details">
          <span>{meta.difficulty}</span>
          <span><Clock3 size={16} aria-hidden="true" /> {meta.estimatedTime}</span>
        </div>
      </header>

      <section className={styles.workspace}>
        <div className={styles.leftColumn}>
          <section className={styles.visualPanel} data-testid="visual-proof-primary-visual">
            {children}
          </section>
          <section className={styles.resultPanel}>
            <span className={styles.resultIcon}><CheckCircle2 aria-hidden="true" /></span>
            <div><small>The Result</small>{result}</div>
          </section>
        </div>

        <aside className={styles.sideColumn}>
          <section className={styles.sidePanel}>
            <h2><Wrench aria-hidden="true" /> Tools</h2>
            <div className={styles.toolList}>{tools}</div>
          </section>
          <section className={styles.sidePanel}>
            <h2><Lightbulb aria-hidden="true" /> The idea <span>(Visual Proof)</span></h2>
            <ol className={styles.steps}>
              {steps.map((step, index) => (
                <li key={step.title} className={index === activeStep ? styles.activeStep : undefined}>
                  <i>{index + 1}</i>
                  <div><b>{step.title}</b><p>{step.body}</p></div>
                </li>
              ))}
            </ol>
          </section>
          <section className={`${styles.sidePanel} ${styles.challengePanel}`}>
            <h2>Check understanding</h2>
            {challenge}
          </section>
        </aside>
      </section>
    </main>
  );
}

type ToolButtonProps = {
  title: string;
  subtitle: string;
  active?: boolean;
  onClick: () => void;
  icon?: ReactNode;
  disabled?: boolean;
};

export function ToolButton({ title, subtitle, active, onClick, icon, disabled }: ToolButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.toolButton} ${active ? styles.activeTool : ""}`}
      onClick={onClick}
      aria-pressed={active}
      disabled={disabled}
    >
      <span className={styles.toolIcon}>{icon ?? <Play size={18} />}</span>
      <span><b>{title}</b><small>{subtitle}</small></span>
    </button>
  );
}

export function ResetTool({ onClick }: { onClick: () => void }) {
  return <ToolButton title="Reset" subtitle="Return to the starting values" onClick={onClick} icon={<RotateCcw size={18} />} />;
}

type RangeProps = {
  label: ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  display?: ReactNode;
  ariaValueText?: string;
};

export function MathRange({ label, value, min, max, step = 1, onChange, display, ariaValueText }: RangeProps) {
  return (
    <label className={styles.rangeCard}>
      <span><b>{label}</b><output>{display ?? value}</output></span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={typeof label === "string" ? label : "Mathematical value"}
        aria-valuetext={ariaValueText}
      />
    </label>
  );
}

export function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className={styles.toggle}>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span aria-hidden="true">✓</span>{label}
    </label>
  );
}

export function Feedback({ state }: { state: "idle" | "correct" | "wrong" }) {
  if (state === "idle") return null;
  return <p className={state === "correct" ? styles.correct : styles.wrong}>{state === "correct" ? "Correct — the visualization confirms it." : "Not yet — use the live values and try again."}</p>;
}

export function useRafAnimation(onFrame: (progress: number) => void) {
  const frameRef = useRef<number | null>(null);
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    setPlaying(false);
  }, []);

  const start = useCallback((duration = 4200) => {
    stop();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      onFrame(1);
      return;
    }
    setPlaying(true);
    const started = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      onFrame(progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(tick);
      else {
        frameRef.current = null;
        setPlaying(false);
      }
    };
    frameRef.current = requestAnimationFrame(tick);
  }, [onFrame, stop]);

  useEffect(() => stop, [stop]);
  return { playing, start, stop };
}

export function svgPoint(event: React.PointerEvent<SVGSVGElement>, viewBox: { width: number; height: number }) {
  const rect = event.currentTarget.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * viewBox.width,
    y: ((event.clientY - rect.top) / rect.height) * viewBox.height,
  };
}

export { styles as phaseOneStyles };

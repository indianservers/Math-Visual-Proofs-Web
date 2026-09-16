"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { getProofFeelById } from "../lib/proofFeel";
import styles from "./VisualProofShell.module.css";

type VisualProofShellProps = {
  id?: string;
  title: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  children: ReactNode;
};

const TONE_CLASS: Record<string, string | undefined> = {
  rearrange: styles.toneRearrange,
  angle: styles.toneAngle,
  measure: styles.toneMeasure,
  tile: styles.toneTile,
  limit: styles.toneLimit,
  grid: styles.toneGrid,
  transform: styles.toneTransform,
  number: styles.toneNumber,
  compare: styles.toneCompare,
  simulate: styles.toneSimulate,
  data: styles.toneData,
  vector: styles.toneVector,
  complex: styles.toneComplex,
  growth: styles.toneGrowth,
  applied: styles.toneApplied,
  pattern: styles.tonePattern,
  general: styles.toneGeneral,
};

/**
 * Canvas-first chrome for visual proofs.
 * Keeps a slim top strip only — no tall Workspace/About side bars.
 * About details live in a compact disclosure instead of a left column.
 */
export default function VisualProofShell({
  id,
  title,
  category,
  difficulty,
  estimatedTime,
  description,
  children,
}: VisualProofShellProps) {
  const [aboutOpen, setAboutOpen] = useState(false);
  const feel = id ? getProofFeelById(id) : null;

  return (
    <main className={styles.page}>
      <header className={styles.topbar}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link href="/proofs">Visual Proofs</Link>
          <span aria-hidden="true">/</span>
          <span>{category}</span>
        </nav>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.meta} aria-label="Proof details">
          <span className={styles.chip}>{difficulty}</span>
          <span className={styles.chip}>{estimatedTime}</span>
          <button
            type="button"
            className={styles.aboutToggle}
            aria-expanded={aboutOpen}
            onClick={() => setAboutOpen((value) => !value)}
          >
            About
          </button>
        </div>
      </header>

      {aboutOpen && (
        <p className={styles.aboutPanel} role="note">
          {description}
        </p>
      )}

      {feel && (
        <aside
          className={[styles.feelStrip, TONE_CLASS[feel.tone]]
            .filter(Boolean)
            .join(" ")}
          aria-label="How this is proved"
        >
          <span className={styles.feelGlyph} aria-hidden="true">
            {feel.methodGlyph}
          </span>
          <div className={styles.feelCopy}>
            <b>{feel.methodLabel}</b>
            <span>{feel.doThis}</span>
          </div>
          <p className={styles.feelAha}>{feel.provedWhen}</p>
        </aside>
      )}

      <section className={styles.workspace}>{children}</section>
    </main>
  );
}

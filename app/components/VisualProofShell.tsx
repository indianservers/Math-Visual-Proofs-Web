"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import styles from "./VisualProofShell.module.css";

type VisualProofShellProps = {
  title: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  children: ReactNode;
};

/**
 * Canvas-first chrome for visual proofs.
 * Keeps a slim top strip only — no tall Workspace/About side bars.
 * About details live in a compact disclosure instead of a left column.
 */
export default function VisualProofShell({
  title,
  category,
  difficulty,
  estimatedTime,
  description,
  children,
}: VisualProofShellProps) {
  const [aboutOpen, setAboutOpen] = useState(false);

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

      <section className={styles.workspace}>{children}</section>
    </main>
  );
}

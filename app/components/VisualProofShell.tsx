import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./VisualProofShell.module.css";

type VisualProofShellProps = {
  title: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  children: ReactNode;
};

/** Stable page chrome for independently developed visual proofs. */
export default function VisualProofShell({
  title,
  category,
  difficulty,
  estimatedTime,
  description,
  children,
}: VisualProofShellProps) {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <nav className={styles.crumbs} aria-label="Breadcrumb">
            <Link href="/proofs">Visual Proofs</Link>
            <span aria-hidden="true">/</span>
            <span>{category}</span>
          </nav>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        <div className={styles.badges} aria-label="Proof details">
          <span>{difficulty}</span>
          <span>{estimatedTime}</span>
        </div>
      </header>
      <section className={styles.workspace}>{children}</section>
    </main>
  );
}

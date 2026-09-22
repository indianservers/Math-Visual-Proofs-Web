"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import ProofDeskTabs from "./ProofDeskTabs";
import ProofMainMenu from "./ProofMainMenu";
import { ProofCanvasHost } from "../proof-engine/ProofCanvasHost";

type VisualProofShellProps = {
  title: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  description: string;
  children: ReactNode;
  nativeWorkspace?: boolean;
};

/** Shared page chrome, menu, and canvas tools for independently developed proofs. */
export default function VisualProofShell({
  title,
  category,
  difficulty,
  estimatedTime,
  description,
  children,
  nativeWorkspace = false,
}: VisualProofShellProps) {
  return (
    <main className="proof-app visual-proof-shell">
      <ProofMainMenu />
      <ProofDeskTabs
        defaultTab="workspace"
        dock={
          <header className="page-head">
            <div>
              <nav className="crumb" aria-label="Breadcrumb">
                <Link href="/proofs">Visual Proofs</Link>
                <span aria-hidden="true"> / </span>
                <span>{category}</span>
              </nav>
              <h1>{title}</h1>
            </div>
            <div className="badges" aria-label="Proof details">
              <div className="pill">{difficulty}</div>
              <div className="pill time"><span className="clock" />{estimatedTime}</div>
            </div>
          </header>
        }
        tabs={[
          {
            id: "workspace",
            label: "Workspace",
            content: (
              <div className="shell-workspace">
                {nativeWorkspace ? children : (
                  <ProofCanvasHost
                    mode="embed"
                    instruction={`Explore ${title}. Use zoom and arrows for the shared canvas; this proof keeps its own moves.`}
                    hints={[
                      description,
                      "Try this proof's own buttons and sliders first.",
                      "Zoom in on a detail, then press Fit to see the whole argument.",
                    ]}
                  >
                    {children}
                  </ProofCanvasHost>
                )}
              </div>
            ),
          },
          {
            id: "about",
            label: "About",
            content: (
              <section className="mission generic-mission desk-about">
                <div className="target">◎</div>
                <div className="mission-copy"><b>Mission:</b> {description}</div>
              </section>
            ),
          },
        ]}
      />
    </main>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { VISUAL_PROOF_RESET_EVENT } from "../proof-engine/ProofCanvasHost";
import styles from "./ImportedHtmlProof.module.css";

type ImportedHtmlProofProps = {
  src: string;
  title: string;
};

const CHROME_OVERRIDE_HREF = "/imported/chrome-overrides.css";

/** Same-origin HTML visualization copied from the intern source repo. */
export default function ImportedHtmlProof({ src, title }: ImportedHtmlProofProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const injectOverrides = () => {
      const doc = frame.contentDocument;
      if (!doc?.head) return;
      if (doc.getElementById("maths-universe-chrome-overrides")) return;
      const link = doc.createElement("link");
      link.id = "maths-universe-chrome-overrides";
      link.rel = "stylesheet";
      link.href = CHROME_OVERRIDE_HREF;
      doc.head.appendChild(link);
    };

    const reload = () => { frame.src = src; };

    frame.addEventListener("load", injectOverrides);
    window.addEventListener(VISUAL_PROOF_RESET_EVENT, reload);
    // Handle fast cache hits where load already fired.
    if (frame.contentDocument?.readyState === "complete") {
      injectOverrides();
    }

    return () => {
      frame.removeEventListener("load", injectOverrides);
      window.removeEventListener(VISUAL_PROOF_RESET_EVENT, reload);
      frame.src = "about:blank";
    };
  }, [src]);

  return (
    <div className={styles.wrap}>
      <iframe
        ref={frameRef}
        className={styles.frame}
        src={src}
        title={title}
        sandbox="allow-scripts allow-same-origin allow-pointer-lock"
      />
    </div>
  );
}

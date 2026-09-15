"use client";

import { useEffect, useRef } from "react";
import styles from "./EmbeddedHtmlProof.module.css";

type EmbeddedHtmlProofProps = {
  /** Fully self-contained HTML document string for the team's proof. */
  html: string;
  title: string;
};

/**
 * Hosts a team-developed, self-contained HTML/CSS/JS visual proof inside our
 * application. The proof's exact markup, styles, and scripts run unmodified in
 * an inline `srcDoc` document that is bundled into our build (no external repo,
 * local files, or second dev server). The same-origin document lets us measure
 * content height for responsive sizing, and React tearing down the element on
 * unmount disposes every timer, animation frame, and listener the proof created.
 */
export default function EmbeddedHtmlProof({
  html,
  title,
}: EmbeddedHtmlProofProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let observer: ResizeObserver | null = null;
    let rafId = 0;
    let lastHeight = 0;

    const fit = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        try {
          const doc = frame.contentDocument;
          if (!doc) return;
          const height = Math.max(
            doc.documentElement?.scrollHeight ?? 0,
            doc.body?.scrollHeight ?? 0,
          );
          const next = Math.max(height, 560);
          // Only write when it actually changes to avoid ResizeObserver loops.
          if (height > 0 && Math.abs(next - lastHeight) > 1) {
            lastHeight = next;
            frame.style.height = `${next}px`;
          }
        } catch {
          /* cross-origin access should never happen for srcDoc, ignore */
        }
      });
    };

    const handleLoad = () => {
      fit();
      try {
        const doc = frame.contentDocument;
        if (doc?.body && typeof ResizeObserver !== "undefined") {
          observer = new ResizeObserver(() => fit());
          observer.observe(doc.body);
        }
      } catch {
        /* ignore */
      }
    };

    frame.addEventListener("load", handleLoad);
    if (frame.contentDocument?.readyState === "complete") handleLoad();

    return () => {
      frame.removeEventListener("load", handleLoad);
      observer?.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [html]);

  return (
    <div className={styles.wrap}>
      <iframe
        ref={frameRef}
        className={styles.frame}
        title={title}
        srcDoc={html}
        loading="lazy"
      />
    </div>
  );
}

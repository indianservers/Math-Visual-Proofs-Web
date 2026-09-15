"use client";

import { useEffect, useRef } from "react";
import styles from "./ImportedHtmlProof.module.css";

type ImportedHtmlProofProps = {
  src: string;
  title: string;
};

/** Same-origin HTML visualization copied from the intern source repo. */
export default function ImportedHtmlProof({ src, title }: ImportedHtmlProofProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    return () => {
      if (frame) frame.src = "about:blank";
    };
  }, []);

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

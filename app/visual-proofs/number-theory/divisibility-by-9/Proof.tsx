"use client";

import { useSyncExternalStore } from "react";
import "katex/dist/katex.min.css";
import { DivisibilityBy9ProofPage as ProofPage } from "./impl/DivisibilityBy9ProofPage";

const subscribe = () => () => {};

// Interactive proofs may initialise non-deterministically (random seeds,
// viewport measurement); render client-only to avoid hydration mismatches.
export default function Proof() {
  const isClient = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  if (!isClient) return null;
  return <ProofPage />;
}

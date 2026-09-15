"use client";

import { useSyncExternalStore } from "react";
import "katex/dist/katex.min.css";
import ProofPage from "./impl/EigenvectorsDirectionsDoNotTurnProofPage";

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

"use client";

import { useSyncExternalStore } from "react";
import "katex/dist/katex.min.css";
import "../../../../vendor/harikishore/harikishore.css";
import { SimpleHarmonicMotionProofPage as ProofPage } from "../../../../vendor/harikishore/components/proof170/SimpleHarmonicMotionProofPage";

const subscribe = () => () => {};

// Interactive proofs may initialise non-deterministically; render client-only.
export default function Proof() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return null;
  return <ProofPage />;
}

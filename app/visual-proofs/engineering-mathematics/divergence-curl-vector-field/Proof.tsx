"use client";

import { useSyncExternalStore } from "react";
import "katex/dist/katex.min.css";
import "../../../../vendor/harikishore/harikishore.css";
import { DivergenceCurlVectorFieldProofPage as ProofPage } from "../../../../vendor/harikishore/components/proof174/DivergenceCurlVectorFieldProofPage";

const subscribe = () => () => {};

// Interactive proofs may initialise non-deterministically; render client-only.
export default function Proof() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return null;
  return <ProofPage />;
}

"use client";

import { useSyncExternalStore } from "react";
import "katex/dist/katex.min.css";
import "../../../../vendor/harikishore/harikishore.css";
import { TriangularNumbersProofPage as ProofPage } from "../../../../vendor/harikishore/components/proof186/TriangularNumbersProofPage";

const subscribe = () => () => {};

// Interactive proofs may initialise non-deterministically; render client-only.
export default function Proof() {
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return null;
  return <ProofPage />;
}

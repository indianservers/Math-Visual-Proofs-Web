"use client";

import ImportedHtmlProof from "../../../components/ImportedHtmlProof";
import { proofConfig } from "./proof.config";

export default function Proof() {
  return (
    <ImportedHtmlProof
      src="/imported-proofs/divisibility-by-3-and-9-digit-sum/index.html"
      title={proofConfig.title}
    />
  );
}

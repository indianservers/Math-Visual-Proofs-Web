"use client";

import ImportedHtmlProof from "../../../components/ImportedHtmlProof";
import { proofConfig } from "./proof.config";

export default function Proof() {
  return (
    <ImportedHtmlProof
      src="/imported-proofs/ellipse-sum-of-distances/index.html"
      title={proofConfig.title}
      autoHeightOnMobile
    />
  );
}

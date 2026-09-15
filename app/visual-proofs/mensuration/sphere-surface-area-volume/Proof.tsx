"use client";

import EmbeddedHtmlProof from "../../../components/EmbeddedHtmlProof";
import { proofConfig } from "./proof.config";
import html from "./proof.html?raw";

export default function Proof() {
  return <EmbeddedHtmlProof html={html} title={proofConfig.title} />;
}

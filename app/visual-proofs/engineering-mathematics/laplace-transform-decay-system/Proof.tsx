"use client";

import { useRouter } from "next/navigation";
import { LaplaceTransformDecaySystemProofPage } from "../../../imported/harikishore/components/proof172/LaplaceTransformDecaySystemProofPage";

export default function Proof() {
  const router = useRouter();
  return <LaplaceTransformDecaySystemProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

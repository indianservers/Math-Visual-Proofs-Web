"use client";

import { useRouter } from "next/navigation";
import { DivergenceCurlVectorFieldProofPage } from "../../../imported/harikishore/components/proof174/DivergenceCurlVectorFieldProofPage";

export default function Proof() {
  const router = useRouter();
  return <DivergenceCurlVectorFieldProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

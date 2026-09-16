"use client";

import { useRouter } from "next/navigation";
import { SimpleHarmonicMotionProofPage } from "../../../imported/harikishore/components/proof170/SimpleHarmonicMotionProofPage";

export default function Proof() {
  const router = useRouter();
  return <SimpleHarmonicMotionProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

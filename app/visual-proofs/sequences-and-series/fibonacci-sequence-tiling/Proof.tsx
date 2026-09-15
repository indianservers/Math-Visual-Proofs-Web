"use client";

import { useRouter } from "next/navigation";
import { FibonacciSequenceTilingProofPage } from "../../../imported/harikishore/components/proof188/FibonacciSequenceTilingProofPage";

export default function Proof() {
  const router = useRouter();
  return <FibonacciSequenceTilingProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

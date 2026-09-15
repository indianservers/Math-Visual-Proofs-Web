"use client";

import { useRouter } from "next/navigation";
import { FibonacciSpiralApproximationProofPage } from "../../../imported/harikishore/components/proof189/FibonacciSpiralApproximationProofPage";

export default function Proof() {
  const router = useRouter();
  return <FibonacciSpiralApproximationProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

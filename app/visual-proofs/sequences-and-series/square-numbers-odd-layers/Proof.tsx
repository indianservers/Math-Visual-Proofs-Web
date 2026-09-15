"use client";

import { useRouter } from "next/navigation";
import { SquareNumbersOddLayersProofPage } from "../../../imported/harikishore/components/proof187/SquareNumbersOddLayersProofPage";

export default function Proof() {
  const router = useRouter();
  return <SquareNumbersOddLayersProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

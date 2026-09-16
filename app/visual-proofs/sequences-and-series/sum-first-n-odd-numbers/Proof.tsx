"use client";

import { useRouter } from "next/navigation";
import { SumFirstNOddNumbersProofPage } from "../../../imported/harikishore/components/proof179/SumFirstNOddNumbersProofPage";

export default function Proof() {
  const router = useRouter();
  return <SumFirstNOddNumbersProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

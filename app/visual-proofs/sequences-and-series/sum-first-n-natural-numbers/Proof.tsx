"use client";

import { useRouter } from "next/navigation";
import { SumFirstNNaturalNumbersProofPage } from "../../../imported/harikishore/components/proof178/SumFirstNNaturalNumbersProofPage";

export default function Proof() {
  const router = useRouter();
  return <SumFirstNNaturalNumbersProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

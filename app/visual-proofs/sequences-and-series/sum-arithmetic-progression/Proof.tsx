"use client";

import { useRouter } from "next/navigation";
import { SumArithmeticProgressionProofPage } from "../../../imported/harikishore/components/proof180/SumArithmeticProgressionProofPage";

export default function Proof() {
  const router = useRouter();
  return <SumArithmeticProgressionProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

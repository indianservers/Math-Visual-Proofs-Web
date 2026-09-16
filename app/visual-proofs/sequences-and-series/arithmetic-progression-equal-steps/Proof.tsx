"use client";

import { useRouter } from "next/navigation";
import { ArithmeticProgressionEqualStepsProofPage } from "../../../imported/harikishore/components/proof177/ArithmeticProgressionEqualStepsProofPage";

export default function Proof() {
  const router = useRouter();
  return <ArithmeticProgressionEqualStepsProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

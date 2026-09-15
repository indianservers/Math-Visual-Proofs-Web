"use client";

import { useRouter } from "next/navigation";
import { GradientSteepestIncreaseProofPage } from "../../../imported/harikishore/components/proof173/GradientSteepestIncreaseProofPage";

export default function Proof() {
  const router = useRouter();
  return <GradientSteepestIncreaseProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

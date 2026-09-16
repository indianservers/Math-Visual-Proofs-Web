"use client";

import { useRouter } from "next/navigation";
import { GeometricProgressionRepeatedScalingProofPage } from "../../../imported/harikishore/components/proof181/GeometricProgressionRepeatedScalingProofPage";

export default function Proof() {
  const router = useRouter();
  return <GeometricProgressionRepeatedScalingProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

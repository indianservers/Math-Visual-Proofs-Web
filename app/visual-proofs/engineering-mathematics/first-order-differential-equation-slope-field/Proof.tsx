"use client";

import { useRouter } from "next/navigation";
import { FirstOrderDifferentialEquationSlopeFieldProofPage } from "../../../imported/harikishore/components/proof169/FirstOrderDifferentialEquationSlopeFieldProofPage";

export default function Proof() {
  const router = useRouter();
  return <FirstOrderDifferentialEquationSlopeFieldProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

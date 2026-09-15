"use client";

import { useRouter } from "next/navigation";
import { TrapezoidalRuleNumericalIntegrationProofPage } from "../../../imported/harikishore/components/proof175/TrapezoidalRuleNumericalIntegrationProofPage";

export default function Proof() {
  const router = useRouter();
  return <TrapezoidalRuleNumericalIntegrationProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

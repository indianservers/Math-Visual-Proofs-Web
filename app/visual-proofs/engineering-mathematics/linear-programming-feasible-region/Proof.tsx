"use client";

import { useRouter } from "next/navigation";
import { LinearProgrammingFeasibleRegionProofPage } from "../../../imported/harikishore/components/proof176/LinearProgrammingFeasibleRegionProofPage";

export default function Proof() {
  const router = useRouter();
  return <LinearProgrammingFeasibleRegionProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

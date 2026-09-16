"use client";

import { useRouter } from "next/navigation";
import { FiniteGeometricSeriesSumProofPage } from "../../../imported/harikishore/components/proof182/FiniteGeometricSeriesSumProofPage";

export default function Proof() {
  const router = useRouter();
  return <FiniteGeometricSeriesSumProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

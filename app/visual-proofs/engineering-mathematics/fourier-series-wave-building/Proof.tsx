"use client";

import { useRouter } from "next/navigation";
import { FourierSeriesWaveBuildingProofPage } from "../../../imported/harikishore/components/proof171/FourierSeriesWaveBuildingProofPage";

export default function Proof() {
  const router = useRouter();
  return <FourierSeriesWaveBuildingProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

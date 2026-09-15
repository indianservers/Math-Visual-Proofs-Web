"use client";

import { useRouter } from "next/navigation";
import { TransformationMatrices2DProofPage } from "../../../imported/harikishore/components/proof168/TransformationMatrices2DProofPage";

export default function Proof() {
  const router = useRouter();
  return <TransformationMatrices2DProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

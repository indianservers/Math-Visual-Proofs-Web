"use client";

import { useRouter } from "next/navigation";
import { SierpinskiRemovedSquareSumProofPage } from "../../../imported/harikishore/components/proof184/SierpinskiRemovedSquareSumProofPage";

export default function Proof() {
  const router = useRouter();
  return <SierpinskiRemovedSquareSumProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

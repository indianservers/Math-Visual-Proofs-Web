"use client";

import { useRouter } from "next/navigation";
import { SierpinskiRetainedAreaProofPage } from "../../../imported/harikishore/components/proof183/SierpinskiRetainedAreaProofPage";

export default function Proof() {
  const router = useRouter();
  return <SierpinskiRetainedAreaProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

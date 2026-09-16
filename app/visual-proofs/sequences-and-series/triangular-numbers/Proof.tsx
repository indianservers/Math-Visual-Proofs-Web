"use client";

import { useRouter } from "next/navigation";
import { TriangularNumbersProofPage } from "../../../imported/harikishore/components/proof186/TriangularNumbersProofPage";

export default function Proof() {
  const router = useRouter();
  return <TriangularNumbersProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

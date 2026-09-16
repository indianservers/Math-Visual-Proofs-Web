"use client";

import { useRouter } from "next/navigation";
import { LineRotationalSymmetryProofPage } from "../../../imported/harikishore/components/proof/LineRotationalSymmetryProofPage";

export default function Proof() {
  const router = useRouter();
  return <LineRotationalSymmetryProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

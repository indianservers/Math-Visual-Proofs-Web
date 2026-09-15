"use client";

import { useRouter } from "next/navigation";
import { TessellationsRepeatedTransformationsProofPage } from "../../../imported/harikishore/components/proof167/TessellationsRepeatedTransformationsProofPage";

export default function Proof() {
  const router = useRouter();
  return <TessellationsRepeatedTransformationsProofPage onBackToDashboard={() => router.push("/proofs")} />;
}

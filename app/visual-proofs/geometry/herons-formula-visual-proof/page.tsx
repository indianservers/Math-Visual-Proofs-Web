import VisualProofShell from "../../../components/VisualProofShell";
import Proof from "./Proof";
import { proofConfig } from "./proof.config";

export default function Page() {
  return (
    <VisualProofShell {...proofConfig}>
      <Proof />
    </VisualProofShell>
  );
}

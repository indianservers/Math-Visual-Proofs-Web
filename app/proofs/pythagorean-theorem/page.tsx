import PythagoreanProof from "../../components/PythagoreanProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("pythagorean-theorem");

export default function Page() {
  return <PythagoreanProof />;
}

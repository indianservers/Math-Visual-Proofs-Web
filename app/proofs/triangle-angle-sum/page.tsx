import AngleSumTriangleProof from "../../components/AngleSumTriangleProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("triangle-angle-sum");

export default function Page() {
  return <AngleSumTriangleProof />;
}

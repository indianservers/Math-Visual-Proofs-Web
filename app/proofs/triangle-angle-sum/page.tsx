import GeometryProof from "../../components/GeometryProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("triangle-angle-sum");

export default function Page() {
  return <GeometryProof kind="angles" />;
}

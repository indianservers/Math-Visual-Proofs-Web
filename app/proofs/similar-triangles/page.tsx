import GeometryProof from "../../components/GeometryProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("similar-triangles");

export default function Page() {
  return <GeometryProof kind="similar" />;
}

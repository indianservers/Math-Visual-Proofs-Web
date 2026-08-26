import GeometryProof from "../../components/GeometryProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("triangle-area");

export default function Page() {
  return <GeometryProof kind="area" />;
}

import GeometryProof from "../../components/GeometryProof";
import { metadataForProof } from "../../lib/proofRegistry";

export const metadata = metadataForProof("exterior-angle-theorem");

export default function Page() {
  return <GeometryProof kind="exterior" />;
}

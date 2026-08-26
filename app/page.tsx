import { redirect } from "next/navigation";
import { PROOF_DEFINITIONS } from "./lib/proofRegistry";

export default function Home() {
  redirect(PROOF_DEFINITIONS[0].route);
}

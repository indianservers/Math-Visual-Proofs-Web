import type { Metadata } from "next";
import Proof from "./Proof";

export const metadata: Metadata = {
  title: "Euler Form and Unit Circle — Visual Proof",
  description:
    "Explore how the complex exponential maps angles to the unit circle and generates cosine and sine.",
};

export default function Page() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_40%_0%,#ffffff_0%,#f8f9ff_48%,#f1f2ff_100%)] px-3 py-4 sm:px-5">
      <Proof />
    </main>
  );
}

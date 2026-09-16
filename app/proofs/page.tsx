import type { Metadata } from "next";
import Link from "next/link";
import ProofCatalogBrowser from "../components/ProofCatalogBrowser";
import { PROOF_DEFINITIONS } from "../lib/proofRegistry";
import {
  ALL_VISUAL_PROOFS,
  VISUAL_PROOF_CATEGORIES,
  catalogProofRoute,
  implementationStatusForProof,
  interactiveRouteForProof,
  proofFeelForProof,
  readinessForProof,
} from "../lib/visualProofCatalog";

export const metadata: Metadata = {
  title: "Visual Proofs Library — Maths Universe",
  description:
    "Browse interactive geometry proofs and learn by dragging, rearranging, extending, and resizing mathematical objects.",
  openGraph: {
    title: "Visual Proofs Library — Maths Universe",
    description: "Choose an interactive visual proof.",
    images: [],
  },
  twitter: {
    title: "Visual Proofs Library — Maths Universe",
    description: "Choose an interactive visual proof.",
    images: [],
  },
};

const cardDetails: Record<
  string,
  { number: string; icon: string; equation: string; action: string }
> = {
  "pythagorean-theorem": {
    number: "01",
    icon: "◲",
    equation: "a² + b² = c²",
    action: "Rearrange triangles",
  },
  "triangle-area": {
    number: "02",
    icon: "△",
    equation: "A = ½bh",
    action: "Move the apex",
  },
  "triangle-angle-sum": {
    number: "03",
    icon: "∠",
    equation: "A + B + C = 180°",
    action: "Lift the angles",
  },
  "exterior-angle-theorem": {
    number: "04",
    icon: "↗",
    equation: "x = A + B",
    action: "Extend the side",
  },
  "similar-triangles": {
    number: "05",
    icon: "△△",
    equation: "A′B′ / AB = k",
    action: "Resize the copy",
  },
};

export default function ProofsIndex() {
  return (
    <main className="proof-library">
      <aside className="library-sidebar" aria-label="Primary navigation">
        <Link
          href="/proofs"
          className="library-brand"
          aria-label="Maths Universe proof library"
        >
          <span className="brand-mark">✣</span>
          <b>
            MATHS
            <br />
            UNIVERSE
          </b>
        </Link>
        <nav className="side-nav">
          <Link href="/proofs" className="side-item active">
            <span className="side-icon">♧</span>Proofs
          </Link>
          <a href="#proof-grid" className="side-item">
            <span className="side-icon">△</span>Explore
          </a>
          <a href="#how-it-works" className="side-item">
            <span className="side-icon">◎</span>How it works
          </a>
        </nav>
      </aside>

      <section className="library-content">
        <header className="library-hero">
          <div>
            <div className="crumb">Maths Universe / Visual Proofs</div>
            <h1>See why mathematics works.</h1>
            <p>
              Choose a proof, move the shapes, and build the theorem yourself.
            </p>
          </div>
          <div
            className="library-summary"
            aria-label={`${PROOF_DEFINITIONS.length} interactive proofs`}
          >
            <strong>{PROOF_DEFINITIONS.length}</strong>
            <span>
              interactive
              <br />
              proofs
            </span>
          </div>
        </header>

        <section id="proof-grid" aria-labelledby="all-proofs-title">
          <div className="library-section-head">
            <div>
              <span className="eyebrow">GEOMETRY COLLECTION</span>
              <h2 id="all-proofs-title">All visual proofs</h2>
            </div>
            <span className="library-tip">
              ☝ Open a card to start exploring
            </span>
          </div>
          <div className="proof-card-grid">
            {PROOF_DEFINITIONS.map((proof) => {
              const detail = cardDetails[proof.id];
              return (
                <Link
                  href={proof.route}
                  className={`proof-library-card proof-card-${proof.id}`}
                  key={proof.id}
                >
                  <div className="proof-card-top">
                    <span className="proof-number">{detail.number}</span>
                    <span className="difficulty-chip">{proof.difficulty}</span>
                  </div>
                  <div className="proof-card-visual" aria-hidden="true">
                    <span>{detail.icon}</span>
                    <i>{detail.equation}</i>
                  </div>
                  <div className="proof-card-body">
                    <span className="proof-category">
                      {proof.category} · {proof.minutes} min
                    </span>
                    <h3>{proof.title}</h3>
                    <p>{proof.description}</p>
                  </div>
                  <div className="proof-card-action">
                    <span>{detail.action}</span>
                    <b>Start proof →</b>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <ProofCatalogBrowser
          categories={VISUAL_PROOF_CATEGORIES.map((category) => ({
            title: category.title,
            slug: category.slug,
            description: category.description,
            proofCount: category.actualProofCount,
          }))}
          proofs={ALL_VISUAL_PROOFS.map((proof) => {
            const feel = proofFeelForProof(proof);
            return {
              catalogNumber: proof.catalogNumber,
              title: proof.title,
              slug: proof.slug,
              categorySlug: proof.categorySlug,
              shortDescription: proof.shortDescription,
              difficulty: proof.difficulty,
              estimatedTime: proof.estimatedTime,
              tags: proof.tags,
              href: catalogProofRoute(proof),
              interactiveHref: interactiveRouteForProof(proof),
              implementationStatus: implementationStatusForProof(proof),
              readiness: readinessForProof(proof),
              methodLabel: feel.methodLabel,
              methodGlyph: feel.methodGlyph,
              doThis: feel.doThis,
              provedWhen: feel.provedWhen,
              uxEnhancement: feel.uxEnhancement,
            };
          })}
        />

        <section className="library-how" id="how-it-works">
          <div>
            <span>1</span>
            <b>Choose a theorem</b>
            <p>Each proof has its own dedicated interactive workspace.</p>
          </div>
          <div>
            <span>2</span>
            <b>Move the mathematics</b>
            <p>Drag, rotate, resize, snap, and inspect live shapes.</p>
          </div>
          <div>
            <span>3</span>
            <b>Build the conclusion</b>
            <p>Complete the visual argument and connect it to the formula.</p>
          </div>
        </section>
      </section>
    </main>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readinessLabel } from "../../../lib/proofFeel";
import { getProofImplementation } from "../../../lib/proofImplementation";
import {
  ALL_VISUAL_PROOFS,
  catalogProofRoute,
  getCatalogCategory,
  getCatalogProof,
  interactiveRouteForProof,
  proofFeelForProof,
  readinessForProof,
} from "../../../lib/visualProofCatalog";

type PageProps = { params: Promise<{ category: string; slug: string }> };

export function generateStaticParams() {
  return ALL_VISUAL_PROOFS.filter((proof) => {
    const implementation = getProofImplementation(proof.id);
    return !implementation || implementation.route !== catalogProofRoute(proof);
  }).map((proof) => ({
    category: proof.categorySlug,
    slug: proof.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const proof = getCatalogProof(category, slug);
  if (!proof) return { title: "Visual Proof Not Found — Maths Universe" };
  const title = `${proof.title} — Visual Proof`;
  return {
    title,
    description: proof.shortDescription,
    openGraph: { title, description: proof.shortDescription, images: [] },
    twitter: { title, description: proof.shortDescription, images: [] },
  };
}

export default async function VisualProofCatalogPage({ params }: PageProps) {
  const { category, slug } = await params;
  const proof = getCatalogProof(category, slug);
  if (!proof) notFound();
  const categoryInfo = getCatalogCategory(category);
  const interactiveRoute = interactiveRouteForProof(proof);
  const readiness = readinessForProof(proof);
  const feel = proofFeelForProof(proof);
  const related = ALL_VISUAL_PROOFS.filter(
    (item) => item.categorySlug === category && item.id !== proof.id,
  ).slice(0, 3);

  return (
    <main className="catalog-detail-page">
      <header className="catalog-detail-nav">
        <Link href="/proofs" className="catalog-detail-brand">
          <span>✣</span>
          <b>MATHS UNIVERSE</b>
        </Link>
        <Link href="/proofs" className="back-to-library">
          ← All visual proofs
        </Link>
      </header>

      <article className="catalog-detail-shell">
        <div className="catalog-detail-breadcrumb">
          <Link href="/proofs">Visual Proofs</Link>
          <span>/</span>
          <Link href={`/proofs#catalog-title`}>
            {categoryInfo?.title ?? category}
          </Link>
          <span>/</span>#{String(proof.catalogNumber).padStart(3, "0")}
        </div>
        <section className="catalog-detail-hero">
          <div className="catalog-detail-copy">
            <div className="catalog-detail-chips">
              <span
                className={`readiness-pill readiness-pill-${readiness}`}
              >
                {readinessLabel(readiness)}
              </span>
              <span>{proof.difficulty}</span>
              <span>{proof.estimatedTime}</span>
              <span>{proof.level}</span>
            </div>
            <h1>{proof.title}</h1>
            <p className="catalog-detail-lead">{proof.shortDescription}</p>
            <p>{proof.longDescription}</p>
            <div className="catalog-detail-actions">
              {interactiveRoute ? (
                <Link
                  href={interactiveRoute}
                  className="open-interactive-proof"
                >
                  ▶ Open interactive proof
                </Link>
              ) : (
                <span className="catalog-page-status catalog-page-upcoming">
                  Upcoming — interactive workspace planned
                </span>
              )}
              <Link href="/proofs" className="browse-more">
                Browse more proofs
              </Link>
            </div>
          </div>
          <div
            className={`catalog-concept-card concept-${feel.tone} concept-${proof.proofLearningModel}`}
            aria-label={`How ${proof.title} is proved`}
          >
            <div className="concept-grid" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <span>{feel.methodGlyph}</span>
            </div>
            <b>Proved like this</b>
            <p>{feel.methodLabel}</p>
          </div>
        </section>

        <section
          className={`proof-feel-panel tone-${feel.tone}`}
          aria-labelledby="proof-feel-title"
        >
          <div className="proof-feel-panel-head">
            <span aria-hidden="true">{feel.methodGlyph}</span>
            <div>
              <p className="eyebrow">HOW THIS IS PROVED</p>
              <h2 id="proof-feel-title">{feel.methodLabel}</h2>
            </div>
          </div>
          <div className="proof-feel-panel-grid">
            <article>
              <h3>What you do</h3>
              <p>{feel.doThis}</p>
            </article>
            <article>
              <h3>The “oo yes” moment</h3>
              <p>{feel.provedWhen}</p>
            </article>
            <article>
              <h3>
                {readiness === "upcoming"
                  ? "Upcoming UX enhancement"
                  : "Signature UX"}
              </h3>
              <p>{feel.uxEnhancement}</p>
            </article>
          </div>
        </section>

        <section className="catalog-learning-grid">
          <div>
            <span className="detail-section-icon">◎</span>
            <h2>What you will understand</h2>
            <ul>
              {proof.learningOutcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="detail-section-icon">◇</span>
            <h2>Before you begin</h2>
            <ul>
              {proof.prerequisites.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <span className="detail-section-icon">#</span>
            <h2>Proof topics</h2>
            <div className="detail-tags">
              {proof.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="related-proofs">
            <div className="library-section-head">
              <div>
                <span className="eyebrow">KEEP EXPLORING</span>
                <h2>More in {categoryInfo?.title}</h2>
              </div>
            </div>
            <div>
              {related.map((item) => {
                const relatedFeel = proofFeelForProof(item);
                const relatedReady = readinessForProof(item);
                return (
                  <Link key={item.id} href={catalogProofRoute(item)}>
                    <small>#{String(item.catalogNumber).padStart(3, "0")}</small>
                    <b>{item.title}</b>
                    <span>
                      {relatedFeel.methodGlyph} {relatedFeel.methodLabel} ·{" "}
                      {readinessLabel(relatedReady)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

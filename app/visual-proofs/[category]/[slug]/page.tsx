import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProofImplementation } from "../../../lib/proofImplementation";
import {
  ALL_VISUAL_PROOFS,
  catalogProofRoute,
  getCatalogCategory,
  getCatalogProof,
  interactiveRouteForProof,
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
                <span className="catalog-page-status">
                  Dedicated proof page #{proof.catalogNumber}
                </span>
              )}
              <Link href="/proofs" className="browse-more">
                Browse more proofs
              </Link>
            </div>
          </div>
          <div
            className={`catalog-concept-card concept-${proof.proofLearningModel}`}
            aria-label={`Visual concept for ${proof.title}`}
          >
            <div className="concept-grid" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <span>
                {proof.categorySlug === "geometry"
                  ? "△"
                  : proof.categorySlug === "calculus"
                    ? "∫"
                    : proof.categorySlug === "statistics"
                      ? "▥"
                      : proof.categorySlug === "vectors"
                        ? "→"
                        : "∑"}
              </span>
            </div>
            <b>Visual model</b>
            <p>{proof.proofLearningModel.replaceAll("-", " ")}</p>
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
              {related.map((item) => (
                <Link key={item.id} href={catalogProofRoute(item)}>
                  <small>#{String(item.catalogNumber).padStart(3, "0")}</small>
                  <b>{item.title}</b>
                  <span>View proof →</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}

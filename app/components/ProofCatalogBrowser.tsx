"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  readinessLabel,
  type ProofReadiness,
} from "../lib/proofFeel";

export type CatalogBrowserCategory = {
  title: string;
  slug: string;
  description: string;
  proofCount: number;
};

export type CatalogBrowserProof = {
  catalogNumber: number;
  title: string;
  slug: string;
  categorySlug: string;
  shortDescription: string;
  difficulty: string;
  estimatedTime: string;
  tags: string[];
  href: string;
  interactiveHref: string | null;
  implementationStatus: "planned" | "in-development" | "interactive" | "verified";
  readiness: ProofReadiness;
  methodLabel: string;
  methodGlyph: string;
  doThis: string;
  provedWhen: string;
  uxEnhancement: string;
};

const CATEGORY_GLYPHS = [
  "△",
  "Σ",
  "∿",
  "⌖",
  "∫",
  "#",
  "∶",
  "◇",
  "▥",
  "∞",
  "▦",
  "→",
  "ℂ",
  "◫",
  "◯",
  "≤",
  "log",
  "✣",
  "⚙",
];

type ReadinessFilter = "all" | "ready" | "upcoming";

export default function ProofCatalogBrowser({
  categories,
  proofs,
}: {
  categories: CatalogBrowserCategory[];
  proofs: CatalogBrowserProof[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [readiness, setReadiness] = useState<ReadinessFilter>("all");
  const normalizedQuery = query.trim().toLowerCase();

  const readinessCounts = useMemo(() => {
    const counts = { upcoming: 0, ready: 0 };
    for (const proof of proofs) {
      if (proof.readiness === "upcoming") counts.upcoming += 1;
      else counts.ready += 1;
    }
    return counts;
  }, [proofs]);

  const filtered = useMemo(
    () =>
      proofs.filter((proof) => {
        const categoryMatches =
          category === "all" || proof.categorySlug === category;
        const readinessMatches =
          readiness === "all" ||
          (readiness === "upcoming" && proof.readiness === "upcoming") ||
          (readiness === "ready" && proof.readiness !== "upcoming");
        const queryMatches =
          !normalizedQuery ||
          `${proof.title} ${proof.shortDescription} ${proof.tags.join(" ")} ${proof.doThis} ${proof.provedWhen}`
            .toLowerCase()
            .includes(normalizedQuery);
        return categoryMatches && readinessMatches && queryMatches;
      }),
    [category, normalizedQuery, proofs, readiness],
  );

  return (
    <section className="catalog-browser" aria-labelledby="catalog-title">
      <div className="catalog-browser-head">
        <div>
          <span className="eyebrow">COMPLETE CATALOG</span>
          <h2 id="catalog-title">Browse 223 visual proofs</h2>
          <p>
            Ready proofs you can open now — Upcoming proofs show how they will
            be proved.
          </p>
        </div>
        <label className="proof-search">
          <span>⌕</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search proofs, formulas, or topics"
            aria-label="Search visual proofs"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Clear search">
              ×
            </button>
          )}
        </label>
      </div>

      <div className="readiness-filter" role="tablist" aria-label="Proof readiness">
        <button
          type="button"
          role="tab"
          aria-selected={readiness === "all"}
          className={readiness === "all" ? "active" : ""}
          onClick={() => setReadiness("all")}
        >
          All <small>{proofs.length}</small>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={readiness === "ready"}
          className={readiness === "ready" ? "active" : ""}
          onClick={() => setReadiness("ready")}
        >
          Ready <small>{readinessCounts.ready}</small>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={readiness === "upcoming"}
          className={readiness === "upcoming" ? "active" : ""}
          onClick={() => setReadiness("upcoming")}
        >
          Upcoming <small>{readinessCounts.upcoming}</small>
        </button>
      </div>

      <div className="category-browser" aria-label="Proof categories">
        <button
          className={category === "all" ? "active" : ""}
          onClick={() => setCategory("all")}
        >
          <i>✦</i>
          <span>
            <b>All proofs</b>
            <small>{proofs.length} proofs</small>
          </span>
        </button>
        {categories.map((item, index) => (
          <button
            key={item.slug}
            className={category === item.slug ? "active" : ""}
            onClick={() => setCategory(item.slug)}
            title={item.description}
          >
            <i>{CATEGORY_GLYPHS[index % CATEGORY_GLYPHS.length]}</i>
            <span>
              <b>{item.title}</b>
              <small>{item.proofCount} proofs</small>
            </span>
          </button>
        ))}
      </div>

      <div className="catalog-results-head">
        <b>
          {category === "all"
            ? "All categories"
            : categories.find((item) => item.slug === category)?.title}
          {readiness === "upcoming"
            ? " · Upcoming"
            : readiness === "ready"
              ? " · Ready"
              : ""}
        </b>
        <span>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>
      {filtered.length ? (
        <div className="catalog-proof-grid">
          {filtered.map((proof) => (
            <article
              className={`catalog-proof-card readiness-${proof.readiness}`}
              key={`${proof.categorySlug}-${proof.slug}`}
            >
              <Link href={proof.href} className="catalog-proof-main">
                <div className="catalog-proof-meta">
                  <span>#{String(proof.catalogNumber).padStart(3, "0")}</span>
                  <span
                    className={`readiness-pill readiness-pill-${proof.readiness}`}
                  >
                    {readinessLabel(proof.readiness)}
                  </span>
                  <i>{proof.difficulty}</i>
                </div>
                <h3>{proof.title}</h3>
                <p>{proof.shortDescription}</p>
                <div className="proof-feel-cue" aria-label="How this is proved">
                  <span className="proof-feel-glyph" aria-hidden="true">
                    {proof.methodGlyph}
                  </span>
                  <div>
                    <b>{proof.methodLabel}</b>
                    <em>{proof.doThis}</em>
                  </div>
                </div>
                <p className="proof-feel-aha">{proof.provedWhen}</p>
                <div className="catalog-proof-foot">
                  <span>{proof.estimatedTime}</span>
                  <b>
                    {proof.readiness === "upcoming"
                      ? "Preview proof →"
                      : "View proof →"}
                  </b>
                </div>
              </Link>
              {proof.interactiveHref ? (
                <Link
                  href={proof.interactiveHref}
                  className="interactive-ready"
                >
                  ●{" "}
                  {proof.readiness === "verified"
                    ? "Visually verified"
                    : "Interactive workspace ready"}
                </Link>
              ) : (
                <div className="upcoming-ux" title={proof.uxEnhancement}>
                  <span>Upcoming UX</span>
                  <p>{proof.uxEnhancement}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-catalog">
          <b>No proofs found</b>
          <p>Try another search or choose a different category.</p>
          <button
            onClick={() => {
              setQuery("");
              setCategory("all");
              setReadiness("all");
            }}
          >
            Show all proofs
          </button>
        </div>
      )}
    </section>
  );
}

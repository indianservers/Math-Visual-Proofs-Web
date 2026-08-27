"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

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

export default function ProofCatalogBrowser({
  categories,
  proofs,
}: {
  categories: CatalogBrowserCategory[];
  proofs: CatalogBrowserProof[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const normalizedQuery = query.trim().toLowerCase();
  const filtered = useMemo(
    () =>
      proofs.filter((proof) => {
        const categoryMatches =
          category === "all" || proof.categorySlug === category;
        const queryMatches =
          !normalizedQuery ||
          `${proof.title} ${proof.shortDescription} ${proof.tags.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
        return categoryMatches && queryMatches;
      }),
    [category, normalizedQuery, proofs],
  );

  return (
    <section className="catalog-browser" aria-labelledby="catalog-title">
      <div className="catalog-browser-head">
        <div>
          <span className="eyebrow">COMPLETE CATALOG</span>
          <h2 id="catalog-title">Browse 223 visual proofs</h2>
          <p>Explore every theorem by topic, level, or mathematical idea.</p>
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
        </b>
        <span>
          {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </span>
      </div>
      {filtered.length ? (
        <div className="catalog-proof-grid">
          {filtered.map((proof) => (
            <article
              className="catalog-proof-card"
              key={`${proof.categorySlug}-${proof.slug}`}
            >
              <Link href={proof.href} className="catalog-proof-main">
                <div className="catalog-proof-meta">
                  <span>#{String(proof.catalogNumber).padStart(3, "0")}</span>
                  <i>{proof.difficulty}</i>
                </div>
                <h3>{proof.title}</h3>
                <p>{proof.shortDescription}</p>
                <div className="catalog-proof-foot">
                  <span>{proof.estimatedTime}</span>
                  <b>View proof →</b>
                </div>
              </Link>
              {proof.interactiveHref && (
                <Link
                  href={proof.interactiveHref}
                  className="interactive-ready"
                >
                  ● {proof.implementationStatus === "verified" ? "Visually verified" : "Interactive workspace ready"}
                </Link>
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
            }}
          >
            Show all proofs
          </button>
        </div>
      )}
    </section>
  );
}

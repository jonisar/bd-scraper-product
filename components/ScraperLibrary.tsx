"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES } from "@/lib/catalog";
import { scraperHref } from "@/lib/scraper-href";
import ScraperCard from "@/components/ScraperCard";

const CARD_LIMIT = 9;

const CATEGORY_VIEW_ALL: Record<string, { label: string; href: string }> = {
  All: { label: "View all scrapers", href: "/products/web-scraper/scraper-lib" },
  "Social Media": { label: "View all Social Media scrapers", href: "/products/web-scraper/scraper-lib?cat=Social+Media" },
  "E-commerce": { label: "View all E-commerce scrapers", href: "/products/web-scraper/scraper-lib?cat=E-commerce" },
  "Business (B2B)": { label: "View all B2B scrapers", href: "/products/web-scraper/scraper-lib?cat=Business+%28B2B%29" },
  Jobs: { label: "View all Jobs scrapers", href: "/products/web-scraper/scraper-lib?cat=Jobs" },
  "Real Estate": { label: "View all Real Estate scrapers", href: "/products/web-scraper/scraper-lib?cat=Real+Estate" },
  Travel: { label: "View all Travel scrapers", href: "/products/web-scraper/scraper-lib?cat=Travel" },
  Search: { label: "View all Search scrapers", href: "/products/web-scraper/scraper-lib?cat=Search" },
  "News & Media": { label: "View all News & Media scrapers", href: "/products/web-scraper/scraper-lib?cat=News+%26+Media" },
  Finance: { label: "View all Finance scrapers", href: "/products/web-scraper/scraper-lib?cat=Finance" },
};

export default function ScraperLibrary() {
  const [cat, setCat] = useState<string>("All");
  const [search, setSearch] = useState("");

  const needle = search.trim().toLowerCase();

  const cards = useMemo(() => {
    if (needle) {
      return catalog
        .filter(
          (s) =>
            (cat === "All" || s.category === cat) &&
            (s.name.toLowerCase().includes(needle) ||
              s.domain.includes(needle) ||
              s.fields.some((f) => f.toLowerCase().includes(needle)))
        )
        .slice(0, CARD_LIMIT);
    }

    if (cat === "All") {
      return catalog.filter((s) => s.popular).slice(0, CARD_LIMIT);
    }

    return catalog.filter((s) => s.category === cat).slice(0, CARD_LIMIT);
  }, [cat, needle]);

  const viewAll = CATEGORY_VIEW_ALL[cat] || CATEGORY_VIEW_ALL.All;

  const sectionTitle =
    needle
      ? `Results for "${search.trim()}"`
      : cat === "All"
        ? "Popular web scrapers"
        : cat;

  return (
    <div className="lib">
      {/* Filter bar */}
      <div className="lib-bar">
        <div className="lib-chips-wrap">
          <div className="lib-chips">
            {CATALOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`lib-chip ${cat === c ? "active" : ""}`}
                onClick={() => setCat(c)}
              >
                {c}
                {c !== "All" && (
                  <span className="lib-chip-n">
                    {catalog.filter((s) => s.category === c).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        <input
          className="lib-search"
          placeholder="Filter..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Filter scrapers"
        />
      </div>

      <div className="lib-section">
        <div className="lib-section-head">
          <h2>{sectionTitle}</h2>
          <a href={viewAll.href} className="lib-section-more">
            {viewAll.label} →
          </a>
        </div>

        {cards.length > 0 ? (
          <div className="lib-grid">
            {cards.map((s) => (
              <ScraperCard
                key={s.id}
                name={s.name}
                domain={s.domain}
                category={s.category}
                desc={s.desc}
                views={s.views}
                downloads={s.downloads}
                href={scraperHref(s)}
              />
            ))}
          </div>
        ) : (
          <div className="lib-empty">
            <p>No scraper found for &ldquo;{search || cat}&rdquo;</p>
            <p className="lib-empty-sub">
              Can&apos;t find what you need?{" "}
              <a href="/products/web-scraper/studio" className="lib-empty-link">
                Build one with Scraper Studio →
              </a>
            </p>
          </div>
        )}
      </div>

      <div className="lib-cta">
        <div className="lib-cta-body">
          <span className="lib-cta-kicker">Full library</span>
          <strong>Explore 1,300+ production-ready scrapers</strong>
          <span>Proxy rotation, CAPTCHA solving, and anti-bot bypass — built in. Pay only for successful results.</span>
        </div>
        <a
          href="/products/web-scraper/scraper-lib"
          className="btn btn-primary btn-pill"
        >
          Browse all scrapers →
        </a>
      </div>
    </div>
  );
}

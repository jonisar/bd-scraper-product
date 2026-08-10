"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES } from "@/lib/catalog";
import { cpHref } from "@/lib/cp-href";
import ScraperCard from "@/components/ScraperCard";

const CARD_LIMIT = 9;

const CP_DATASETS = "https://brightdata.com/cp/datasets";

const CATEGORY_VIEW_ALL: Record<string, { label: string; href: string; external?: boolean }> = {
  All: { label: "Browse all scrapers", href: CP_DATASETS, external: true },
  "Social Media": { label: "View all Social Media scrapers", href: "/products/web-scraper/social-media" },
  "E-commerce": { label: "View all E-commerce scrapers", href: "/products/web-scraper/ecommerce" },
  "Business (B2B)": { label: "View all B2B scrapers", href: "/products/web-scraper/b2b" },
  Jobs: { label: "View all Jobs scrapers", href: "/products/web-scraper/jobs" },
  "Real Estate": { label: "View all Real Estate scrapers", href: "/products/web-scraper/real-estate" },
  Travel: { label: "View all Travel scrapers", href: "/products/web-scraper/travel" },
  Search: { label: "View all Search scrapers", href: "/products/web-scraper/search" },
  "News & Media": { label: "View all News & Media scrapers", href: "/products/web-scraper/news-media" },
  Finance: { label: "View all Finance scrapers", href: "/products/web-scraper/finance" },
};

export default function ScraperLibrary() {
  const [cat, setCat] = useState<string>("All");

  const cards = useMemo(() => {
    if (cat === "All") {
      return catalog.filter((s) => s.popular).slice(0, CARD_LIMIT);
    }
    return catalog.filter((s) => s.category === cat).slice(0, CARD_LIMIT);
  }, [cat]);

  const viewAll = CATEGORY_VIEW_ALL[cat] || CATEGORY_VIEW_ALL.All;

  const sectionTitle =
    cat === "All" ? "Popular web scrapers" : `${cat} scrapers`;

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
      </div>

      <div className="lib-section">
        <div className="lib-section-head">
          <h2>{sectionTitle}</h2>
          <a
            href={viewAll.href}
            className="lib-section-more"
            {...(viewAll.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          >
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
                href={cpHref(s)}
              />
            ))}
          </div>
        ) : (
          <div className="lib-empty">
            <p>No scrapers found for &ldquo;{cat}&rdquo;</p>
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
          href={CP_DATASETS}
          className="btn btn-primary btn-pill"
          target="_blank"
          rel="noopener noreferrer"
        >
          Browse all scrapers →
        </a>
      </div>
    </div>
  );
}

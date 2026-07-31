"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES, type CatalogScraper } from "@/lib/catalog";
import { templates, consoleUrl } from "@/lib/templates";

function scraperHref(s: CatalogScraper): string {
  if (s.slug === "amazon-product" || s.id === "amazon-products") {
    return "/products/web-scraper/amazon/amazon-product-scraper";
  }
  if (s.domain === "amazon.com") {
    return "/products/web-scraper/amazon";
  }
  if (s.slug) {
    const t = templates.find((tpl) => tpl.slug === s.slug);
    if (t) return consoleUrl(t);
  }
  const byDomain = templates.find((t) => t.domain === s.domain && t.popular)
    || templates.find((t) => t.domain === s.domain);
  if (byDomain) return consoleUrl(byDomain);
  return `https://brightdata.com/cp/scrapers/browse?category=all&q=${encodeURIComponent(s.name)}`;
}

export default function ScraperLibrary() {
  const [cat, setCat] = useState<string>("All");
  const [search, setSearch] = useState("");

  const needle = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    let list = catalog;
    if (cat !== "All") list = list.filter((s) => s.category === cat);
    if (needle) {
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(needle) ||
          s.domain.includes(needle) ||
          s.fields.some((f) => f.toLowerCase().includes(needle))
      );
    }
    return list;
  }, [cat, needle]);

  const popular = catalog.filter((s) => s.popular);

  const showCurated = cat === "All" && !needle;

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

      {showCurated ? (
        <>
          <div className="lib-section">
            <div className="lib-section-head">
              <h3>Most popular</h3>
              <span className="lib-section-count">{popular.length} scrapers</span>
              <a
                href="https://brightdata.com/cp/scrapers/browse?category=all"
                target="_blank"
                rel="noopener noreferrer"
                className="lib-section-more"
              >
                View all →
              </a>
            </div>
            <div className="lib-grid">
              {popular.map((s) => (
                <ScraperCard key={s.id} s={s} />
              ))}
            </div>
          </div>

          {CATALOG_CATEGORIES.filter((c) => c !== "All").map((category) => {
            const items = catalog.filter((s) => s.category === category && !s.popular);
            if (items.length === 0) return null;
            return (
              <div key={category} className="lib-section">
                <div className="lib-section-head">
                  <h3>{category}</h3>
                  <span className="lib-section-count">
                    {catalog.filter((s) => s.category === category).length} scrapers
                  </span>
                  <a
                    href={`https://brightdata.com/cp/scrapers/browse?category=${encodeURIComponent(category.toLowerCase())}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lib-section-more"
                  >
                    View all →
                  </a>
                </div>
                <div className="lib-grid">
                  {items.map((s) => (
                    <ScraperCard key={s.id} s={s} />
                  ))}
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="lib-section">
          <div className="lib-section-head">
            <h3>{cat === "All" ? "Results" : cat}</h3>
            <span className="lib-section-count">{filtered.length} scrapers</span>
          </div>
          {filtered.length > 0 ? (
            <div className="lib-grid">
              {filtered.map((s) => (
                <ScraperCard key={s.id} s={s} />
              ))}
            </div>
          ) : (
            <div className="lib-empty">
              <p>No scraper found for &ldquo;{search || cat}&rdquo;</p>
              <p className="lib-empty-sub">
                Can&apos;t find what you need?{" "}
                <a
                  href="https://brightdata.com/cp/scrapers/automation/chat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="lib-empty-link"
                >
                  Build one with Scraper Studio →
                </a>
              </p>
            </div>
          )}
        </div>
      )}

      <div className="lib-cta">
        <p>
          Showing {catalog.length} of <strong>1,300+ production-ready scrapers</strong> in the full library.
        </p>
        <a
          href="https://brightdata.com/cp/scrapers/browse?category=all"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-pill"
        >
          Browse all scrapers →
        </a>
        <p className="lib-cta-note">
          Every scraper includes proxy rotation, CAPTCHA solving, and anti-bot bypass. Pay only for successful results.
        </p>
      </div>
    </div>
  );
}

function ScraperCard({ s }: { s: CatalogScraper }) {
  const href = scraperHref(s);
  const external = href.startsWith("http");

  return (
    <div className="fc">
      <a
        href={href}
        className="fc-link"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <div className="fc-top">
          <div className="fc-identity">
            <span className="fc-name">{s.name}</span>
            <span className="fc-domain">{s.domain}</span>
          </div>
          <span className="fc-cat">{s.category}</span>
        </div>
        <p className="fc-desc">{s.desc}</p>
      </a>
      <div className="fc-stats-row">
        <div className="fc-stat">
          <span className="fc-stat-val">{s.views}</span>
          <span className="fc-stat-label">Delivered</span>
        </div>
        <div className="fc-stat">
          <span className="fc-stat-val">{s.downloads}</span>
          <span className="fc-stat-label">Active users</span>
        </div>
        <div className="fc-stat">
          <span className="fc-stat-val">$1.50</span>
          <span className="fc-stat-label">per 1K</span>
        </div>
      </div>
      <div className="fc-foot">
        <span className="fc-badge">✓ GDPR &amp; CCPA</span>
        <a
          href="https://brightdata.com/cp/start"
          target="_blank"
          rel="noopener noreferrer"
          className="fc-cta"
          onClick={(e) => e.stopPropagation()}
        >
          Start free →
        </a>
      </div>
    </div>
  );
}

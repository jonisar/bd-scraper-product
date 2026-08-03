"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES } from "@/lib/catalog";
import { CATEGORY_LABELS } from "@/lib/category-labels";
import { scraperHref } from "@/lib/scraper-href";
import ScraperCard from "@/components/ScraperCard";

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
              <h2>Popular web scrapers</h2>
              <a
                href="/products/web-scraper/scraper-lib"
                className="lib-section-more"
              >
                View all →
              </a>
            </div>
            <div className="lib-grid">
              {popular.slice(0, 9).map((s) => (
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
          </div>

          {CATALOG_CATEGORIES.filter((c) => c !== "All").map((category) => {
            const items = catalog.filter((s) => s.category === category && !s.popular);
            if (items.length === 0) return null;
            const labels = CATEGORY_LABELS[category] || [];
            return (
              <div key={category} className="lib-section">
                <div className="lib-section-head">
                  <h3>{category}</h3>
                  <a
                    href={`/products/web-scraper/scraper-lib?cat=${encodeURIComponent(category)}`}
                    className="lib-section-more"
                  >
                    View all →
                  </a>
                  {labels.length > 0 && (
                    <div className="lib-section-labels">
                      {labels.map((l) => (
                        <a
                          key={l.name}
                          href={l.href}
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="lib-section-label"
                        >
                          {l.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="lib-grid">
                  {items.map((s) => (
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
              </div>
            );
          })}
        </>
      ) : (
        <div className="lib-section">
          <div className="lib-section-head">
            <h3>{cat === "All" ? "Results" : cat}</h3>
          </div>
          {filtered.length > 0 ? (
            <div className="lib-grid">
              {filtered.map((s) => (
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
                <a
                  href="/products/web-scraper/studio"
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


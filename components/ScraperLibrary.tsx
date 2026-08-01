"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES, type CatalogScraper } from "@/lib/catalog";
import { templates, templateHref } from "@/lib/templates";
import ScraperCard from "@/components/ScraperCard";

const CATEGORY_LABELS: Record<string, { name: string; href: string }[]> = {
  "Social Media": [
    { name: "Instagram", href: "https://brightdata.com/products/web-scraper/instagram" },
    { name: "TikTok", href: "https://brightdata.com/products/web-scraper/tiktok" },
    { name: "LinkedIn", href: "https://brightdata.com/products/web-scraper/linkedin" },
    { name: "Facebook", href: "https://brightdata.com/products/web-scraper/facebook" },
    { name: "X (Twitter)", href: "https://brightdata.com/products/web-scraper/x" },
  ],
  "E-commerce": [
    { name: "Amazon", href: "/products/web-scraper/amazon" },
    { name: "Walmart", href: "https://brightdata.com/products/web-scraper/walmart" },
    { name: "Shopee", href: "https://brightdata.com/products/web-scraper/shopee" },
    { name: "eBay", href: "https://brightdata.com/products/web-scraper/ebay" },
    { name: "Target", href: "https://brightdata.com/products/web-scraper/target" },
  ],
  "Business (B2B)": [
    { name: "LinkedIn", href: "https://brightdata.com/products/web-scraper/linkedin" },
    { name: "Crunchbase", href: "https://brightdata.com/products/web-scraper/crunchbase" },
    { name: "Glassdoor", href: "https://brightdata.com/products/web-scraper/glassdoor" },
    { name: "ZoomInfo", href: "https://brightdata.com/products/web-scraper/zoominfo" },
  ],
  "Jobs": [
    { name: "Indeed", href: "https://brightdata.com/products/web-scraper/indeed" },
    { name: "LinkedIn Jobs", href: "https://brightdata.com/products/web-scraper/linkedin" },
    { name: "Glassdoor", href: "https://brightdata.com/products/web-scraper/glassdoor" },
  ],
  "Real Estate": [
    { name: "Zillow", href: "https://brightdata.com/products/web-scraper/zillow" },
    { name: "Realtor", href: "https://brightdata.com/products/web-scraper/realtor" },
    { name: "Redfin", href: "https://brightdata.com/products/web-scraper/redfin" },
    { name: "Airbnb", href: "https://brightdata.com/products/web-scraper/airbnb" },
  ],
  "Travel": [
    { name: "Booking", href: "https://brightdata.com/products/web-scraper/booking" },
    { name: "Tripadvisor", href: "https://brightdata.com/products/web-scraper/tripadvisor" },
    { name: "Airbnb", href: "https://brightdata.com/products/web-scraper/airbnb" },
    { name: "Expedia", href: "https://brightdata.com/products/web-scraper/expedia" },
  ],
  "Search": [
    { name: "Google Maps", href: "https://brightdata.com/products/web-scraper/google-maps" },
    { name: "Google Search", href: "https://brightdata.com/products/web-scraper/google" },
    { name: "Yelp", href: "https://brightdata.com/products/web-scraper/yelp" },
    { name: "Yellow Pages", href: "https://brightdata.com/products/web-scraper/yellow-pages" },
  ],
  "News & Media": [
    { name: "Reuters", href: "https://brightdata.com/products/web-scraper/reuters" },
    { name: "Bloomberg", href: "https://brightdata.com/products/web-scraper/bloomberg" },
    { name: "Reddit", href: "https://brightdata.com/products/web-scraper/reddit" },
  ],
  "Finance": [
    { name: "Yahoo Finance", href: "https://brightdata.com/products/web-scraper/yahoo-finance" },
    { name: "Bloomberg", href: "https://brightdata.com/products/web-scraper/bloomberg" },
    { name: "SEC", href: "https://brightdata.com/products/web-scraper/sec" },
    { name: "MarketWatch", href: "https://brightdata.com/products/web-scraper/marketwatch" },
  ],
};

function scraperHref(s: CatalogScraper): string {
  if (s.slug === "amazon-product" || s.id === "amazon-products") {
    return "/products/web-scraper/amazon/amazon-product-scraper";
  }
  if (s.domain === "amazon.com") {
    return "/products/web-scraper/amazon";
  }
  if (s.slug) {
    const t = templates.find((tpl) => tpl.slug === s.slug);
    if (t) return templateHref(t);
  }
  const byDomain = templates.find((t) => t.domain === s.domain && t.popular)
    || templates.find((t) => t.domain === s.domain);
  if (byDomain) return templateHref(byDomain);
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
              <h2>Popular web scrapers</h2>
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
                    href={`https://brightdata.com/cp/scrapers/browse?category=${encodeURIComponent(category.toLowerCase())}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
        <div className="lib-cta-body">
          <span className="lib-cta-kicker">Full library</span>
          <strong>Explore 1,300+ production-ready scrapers</strong>
          <span>Proxy rotation, CAPTCHA solving, and anti-bot bypass — built in. Pay only for successful results.</span>
        </div>
        <a
          href="https://brightdata.com/cp/scrapers/browse?category=all"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary btn-pill"
        >
          Browse all scrapers →
        </a>
      </div>
    </div>
  );
}


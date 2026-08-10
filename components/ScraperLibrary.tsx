"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES } from "@/lib/catalog";
import { cpHref } from "@/lib/cp-href";
import ScraperCard from "@/components/ScraperCard";
import DomainMark from "@/components/DomainMark";

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

type DomainCardData = {
  domain: string;
  label: string;
  desc: string;
  scraperCount: number;
  totalDelivered: string;
  successRate: string;
  href: string;
};

function parseViews(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  if (v.includes("K")) return n * 1000;
  if (v.includes("M")) return n * 1_000_000;
  return n || 0;
}

function buildTopDomains(): DomainCardData[] {
  const DOMAIN_META: Record<string, { label: string; desc: string; href: string }> = {
    "linkedin.com":       { label: "LinkedIn",       desc: "Profiles, companies, job listings, and post engagement data", href: "/products/web-scraper/linkedin" },
    "instagram.com":      { label: "Instagram",      desc: "Profiles, posts, reels, comments, and engagement metrics", href: "/products/web-scraper/instagram" },
    "tiktok.com":         { label: "TikTok",         desc: "Profiles, videos, shop products, and trending hashtags", href: "/products/web-scraper/tiktok" },
    "facebook.com":       { label: "Facebook",       desc: "Page posts, ads library, reactions, and audience data", href: "/products/web-scraper/facebook" },
    "x.com":              { label: "X (Twitter)",    desc: "Posts, profiles, engagement metrics, and trending topics", href: "/products/web-scraper/x" },
    "openai.com":         { label: "ChatGPT",        desc: "AI conversations, responses, and model interaction data", href: "/products/web-scraper/chatgpt" },
    "youtube.com":        { label: "YouTube",        desc: "Videos, channels, comments, subscribers, and view counts", href: "/products/web-scraper/youtube" },
    "amazon.com":         { label: "Amazon",         desc: "Products, reviews, pricing, sellers, and bestsellers data", href: "/products/web-scraper/amazon" },
    "walmart.com":        { label: "Walmart",        desc: "Products, prices, reviews, and inventory data", href: "/products/web-scraper/walmart" },
    "booking.com":        { label: "Booking.com",    desc: "Hotels, prices, availability, and guest reviews", href: "/products/web-scraper/booking" },
    "airbnb.com":         { label: "Airbnb",         desc: "Vacation rental listings, prices, and reviews", href: "/products/web-scraper/airbnb" },
    "indeed.com":         { label: "Indeed",         desc: "Job listings, salaries, company reviews, and labor market data", href: "/products/web-scraper/indeed" },
    "crunchbase.com":     { label: "Crunchbase",     desc: "Companies, funding rounds, investors, and M&A data", href: "/products/web-scraper/crunchbase" },
    "zillow.com":         { label: "Zillow",         desc: "Property listings, Zestimates, rentals, and neighborhood data", href: "/products/web-scraper/zillow" },
    "google.com/maps":    { label: "Google Maps",    desc: "Business listings, reviews, ratings, hours, and locations", href: "/products/web-scraper/google-maps" },
    "glassdoor.com":      { label: "Glassdoor",      desc: "Company reviews, salaries, interviews, and job listings", href: "/products/web-scraper/glassdoor" },
    "yelp.com":           { label: "Yelp",           desc: "Business listings, reviews, ratings, and local data", href: "/products/web-scraper/yelp" },
    "play.google.com":    { label: "Google Play",    desc: "Apps, reviews, rankings, and developer data", href: "/products/web-scraper/google-play" },
  };

  return Object.keys(DOMAIN_META).map((domain) => {
    const meta = DOMAIN_META[domain];
    const scrapers = catalog.filter((s) => s.domain === domain);
    const totalViews = scrapers.reduce((sum, s) => sum + parseViews(s.views), 0);
    const deliveredStr = totalViews >= 1000 ? `${(totalViews / 1000).toFixed(0)}K+` : `${totalViews}+`;
    return {
      domain,
      label: meta.label,
      desc: meta.desc,
      scraperCount: scrapers.length,
      totalDelivered: deliveredStr,
      successRate: "99.2%",
      href: meta.href,
    };
  });
}

const TOP_DOMAINS = buildTopDomains();

export default function ScraperLibrary() {
  const [cat, setCat] = useState<string>("All");

  const isAll = cat === "All";

  const cards = useMemo(() => {
    if (isAll) return [];
    return catalog.filter((s) => s.category === cat).slice(0, CARD_LIMIT);
  }, [cat, isAll]);

  const viewAll = CATEGORY_VIEW_ALL[cat] || CATEGORY_VIEW_ALL.All;

  const sectionTitle = isAll ? "Popular domains" : `${cat} scrapers`;

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

        {isAll ? (
          <div className="slib-quicknav">
            {TOP_DOMAINS.slice(0, CARD_LIMIT).map((d) => (
              <a key={d.domain} href={d.href} className="cc">
                <div className="cc-glow" aria-hidden="true" />
                <div className="cc-header">
                  <DomainMark domain={d.domain} size="domain" />
                  <div className="cc-identity">
                    <span className="cc-name">{d.label}</span>
                    <span className="cc-count">{d.domain}</span>
                  </div>
                  <span className="fc-cat">{d.scraperCount} scrapers</span>
                </div>
                <p className="cc-desc">{d.desc}</p>
                <div className="cc-metrics">
                  <div className="fc-metric">
                    <span className="fc-metric-val">{d.totalDelivered}</span>
                    <span className="fc-metric-label">Delivered</span>
                  </div>
                  <div className="fc-metric-divider" />
                  <div className="fc-metric">
                    <span className="fc-metric-val">{d.scraperCount}</span>
                    <span className="fc-metric-label">Scrapers</span>
                  </div>
                  <div className="fc-metric-divider" />
                  <div className="fc-metric">
                    <span className="fc-metric-val fc-metric-success">{d.successRate}</span>
                    <span className="fc-metric-label">Success</span>
                  </div>
                </div>
                <div className="cc-foot">
                  <div className="fc-signals">
                    <span className="fc-signal fc-signal-mcp">⚡ MCP</span>
                    <span className="fc-signal fc-signal-live">
                      <span className="fc-pulse" aria-hidden="true" />
                      Verified 3h ago
                    </span>
                  </div>
                  <span className="cc-cta">Browse scrapers →</span>
                </div>
              </a>
            ))}
          </div>
        ) : cards.length > 0 ? (
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

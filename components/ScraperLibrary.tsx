"use client";

import { useMemo, useState } from "react";
import { catalog, CATALOG_CATEGORIES } from "@/lib/catalog";
import { scraperHref } from "@/lib/scraper-href";
import ScraperCard from "@/components/ScraperCard";

const CARD_LIMIT = 9;

const TOP_9_DOMAINS: { domain: string; label: string; icon: string; logo: string; color: string; desc: string; href: string }[] = [
  { domain: "linkedin.com",    label: "LinkedIn",    icon: "in", logo: "/logos/linkedin.png",    color: "#0A66C2", desc: "Profiles, companies, job listings, and post engagement data", href: "/products/web-scraper/linkedin" },
  { domain: "instagram.com",   label: "Instagram",   icon: "◎",  logo: "/logos/instagram.png",   color: "#E4405F", desc: "Profiles, posts, reels, comments, and engagement metrics", href: "/products/web-scraper/instagram" },
  { domain: "tiktok.com",      label: "TikTok",      icon: "♪",  logo: "/logos/tiktok.png",      color: "#00F2EA", desc: "Profiles, videos, shop products, and trending hashtags", href: "/products/web-scraper/tiktok" },
  { domain: "facebook.com",    label: "Facebook",    icon: "f",  logo: "/logos/facebook.png",    color: "#1877F2", desc: "Page posts, ads library, reactions, and audience data", href: "/products/web-scraper/facebook" },
  { domain: "amazon.com",      label: "Amazon",      icon: "A",  logo: "/logos/amazon.png",      color: "#FF9900", desc: "Products, reviews, pricing, sellers, and bestsellers data", href: "/products/web-scraper/amazon" },
  { domain: "youtube.com",     label: "YouTube",     icon: "▶",  logo: "/logos/youtube.png",     color: "#FF0000", desc: "Videos, channels, comments, subscribers, and view counts", href: "/products/web-scraper/youtube" },
  { domain: "zillow.com",      label: "Zillow",      icon: "Z",  logo: "/logos/zillow.png",      color: "#006AFF", desc: "Property listings, Zestimates, rentals, and neighborhood data", href: "/products/web-scraper/zillow" },
  { domain: "google.com/maps", label: "Google Maps", icon: "G",  logo: "/logos/google-maps.png", color: "#34A853", desc: "Business listings, reviews, ratings, hours, and locations", href: "/products/web-scraper/google-maps" },
  { domain: "indeed.com",      label: "Indeed",      icon: "I",  logo: "/logos/indeed.png",      color: "#003A9B", desc: "Job listings, salaries, company reviews, and labor market data", href: "/products/web-scraper/indeed" },
];

function DomainLogo({ logo, label, icon, color }: { logo: string; label: string; icon: string; color: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="cc-icon" style={{ background: `linear-gradient(135deg, ${color}22, ${color}0a)`, borderColor: `${color}33` }}>
      {!failed ? (
        <img src={logo} alt={label} className="cc-icon-logo" width={28} height={28} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <span className="cc-icon-letter" style={{ color }}>{icon}</span>
      )}
    </div>
  );
}

function buildDomainCards() {
  return TOP_9_DOMAINS.map((meta) => {
    const scrapers = catalog.filter((s) => s.domain === meta.domain);
    const totalViews = scrapers.reduce((sum, s) => sum + parseInt(s.views.replace(/[^0-9]/g, ""), 10) * (s.views.includes("K") ? 1000 : 1), 0);
    const deliveredStr = totalViews >= 1000 ? `${(totalViews / 1000).toFixed(0)}K+` : `${totalViews}+`;
    return { ...meta, scraperCount: scrapers.length, totalDelivered: deliveredStr, successRate: "99.2%" };
  });
}

const CATEGORY_VIEW_ALL: Record<string, { label: string; href: string }> = {
  All: { label: "View all scrapers", href: "/products/web-scraper/scraper-lib" },
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
  const [search, setSearch] = useState("");

  const needle = search.trim().toLowerCase();
  const showDomains = cat === "All" && !needle;

  const domainCards = useMemo(() => buildDomainCards(), []);

  const cards = useMemo(() => {
    if (showDomains) return [];
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
    return catalog.filter((s) => s.category === cat).slice(0, CARD_LIMIT);
  }, [cat, needle, showDomains]);

  const viewAll = CATEGORY_VIEW_ALL[cat] || CATEGORY_VIEW_ALL.All;

  const sectionTitle =
    needle
      ? `Results for "${search.trim()}"`
      : cat === "All"
        ? "Popular domains"
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

        {showDomains ? (
          <div className="lib-grid">
            {domainCards.map((d) => (
              <a key={d.domain} href={d.href} className="cc">
                <div className="cc-glow" aria-hidden="true" />
                <div className="cc-header">
                  <DomainLogo logo={d.logo} label={d.label} icon={d.icon} color={d.color} />
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

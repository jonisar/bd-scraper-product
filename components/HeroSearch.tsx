"use client";

import { useMemo, useState } from "react";
import type { Template } from "@/lib/templates";
import { consoleUrl } from "@/lib/templates";

const POPULAR_SITES = [
  { label: "Amazon", domain: "amazon.com", color: "#FF9900" },
  { label: "LinkedIn", domain: "linkedin.com", color: "#0A66C2" },
  { label: "Instagram", domain: "instagram.com", color: "#E4405F" },
  { label: "Google Maps", domain: "google.com", color: "#34A853" },
  { label: "Zillow", domain: "zillow.com", color: "#006AFF" },
  { label: "TikTok", domain: "tiktok.com", color: "#ff0050" },
  { label: "YouTube", domain: "youtube.com", color: "#FF0000" },
  { label: "Walmart", domain: "walmart.com", color: "#0071CE" },
];

function domainOf(input: string) {
  const s = input.trim().toLowerCase();
  if (!s) return "";
  try {
    const url = s.includes("://") ? new URL(s) : new URL("https://" + s);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return s.replace(/^www\./, "").split("/")[0];
  }
}

export default function HeroSearch({ templates }: { templates: Template[] }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const needle = q.trim().toLowerCase();
  const dom = domainOf(q);

  const matches = useMemo(() => {
    if (!needle) return [];
    return templates.filter(
      (t) =>
        t.domain.includes(needle) ||
        t.domain.includes(dom) ||
        dom.includes(t.domain.split(".")[0]) ||
        t.name.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle)
    );
  }, [templates, needle, dom]);

  const open = focused && needle.length > 0;

  const go = () => {
    if (matches[0]) window.open(consoleUrl(matches[0]), "_blank");
  };

  return (
    <div className="hsearch-wrap">
      <div className="hsearch">
        <span className="hsearch-icon" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && go()}
          placeholder="Find scrapers for Amazon, LinkedIn, Zillow..."
          aria-label="Search for a scraper"
        />
        <button className="btn btn-primary btn-sm btn-pill" onClick={go} disabled={!matches.length}>
          Search
        </button>
      </div>

      {/* Popular sites pills */}
      {!needle && (
        <div className="hero-popular">
          <span className="hero-popular-label">Popular:</span>
          {POPULAR_SITES.map((site) => (
            <button
              key={site.domain}
              className="hero-popular-pill"
              onClick={() => { setQ(site.domain); setFocused(true); }}
            >
              <span className="hero-popular-dot" style={{ background: site.color }} />
              {site.label}
            </button>
          ))}
        </div>
      )}

      {/* Results dropdown */}
      {open && (
        <div className="hsearch-panel">
          {matches.length > 0 ? (
            matches.slice(0, 5).map((t) => (
              <a key={t.slug} href={consoleUrl(t)} target="_blank" rel="noopener noreferrer" className="hsearch-row">
                <span className="hsearch-row-icon" style={{ color: t.color }}>{t.icon}</span>
                <span className="hsearch-row-main">
                  <span className="hsearch-row-name">{t.name}</span>
                  <span className="hsearch-row-domain">{t.domain}</span>
                </span>
                <span className="hsearch-avail">Available</span>
              </a>
            ))
          ) : (
            <div className="hsearch-empty">
              <div className="hsearch-empty-top">
                No scraper for <b>{dom || q}</b> yet — but you can build one instantly.
              </div>
              <div className="hsearch-empty-actions">
                <a
                  href="https://brightdata.com/cp/scrapers/automation/chat"
                  className="hsearch-action"
                >
                  Build with AI Scraper Studio →
                </a>
                <a href="#agents" className="hsearch-action">
                  Or use your coding agent →
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

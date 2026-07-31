"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import type { Template } from "@/lib/templates";
import { consoleUrl } from "@/lib/templates";

const POPULAR_SITES = [
  { label: "Amazon", domain: "amazon.com", color: "#FF9900", href: "/products/web-scraper/amazon" },
  { label: "LinkedIn", domain: "linkedin.com", color: "#0A66C2", slug: "linkedin-profile" },
  { label: "Instagram", domain: "instagram.com", color: "#E4405F", slug: "instagram-profile" },
  { label: "Google Maps", domain: "google.com", color: "#34A853", slug: "google-maps" },
  { label: "Zillow", domain: "zillow.com", color: "#006AFF", slug: "zillow-listings" },
  { label: "TikTok", domain: "tiktok.com", color: "#ff0050", slug: "tiktok-posts" },
  {
    label: "YouTube",
    domain: "youtube.com",
    color: "#FF0000",
    href: "https://brightdata.com/cp/scrapers/browse?category=all",
  },
  {
    label: "Walmart",
    domain: "walmart.com",
    color: "#0071CE",
    href: "https://brightdata.com/cp/scrapers/browse?category=all",
  },
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
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

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

  const go = useCallback((idx?: number) => {
    const target = matches[idx ?? activeIdx] ?? matches[0];
    if (target) window.open(consoleUrl(target), "_blank");
  }, [matches, activeIdx]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter") go();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.min(matches.length - 1, 4)));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go();
    } else if (e.key === "Escape") {
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    clearTimeout(blurTimer.current);
    setFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 180);
  };

  const handlePillClick = (site: (typeof POPULAR_SITES)[number]) => {
    if (site.href) {
      if (site.href.startsWith("/")) {
        window.location.href = site.href;
      } else {
        window.open(site.href, "_blank", "noopener,noreferrer");
      }
      return;
    }
    if ("slug" in site && site.slug) {
      const target = templates.find((t) => t.slug === site.slug);
      if (target) {
        window.open(consoleUrl(target), "_blank", "noopener,noreferrer");
        return;
      }
    }
    const fallback =
      templates.find((t) => t.domain === site.domain && t.popular) ||
      templates.find((t) => t.domain === site.domain);
    if (fallback) {
      window.open(consoleUrl(fallback), "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="hsearch-block">
      <div className="hsearch-wrap">
        <div className="hsearch">
          <span className="hsearch-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActiveIdx(-1); }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Find scrapers for Amazon, LinkedIn, Zillow..."
            aria-label="Search for a scraper"
            autoComplete="off"
          />
          <button
            type="button"
            className="btn btn-primary btn-sm btn-pill"
            onClick={() => go()}
            disabled={!matches.length}
          >
            Search
          </button>
        </div>

        {open && (
          <div className="hsearch-panel" role="listbox">
            {matches.length > 0 ? (
              matches.slice(0, 5).map((t, i) => (
                <a
                  key={t.slug}
                  href={consoleUrl(t)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`hsearch-row${i === activeIdx ? " hsearch-row-active" : ""}`}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseEnter={() => setActiveIdx(i)}
                  onMouseDown={(e) => e.preventDefault()}
                >
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
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hsearch-action"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Build with AI Scraper Studio →
                  </a>
                  <a href="#agents" className="hsearch-action" onMouseDown={(e) => e.preventDefault()}>
                    Or use your coding agent →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {!needle && (
        <div className="hero-popular">
          <span className="hero-popular-label">Popular:</span>
          {POPULAR_SITES.map((site) => (
            <button
              key={site.domain}
              type="button"
              className="hero-popular-pill"
              onClick={() => handlePillClick(site)}
            >
              <span className="hero-popular-dot" style={{ background: site.color }} />
              {site.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

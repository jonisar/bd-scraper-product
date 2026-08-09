"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { Template } from "@/lib/templates";
import { cpHrefForTemplate } from "@/lib/cp-href";

const SEARCH_RESULTS_PATH = "/products/web-scraper/scraper-lib";

const POPULAR_SITES = [
  { label: "Amazon", domain: "amazon.com", color: "#FF9900", href: "/products/web-scraper/amazon" },
  { label: "LinkedIn", domain: "linkedin.com", color: "#0A66C2", href: "/products/web-scraper/linkedin" },
  { label: "Instagram", domain: "instagram.com", color: "#E4405F", href: "/products/web-scraper/instagram" },
  { label: "Google Maps", domain: "google.com", color: "#34A853", href: "/products/web-scraper/google-maps" },
  { label: "Zillow", domain: "zillow.com", color: "#006AFF", href: "/products/web-scraper/zillow" },
  { label: "TikTok", domain: "tiktok.com", color: "#ff0050", href: "/products/web-scraper/tiktok" },
  { label: "YouTube", domain: "youtube.com", color: "#FF0000", href: "/products/web-scraper/youtube" },
  {
    label: "Walmart",
    domain: "walmart.com",
    color: "#0071CE",
    href: "/products/web-scraper/scraper-lib?q=walmart",
  },
];

const MAX_RESULTS = 6;

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

function resultHref(t: Template): string {
  return cpHrefForTemplate(t);
}

function scoreMatch(t: Template, needle: string, dom: string): number {
  const name = t.name.toLowerCase();
  const domain = t.domain.toLowerCase();
  const category = t.category.toLowerCase();
  const root = domain.split(".")[0];

  if (domain === needle || domain === dom) return 100;
  if (root === needle || root === dom) return 90;
  if (name.startsWith(needle)) return 80;
  if (domain.startsWith(needle) || domain.startsWith(dom)) return 75;
  if (name.includes(needle)) return 60;
  if (domain.includes(needle) || domain.includes(dom)) return 50;
  if (category.includes(needle)) return 30;
  if (dom && root.includes(dom)) return 20;
  return 0;
}

function searchResultsUrl(query: string): string {
  return `${SEARCH_RESULTS_PATH}?q=${encodeURIComponent(query.trim())}`;
}

export default function HeroSearch({ templates }: { templates: Template[] }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const needle = q.trim().toLowerCase();
  const dom = domainOf(q);

  const matches = useMemo(() => {
    if (!needle) return [];
    return templates
      .map((t) => ({ t, score: scoreMatch(t, needle, dom) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (!!b.t.popular !== !!a.t.popular) return a.t.popular ? -1 : 1;
        return a.t.name.localeCompare(b.t.name);
      })
      .map((x) => x.t);
  }, [templates, needle, dom]);

  const open = focused && needle.length > 0;
  const visible = matches.slice(0, MAX_RESULTS);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const navigateTo = useCallback((t: Template) => {
    const href = resultHref(t);
    if (href.startsWith("/")) {
      window.location.href = href;
    } else {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  }, []);

  /** Navigate to the scraper-lib search results page */
  const goToSearchResults = useCallback(() => {
    const trimmed = q.trim();
    if (!trimmed) return;
    window.location.href = searchResultsUrl(trimmed);
  }, [q]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchResults();
    } else if (!open) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, visible.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    clearTimeout(blurTimer.current);
    setFocused(true);
  };

  const handleBlur = () => {
    blurTimer.current = setTimeout(() => setFocused(false), 160);
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
        navigateTo(target);
        return;
      }
    }
    const fallback =
      templates.find((t) => t.domain === site.domain && t.popular) ||
      templates.find((t) => t.domain === site.domain);
    if (fallback) navigateTo(fallback);
  };

  return (
    <div className="hsearch-block">
      <div className="hsearch-wrap" ref={wrapRef}>
        <div className={`hsearch${focused ? " hsearch-focused" : ""}`}>
          <span className="hsearch-icon" aria-hidden>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActiveIdx(0);
              setFocused(true);
            }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="Find scrapers for Amazon, Instagram, TikTok..."
            aria-label="Search for a scraper"
            aria-expanded={open}
            aria-controls="hero-search-results"
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <button
            type="button"
            className="btn btn-primary btn-sm btn-pill"
            onClick={goToSearchResults}
            disabled={!needle}
          >
            Search
          </button>
        </div>

        {open && (
          <div className="hsearch-panel" role="listbox" id="hero-search-results">
            {visible.length > 0 ? (
              <>
                {visible.map((t, i) => {
                  const href = resultHref(t);
                  const external = href.startsWith("http");
                  return (
                    <a
                      key={t.slug}
                      href={href}
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className={`hsearch-row${i === activeIdx ? " hsearch-row-active" : ""}`}
                      role="option"
                      aria-selected={i === activeIdx}
                      onMouseEnter={() => setActiveIdx(i)}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <span className="hsearch-row-icon" style={{ color: t.color }}>
                        {t.icon}
                      </span>
                      <span className="hsearch-row-main">
                        <span className="hsearch-row-name">{t.name}</span>
                        <span className="hsearch-row-domain">{t.domain}</span>
                      </span>
                      <span className="hsearch-avail">Available</span>
                    </a>
                  );
                })}
                <a
                  href={searchResultsUrl(q)}
                  className="hsearch-more"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  View all results for &ldquo;{q.trim()}&rdquo; →
                </a>
              </>
            ) : (
              <div className="hsearch-empty">
                <div className="hsearch-empty-top">
                  No scraper for <b>{dom || q}</b> yet — build one with AI in minutes.
                </div>
                <div className="hsearch-empty-actions">
                  <a
                    href="/products/web-scraper/studio"
                    className="hsearch-action"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    Build with AI Scraper Studio →
                  </a>
                  <a href="/products/web-scraper#agents" className="hsearch-action" onMouseDown={(e) => e.preventDefault()}>
                    Or use your coding agent →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hero-popular" aria-hidden={!!needle || undefined}>
        {!needle && (
          <>
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
          </>
        )}
      </div>

      {!needle && (
        <div className="hero-inline-ctas">
          <a href="https://brightdata.com/cp/start" className="hero-cta-start" target="_blank" rel="noopener noreferrer">
            Start free →
          </a>
          <span className="hero-cta-sep" />
          <a href="https://brightdata.com/contact" className="hero-cta-sales" target="_blank" rel="noopener noreferrer">
            Contact sales
          </a>
        </div>
      )}
    </div>
  );
}

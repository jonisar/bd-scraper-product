"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import type { Template } from "@/lib/templates";
import { cpHrefForTemplate } from "@/lib/cp-href";
import { DOMAIN_HUBS, CATEGORY_HUBS, type DomainHubData } from "@/lib/domain-hubs";

const ALL_HUBS = Object.values(DOMAIN_HUBS).concat(Object.values(CATEGORY_HUBS));

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
    href: "/products/web-scraper/walmart",
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

function scoreHubMatch(hub: DomainHubData, needle: string, dom: string): number {
  const name = hub.name.toLowerCase();
  const slug = hub.slug.toLowerCase();
  const domain = hub.domain.toLowerCase();
  const root = domain.split(".")[0];

  if (slug === needle || name === needle) return 100;
  if (domain === needle || domain === dom) return 95;
  if (root === needle || root === dom) return 90;
  if (name.startsWith(needle)) return 80;
  if (slug.startsWith(needle)) return 75;
  if (domain.startsWith(needle)) return 70;
  if (name.includes(needle)) return 60;
  if (domain.includes(needle)) return 50;
  if (dom && root.includes(dom)) return 30;
  return 0;
}

const CP_DATASETS = "https://brightdata.com/cp/datasets";

export default function HeroSearch({ templates }: { templates: Template[] }) {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const needle = q.trim().toLowerCase();
  const dom = domainOf(q);

  const hubMatches = useMemo(() => {
    if (!needle) return [];
    return ALL_HUBS
      .map((hub) => ({ hub, score: scoreHubMatch(hub, needle, dom) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [needle, dom]);

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
  const totalItems = hubMatches.length + visible.length;
  const hasAnyResults = hubMatches.length > 0 || visible.length > 0;

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

  const goToSearchResults = useCallback(() => {
    const trimmed = q.trim();
    if (!trimmed) return;
    window.open(CP_DATASETS, "_blank", "noopener,noreferrer");
  }, [q]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) {
        const link = document.querySelector<HTMLAnchorElement>(".hsearch-panel [role=option].hsearch-row-active, .hsearch-panel [role=option].hsearch-hub-active");
        if (link) { link.click(); return; }
      }
      goToSearchResults();
    } else if (!open) {
      return;
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, totalItems - 1));
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
            {hasAnyResults ? (
              <>
                {hubMatches.length > 0 && (
                  <div className="hsearch-hub-group">
                    <div className="hsearch-group-label">Domains</div>
                    {hubMatches.map(({ hub }, i) => (
                      <a
                        key={hub.slug}
                        href={`/products/web-scraper/${hub.slug}`}
                        className={`hsearch-row hsearch-row-domain-hub${i === activeIdx ? " hsearch-row-active hsearch-hub-active" : ""}`}
                        role="option"
                        aria-selected={i === activeIdx}
                        onMouseEnter={() => setActiveIdx(i)}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        <span className="hsearch-hub-icon">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                          </svg>
                        </span>
                        <span className="hsearch-row-main">
                          <span className="hsearch-row-name">{hub.name}</span>
                          <span className="hsearch-row-domain">{hub.domain}</span>
                        </span>
                        <span className="hsearch-hub-badge">{hub.scrapers.length} scrapers</span>
                      </a>
                    ))}
                  </div>
                )}
                {visible.length > 0 && (
                  <div className="hsearch-scraper-group">
                    {hubMatches.length > 0 && (
                      <div className="hsearch-group-label">Scrapers</div>
                    )}
                    {visible.map((t, i) => {
                      const idx = hubMatches.length + i;
                      const href = resultHref(t);
                      const external = href.startsWith("http");
                      return (
                        <a
                          key={t.slug}
                          href={href}
                          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className={`hsearch-row${idx === activeIdx ? " hsearch-row-active" : ""}`}
                          role="option"
                          aria-selected={idx === activeIdx}
                          onMouseEnter={() => setActiveIdx(idx)}
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
                  </div>
                )}
                <a
                  href="https://brightdata.com/cp/datasets"
                  className="hsearch-more"
                  target="_blank"
                  rel="noopener noreferrer"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  Browse all scrapers on Bright Data →
                </a>
              </>
            ) : (
              <div className="hsearch-empty">
                <div className="hsearch-empty-top">
                  No scraper for <b>{dom || q}</b> yet, build one with AI in minutes.
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
        <>
          <div className="hero-ctas">
            <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
              Start free
            </a>
            <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
              Contact sales
            </a>
          </div>
          <p className="hub-hero-note">No credit card required · 5K free records/month</p>
        </>
      )}
    </div>
  );
}

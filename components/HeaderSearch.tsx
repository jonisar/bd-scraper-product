"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { templates } from "@/lib/templates";
import { templateHref } from "@/lib/templates";
import { DOMAIN_HUBS, CATEGORY_HUBS, type DomainHubData } from "@/lib/domain-hubs";

const ALL_HUBS = Object.values(DOMAIN_HUBS).concat(Object.values(CATEGORY_HUBS));

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

export default function HeaderSearch() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
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
    return templates.filter(
      (t) =>
        t.domain.includes(needle) ||
        t.domain.includes(dom) ||
        dom.includes(t.domain.split(".")[0]) ||
        t.name.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle)
    );
  }, [needle, dom]);

  const open = focused && needle.length > 0;
  const totalItems = hubMatches.length + Math.min(matches.length, 5);

  const goToSearchResults = useCallback(() => {
    const trimmed = q.trim();
    if (!trimmed) return;
    window.location.href = `/products/web-scraper/scraper-lib?q=${encodeURIComponent(trimmed)}`;
  }, [q]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0) {
        const link = document.querySelector<HTMLAnchorElement>(".hdr-search-panel [role=option].hdr-search-row-active");
        if (link) { link.click(); return; }
      }
      goToSearchResults();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, totalItems - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const hasAnyResults = hubMatches.length > 0 || matches.length > 0;

  return (
    <div className="hdr-search">
      <svg
        className="hdr-search-icon"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        aria-hidden
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
      <input
        ref={inputRef}
        value={q}
        onChange={(e) => {
          setQ(e.target.value);
          setActiveIdx(-1);
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Search scrapers..."
        aria-label="Search scrapers"
        autoComplete="off"
      />
      {!focused && !q && (
        <kbd className="hdr-search-kbd" aria-hidden>⌘K</kbd>
      )}

      {open && (
        <div className="hdr-search-panel" role="listbox">
          {hasAnyResults ? (
            <>
            {hubMatches.length > 0 && (
              <div className="hdr-search-hub-group">
                <div className="hdr-search-group-label">Domains</div>
                {hubMatches.map(({ hub }, i) => (
                  <a
                    key={hub.slug}
                    href={`/products/web-scraper/${hub.slug}`}
                    className={`hdr-search-row hdr-search-row-domain-hub${i === activeIdx ? " hdr-search-row-active" : ""}`}
                    role="option"
                    aria-selected={i === activeIdx}
                    onMouseEnter={() => setActiveIdx(i)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="hdr-search-hub-icon">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                      </svg>
                    </span>
                    <span className="hdr-search-row-info">
                      <span className="hdr-search-row-name">{hub.name}</span>
                      <span className="hdr-search-row-domain">{hub.domain}</span>
                    </span>
                    <span className="hdr-search-hub-badge">{hub.scrapers.length} scrapers</span>
                  </a>
                ))}
              </div>
            )}
            {matches.length > 0 && (
              <div className="hdr-search-scraper-group">
                {hubMatches.length > 0 && (
                  <div className="hdr-search-group-label">Scrapers</div>
                )}
                {matches.slice(0, 5).map((t, i) => {
                  const idx = hubMatches.length + i;
                  const href = templateHref(t);
                  const external = href.startsWith("http");
                  return (
                  <a
                    key={t.slug}
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={`hdr-search-row${idx === activeIdx ? " hdr-search-row-active" : ""}`}
                    role="option"
                    aria-selected={idx === activeIdx}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <span className="hdr-search-row-icon" style={{ color: t.color }}>
                      {t.icon}
                    </span>
                    <span className="hdr-search-row-info">
                      <span className="hdr-search-row-name">{t.name}</span>
                      <span className="hdr-search-row-domain">{t.domain}</span>
                    </span>
                    <span className="hdr-search-row-avail">✓</span>
                  </a>
                  );
                })}
              </div>
            )}
            <a
              href="/products/web-scraper/scraper-lib"
              className="hdr-search-more"
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={(e) => e.preventDefault()}
            >
              Browse all scrapers →
            </a>
            </>
          ) : (
            <div className="hdr-search-empty">
              <p>No scraper for <b>{dom || q}</b></p>
              <a
                href="/products/web-scraper/scraper-lib"
                className="hdr-search-empty-link"
                target="_blank"
                rel="noopener noreferrer"
                onMouseDown={(e) => e.preventDefault()}
              >
                Browse all scrapers →
              </a>
              <a
                href="/products/web-scraper/studio"
                className="hdr-search-empty-link"
                onMouseDown={(e) => e.preventDefault()}
              >
                Build one with AI →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

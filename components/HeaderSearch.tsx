"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { templates, templateHref } from "@/lib/templates";

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

export default function HeaderSearch() {
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
  }, [needle, dom]);

  const open = focused && needle.length > 0;

  const searchResultsUrl = useCallback((query: string) => {
    return `/products/web-scraper/scraper-lib?q=${encodeURIComponent(query.trim())}`;
  }, []);

  /** Enter always opens search results (same as /web-scraper HeroSearch). */
  const goToSearchResults = useCallback(() => {
    const trimmed = q.trim();
    if (!trimmed) return;
    window.location.href = searchResultsUrl(trimmed);
  }, [q, searchResultsUrl]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      goToSearchResults();
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.min(matches.length - 1, 4)));
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
          {matches.length > 0 ? (
            <>
            {matches.slice(0, 5).map((t, i) => {
              const href = templateHref(t);
              const external = href.startsWith("http");
              return (
              <a
                key={t.slug}
                href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`hdr-search-row${i === activeIdx ? " hdr-search-row-active" : ""}`}
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
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
            <a
              href={searchResultsUrl(q)}
              className="hdr-search-more"
              onMouseDown={(e) => e.preventDefault()}
            >
              View all results for &ldquo;{q.trim()}&rdquo; →
            </a>
            </>
          ) : (
            <div className="hdr-search-empty">
              <p>No scraper for <b>{dom || q}</b></p>
              <a
                href={searchResultsUrl(q)}
                className="hdr-search-empty-link"
                onMouseDown={(e) => e.preventDefault()}
              >
                Search all scrapers →
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

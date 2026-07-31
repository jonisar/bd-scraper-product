"use client";

import { useMemo, useState, useRef, useCallback } from "react";
import { templates, consoleUrl } from "@/lib/templates";

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
  const blurTimer = useRef<ReturnType<typeof setTimeout>>();

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

  const go = useCallback(
    (idx?: number) => {
      const target = matches[idx ?? activeIdx] ?? matches[0];
      if (target) {
        window.open(consoleUrl(target), "_blank");
        setQ("");
        setFocused(false);
      }
    },
    [matches, activeIdx]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" && matches.length) go();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, Math.min(matches.length - 1, 5)));
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

      {open && (
        <div className="hdr-search-panel" role="listbox">
          {matches.length > 0 ? (
            matches.slice(0, 6).map((t, i) => (
              <a
                key={t.slug}
                href={consoleUrl(t)}
                target="_blank"
                rel="noopener noreferrer"
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
              </a>
            ))
          ) : (
            <div className="hdr-search-empty">
              <p>No scraper for <b>{dom || q}</b></p>
              <a
                href="https://brightdata.com/cp/scrapers/automation/chat"
                target="_blank"
                rel="noopener noreferrer"
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

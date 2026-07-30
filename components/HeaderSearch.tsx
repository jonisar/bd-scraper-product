"use client";

import { useMemo, useState } from "react";
import { templates, consoleUrl } from "@/lib/templates";

export default function HeaderSearch() {
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);

  const needle = q.trim().toLowerCase();

  const matches = useMemo(() => {
    if (!needle) return [];
    return templates.filter(
      (t) =>
        t.domain.includes(needle) ||
        t.name.toLowerCase().includes(needle) ||
        t.category.toLowerCase().includes(needle)
    );
  }, [needle]);

  const open = focused && needle.length > 0 && matches.length > 0;

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
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 180)}
        placeholder="Search scrapers..."
        aria-label="Search scrapers"
      />
      <kbd className="hdr-search-kbd hide-sm">/</kbd>

      {open && (
        <div className="hdr-search-panel">
          {matches.slice(0, 6).map((t) => (
            <a
              key={t.slug}
              href={consoleUrl(t)}
              target="_blank"
              rel="noopener noreferrer"
              className="hdr-search-row"
              onClick={() => { setQ(""); setFocused(false); }}
            >
              <span className="hdr-search-row-icon" style={{ color: t.color }}>
                {t.icon}
              </span>
              <span className="hdr-search-row-info">
                <span className="hdr-search-row-name">{t.name}</span>
                <span className="hdr-search-row-domain">{t.domain}</span>
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

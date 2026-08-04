"use client";

import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import { catalog, CATALOG_CATEGORIES, type CatalogScraper } from "@/lib/catalog";
import { CATEGORY_LABELS } from "@/lib/category-labels";
import { scraperHref } from "@/lib/scraper-href";
import ScraperCard from "@/components/ScraperCard";

const POPULAR_LIMIT = 9;
const BATCH_SIZE = 12;
const SECTION_CARD_BATCH = 6;

type SortKey = "best-match" | "popular" | "most-used" | "az";

const SORT_OPTIONS: { value: SortKey; label: string; searchOnly?: boolean }[] = [
  { value: "best-match", label: "Best match", searchOnly: true },
  { value: "popular", label: "Popular" },
  { value: "az", label: "A → Z" },
];

const CATEGORY_ICONS: Record<string, string> = {
  "Social Media": "◎",
  "E-commerce": "⛁",
  "Business (B2B)": "⊞",
  "Jobs": "⬡",
  "Real Estate": "⌂",
  "Travel": "✈",
  "Search": "▲",
  "News & Media": "◈",
  "Finance": "∞",
};

const CATEGORY_VIEW_ALL: Record<string, { label: string; href: string }> = {
  "Social Media":   { label: "View all Social Media scrapers",   href: "/products/web-scraper/scraper-lib?cat=Social+Media" },
  "E-commerce":     { label: "View all E-commerce scrapers",     href: "/products/web-scraper/scraper-lib/categories/ecommerce" },
  "Business (B2B)": { label: "View all B2B scrapers",            href: "/products/web-scraper/scraper-lib?cat=Business+%28B2B%29" },
  "Jobs":           { label: "View all Jobs scrapers",           href: "/products/web-scraper/scraper-lib?cat=Jobs" },
  "Real Estate":    { label: "View all Real Estate scrapers",    href: "/products/web-scraper/scraper-lib?cat=Real+Estate" },
  "Travel":         { label: "View all Travel scrapers",         href: "/products/web-scraper/scraper-lib?cat=Travel" },
  "Search":         { label: "View all Search scrapers",         href: "/products/web-scraper/scraper-lib?cat=Search" },
  "News & Media":   { label: "View all News & Media scrapers",   href: "/products/web-scraper/scraper-lib?cat=News+%26+Media" },
  "Finance":        { label: "View all Finance scrapers",        href: "/products/web-scraper/scraper-lib?cat=Finance" },
};

type DomainCardData = {
  domain: string;
  label: string;
  icon: string;
  logo: string;
  color: string;
  desc: string;
  scraperCount: number;
  totalDelivered: string;
  successRate: string;
  href: string;
};

function buildTopDomains(): DomainCardData[] {
  const DOMAIN_META: Record<string, { label: string; icon: string; logo: string; color: string; desc: string; href: string }> = {
    "linkedin.com":       { label: "LinkedIn",       icon: "in", logo: "/logos/linkedin.png",       color: "#0A66C2", desc: "Profiles, companies, job listings, and post engagement data", href: "/products/web-scraper/linkedin" },
    "instagram.com":      { label: "Instagram",      icon: "◎",  logo: "/logos/instagram.png",      color: "#E4405F", desc: "Profiles, posts, reels, comments, and engagement metrics", href: "/products/web-scraper/instagram" },
    "tiktok.com":         { label: "TikTok",         icon: "♪",  logo: "/logos/tiktok.png",         color: "#00F2EA", desc: "Profiles, videos, shop products, and trending hashtags", href: "/products/web-scraper/tiktok" },
    "facebook.com":       { label: "Facebook",       icon: "f",  logo: "/logos/facebook.png",       color: "#1877F2", desc: "Page posts, ads library, reactions, and audience data", href: "/products/web-scraper/facebook" },
    "x.com":              { label: "X (Twitter)",    icon: "𝕏",  logo: "/logos/x.png",              color: "#14171A", desc: "Posts, profiles, engagement metrics, and trending topics", href: "/products/web-scraper/x" },
    "openai.com":         { label: "ChatGPT",        icon: "◈",  logo: "/logos/chatgpt.png",        color: "#10A37F", desc: "AI conversations, responses, and model interaction data", href: "/products/web-scraper/chatgpt" },
    "youtube.com":        { label: "YouTube",        icon: "▶",  logo: "/logos/youtube.png",        color: "#FF0000", desc: "Videos, channels, comments, subscribers, and view counts", href: "/products/web-scraper/youtube" },
    "amazon.com":         { label: "Amazon",         icon: "A",  logo: "/logos/amazon.png",         color: "#FF9900", desc: "Products, reviews, pricing, sellers, and bestsellers data", href: "/products/web-scraper/amazon" },
    "walmart.com":        { label: "Walmart",        icon: "W",  logo: "/logos/walmart.png",        color: "#0071CE", desc: "Products, prices, reviews, and inventory data", href: "/products/web-scraper/walmart" },
    "booking.com":        { label: "Booking.com",    icon: "B",  logo: "/logos/booking.png",        color: "#003580", desc: "Hotels, prices, availability, and guest reviews", href: "/products/web-scraper/booking" },
    "airbnb.com":         { label: "Airbnb",         icon: "A",  logo: "/logos/airbnb.png",         color: "#FF5A5F", desc: "Vacation rental listings, prices, and reviews", href: "/products/web-scraper/airbnb" },
    "indeed.com":         { label: "Indeed",         icon: "I",  logo: "/logos/indeed.png",         color: "#003A9B", desc: "Job listings, salaries, company reviews, and labor market data", href: "/products/web-scraper/indeed" },
    "crunchbase.com":     { label: "Crunchbase",     icon: "Cb", logo: "/logos/crunchbase.png",     color: "#0288D1", desc: "Companies, funding rounds, investors, and M&A data", href: "/products/web-scraper/crunchbase" },
    "zillow.com":         { label: "Zillow",         icon: "Z",  logo: "/logos/zillow.png",         color: "#006AFF", desc: "Property listings, Zestimates, rentals, and neighborhood data", href: "/products/web-scraper/zillow" },
    "google.com/maps":    { label: "Google Maps",    icon: "G",  logo: "/logos/google-maps.png",    color: "#34A853", desc: "Business listings, reviews, ratings, hours, and locations", href: "/products/web-scraper/google-maps" },
    "glassdoor.com":      { label: "Glassdoor",      icon: "Gd", logo: "/logos/glassdoor.png",      color: "#0CAA41", desc: "Company reviews, salaries, interviews, and job listings", href: "/products/web-scraper/glassdoor" },
    "yelp.com":           { label: "Yelp",           icon: "Y",  logo: "/logos/yelp.png",           color: "#D32323", desc: "Business listings, reviews, ratings, and local data", href: "/products/web-scraper/yelp" },
    "play.google.com":    { label: "Google Play",    icon: "▷",  logo: "/logos/google-play.png",    color: "#01875F", desc: "Apps, reviews, rankings, and developer data", href: "/products/web-scraper/google-play" },
    "homedepot.com":      { label: "Home Depot",     icon: "HD", logo: "/logos/homedepot.png",      color: "#F96302", desc: "Building materials, products, prices, and reviews", href: "/products/web-scraper/homedepot" },
    "zoopla.co.uk":       { label: "Zoopla",         icon: "Zp", logo: "/logos/zoopla.png",         color: "#7B0099", desc: "UK property listings, prices, and market data", href: "/products/web-scraper/zoopla" },
    "zonaprop.com.ar":    { label: "Zonaprop",       icon: "Zn", logo: "/logos/zonaprop.png",       color: "#FF6611", desc: "Argentina property listings and real estate data", href: "/products/web-scraper/zonaprop" },
    "inmuebles24.com":    { label: "Inmuebles24",    icon: "I24",logo: "/logos/inmuebles24.png",    color: "#FF6611", desc: "Mexico property listings and real estate data", href: "/products/web-scraper/inmuebles24" },
    "metrocuadrado.com":  { label: "Metrocuadrado",  icon: "Mc", logo: "/logos/metrocuadrado.png",  color: "#004CFF", desc: "Colombia property listings and real estate data", href: "/products/web-scraper/metrocuadrado" },
    "agoda.com":          { label: "Agoda",          icon: "Ag", logo: "/logos/agoda.png",          color: "#5391D4", desc: "Hotels, prices, and reviews across Asia-Pacific", href: "/products/web-scraper/agoda" },
    "trip.com":           { label: "Trip.com",       icon: "Tr", logo: "/logos/trip.png",           color: "#287DFA", desc: "Hotels, flights, and travel deals worldwide", href: "/products/web-scraper/trip" },
  };

  const domainOrder = Object.keys(DOMAIN_META);
  return domainOrder.map((domain) => {
    const meta = DOMAIN_META[domain];
    const scrapers = catalog.filter((s) => s.domain === domain);
    const totalViews = scrapers.reduce((sum, s) => sum + parseViews(s.views), 0);
    const deliveredStr = totalViews >= 1000 ? `${(totalViews / 1000).toFixed(0)}K+` : `${totalViews}+`;
    return {
      domain,
      label: meta.label,
      icon: meta.icon,
      logo: meta.logo,
      color: meta.color,
      desc: meta.desc,
      scraperCount: scrapers.length,
      totalDelivered: deliveredStr,
      successRate: "99.2%",
      href: meta.href,
    };
  });
}

const TOP_DOMAINS = buildTopDomains();

function DomainLogo({ domain, logo, label, icon, color }: { domain: string; logo: string; label: string; icon: string; color: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="cc-icon" style={{ background: `linear-gradient(135deg, ${color}22, ${color}0a)`, borderColor: `${color}33` }}>
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logo}
          alt={label}
          className={`cc-icon-logo${domain === "x.com" ? " cc-logo-invert" : ""}`}
          width={24}
          height={24}
          loading="eager"
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="cc-icon-letter" style={{ color }}>{icon}</span>
      )}
    </div>
  );
}

function parseViews(v: string): number {
  const n = parseFloat(v.replace(/[^0-9.]/g, ""));
  if (v.includes("K")) return n * 1000;
  if (v.includes("M")) return n * 1_000_000;
  return n || 0;
}

/**
 * Score how relevant a scraper is to the search query.
 * Higher = more relevant. Returns 0 if no match.
 */
function scoreRelevancy(s: CatalogScraper, needle: string): number {
  const name = s.name.toLowerCase();
  const domain = s.domain.toLowerCase();
  const root = domain.split(".")[0];
  const category = s.category.toLowerCase();
  const desc = s.desc.toLowerCase();
  const dom = needle.replace(/^www\./, "").split("/")[0];

  if (domain === needle || domain === dom) return 100;
  if (root === needle || root === dom) return 95;
  if (name.startsWith(needle)) return 85;
  if (domain.startsWith(needle) || domain.startsWith(dom)) return 80;
  if (name.includes(needle)) return 65;
  if (domain.includes(needle) || domain.includes(dom)) return 55;
  if (desc.includes(needle)) return 40;
  if (category.includes(needle)) return 35;
  if (s.fields.some((f) => f.toLowerCase().includes(needle))) return 25;
  return 0;
}

function sortScrapers(list: CatalogScraper[], sort: SortKey, needle?: string): CatalogScraper[] {
  const arr = [...list];
  switch (sort) {
    case "best-match": {
      const q = needle || "";
      return arr.sort((a, b) => {
        const ra = scoreRelevancy(a, q);
        const rb = scoreRelevancy(b, q);
        if (rb !== ra) return rb - ra;
        return parseViews(b.views) - parseViews(a.views);
      });
    }
    case "popular":
      return arr.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0) || parseViews(b.views) - parseViews(a.views));
    case "most-used":
      return arr.sort((a, b) => parseViews(b.views) - parseViews(a.views));
    case "az":
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    default:
      return arr;
  }
}

function readUrlParams() {
  if (typeof window === "undefined") return { cat: "All", sort: "popular" as SortKey, q: "" };
  const params = new URLSearchParams(window.location.search);
  const cat = params.get("cat") || "All";
  const sort = (params.get("sort") as SortKey) || "popular";
  const q = params.get("q") || "";
  return { cat, sort, q };
}

function writeUrlParams(cat: string, sort: SortKey, q: string) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams();
  if (cat !== "All") params.set("cat", cat);
  if (sort !== "popular") params.set("sort", sort);
  if (q) params.set("q", q);
  const qs = params.toString();
  const url = window.location.pathname + (qs ? `?${qs}` : "");
  window.history.replaceState(null, "", url);
}

/* ─── Lazy section: renders cards progressively once near viewport ─── */
function LazyCardGrid({
  scrapers,
  batchSize = SECTION_CARD_BATCH,
}: {
  scrapers: CatalogScraper[];
  batchSize?: number;
}) {
  const [visible, setVisible] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && visible === 0) setVisible(batchSize);
      },
      { rootMargin: "400px" },
    );
    obs.observe(root);
    return () => obs.disconnect();
  }, [batchSize, visible]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= scrapers.length) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible((v) => Math.min(v + batchSize, scrapers.length));
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible, scrapers.length, batchSize]);

  const slice = scrapers.slice(0, visible);
  const hasMore = visible < scrapers.length;

  return (
    <div ref={rootRef}>
      {visible > 0 && (
        <div className="lib-grid slib-grid-animated">
          {slice.map((s, i) => (
            <div
              key={s.id}
              className="slib-card-appear"
              style={{ animationDelay: `${Math.min(i % batchSize, 8) * 40}ms` }}
            >
              <ScraperCard
                name={s.name}
                domain={s.domain}
                category={s.category}
                desc={s.desc}
                views={s.views}
                downloads={s.downloads}
                href={scraperHref(s)}
              />
            </div>
          ))}
        </div>
      )}
      {hasMore && (
        <div ref={sentinelRef} className="slib-sentinel">
          <div className="slib-loading">
            <span className="slib-loading-dot" />
            <span className="slib-loading-dot" />
            <span className="slib-loading-dot" />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ScraperLibraryInfinite() {
  const [cat, setCat] = useState<string>("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [sortOpen, setSortOpen] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const didHydrateRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const { cat: urlCat, sort: urlSort, q: urlQ } = readUrlParams();
    if (CATALOG_CATEGORIES.includes(urlCat as typeof CATALOG_CATEGORIES[number])) setCat(urlCat);
    if (SORT_OPTIONS.some((o) => o.value === urlSort)) setSort(urlSort);
    if (urlQ) {
      setSearch(urlQ);
      if (!urlSort || urlSort === "popular") setSort("best-match");
    }
    requestAnimationFrame(() => { didHydrateRef.current = true; });
  }, []);

  useEffect(() => {
    if (!didHydrateRef.current) return;
    writeUrlParams(cat, sort, search.trim());
  }, [cat, sort, search]);

  const prevSearchRef = useRef("");
  useEffect(() => {
    if (!initializedRef.current) return;
    const trimmed = search.trim();
    const prev = prevSearchRef.current;
    prevSearchRef.current = trimmed;
    if (trimmed && !prev) setSort("best-match");
    else if (!trimmed && prev) setSort("popular");
  }, [search]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const s of catalog) counts.set(s.category, (counts.get(s.category) || 0) + 1);
    return counts;
  }, []);

  const needle = search.trim().toLowerCase();
  const isSearching = needle.length > 0;
  const isCurated = cat === "All" && !isSearching;

  const filtered = useMemo(() => {
    let list = [...catalog];
    if (cat !== "All") list = list.filter((s) => s.category === cat);
    if (needle) list = list.filter((s) => scoreRelevancy(s, needle) > 0);
    return sortScrapers(list, sort, needle);
  }, [cat, needle, sort]);

  const popular = useMemo(
    () => sortScrapers(catalog.filter((s) => s.popular), "most-used").slice(0, POPULAR_LIMIT),
    [],
  );

  const categorySections = useMemo(() => {
    if (!isCurated) return [];
    const popularIds = new Set(popular.map((s) => s.id));
    return CATALOG_CATEGORIES
      .filter((c) => c !== "All")
      .map((category) => {
        const all = sortScrapers(catalog.filter((s) => s.category === category), "most-used");
        const deduped = all.filter((s) => !popularIds.has(s.id));
        return { category, scrapers: deduped, total: all.length, labels: CATEGORY_LABELS[category] || [] };
      })
      .filter((sec) => sec.scrapers.length > 0);
  }, [isCurated, popular]);

  useEffect(() => { setVisibleCount(BATCH_SIZE); }, [cat, needle, sort]);

  const loadMore = useCallback(() => {
    setVisibleCount((prev) => Math.min(prev + BATCH_SIZE, filtered.length));
  }, [filtered.length]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMore(); },
      { rootMargin: "200px" },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, [loadMore]);

  useEffect(() => {
    if (!sortOpen) return;
    const handler = (e: MouseEvent) => {
      if (!sortRef.current?.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  const handleCatChange = (c: string) => {
    setCat(c);
    setSearch("");
    setSort("popular");
  };

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const activeLabels = CATEGORY_LABELS[cat] || [];

  const renderCard = (s: CatalogScraper, idx: number) => (
    <div
      key={s.id}
      className="slib-card-appear"
      style={{ animationDelay: `${Math.min(idx % BATCH_SIZE, 8) * 40}ms` }}
    >
      <ScraperCard
        name={s.name}
        domain={s.domain}
        category={s.category}
        desc={s.desc}
        views={s.views}
        downloads={s.downloads}
        href={scraperHref(s)}
      />
    </div>
  );

  return (
    <div className="slib-infinite">
      {/* ── Sticky filter bar ─────────────────────────────────── */}
      <div className="slib-filter-bar">
        <div className="lib-chips-wrap">
          <div className="lib-chips">
            {CATALOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`lib-chip ${cat === c ? "active" : ""}`}
                onClick={() => handleCatChange(c)}
              >
                {c}
                {c !== "All" && (
                  <span className="lib-chip-n">
                    {categoryCounts.get(c) || 0}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="slib-controls">
          <div className="slib-search-wrap">
            <input
              className="lib-search"
              placeholder="Find scrapers for Amazon, Instagram, TikTok..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Filter scrapers"
            />
            {search && (
              <button
                type="button"
                className="slib-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="slib-sort" ref={sortRef}>
            <button
              type="button"
              className="slib-sort-btn"
              onClick={() => setSortOpen((o) => !o)}
              aria-expanded={sortOpen}
              aria-haspopup="listbox"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M3 6h18M3 12h12M3 18h6" />
              </svg>
              {SORT_OPTIONS.find((o) => o.value === sort)?.label}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" className={`slib-sort-chevron${sortOpen ? " open" : ""}`}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>
            {sortOpen && (
              <div className="slib-sort-menu" role="listbox">
                {SORT_OPTIONS.filter((o) => !o.searchOnly || isSearching).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    role="option"
                    aria-selected={sort === o.value}
                    className={`slib-sort-option${sort === o.value ? " active" : ""}`}
                    onClick={() => { setSort(o.value); setSortOpen(false); }}
                  >
                    {o.label}
                    {sort === o.value && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active category labels */}
      {activeLabels.length > 0 && !isSearching && (
        <div className="slib-active-labels">
          {activeLabels.map((l) => (
            <a
              key={l.name}
              href={l.href}
              {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="lib-section-label"
            >
              {l.name}
            </a>
          ))}
        </div>
      )}

      {/* Results count — filtered/search modes only */}
      {!isCurated && (
        <div className="slib-results-meta">
          <span className="slib-results-count">
            {filtered.length} scraper{filtered.length !== 1 ? "s" : ""}
            {cat !== "All" && ` in ${cat}`}
            {isSearching && ` matching \u201c${search.trim()}\u201d`}
          </span>
        </div>
      )}

      {/* ─── CURATED "ALL" VIEW ─────────────────────────────────── */}
      {isCurated ? (
        <div className="slib-curated">
          {/* Domain cards */}
          <div className="slib-quicknav">
            {TOP_DOMAINS.map((d) => {
              const external = d.href.startsWith("http");
              return (
                <a
                  key={d.domain}
                  href={d.href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="cc"
                >
                  <div className="cc-glow" aria-hidden="true" />
                  <div className="cc-header">
                    <DomainLogo domain={d.domain} logo={d.logo} label={d.label} icon={d.icon} color={d.color} />
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
              );
            })}
          </div>

          {/* Popular scrapers — rendered immediately */}
          <div className="slib-curated-section">
            <div className="slib-curated-head">
              <div>
                <h2>Popular scrapers</h2>
                <p>The most-used scrapers across all categories</p>
              </div>
              <span className="slib-section-count">{catalog.length} total</span>
            </div>
            <div className="lib-grid slib-grid-animated">
              {popular.map((s, i) => renderCard(s, i))}
            </div>
            <p className="slib-view-all">
              <a href="/products/web-scraper/scraper-lib?sort=popular" className="slib-view-all-link">
                View all scrapers →
              </a>
            </p>
          </div>

          {/* Category sections — all scrapers, lazy-loaded per section */}
          {categorySections.map((sec) => (
            <div key={sec.category} className="slib-curated-section">
              <div className="slib-curated-head">
                <div>
                  <h3>
                    <span className="slib-curated-caticon">{CATEGORY_ICONS[sec.category] || "◈"}</span>
                    {sec.category}
                  </h3>
                  {sec.labels.length > 0 && (
                    <div className="slib-curated-labels">
                      {sec.labels.map((l) => (
                        <a
                          key={l.name}
                          href={l.href}
                          {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="lib-section-label"
                        >
                          {l.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <span className="slib-section-count">{sec.total} scrapers</span>
              </div>
              <LazyCardGrid scrapers={sec.scrapers} />
              {CATEGORY_VIEW_ALL[sec.category] && (
                <p className="slib-view-all">
                  <a href={CATEGORY_VIEW_ALL[sec.category].href} className="slib-view-all-link">
                    {CATEGORY_VIEW_ALL[sec.category].label} →
                  </a>
                </p>
              )}
            </div>
          ))}

          {/* Bottom CTA */}
          <div className="slib-bottom-cta">
            <div className="slib-bottom-cta-body">
              <strong>Can&rsquo;t find what you need?</strong>
              <p>Build a custom scraper for any website in minutes with AI — no code required.</p>
            </div>
            <a href="/products/web-scraper/studio" className="btn btn-primary btn-pill">
              Open Scraper Studio →
            </a>
          </div>
        </div>
      ) : (
        /* ─── FILTERED / SEARCH VIEW (infinite scroll) ────────── */
        <>
          {visible.length > 0 ? (
            <>
              <div className="lib-grid slib-grid-animated">
                {visible.map((s, idx) => renderCard(s, idx))}
              </div>

              {hasMore && (
                <div ref={sentinelRef} className="slib-sentinel">
                  <div className="slib-loading">
                    <span className="slib-loading-dot" />
                    <span className="slib-loading-dot" />
                    <span className="slib-loading-dot" />
                  </div>
                </div>
              )}

              {!hasMore && filtered.length > BATCH_SIZE && (
                <div className="slib-end-message">
                  <p>You&rsquo;ve seen all {filtered.length} scrapers{cat !== "All" ? ` in ${cat}` : ""}.</p>
                </div>
              )}
            </>
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
        </>
      )}
    </div>
  );
}

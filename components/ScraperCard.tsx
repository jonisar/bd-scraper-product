"use client";

export type ScraperCardProps = {
  name: string;
  domain: string;
  category: string;
  desc: string;
  fieldsPreview?: string;
  views: string;
  downloads: string;
  href: string;
  ctaLabel?: string;
  ctaHref?: string;
  successRate?: string;
  lastVerified?: string;
};

export default function ScraperCard({
  name,
  domain,
  category,
  desc,
  fieldsPreview,
  views,
  downloads,
  href,
  ctaLabel = "Try scraper →",
  ctaHref,
  successRate = "99.2%",
  lastVerified = "3h ago",
}: ScraperCardProps) {
  const external = href.startsWith("http");
  const resolvedCtaHref = ctaHref || href;
  const ctaExternal = resolvedCtaHref.startsWith("http");

  return (
    <div className="fc">
      <a
        href={href}
        className="fc-link"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={`${name} — ${domain}`}
      >
        <div className="fc-top">
          <div className="fc-identity">
            <span className="fc-name">{name}</span>
            <span className="fc-domain">{domain}</span>
          </div>
          <span className="fc-cat">{category}</span>
        </div>
        <p className="fc-desc">{desc}</p>
        {fieldsPreview ? <p className="fc-fields">{fieldsPreview}</p> : null}
      </a>
      <div className="fc-stats-row">
        <div className="fc-stat">
          <span className="fc-stat-val">{views}</span>
          <span className="fc-stat-label">Delivered</span>
        </div>
        <div className="fc-stat">
          <span className="fc-stat-val">{downloads}</span>
          <span className="fc-stat-label">Active users</span>
        </div>
        <div className="fc-stat">
          <span className="fc-stat-val fc-stat-success">{successRate}</span>
          <span className="fc-stat-label">Success rate</span>
        </div>
      </div>
      <div className="fc-foot">
        <div className="fc-badges">
          <span className="fc-badge fc-badge-mcp">⚡ MCP</span>
          <span className="fc-badge">✓ Auto-maintained</span>
        </div>
        <span className="fc-verified">Verified {lastVerified}</span>
      </div>
    </div>
  );
}

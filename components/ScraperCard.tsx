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
          <span className="fc-stat-val">$1.50</span>
          <span className="fc-stat-label">per 1K</span>
        </div>
      </div>
      <div className="fc-foot">
        <div className="fc-badges">
          <span className="fc-badge">✓ GDPR &amp; CCPA</span>
          <span className="fc-badge">✓ Auto-maintained</span>
        </div>
        <a
          href={resolvedCtaHref}
          className="fc-cta"
          onClick={(e) => e.stopPropagation()}
          {...(ctaExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

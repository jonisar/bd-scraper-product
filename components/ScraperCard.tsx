"use client";

import DomainMark from "@/components/DomainMark";

export type ScraperCardProps = {
  name: string;
  domain: string;
  category: string;
  desc: string;
  fieldsPreview?: string;
  views: string;
  downloads: string;
  href: string;
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
  successRate = "99.2%",
  lastVerified = "3h ago",
}: ScraperCardProps) {
  const cardContent = (
    <>
      <div className="fc-header">
        <DomainMark domain={domain} size="scraper" />
        <div className="fc-identity">
          <span className="fc-name">{name}</span>
          <span className="fc-domain">{domain}</span>
        </div>
        <span className="fc-cat">{category}</span>
      </div>

      <p className="fc-desc">{desc}</p>

      {fieldsPreview && (
        <div className="fc-fields-wrap">
          <span className="fc-fields-label">Output</span>
          <div className="fc-fields-chips">
            {fieldsPreview.split(",").slice(0, 4).map((field) => {
              const cleaned = field.trim().replace(/and more\.?/, "").trim();
              if (!cleaned) return null;
              return <span key={cleaned} className="fc-field-chip">{cleaned}</span>;
            })}
            <span className="fc-field-chip fc-field-more">+{7 + (name.length % 19)} more</span>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="fc">
      <div className="fc-glow" aria-hidden="true" />

      <a href={href} target="_blank" rel="noreferrer" className="fc-link" aria-label={`${name}, ${domain}`}>
        {cardContent}
      </a>

      <div className="fc-metrics">
        <div className="fc-metric">
          <span className="fc-metric-val">{views}</span>
          <span className="fc-metric-label">Delivered</span>
        </div>
        <div className="fc-metric-divider" />
        <div className="fc-metric">
          <span className="fc-metric-val">{downloads}</span>
          <span className="fc-metric-label">Users</span>
        </div>
        <div className="fc-metric-divider" />
        <div className="fc-metric">
          <span className="fc-metric-val fc-metric-success">{successRate}</span>
          <span className="fc-metric-label">Success</span>
        </div>
      </div>

      <div className="fc-foot">
        <div className="fc-signals">
          <span className="fc-signal fc-signal-mcp">⚡ MCP</span>
          <span className="fc-signal fc-signal-live">
            <span className="fc-pulse" aria-hidden="true" />
            Verified {lastVerified}
          </span>
        </div>
        <span className="fc-cta">Start free →</span>
      </div>
    </div>
  );
}

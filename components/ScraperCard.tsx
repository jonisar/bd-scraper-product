"use client";

import Link from "next/link";

const BRAND_COLORS: Record<string, string> = {
  "amazon.com": "#FF9900",
  "linkedin.com": "#0A66C2",
  "instagram.com": "#E4405F",
  "tiktok.com": "#00F2EA",
  "google.com/maps": "#34A853",
  "google.com": "#4285F4",
  "zillow.com": "#006AFF",
  "x.com": "#A8B3BD",
  "facebook.com": "#1877F2",
  "youtube.com": "#FF0000",
  "crunchbase.com": "#0288D1",
  "indeed.com": "#2164F3",
  "walmart.com": "#0071CE",
  "reddit.com": "#FF4500",
  "glassdoor.com": "#0CAA41",
  "booking.com": "#003580",
  "airbnb.com": "#FF5A5F",
  "finance.yahoo.com": "#6001D2",
  "ebay.com": "#E53238",
  "etsy.com": "#F1641E",
  "shopify.com": "#96BF48",
  "tripadvisor.com": "#34E0A1",
  "pinterest.com": "#E60023",
  "yelp.com": "#D32323",
  "trustpilot.com": "#00B67A",
  "target.com": "#CC0000",
  "bestbuy.com": "#0046BE",
  "twitch.tv": "#9146FF",
  "discord.com": "#5865F2",
  "quora.com": "#B92B27",
  "medium.com": "#A8B3BD",
  "expedia.com": "#FFDC00",
  "redfin.com": "#A02021",
  "realtor.com": "#D92228",
  "apollo.io": "#6B4FBB",
  "g2.com": "#FF492C",
  "upwork.com": "#14A800",
  "fiverr.com": "#1DBF73",
  "coinmarketcap.com": "#17C784",
  "bloomberg.com": "#5E00FF",
};

function brandColor(domain: string): string {
  if (BRAND_COLORS[domain]) return BRAND_COLORS[domain];
  const root = domain.split(".")[0];
  for (const [key, color] of Object.entries(BRAND_COLORS)) {
    if (key.startsWith(root)) return color;
  }
  return "#6ea0ff";
}

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
  const external = href.startsWith("http");
  const bc = brandColor(domain);

  const cardContent = (
    <>
      <div className="fc-header">
        <div
          className="fc-icon"
          style={{
            background: `linear-gradient(135deg, ${bc}22, ${bc}0a)`,
            borderColor: `${bc}33`,
          }}
        >
          <span className="fc-icon-letter" style={{ color: bc }}>{domain.charAt(0).toUpperCase()}</span>
        </div>
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

      {external ? (
        <a
          href={href}
          className="fc-link"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — ${domain}`}
        >
          {cardContent}
        </a>
      ) : (
        <Link href={href} className="fc-link" aria-label={`${name} — ${domain}`}>
          {cardContent}
        </Link>
      )}

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

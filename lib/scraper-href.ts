import { AMAZON_SCRAPERS } from "@/lib/amazon-scrapers";
import { templates, templateHref } from "@/lib/templates";
import type { CatalogScraper } from "@/lib/catalog";

/** Domains that have a local hub page under /products/web-scraper/{slug} */
export const DOMAIN_HUB_HREF: Record<string, string> = {
  "amazon.com": "/products/web-scraper/amazon",
  "linkedin.com": "/products/web-scraper/linkedin",
  "instagram.com": "/products/web-scraper/instagram",
  "tiktok.com": "/products/web-scraper/tiktok",
  "google.com/maps": "/products/web-scraper/google-maps",
  "zillow.com": "/products/web-scraper/zillow",
  "x.com": "/products/web-scraper/x",
  "facebook.com": "/products/web-scraper/facebook",
  "youtube.com": "/products/web-scraper/youtube",
};

const amazonHrefMap = new Map(AMAZON_SCRAPERS.map((a) => [a.id, a.href]));
// Catalog uses "amazon-products"; amazon-scrapers uses "amazon-product"
amazonHrefMap.set("amazon-products", "/products/web-scraper/amazon/amazon-product-scraper");

/**
 * Preferred in-app href for a catalog scraper card.
 * Prefer local detail/hub pages; fall back to scraper-lib search.
 */
export function scraperHref(s: CatalogScraper): string {
  const amazonHref = amazonHrefMap.get(s.id);
  if (amazonHref) return amazonHref;

  if (s.slug === "amazon-product") {
    return "/products/web-scraper/amazon/amazon-product-scraper";
  }

  const hub = DOMAIN_HUB_HREF[s.domain];
  if (hub && s.domain === "amazon.com") return hub;

  if (s.slug) {
    const t = templates.find((tpl) => tpl.slug === s.slug);
    if (t) {
      const href = templateHref(t);
      // Prefer local hub over console URLs for library SEO
      if (href.startsWith("/") || !hub) return href;
    }
  }

  if (hub) return hub;

  const byDomain =
    templates.find((t) => t.domain === s.domain && t.popular) ||
    templates.find((t) => t.domain === s.domain);
  if (byDomain) {
    const href = templateHref(byDomain);
    if (href.startsWith("/")) return href;
  }

  return `/products/web-scraper/scraper-lib?q=${encodeURIComponent(s.name)}`;
}

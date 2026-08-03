import type { MetadataRoute } from "next";

const BASE = "https://brightdata.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "/products/web-scraper",
    "/products/web-scraper/scraper-lib",
    "/products/web-scraper/scraper-lib/categories",
    "/products/web-scraper/scraper-lib/categories/ecommerce",
    "/products/web-scraper/studio",
    "/products/web-scraper/amazon",
    "/products/web-scraper/amazon/amazon-product-scraper",
    "/products/web-scraper/linkedin",
    "/products/web-scraper/instagram",
    "/products/web-scraper/tiktok",
    "/products/web-scraper/google-maps",
    "/products/web-scraper/zillow",
    "/products/web-scraper/x",
    "/products/web-scraper/facebook",
    "/products/web-scraper/youtube",
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("scraper-lib") ? "daily" : "weekly",
    priority: path === "/products/web-scraper" ? 1 : path.includes("amazon-product") ? 0.9 : 0.8,
  }));
}

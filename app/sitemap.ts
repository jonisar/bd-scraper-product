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
    "/products/web-scraper/facebook",
    "/products/web-scraper/x",
    "/products/web-scraper/chatgpt",
    "/products/web-scraper/youtube",
    "/products/web-scraper/google-maps",
    "/products/web-scraper/zillow",
    "/products/web-scraper/crunchbase",
    "/products/web-scraper/glassdoor",
    "/products/web-scraper/indeed",
    "/products/web-scraper/yelp",
    "/products/web-scraper/walmart",
    "/products/web-scraper/google-play",
    "/products/web-scraper/homedepot",
    "/products/web-scraper/zoopla",
    "/products/web-scraper/zonaprop",
    "/products/web-scraper/inmuebles24",
    "/products/web-scraper/metrocuadrado",
    "/products/web-scraper/booking",
    "/products/web-scraper/airbnb",
    "/products/web-scraper/agoda",
    "/products/web-scraper/trip",
  ];

  return routes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: path.includes("scraper-lib") ? "daily" : "weekly",
    priority: path === "/products/web-scraper" ? 1 : path.includes("amazon-product") ? 0.9 : 0.8,
  }));
}

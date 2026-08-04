import type { NextConfig } from "next";

const VERTICAL_SLUGS = [
  "ecommerce",
  "social-media",
  "b2b",
  "jobs",
  "real-estate",
  "travel",
  "search",
  "finance",
  "news-media",
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return VERTICAL_SLUGS.map((slug) => ({
      source: `/products/web-scraper/scraper-lib/categories/${slug}`,
      destination: `/products/web-scraper/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;

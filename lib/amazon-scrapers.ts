/**
 * Amazon website scrapers shown on /products/web-scraper/amazon
 * Primary product scraper is local; others deep-link to Bright Data when no local page exists yet.
 */

export type AmazonScraper = {
  id: string;
  name: string;
  desc: string;
  fieldsPreview: string;
  views: string;
  downloads: string;
  /** Local app path when we have a detail page */
  href: string;
  local?: boolean;
};

const BD = "https://brightdata.com/products/web-scraper/amazon";

export const AMAZON_SITE = {
  slug: "amazon",
  name: "Amazon",
  domain: "amazon.com",
  title: "Amazon Scraper API",
  headline: "Amazon Scraper API",
  description:
    "Extract Amazon product data — prices, reviews, ratings, availability, seller info, and more — via API or no-code scraper. Auto-maintained and always unblocked.",
  scraperCount: 14,
} as const;

export const AMAZON_SCRAPERS: AmazonScraper[] = [
  {
    id: "amazon-product",
    name: "Amazon Product Scraper",
    desc: "Collect full product detail pages by URL — title, price, stock, seller, ratings, and more.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "34.7K+",
    downloads: "5.7K+",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    id: "amazon-product-bestsellers",
    name: "Amazon Products by Best Sellers",
    desc: "Collect products from a best sellers category URL.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "34.7K+",
    downloads: "5.7K+",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    id: "amazon-product-category",
    name: "Amazon Products by Category URL",
    desc: "Collect products from a specific Amazon category URL.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "34.7K+",
    downloads: "5.7K+",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    id: "amazon-product-keywords",
    name: "Amazon Products by Keywords",
    desc: "Discover products using Amazon keyword search.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "34.7K+",
    downloads: "5.7K+",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    id: "amazon-product-upc",
    name: "Amazon Products by UPC",
    desc: "Find products by UPC numbers.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "34.7K+",
    downloads: "5.7K+",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    id: "amazon-reviews",
    name: "Amazon Reviews Scraper",
    desc: "Scrape review text, ratings, verified purchase status, and author info.",
    fieldsPreview: "Review text, rating, author, ASIN, verified purchase, and more.",
    views: "7.3K+",
    downloads: "858+",
    href: `${BD}/reviews`,
  },
  {
    id: "amazon-sellers",
    name: "Amazon Sellers Info",
    desc: "Seller ID, store name, ratings, feedback, return policy, and business details.",
    fieldsPreview: "Seller ID, name, ratings, feedback, return policy, and more.",
    views: "2.5K+",
    downloads: "368+",
    href: `${BD}/seller`,
  },
  {
    id: "amazon-global",
    name: "Amazon Products Global Dataset",
    desc: "Global Amazon product data across marketplaces.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-global-category",
    name: "Amazon Global by Category URL",
    desc: "Collect global products from a category URL.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-global-keyword",
    name: "Amazon Global by Keyword Search",
    desc: "Collect global products by keyword search.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-global-bestsellers",
    name: "Amazon Global by Best Sellers",
    desc: "Collect global products from best sellers category URLs.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-global-seller",
    name: "Amazon Global by Seller URL",
    desc: "Collect Amazon products from a seller URL across markets.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-global-brand",
    name: "Amazon Global by Brand URL",
    desc: "Collect products from Amazon brand pages.",
    fieldsPreview: "Title, brand, price, availability, reviews, and more.",
    views: "2.1K+",
    downloads: "370+",
    href: BD,
  },
  {
    id: "amazon-search",
    name: "Amazon Products Search",
    desc: "Search result listings: ASIN, price, sponsored flags, and sold count.",
    fieldsPreview: "ASIN, name, price, sponsored, sold count, and more.",
    views: "1.6K+",
    downloads: "178+",
    href: BD,
  },
];

/** Deep-link cards for common Amazon extraction jobs */
export const AMAZON_PRODUCT_TYPES: {
  title: string;
  desc: string;
  href: string;
  local?: boolean;
}[] = [
  {
    title: "Amazon Reviews Scraper",
    desc: "Review text, ratings, verified purchase, dates, and reviewer details.",
    href: "https://brightdata.com/products/web-scraper/amazon/reviews",
  },
  {
    title: "Amazon ASIN Scraper",
    desc: "Product pages by ASIN — title, brand, price, images, availability, and more.",
    href: "/products/web-scraper/amazon/amazon-product-scraper",
    local: true,
  },
  {
    title: "Amazon Seller Scraper",
    desc: "Seller name, ID, ratings, feedback, shipping, and business details.",
    href: "https://brightdata.com/products/web-scraper/amazon/seller",
  },
  {
    title: "Amazon Price Scraper",
    desc: "Current vs original price, discounts, deals, currency, and stock status.",
    href: "https://brightdata.com/products/web-scraper/amazon/price",
  },
];

export const AMAZON_FAQS = [
  {
    q: "What is the Amazon Scraper API?",
    a: "The Amazon Scraper API automates data extraction from Amazon, so you can gather product, review, seller, and pricing data at scale without building or maintaining scrapers.",
  },
  {
    q: "How does the Amazon Scraper API work?",
    a: "Send a request with product URLs, ASINs, keywords, or category links. Bright Data handles proxies, CAPTCHAs, and rendering, then returns structured JSON, NDJSON, or CSV.",
  },
  {
    q: "Is the Amazon Scraper API compliant with data protection regulations?",
    a: "Yes. Bright Data collects only publicly available data and is designed to comply with GDPR, CCPA, and related privacy frameworks, backed by SOC 2 and ISO 27001 controls.",
  },
  {
    q: "Can I use the Amazon Scraper API for competitive analysis?",
    a: "Yes. Teams use it for pricing intelligence, bestseller tracking, review sentiment, seller benchmarking, and catalog monitoring across Amazon marketplaces.",
  },
  {
    q: "How can I integrate the Amazon Scraper API with my existing systems?",
    a: "Use the REST API with any HTTP client (Python, Node.js, cURL), deliver results via webhook, or push to Amazon S3, GCS, Azure, Snowflake, or SFTP.",
  },
  {
    q: "Is there a free tier available for the Amazon Scraper API?",
    a: "Yes. New Bright Data accounts include 5,000 free records per month (~$7.50 value) — no credit card, promo code, or commitment. Credits apply to Scrapers, Unlocker API, and SERP API, and renew on the 1st of each month.",
  },
  {
    q: "What happens when my free credits run out while using the Amazon Scraper API?",
    a: "If you have deposited funds, usage continues at pay-as-you-go rates. Without funds, requests error until you add balance or credits renew. Unused free credits do not roll over. Enable auto-recharge in billing settings to avoid interruptions.",
  },
  {
    q: "What are the usage limits for the Amazon Scraper API?",
    a: "There are no hard concurrency caps for typical use — scale from small tests to millions of records on the same API. Pay only for successfully delivered results.",
  },
  {
    q: "Do you provide support for the Amazon Scraper API?",
    a: "Yes. Bright Data offers 24/7 support for the Amazon Scraper API, with dedicated help for enterprise plans.",
  },
  {
    q: "What delivery methods are available?",
    a: "API download, webhook, Amazon S3, Google Cloud Storage, Google Pub/Sub, Microsoft Azure Storage, Snowflake, and SFTP.",
  },
  {
    q: "What file formats are available?",
    a: "JSON, NDJSON, JSON lines, CSV, and .gz (compressed).",
  },
] as const;

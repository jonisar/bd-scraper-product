import type { Metadata } from "next";
import ScraperPage from "@/app/components/ScraperPage";

export const metadata: Metadata = {
  title: "Amazon Product Scraper API - 5K Records/Month for Free",
  description:
    "Extract prices, reviews, stock levels & seller data from any Amazon product page via API. 40+ structured fields, 99.99% uptime SLA. Start free — 5K records/month, no credit card required.",
  openGraph: {
    title: "Amazon Product Scraper API - 5K Records/Month for Free",
    description:
      "Extract Amazon product data — prices, reviews, ratings, availability, seller info — via API. 40+ structured fields, 99.99% uptime SLA. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/amazon/amazon-product-scraper",
    siteName: "Bright Data",
  },
  alternates: {
    canonical: "https://brightdata.com/products/web-scraper/amazon/amazon-product-scraper",
  },
};

/** Keep in sync with FAQs rendered in ScraperPage */
const PAGE_FAQS = [
  {
    q: "What is the Amazon Scraper API?",
    a: "A fully managed REST API that extracts structured product data from Amazon. Send URLs or ASINs, get back clean JSON with 40+ fields — prices, reviews, seller info, stock levels, and more.",
  },
  {
    q: "How does the Amazon Scraper API work?",
    a: "POST Amazon URLs to the /scrape endpoint for real-time results (median ~3s) or /trigger for async bulk jobs up to 5,000 URLs. Bright Data handles proxies, CAPTCHAs, and JavaScript rendering automatically.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes. Every account includes 5,000 free records per month — no credit card required. Credits renew on the 1st of each month.",
  },
  {
    q: "What happens when free credits run out?",
    a: "If you have pre-deposited funds, usage continues at PAYG rates ($1.50/1K records). Otherwise, requests pause until you add funds or credits renew next month.",
  },
  {
    q: "What are the usage limits?",
    a: "No hard limits. The API supports unlimited concurrency and bulk requests of up to 5,000 URLs per call. Scale plans include priority throughput.",
  },
  {
    q: "Is the API compliant with data protection regulations?",
    a: "Yes. All data collection complies with GDPR, CCPA, and SEC regulations. Only publicly available data is collected — the same information any logged-out shopper can see.",
  },
  {
    q: "Can I use it for competitive analysis?",
    a: "Absolutely. Track competitor pricing, Buy Box winners, bestseller rankings, review velocity, and seller metrics across all 18 Amazon marketplaces.",
  },
  {
    q: "How do I integrate with my existing systems?",
    a: "Use the REST API directly, or deliver data to S3, Snowflake, Google Cloud Storage, webhooks, and more. SDKs available for Python, JavaScript, MCP, LangChain, and CrewAI.",
  },
  {
    q: "What delivery methods and file formats are supported?",
    a: "Delivery via API response, webhook, Amazon S3, Google Cloud Storage, Azure Blob, Snowflake, PubSub, and SFTP. Formats: JSON, NDJSON, CSV, and .gz compressed.",
  },
  {
    q: "Do you provide support?",
    a: "Yes — 24/7 dedicated support with under 10 minutes average response time, available via chat, email, or phone.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: PAGE_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

export default function AmazonProductScraperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ScraperPage />
    </>
  );
}

import type { Metadata } from "next";
import ScraperPage from "@/app/components/ScraperPage";

export const metadata: Metadata = {
  title: "Amazon Product Scraper API | Bright Data",
  description:
    "Extract prices, reviews, stock levels & seller data from any Amazon product page via API. Start free — 5K records/month.",
  openGraph: {
    title: "Amazon Product Scraper API | Bright Data",
    description:
      "Extract Amazon product data — prices, reviews, ratings, availability, seller info — via API or no-code. 99.2% success rate. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/amazon/amazon-product-scraper",
    siteName: "Bright Data",
  },
  alternates: {
    canonical: "https://brightdata.com/products/web-scraper/amazon/amazon-product-scraper",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What data can the Amazon Product Scraper extract?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Title, ASIN, price, list price, currency, star rating, reviews count, stock status, brand, seller info, product features, category breadcrumbs, and main product image URL.",
      },
    },
    {
      "@type": "Question",
      name: "How much does the Amazon Product Scraper cost?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Free tier includes 5,000 records/month with no credit card. Pay-as-you-go is $1.50 per 1,000 records. Volume discounts available on Scale ($499/mo) and Enterprise plans.",
      },
    },
    {
      "@type": "Question",
      name: "Can I use this scraper with AI agents via MCP?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Bright Data provides an MCP server that works with Claude, ChatGPT, Cursor, and any MCP-compatible client. You can also integrate via OpenAI SDK, LangChain, CrewAI, or REST API.",
      },
    },
  ],
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

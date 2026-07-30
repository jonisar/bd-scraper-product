import type { Metadata } from "next";
import ScraperPage from "@/app/components/ScraperPage";

export const metadata: Metadata = {
  title: "Amazon Scraper API - 5K records/Month for Free | Bright Data",
  description:
    "Scrape Amazon products and collect data such as best sellers, prices, reviews, images, ratings, and more. Amazon Scraper API or no-code scraper. Free Trial.",
  openGraph: {
    title: "Amazon Scraper API - 5K records/Month for Free | Bright Data",
    description:
      "Scrape Amazon products and collect data such as best sellers, prices, reviews, images, ratings, and more.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/amazon",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/amazon" },
};

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is an Amazon Scraper?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "An Amazon scraper is an automated tool designed to collect data from Amazon product pages and search results. Bright Data's Amazon Scraper API lets you collect pricing, reviews, ratings, and product details via a simple API call — no proxies or browsers to manage.",
      },
    },
    {
      "@type": "Question",
      name: "What data fields does the Amazon Scraper collect?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The Amazon Scraper collects over 50 data fields including product title, price, reviews, ratings, seller info, product description, images, availability status, category, ASIN, best-seller rank, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Is the Amazon Scraper free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, you get 5,000 records per month for free — no credit card required. Beyond that, pricing starts at $1.50 per 1,000 records on a pay-as-you-go basis.",
      },
    },
  ],
};

export default function AmazonScraperPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <ScraperPage />
    </>
  );
}

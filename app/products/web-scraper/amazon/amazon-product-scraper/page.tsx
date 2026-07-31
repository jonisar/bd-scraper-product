import type { Metadata } from "next";
import ScraperPage from "@/app/components/ScraperPage";

export const metadata: Metadata = {
  title: "Amazon Product Scraper API | Bright Data",
  description:
    "Extract prices, reviews, stock levels & seller data from any Amazon product page via API. Start free — 5K records/month.",
  alternates: {
    canonical: "https://brightdata.com/products/web-scraper/amazon/amazon-product-scraper",
  },
};

export default function AmazonProductScraperPage() {
  return <ScraperPage />;
}

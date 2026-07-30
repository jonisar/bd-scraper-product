import type { Metadata } from "next";
import ScraperPage from "@/app/components/ScraperPage";

export const metadata: Metadata = {
  title: "Amazon Scraper API - 5K records/Month for Free | Bright Data",
  description:
    "Scrape Amazon products and collect data such as best sellers, prices, reviews, images, ratings, and more. Amazon Scraper API or no-code scraper. Free Trial.",
};

export default function AmazonScraperPage() {
  return <ScraperPage />;
}

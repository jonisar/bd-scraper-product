import type { Metadata } from "next";
import DomainHub from "@/components/DomainHub";
import { CATEGORY_HUBS } from "@/lib/domain-hubs";

const hub = CATEGORY_HUBS["search"];

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  openGraph: {
    title: hub.title,
    description: hub.description,
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib/categories/search",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib/categories/search" },
};

export default function SearchCategoryPage() {
  return <DomainHub hub={hub} />;
}

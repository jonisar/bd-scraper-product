import type { Metadata } from "next";
import DomainHub from "@/components/DomainHub";
import { CATEGORY_HUBS } from "@/lib/domain-hubs";

const hub = CATEGORY_HUBS["finance"];

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  openGraph: {
    title: hub.title,
    description: hub.description,
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib/categories/finance",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib/categories/finance" },
};

export default function FinanceCategoryPage() {
  return <DomainHub hub={hub} />;
}

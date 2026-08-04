import type { Metadata } from "next";
import DomainHub from "@/components/DomainHub";
import { CATEGORY_HUBS } from "@/lib/domain-hubs";

const hub = CATEGORY_HUBS["jobs"];

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  openGraph: {
    title: hub.title,
    description: hub.description,
    type: "website",
    url: "https://brightdata.com/products/web-scraper/scraper-lib/categories/jobs",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/scraper-lib/categories/jobs" },
};

export default function JobsCategoryPage() {
  return <DomainHub hub={hub} />;
}

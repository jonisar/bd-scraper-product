import type { Metadata } from "next";
import { DOMAIN_HUBS } from "@/lib/domain-hubs";
import DomainHubPage from "@/components/DomainHubPage";

const hub = DOMAIN_HUBS.zillow;

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  openGraph: {
    title: hub.title,
    description: hub.description,
    type: "website",
    url: `https://brightdata.com/products/web-scraper/${hub.slug}`,
    siteName: "Bright Data",
  },
  alternates: { canonical: `https://brightdata.com/products/web-scraper/${hub.slug}` },
};

export default function ZillowPage() {
  return <DomainHubPage hub={hub} />;
}

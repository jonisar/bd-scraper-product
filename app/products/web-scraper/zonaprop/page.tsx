import type { Metadata } from "next";
import { DOMAIN_HUBS } from "@/lib/domain-hubs";
import DomainHub from "@/components/DomainHub";

const hub = DOMAIN_HUBS.zonaprop;

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

export default function ZonapropPage() {
  return <DomainHub hub={hub} />;
}

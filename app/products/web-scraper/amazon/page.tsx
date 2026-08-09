import type { Metadata } from "next";
import { DOMAIN_HUBS } from "@/lib/domain-hubs";
import DomainHub from "@/components/DomainHub";

const hub = DOMAIN_HUBS.amazon;

export const metadata: Metadata = {
  title: hub.title,
  description: hub.description,
  openGraph: {
    title: hub.title,
    description: hub.description,
    type: "website",
    url: `https://brightdata.com/products/web-scraper/${hub.slug}`,
    siteName: "Bright Data",
    images: [
      {
        url: "/images/og-amazon-scraper.png",
        width: 1200,
        height: 630,
        alt: "Bright Data Amazon Scraper API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: hub.title,
    description: hub.description,
  },
  alternates: { canonical: `https://brightdata.com/products/web-scraper/${hub.slug}` },
};

export default function AmazonHubPage() {
  return <DomainHub hub={hub} />;
}

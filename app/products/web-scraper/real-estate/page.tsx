import type { Metadata } from "next";
import { CATEGORY_HUBS } from "@/lib/domain-hubs";
import DomainHub from "@/components/DomainHub";

const hub = CATEGORY_HUBS["real-estate"];

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

export default function Page() {
  return <DomainHub hub={hub} />;
}

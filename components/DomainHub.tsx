import DomainHubPage from "@/components/DomainHubPage";
import type { DomainHubData } from "@/lib/domain-hubs";

/** Server wrapper: emits FAQ + BreadcrumbList JSON-LD, then renders the client hub UI. */
export default function DomainHub({ hub }: { hub: DomainHubData }) {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: hub.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Bright Data", item: "https://brightdata.com" },
      { "@type": "ListItem", position: 2, name: "Web Scraper", item: "https://brightdata.com/products/web-scraper" },
      { "@type": "ListItem", position: 3, name: hub.name, item: `https://brightdata.com/products/web-scraper/${hub.slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <DomainHubPage hub={hub} />
    </>
  );
}

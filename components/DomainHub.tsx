import DomainHubPage from "@/components/DomainHubPage";
import type { DomainHubData } from "@/lib/domain-hubs";

/** Server wrapper: emits FAQ JSON-LD, then renders the client hub UI. */
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <DomainHubPage hub={hub} />
    </>
  );
}

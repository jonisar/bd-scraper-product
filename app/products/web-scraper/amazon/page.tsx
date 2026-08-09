import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import ScraperCard from "@/components/ScraperCard";
import { cpHref } from "@/lib/cp-href";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import AgentGetStarted from "@/components/AgentGetStarted";
import AgentSetupCta from "@/components/AgentSetupCta";
import { PricingCards } from "@/components/PricingCards";
import PricingAssurances from "@/components/PricingAssurances";
import PricingSlider from "@/components/PricingSlider";
import AmazonCodeExamples from "@/components/AmazonCodeExamples";
import StatBanner from "@/components/StatBanner";
import ChooseYourPath from "@/components/ChooseYourPath";
import HubStrip from "@/components/HubStrip";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import IncludedInEveryPlan from "@/components/IncludedInEveryPlan";
import UnderTheHood from "@/components/UnderTheHood";
import UseCasesGrid from "@/components/UseCasesGrid";
import CompareTable from "@/components/CompareTable";
import DxComplianceSection from "@/components/DxComplianceSection";
import FaqSection from "@/components/FaqSection";
import HeroRatings from "@/components/HeroRatings";
import {
  AMAZON_SCRAPERS,
  AMAZON_SITE,
  AMAZON_FAQS,
  AMAZON_PRODUCT_TYPES,
} from "@/lib/amazon-scrapers";

export const metadata: Metadata = {
  title: "Amazon Scraper API - 5K Records/Month for Free",
  description:
    "Scrape Amazon products and collect ASIN, prices, reviews, images, ratings, seller info, and more. Amazon Scraper API or no-code scraper. Free trial: 5K records/month.",
  openGraph: {
    title: "Amazon Scraper API - 5K Records/Month for Free",
    description:
      "Extract Amazon product data — prices, reviews, ratings, availability, and seller info — via API or no-code. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/amazon",
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
    title: "Amazon Scraper API - 5K Records/Month for Free",
    description:
      "Extract Amazon product data — prices, reviews, ratings, availability — via API or no-code. Start free.",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/amazon" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AMAZON_FAQS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: { "@type": "Answer", text: item.a },
  })),
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bright Data", item: "https://brightdata.com" },
    { "@type": "ListItem", position: 2, name: "Web Scraper", item: "https://brightdata.com/products/web-scraper" },
    { "@type": "ListItem", position: 3, name: "Amazon", item: "https://brightdata.com/products/web-scraper/amazon" },
  ],
};

export default function AmazonHubPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />

      <main>
        <div className="container">
          <nav className="site-breadcrumb" aria-label="Breadcrumb">
            <a href="https://brightdata.com/products" target="_blank" rel="noopener noreferrer">
              Products
            </a>
            <span aria-hidden="true">/</span>
            <Link href="/products/web-scraper">Web Scraper API</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">Amazon</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="hero site-hub-hero">
          <div className="container hero-inner">
            <HeroRatings />

            <h1>
              <span className="grad-text">{AMAZON_SITE.headline}</span>
            </h1>
            <p className="hero-sub">{AMAZON_SITE.description}</p>

            <div className="hero-ctas">
              <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                Start free
              </a>
              <AgentSetupCta variant="hub" />
            </div>
            <p className="hub-hero-note">No credit card required · 5K free records/month</p>
          </div>
        </section>

        <TrustedByStrip />

        {/* AVAILABLE SCRAPERS */}
        <section className="section scrapers-first hub-anchor" id="scrapers">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Web Scrapers</span>
              <h2>Popular Amazon scrapers</h2>
              <p>
                Production-ready Amazon scrapers — auto-maintained, unblockable, and ready to call via API or no-code.
              </p>
            </div>

            <div className="lib-grid">
              {AMAZON_SCRAPERS.slice(0, 9).map((s) => (
                <ScraperCard
                  key={s.id}
                  name={s.name}
                  domain={AMAZON_SITE.domain}
                  category="E-commerce"
                  desc={s.desc}
                  fieldsPreview={s.fieldsPreview}
                  views={s.views}
                  downloads={s.downloads}
                  href={cpHref(s)}
                />
              ))}
            </div>
            {AMAZON_SCRAPERS.length > 9 && (
              <p className="hub-view-all">
                <a href="/products/web-scraper/scraper-lib?q=amazon" className="hub-view-all-link">
                  View all {AMAZON_SCRAPERS.length} Amazon scrapers →
                </a>
              </p>
            )}

            <HubStrip />

            <div className="hub-dataset-cta">
              <div className="hub-dataset-cta-body">
                <span className="hub-dataset-cta-kicker">Amazon Datasets</span>
                <strong>Just want Amazon data? Skip scraping.</strong>
                <span>Get pre-collected, ready-to-use Amazon datasets — updated daily, delivered instantly.</span>
              </div>
              <a href="https://brightdata.com/products/datasets/amazon" className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                Browse Amazon datasets →
              </a>
            </div>
          </div>
        </section>

        <HowItWorksSteps
          heading="From zero to Amazon data in 3 steps"
          step1="Choose from the Amazon scrapers above — products, reviews, sellers, rankings, and more."
          altBg
          hubAnchor
        />

        {/* PRICING — buyers check cost early */}
        <section className="section animate-rise hub-anchor" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Amazon Scraper API Pricing</span>
              <h2>Only pay for what&rsquo;s successfully delivered</h2>
              <p>No hidden fees. No charges for failed deliveries. Every plan includes full access to Amazon scrapers and infrastructure.</p>
            </div>
            <PricingSlider className="mb-6" />
            <PricingCards unit="records" />
            <PricingAssurances />
          </div>
        </section>

        {/* AGENTS — modern developer workflow */}
        <section className="section section-alt animate-rise hub-anchor" id="agents">
          <div className="container">
            <AgentGetStarted name="Amazon" domain="amazon.com" />
          </div>
        </section>

        {/* CHOOSE YOUR PATH */}
        <section className="section animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Start scraping in minutes — your way</h2>
              <p>Same scrapers, three ways to run them — pick the workflow that fits your team.</p>
            </div>
            <ChooseYourPath name="Amazon" />
          </div>
        </section>

        <IncludedInEveryPlan altBg hubAnchor />

        {/* CODE EXAMPLES */}
        <section className="section animate-rise hub-anchor" id="code">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Code examples</span>
              <h2>Easily scrape Amazon without getting blocked</h2>
              <p>Copy a working request for products, reviews, or sellers — cURL, Python, or Node.js.</p>
            </div>
            <AmazonCodeExamples />
          </div>
        </section>

        {/* PRODUCT TYPES — Amazon-specific deep dive */}
        <section className="section section-alt animate-rise hub-anchor" id="types">
          <div className="container">
            <div className="section-head">
              <span className="kicker">By data type</span>
              <h2>Simplified Amazon data extraction</h2>
              <p>Jump straight to the scraper that matches your use case.</p>
            </div>
            <div className="hub-types">
              {AMAZON_PRODUCT_TYPES.map((item) =>
                item.local ? (
                  <Link key={item.title} href={item.href} className="hub-type-card">
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <span className="hub-type-cta">Open scraper →</span>
                  </Link>
                ) : (
                  <a
                    key={item.title}
                    href={item.href}
                    className="hub-type-card"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <span className="hub-type-cta">Open scraper →</span>
                  </a>
                )
              )}
            </div>
          </div>
        </section>

        <UnderTheHood name="Amazon" hubAnchor />

        <StatBanner />

        <UseCasesGrid
          name="Amazon"
          description="Real-time Amazon intelligence for pricing, competition, and brand reputation."
          items={[
            { title: "Product inventory and pricing strategy", body: "Scrape Amazon listings in real time to identify best sellers, track price changes, and monitor availability. Collect titles, prices, ASINs, brands, and stock status to optimize inventory and dynamic pricing.", tags: "Products · Prices · ASINs · Availability" },
            { title: "Stay ahead of the competition", body: "Monitor bestseller rankings, seller profiles, and listings to benchmark against category leaders. Collect seller ratings, feedback, and promotional signals to uncover product opportunities.", tags: "Best sellers · Sellers · Rankings" },
            { title: "Consumer sentiment and brand reputation", body: "Scrape Amazon reviews and ratings across categories and countries. Collect review text, star ratings, verified purchase status, and dates to spot demand shifts before they peak.", tags: "Reviews · Ratings · Sentiment" },
            { title: "Catalog & marketplace intelligence", body: "Build rich Amazon catalogs with images, variants, features, and category trees — ready for analytics, enrichment, and machine learning pipelines.", tags: "Catalog · Variants · Categories" },
          ]}
          altBg
          hubAnchor
        />

        <CompareTable
          name="Amazon"
          title="Amazon Scraper API vs DIY and other providers"
          description="Compare Bright Data&rsquo;s managed Amazon scrapers with building your own or using other services."
          scraperRow={{ label: "Pre-built Amazon scrapers", bd: "✓ 14+ ready", others: "1–3", diy: "Build each" }}
          hubAnchor
        />

        <DxComplianceSection altBg hubAnchor />

        <FaqSection
          title="Amazon Scraper API FAQs"
          description="Common questions about scraping Amazon with Bright Data&rsquo;s Web Scraper API."
          items={AMAZON_FAQS}
          hubAnchor
        />

        <AiPromptCta headingPlain="Build your own" headingAccent="e-commerce scraper" />
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

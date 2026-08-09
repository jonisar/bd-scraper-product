"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import ScraperCard from "@/components/ScraperCard";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import AgentGetStarted from "@/components/AgentGetStarted";
import AgentSetupCta from "@/components/AgentSetupCta";
import PricingAssurances from "@/components/PricingAssurances";
import PricingSlider from "@/components/PricingSlider";
import { PricingCards } from "@/components/PricingCards";
import HubCodeExample from "@/components/HubCodeExample";
import ChooseYourPath from "@/components/ChooseYourPath";
import StatBanner from "@/components/StatBanner";
import HubStrip from "@/components/HubStrip";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import IncludedInEveryPlan from "@/components/IncludedInEveryPlan";
import UnderTheHood from "@/components/UnderTheHood";
import UseCasesGrid from "@/components/UseCasesGrid";
import CompareTable from "@/components/CompareTable";
import DxComplianceSection from "@/components/DxComplianceSection";
import FaqSection from "@/components/FaqSection";
import HeroRatings from "@/components/HeroRatings";
import ScraperPreview from "@/components/ScraperPreview";
import { sampleUrlForDomain, type DomainHubData } from "@/lib/domain-hubs";
import { cpHref } from "@/lib/cp-href";
import { templates, type Template } from "@/lib/templates";

function buildMockTemplate(hub: DomainHubData): Template {
  const domain = hub.domain;
  const name = hub.name + " Data";
  return {
    slug: hub.slug + "-data",
    name,
    domain,
    category: hub.category,
    icon: domain.charAt(0).toUpperCase(),
    color: "#3D7FFC",
    tagline: `Structured ${hub.name} data via API — ready in seconds.`,
    description: `Extract structured data from ${hub.name} pages via API. No proxy management, no anti-bot headaches — just send URLs and get structured JSON back. Free 5K records/month included.`,
    datasetId: "gd_example_mock",
    endpoints: [
      { name: "Collect by URL", desc: `Pass ${hub.name} URLs directly.` },
      { name: "Discover by keyword", desc: `Search and collect matching results.` },
    ],
    responseTime: "~12s per input",
    mcp: { tool: `web_data_${hub.slug}`, group: hub.category.toLowerCase() },
    inputs: [
      { name: "url", type: "string", required: true, example: sampleUrlForDomain(domain), description: `${hub.name} page URL.` },
      { name: "limit", type: "number", required: false, example: "20", description: "Max records to return." },
    ],
    dictionary: [
      { name: "title", description: "Page title", type: "Text" },
      { name: "url", description: "Source URL", type: "Url" },
      { name: "description", description: "Content description", type: "Text" },
      { name: "date", description: "Publication or listing date", type: "Date" },
      { name: "category", description: "Content category", type: "Text" },
      { name: "rating", description: "Rating or score", type: "Number" },
      { name: "image", description: "Primary image URL", type: "Url" },
      { name: "author", description: "Author or publisher", type: "Text" },
    ],
    totalFields: 35,
    sampleOutput: {
      title: `Sample ${hub.name} Record`,
      url: sampleUrlForDomain(domain),
      description: "Structured data extracted automatically...",
      category: hub.category,
      rating: 4.5,
    },
  };
}

export default function DomainHubPage({ hub }: { hub: DomainHubData }) {
  const topScraper = hub.scrapers[0];
  // Domain hubs use hostnames (amazon.com); category hubs use labels — fall back to top scraper's domain
  const exampleHost =
    topScraper?.domain ||
    (hub.domain.includes(".") ? hub.domain : "amazon.com");
  const sampleUrl = topScraper?.sampleUrl || sampleUrlForDomain(exampleHost);
  const pipelineId = topScraper?.cliPipeline || "amazon_product";

  return (
    <div className="lib-page">
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
            <Link href="/products/web-scraper/scraper-lib">Scraper Library</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{hub.name}</span>
          </nav>
        </div>

        {/* HERO */}
        <section className="hero site-hub-hero">
          <div className="container hero-inner">
            <HeroRatings />

            <h1>
              <span className="grad-text">{hub.headline}</span>
            </h1>
            <p className="hero-sub">{hub.description}</p>

            <div className="hero-ctas">
              <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                Start free
              </a>
              <AgentSetupCta
                variant="hub"
                prompt={`Read https://brightdata.com/skills.md and scrape data from ${hub.domain}`}
              />
            </div>
            <p className="hub-hero-note">No credit card required · 5K free records/month</p>
          </div>
        </section>

        <TrustedByStrip />

        {/* 1. SCRAPER GALLERY */}
        <section className="section scrapers-first hub-anchor" id="scrapers">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Web Scrapers</span>
              <h2>Popular {hub.name} scrapers</h2>
              <p>
                Production-ready {hub.name} scrapers — auto-maintained, unblockable, and ready to call via API or no-code.
              </p>
            </div>

            <div className="lib-grid">
              {hub.scrapers.slice(0, 9).map((s) => (
                <ScraperCard
                  key={s.id}
                  name={s.name}
                  domain={s.domain || hub.domain}
                  category={s.category || hub.category}
                  desc={s.desc}
                  fieldsPreview={s.fieldsPreview}
                  views={s.views}
                  downloads={s.downloads}
                  href={cpHref(s)}
                />
              ))}
            </div>
            {hub.scrapers.length > 9 && (
              <p className="hub-view-all">
                <a href={`/products/web-scraper/scraper-lib?q=${encodeURIComponent(hub.domain)}`} className="hub-view-all-link">
                  View all {hub.scrapers.length} {hub.name} scrapers →
                </a>
              </p>
            )}

            <HubStrip />

            {hub.datasetCta && (
              <div className="hub-dataset-cta">
                <div className="hub-dataset-cta-body">
                  <span className="hub-dataset-cta-kicker">{hub.datasetCta.kicker}</span>
                  <strong>{hub.datasetCta.title}</strong>
                  <span>{hub.datasetCta.body}</span>
                </div>
                <a href={hub.datasetCta.href} className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                  {hub.datasetCta.label}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* SCRAPER PREVIEW — interactive experience (resolves to top domain scraper or mock) */}
        {(() => {
          const previewTemplate: Template =
            templates.find((t) => t.domain === hub.domain && t.popular) ||
            templates.find((t) => t.domain === hub.domain) ||
            templates.find((t) => t.category === hub.category && t.popular) ||
            templates.find((t) => t.category === hub.category) ||
            buildMockTemplate(hub);
          return <ScraperPreview template={previewTemplate} />;
        })()}

        <HowItWorksSteps
          heading={`From zero to ${hub.name} data in 3 steps`}
          step1={`Choose from the ${hub.name} scrapers above or create your own with AI in minutes.`}
          altBg
          hubAnchor
        />

        {/* CODE EXAMPLE + SAMPLE OUTPUT */}
        <section className="section animate-rise hub-anchor" id="code">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Quick start</span>
              <h2>One API call to get {hub.name} data</h2>
              <p>Send a URL, get structured JSON back. Works with any HTTP client.</p>
            </div>
            <div className="hub-code-split">
              <div className="hub-code-split-main">
                <HubCodeExample sampleUrl={sampleUrl} />
              </div>
              <div className="hub-code-split-output">
                <div className="hub-code-example">
                  <div className="hub-code-tabs">
                    <span className="hub-code-tab active" style={{ cursor: "default" }}>Sample response</span>
                  </div>
                  <pre className="hub-code-pre">
                    <code>{`[{\n  "url": "${sampleUrl}",\n  ${topScraper?.fieldsPreview
                      ? topScraper.fieldsPreview
                          .replace(", and more.", "")
                          .split(", ")
                          .slice(0, 5)
                          .map((f) => `"${f.trim()}": "..."`)
                          .join(",\n  ")
                      : `"title": "...",\n  "price": "..."`
                    },\n  ...\n}]`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING — buyers check cost early */}
        <section className="section section-alt animate-rise hub-anchor" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">{hub.name} Scraper API Pricing</span>
              <h2>Only pay for what&rsquo;s successfully delivered</h2>
              <p>No hidden fees. No charges for failed deliveries. Every plan includes full access to {hub.name} scrapers and infrastructure.</p>
            </div>
            <PricingSlider className="mb-6" />
            <PricingCards unit="records" />
            <PricingAssurances />
          </div>
        </section>

        {/* AGENTS — modern developer workflow */}
        <section className="section animate-rise hub-anchor" id="agents">
          <div className="container">
            <AgentGetStarted
              name={hub.name}
              domain={exampleHost}
              pipelineId={pipelineId}
              sampleUrl={sampleUrl}
            />
          </div>
        </section>

        {/* PATHS — orient developers & buyers */}
        <section className="section section-alt animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Start scraping in minutes — your way</h2>
              <p>Same scrapers, three ways to run them — pick the workflow that fits your team.</p>
            </div>
            <ChooseYourPath name={hub.name} />
          </div>
        </section>

        <IncludedInEveryPlan hubAnchor />

        {/* PRODUCT TYPES — domain-specific deep dive (optional) */}
        {hub.productTypes && hub.productTypes.length > 0 && (
          <section className="section section-alt animate-rise hub-anchor" id="types">
            <div className="container">
              <div className="section-head">
                <span className="kicker">By data type</span>
                <h2>Simplified {hub.name} data extraction</h2>
                <p>Jump straight to the scraper that matches your use case.</p>
              </div>
              <div className="hub-types">
                {hub.productTypes.map((item) =>
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
        )}

        <UnderTheHood name={hub.name} altBg hubAnchor />

        <StatBanner />

        <UseCasesGrid
          name={hub.name}
          description={`Real-time ${hub.name} intelligence for your business.`}
          items={hub.useCases}
          hubAnchor
        />

        <CompareTable
          name={hub.name}
          title={`${hub.name} Scraper API vs DIY and other providers`}
          description="Compare Bright Data&rsquo;s managed scrapers with building your own or using other scraping services."
          scraperRow={{ label: `Pre-built ${hub.name} scrapers`, bd: "✓ Ready to use", others: "Limited", diy: "Build each" }}
          altBg
          hubAnchor
        />

        <DxComplianceSection hubAnchor />

        <FaqSection
          title={`${hub.name} Scraper API FAQs`}
          description={`Common questions about scraping ${hub.name} with Bright Data\u2019s Web Scraper API.`}
          items={hub.faqs}
          altBg
          hubAnchor
        />

        {hub.slug === "ecommerce" ? (
          <AiPromptCta headingPlain="Build your own" headingAccent="e-commerce scraper" />
        ) : (
          <AiPromptCta />
        )}
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

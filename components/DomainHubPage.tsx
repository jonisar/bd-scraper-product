"use client";

import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import { HUB_SUBNAV } from "@/lib/site-nav";
import ScrollReveal from "@/components/ScrollReveal";
import ScraperCard from "@/components/ScraperCard";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import AgentGetStarted from "@/components/AgentGetStarted";

import PricingAssurances from "@/components/PricingAssurances";
import PricingSlider from "@/components/PricingSlider";
import { PricingCards } from "@/components/PricingCards";
import HubCodeExample, { getHubTarget, HubCodeAuthNote } from "@/components/HubCodeExample";
import ChooseYourPath from "@/components/ChooseYourPath";
import StatBanner from "@/components/StatBanner";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import IncludedInEveryPlan from "@/components/IncludedInEveryPlan";
import UseCasesGrid from "@/components/UseCasesGrid";
import CompareTable from "@/components/CompareTable";
import DxComplianceSection from "@/components/DxComplianceSection";
import FaqSection from "@/components/FaqSection";
import HeroRatings from "@/components/HeroRatings";
import ScraperPreview from "@/components/ScraperPreview";
import ValueBanner from "@/components/ValueBanner";
import DatasetCtaBanner from "@/components/DatasetCtaBanner";
import { sampleUrlForDomain, type DomainHubData } from "@/lib/domain-hubs";
import { cpHref } from "@/lib/cp-href";

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
      <Header subnav={HUB_SUBNAV} />

      <main>
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
              <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
                Contact sales
              </a>
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
                Pick one and call it. Every scraper lists its output fields, delivery volume, and live success rate.
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
                  href={s.href || cpHref(s)}
                />
              ))}
            </div>

          </div>
        </section>

        <DatasetCtaBanner
          name={hub.name}
          href={hub.datasetCta?.href}
        />

        <ValueBanner rankingHref={hub.rankingUrl} />

        {/* PRICING — high up for quick buyer conversion */}
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

        <HowItWorksSteps
          heading={`From zero to ${hub.name} data in 3 steps`}
          step1={`Choose from the ${hub.name} scrapers above or create your own with AI in minutes.`}
          hubAnchor
        />

        {/* CODE EXAMPLE + SAMPLE OUTPUT */}
        <section className="section section-alt animate-rise hub-anchor" id="code">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Quick start</span>
              <h2>One API call to get {hub.name} data</h2>
              <p>Send a URL, get structured JSON back. Works with any HTTP client.</p>
            </div>
            <div className="hub-code-split">
              <div className="hub-code-split-main">
                <HubCodeExample
                  sampleUrl={getHubTarget(hub.domain) ? undefined : sampleUrl}
                  fixedTarget={getHubTarget(hub.domain)?.name}
                />
              </div>
              <div className="hub-code-split-output">
                <div className="hub-code-example">
                  <div className="hub-code-tabs">
                    <span className="hub-code-tab active" style={{ cursor: "default" }}>Sample response</span>
                  </div>
                  <pre className="hub-code-pre">
                    <code>{getHubTarget(hub.domain)?.response ?? `[{\n  "url": "${sampleUrl}",\n  ${topScraper?.fieldsPreview
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
            <HubCodeAuthNote />
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

        {/* SCRAPER PREVIEW — interactive example after agent context */}
        <ScraperPreview />

        {/* PATHS — orient developers & buyers */}
        <section className="section section-alt animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Same scrapers, three ways to run them</h2>
              <p>Call the API from code, click through the control panel, or hand it to your AI agent.</p>
            </div>
            <ChooseYourPath name={hub.name} />
          </div>
        </section>

        <IncludedInEveryPlan name={hub.name} hubAnchor />

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

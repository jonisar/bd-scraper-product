import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { HOME_SUBNAV } from "@/lib/site-nav";
import HeroSearch from "@/components/HeroSearch";
import ScraperLibrary from "@/components/ScraperLibrary";
import AgentGetStarted from "@/components/AgentGetStarted";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import { PricingCards } from "@/components/PricingCards";
import PricingSlider from "@/components/PricingSlider";
import PricingAssurances from "@/components/PricingAssurances";
import DiscountBanner from "@/components/DiscountBanner";
import HubCodeExample from "@/components/HubCodeExample";
import StatBanner from "@/components/StatBanner";
import ChooseYourPath from "@/components/ChooseYourPath";
import HowItWorksSteps from "@/components/HowItWorksSteps";
import CompareTable from "@/components/CompareTable";
import DxComplianceSection from "@/components/DxComplianceSection";
import FaqSection from "@/components/FaqSection";
import HeroRatings from "@/components/HeroRatings";
import ScraperPreview from "@/components/ScraperPreview";
import ValueBanner from "@/components/ValueBanner";
import HiddenCostAccordion from "@/components/HiddenCostAccordion";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Web Scraping API - 5K Records/Month for Free",
  description:
    "The most reliable Web Scraping API. 1,400+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free, no credit card required.",
  openGraph: {
    title: "Web Scraping API - 5K Records/Month for Free",
    description:
      "1,400+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper",
    siteName: "Bright Data",
    images: [
      {
        url: "/images/og-web-scraper.png",
        width: 1200,
        height: 630,
        alt: "Bright Data Web Scraping API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Web Scraping API - 5K Records/Month for Free",
    description:
      "1,400+ production-ready scrapers with auto proxy rotation, anti-bot bypass, and JS rendering. Start free.",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper" },
};

const FAQ_ITEMS = [
  {
    q: "What is a Web Scraper API?",
    a: "Bright Data's Web Scraper API is a cloud service that extracts structured data from websites for you. It handles IP rotation, CAPTCHA solving, JavaScript rendering, and parsing into JSON or CSV, so you get clean data without building scraping infrastructure.",
  },
  {
    q: "How is this different from building my own scraper?",
    a: "DIY scrapers require managing proxies, solving CAPTCHAs, handling blocks, and constant maintenance when sites change. Bright Data's scrapers are maintained 24/7, run on 400M+ residential IPs, and include unblocking. Call the API and get structured data back.",
  },
  {
    q: "What websites can I scrape?",
    a: "There are 1,400+ pre-built scrapers for popular sites including Amazon, LinkedIn, Instagram, TikTok, Google Maps, Zillow, and hundreds more. For any other website, use Scraper Studio to create a custom scraper with AI in minutes.",
  },
  {
    q: "Is web scraping with Bright Data legal and compliant?",
    a: "Yes. Bright Data collects only publicly available data, is ISO 27001 certified, maintains SOC 2 controls, and is GDPR and CCPA compliant. A dedicated Compliance & Ethics team reviews every use case, backed by a documented Know Your Customer process and Acceptable Use Policy. Details are published in the Bright Data Trust Center.",
  },
  {
    q: "How do I get started with the Web Scraper API?",
    a: "Sign up for free (no credit card), get 5,000 records/month at no cost. Browse the scraper library, pick one, and make your first API call in minutes with the Python or Node.js SDKs, the CLI, or any HTTP client. Also available as an MCP server for AI agents.",
  },
  {
    q: "Can AI agents use the Web Scraper API?",
    a: "Yes. Connect any agent through the hosted MCP server, point a coding agent at brightdata.com/SKILL.md to set itself up, or use the CLI. Agents authenticate once with browser OAuth and can run any of the 1,400+ scrapers or build new ones with Scraper Studio.",
  },
  {
    q: "What data formats are supported?",
    a: "JSON, NDJSON, and CSV. Data can be delivered via API response, webhook, Amazon S3, Google Cloud Storage, Snowflake, or SFTP.",
  },
  {
    q: "What use cases is the Web Scraper API optimized for?",
    a: "Competitive benchmarking, market trend analysis, dynamic pricing, sentiment extraction, lead generation, and feeding data into ML pipelines. Essential for e-commerce, fintech, real estate, and social media analytics.",
  },
  {
    q: "How does the Web Scraper API handle large-scale extraction?",
    a: "Built for high concurrency and batch processing. Send up to 5,000 URLs per request, schedule recurring jobs, and scale to millions of records with no infrastructure changes. Pay only for successfully delivered results.",
  },
  {
    q: "How much does web scraping cost?",
    a: "Bright Data's Web Scraper API starts free with 5,000 records/month. Pay-as-you-go pricing is $1.50 per 1,000 records, with volume discounts available. You only pay for successfully delivered data, failed requests are free.",
  },
  {
    q: "Can I use this Web Scraper API with Python or Node.js?",
    a: "Yes. Official SDKs for Python (brightdata-sdk) and Node.js (@brightdata/sdk) handle auth and result polling for you. You can also call the REST API from any HTTP client: requests, axios, cURL, Go, or Java. Every scraper page includes ready-made snippets in both languages.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

const softwareJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bright Data Web Scraper API",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  url: "https://brightdata.com/products/web-scraper",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
    description: "Free tier: 5,000 records/month",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.7",
    ratingCount: "680",
    bestRating: "5",
  },
  provider: { "@id": "https://brightdata.com#organization" },
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Bright Data", item: "https://brightdata.com" },
    { "@type": "ListItem", position: 2, name: "Products", item: "https://brightdata.com/products" },
    { "@type": "ListItem", position: 3, name: "Web Scraper API", item: "https://brightdata.com/products/web-scraper" },
  ],
};

export default function WebScraperHome() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header subnav={HOME_SUBNAV} />

      <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <HeroRatings />

          <h1>
            Get data from any website<br />
            with <span className="grad-text">Web Scraper API</span>
          </h1>

          <p className="hero-sub">
            Thousands of <span className="hero-stat-accent">verified scrapers</span> for every website. Never worry about <span className="hero-stat-accent">scale</span>, <span className="hero-stat-accent">unblocking</span>, or <span className="hero-stat-accent">maintenance</span>. Or build your own scraper with AI.
          </p>

          <HeroSearch templates={templates} />
        </div>
      </section>

      <TrustedByStrip />

      {/* SCRAPER LIBRARY */}
      <section className="library-section" id="library">
        <div className="container">
          <ScraperLibrary />
        </div>
      </section>

      <ValueBanner />

      {/* PRICING — high up for quick buyer conversion */}
      <section className="section section-alt animate-rise" id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Pricing</span>
            <h2>Only pay for successful results</h2>
            <p>No hidden fees. No charges for failed requests. Every plan includes full access to all scrapers and infrastructure.</p>
          </div>
          <DiscountBanner />
          <PricingSlider className="mb-6" />
          <PricingCards unit="records" />
          <PricingAssurances />

          <HiddenCostAccordion />
        </div>
      </section>

      <HowItWorksSteps
        heading="From zero to structured data in 3 steps"
        step1="Browse 1,400+ pre-built scrapers or create your own with AI in minutes."
      />

      {/* CODE EXAMPLE */}
      <section className="section section-alt animate-rise" id="code">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Quick start</span>
            <h2>One API call to get structured data</h2>
            <p>Send a URL, get structured JSON back. Works with any HTTP client in any language.</p>
          </div>
          <HubCodeExample />
        </div>
      </section>

      {/* AGENT SECTION — modern dev workflow */}
      <section className="section animate-rise" id="agents">
        <div className="container">
          <AgentGetStarted />
        </div>
      </section>

      {/* WHY BRIGHT DATA SCRAPERS — right after agents */}
      <section className="section section-alt animate-rise" id="how">
        <div className="container">
          <div className="section-head">
            <span className="kicker">World's #1 scraping platform</span>
            <h2>Everything you need, built in</h2>
            <p>You pay for results. Proxies, rendering, concurrency, and delivery are always included, on every plan.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">🛡</span><h3>Proxies, unblocking, and rendering included</h3></div><p>Every request runs on 400M+ IPs with CAPTCHA solving, anti-bot bypass, and JS rendering. No separate services to set up.</p></div>
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">⚡</span><h3>Scale to millions of pages instantly</h3></div><p>Unlimited concurrency. Batch up to 5K URLs per request. No infrastructure to manage, no config to change.</p></div>
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">🔄</span><h3>Scrapers auto-fix when sites change</h3></div><p>Self-healing technology detects site changes and repairs scrapers. Your pipelines keep running without engineering work.</p></div>
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">✓</span><h3>1,400+ scrapers, always maintained</h3></div><p>Every scraper is built, tested, and kept working by Bright Data. Defined inputs, structured outputs. No community guesswork.</p></div>
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">💲</span><h3>Pay per result, nothing extra</h3></div><p>One price per record delivered. Proxies, retries, rendering, unblocking &mdash; all included in that price.</p></div>
            <div className="feature-card"><div className="feature-head"><span className="feature-icon">🏛</span><h3>Compliant and fully supported</h3></div><p>GDPR &amp; CCPA compliant. 24/7 human support on every plan, including free.</p></div>
          </div>
        </div>
      </section>

      {/* SCRAPER PREVIEW */}
      <ScraperPreview />

      {/* CHOOSE YOUR PATH */}
      <section className="section animate-rise" id="paths">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Choose your path</span>
            <h2>Same scrapers, three ways to run them</h2>
            <p>Call the API from code, click through the control panel, or hand it to your AI agent.</p>
          </div>
          <ChooseYourPath />
        </div>
      </section>

      <StatBanner />

      {/* USE CASES */}
      <section className="section animate-rise" id="use-cases">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Use cases</span>
            <h2>Scraper APIs for every use case</h2>
            <p>Pre-built scrapers optimized for the industries and workflows developers use most.</p>
          </div>
          <div className="usecases-grid">
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/ecommerce" className="usecase-title-link">E-commerce scraping API</a></h3>
              <div className="usecase-labels">
                <a href="/products/web-scraper/amazon" className="usecase-label">Amazon</a>
                <a href="/products/web-scraper/walmart" className="usecase-label">Walmart</a>
                <a href="https://brightdata.com/products/web-scraper/shopee" className="usecase-label" target="_blank" rel="noopener noreferrer">Shopee</a>
                <a href="https://brightdata.com/products/web-scraper/target" className="usecase-label" target="_blank" rel="noopener noreferrer">Target</a>
                <a href="https://brightdata.com/products/web-scraper/ebay" className="usecase-label" target="_blank" rel="noopener noreferrer">eBay</a>
              </div>
              <p>
                Track competitor pricing, monitor stock levels, collect product reviews, and
                benchmark seller performance across Amazon, Walmart, Shopee, and 50+ marketplaces.
              </p>
              <a href="/products/web-scraper/ecommerce" className="usecase-cta">View all E-commerce scrapers →</a>
            </div>
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/social-media" className="usecase-title-link">Social media scraping API</a></h3>
              <div className="usecase-labels">
                <a href="/products/web-scraper/instagram" className="usecase-label">Instagram</a>
                <a href="/products/web-scraper/tiktok" className="usecase-label">TikTok</a>
                <a href="/products/web-scraper/linkedin" className="usecase-label">LinkedIn</a>
                <a href="/products/web-scraper/youtube" className="usecase-label">YouTube</a>
                <a href="/products/web-scraper/x" className="usecase-label">X</a>
                <a href="/products/web-scraper/facebook" className="usecase-label">Facebook</a>
              </div>
              <p>
                Extract public posts, profiles, followers, engagement metrics, and trending
                hashtags. Power influencer analytics, sentiment analysis, and content monitoring at scale.
              </p>
              <a href="/products/web-scraper/social-media" className="usecase-cta">View all Social Media scrapers →</a>
            </div>
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/search" className="usecase-title-link">Search &amp; maps scraping API</a></h3>
              <div className="usecase-labels">
                <a href="/products/web-scraper/google-maps" className="usecase-label">Google Maps</a>
                <a href="/products/web-scraper/yelp" className="usecase-label">Yelp</a>
                <a href="https://brightdata.com/products/web-scraper/tripadvisor" className="usecase-label" target="_blank" rel="noopener noreferrer">Tripadvisor</a>
                <a href="https://brightdata.com/products/web-scraper/yellow-pages" className="usecase-label" target="_blank" rel="noopener noreferrer">Yellow Pages</a>
              </div>
              <p>
                Collect Google Maps business listings, reviews, ratings, and local SEO data.
                Monitor rankings, analyze competitors, and track customer sentiment by location.
              </p>
              <a href="/products/web-scraper/search" className="usecase-cta">View all Search scrapers →</a>
            </div>
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/real-estate" className="usecase-title-link">Real estate scraping API</a></h3>
              <div className="usecase-labels">
                <a href="/products/web-scraper/zillow" className="usecase-label">Zillow</a>
                <a href="https://brightdata.com/products/web-scraper/realtor" className="usecase-label" target="_blank" rel="noopener noreferrer">Realtor</a>
                <a href="https://brightdata.com/products/web-scraper/redfin" className="usecase-label" target="_blank" rel="noopener noreferrer">Redfin</a>
                <a href="/products/web-scraper/airbnb" className="usecase-label">Airbnb</a>
                <a href="/products/web-scraper/booking" className="usecase-label">Booking</a>
              </div>
              <p>
                Collect property listings, pricing history, neighborhood data, and agent info from
                Zillow, Realtor.com, and Redfin. Build market intelligence for residential and commercial real estate.
              </p>
              <a href="/products/web-scraper/real-estate" className="usecase-cta">View all Real Estate scrapers →</a>
            </div>
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/b2b" className="usecase-title-link">Business &amp; B2B scraping API</a></h3>
              <div className="usecase-labels">
                <a href="/products/web-scraper/linkedin" className="usecase-label">LinkedIn</a>
                <a href="/products/web-scraper/crunchbase" className="usecase-label">Crunchbase</a>
                <a href="/products/web-scraper/glassdoor" className="usecase-label">Glassdoor</a>
                <a href="/products/web-scraper/indeed" className="usecase-label">Indeed</a>
              </div>
              <p>
                Enrich leads with company data, job listings, funding rounds, and employee info from
                LinkedIn, Crunchbase, and Glassdoor. Fuel CRM enrichment, competitive intel, and market mapping.
              </p>
              <a href="/products/web-scraper/b2b" className="usecase-cta">View all B2B scrapers →</a>
            </div>
            <div className="usecase-card">
              <h3><a href="/products/web-scraper/finance" className="usecase-title-link">Financial data scraping API</a></h3>
              <div className="usecase-labels">
                <a href="https://brightdata.com/products/web-scraper/yahoo-finance" className="usecase-label" target="_blank" rel="noopener noreferrer">Yahoo Finance</a>
                <a href="https://brightdata.com/products/web-scraper/bloomberg" className="usecase-label" target="_blank" rel="noopener noreferrer">Bloomberg</a>
                <a href="https://brightdata.com/products/web-scraper/sec" className="usecase-label" target="_blank" rel="noopener noreferrer">SEC</a>
                <a href="https://brightdata.com/products/web-scraper/marketwatch" className="usecase-label" target="_blank" rel="noopener noreferrer">MarketWatch</a>
              </div>
              <p>
                Extract stock prices, market cap, earnings data, analyst ratings, and news sentiment
                from Yahoo Finance and public filings. Build alternative data feeds for quantitative strategies.
              </p>
              <a href="/products/web-scraper/finance" className="usecase-cta">View all Finance scrapers →</a>
            </div>
          </div>
        </div>
      </section>

      <CompareTable
        name="Web Scraper API"
        title="Web Scraper API vs DIY scrapers and other providers"
        description="Compare Bright Data&rsquo;s managed Web Scraper API with other scraping providers and building your own scraper stack, infrastructure, anti-bot, proxies, maintenance, and compliance."
        scraperRow={{ label: "Pre-built scrapers", bd: "✓ 1,400+", others: "50–200", diy: "0 (build each)" }}
        othersHeader="Other scraping providers"
        altBg
      />

      <DxComplianceSection />

      <AiPromptCta />

      <FaqSection
        title="Web Scraper API FAQs"
        description="Common questions about Bright Data&rsquo;s Web Scraping API, how it works, what you can scrape, compliance, pricing, and getting started."
        items={FAQ_ITEMS}
        altBg
      />

      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import HeroSearch from "@/components/HeroSearch";
import ScraperLibrary from "@/components/ScraperLibrary";
import AgentGetStarted from "@/components/AgentGetStarted";
import StudioAgentPrompts from "@/components/StudioAgentPrompts";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Web Scraping API - 5K Records/Month for Free | Bright Data",
  description:
    "The most reliable Web Scraping API. 1,300+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free — no credit card required.",
  openGraph: {
    title: "Web Scraping API - 5K Records/Month for Free | Bright Data",
    description:
      "1,300+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper" },
};

const FAQ_ITEMS = [
  {
    q: "What is a Web Scraper API?",
    a: "A cloud-based service that automates web data extraction. It handles IP rotation, CAPTCHA solving, JavaScript rendering, and data parsing into structured formats (JSON, CSV) — so you get clean data without building or maintaining scraping infrastructure.",
  },
  {
    q: "How is this different from building my own scraper?",
    a: "DIY scrapers require managing proxies, solving CAPTCHAs, handling blocks, and constant maintenance when sites change. Bright Data's scrapers are auto-maintained 24/7, run on 400M+ residential IPs, and include unblocking — you just call the API and get structured data back.",
  },
  {
    q: "What websites can I scrape?",
    a: "There are 1,300+ pre-built scrapers for popular sites including Amazon, LinkedIn, Instagram, TikTok, Google Maps, Zillow, and hundreds more. For any other website, use Scraper Studio to create a custom scraper with AI in minutes.",
  },
  {
    q: "Is web scraping with Bright Data legal and compliant?",
    a: "Yes. Bright Data collects only publicly available data, is ISO 27001 certified, GDPR-ready, and maintains SOC 2 controls. Our Compliance & Ethics team ensures all practices follow data protection laws including GDPR and CCPA.",
  },
  {
    q: "How do I get started with the Web Scraper API?",
    a: "Sign up for free (no credit card), get 5,000 records/month at no cost. Browse the scraper library, pick one, and make your first API call in minutes. Works with cURL, Python, Node.js, or any HTTP client. Also available as an MCP server for AI agents.",
  },
  {
    q: "What data formats are supported?",
    a: "JSON, NDJSON, and CSV. Data can be delivered via API response, webhook, Amazon S3, Google Cloud Storage, Snowflake, or SFTP.",
  },
  {
    q: "What use cases are Web Scraper APIs optimized for?",
    a: "Competitive benchmarking, market trend analysis, dynamic pricing, sentiment extraction, lead generation, and feeding data into ML pipelines. Essential for e-commerce, fintech, real estate, and social media analytics.",
  },
  {
    q: "How does the Web Scraper API handle large-scale extraction?",
    a: "Built for high concurrency and batch processing. Send up to 5,000 URLs per request, schedule recurring jobs, and scale to millions of records with no infrastructure changes. Pay only for successfully delivered results.",
  },
  {
    q: "How much does web scraping cost?",
    a: "Bright Data's Web Scraper API starts free with 5,000 records/month. Pay-as-you-go pricing is $1.50 per 1,000 records, with volume discounts available. You only pay for successfully delivered data — failed requests are free.",
  },
  {
    q: "Can I use this Web Scraper API with Python or Node.js?",
    a: "Yes. The API works with any HTTP client — Python (requests, aiohttp), Node.js (axios, fetch), cURL, Go, Java, or any language with HTTP support. We provide ready-made code snippets for each scraper in Python and JavaScript (sync and async).",
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

export default function WebScraperHome() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Header />

      <main>
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-ratings">
            <a className="hero-rating" href="https://www.trustpilot.com/review/brightdata.com" target="_blank" rel="noopener noreferrer">
              <span className="stars">★★★★★</span>
              <strong>4.6</strong> Trustpilot
            </a>
            <a className="hero-rating" href="https://www.g2.com/products/bright-data/reviews" target="_blank" rel="noopener noreferrer">
              <span className="stars">★★★★★</span>
              <strong>4.6</strong> G2
            </a>
            <a className="hero-rating" href="https://www.capterra.com/p/146810/Luminati/" target="_blank" rel="noopener noreferrer">
              <span className="stars">★★★★★</span>
              <strong>4.8</strong> Capterra
            </a>
          </div>

          <h1>
            Get data from any website<br />
            with <span className="grad-text">Web Scraper API</span>
          </h1>

          <p className="hero-sub">
            The most reliable web scraping API —{" "}
            <span className="hero-stat-accent">1,300+ scrapers</span>, automatic
            proxy rotation, anti-bot bypass, and JS rendering.
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

      {/* VALUE BANNER */}
      <section className="value-banner">
        <div className="container value-banner-inner">
          <div className="vb-item">
            <strong>#1</strong>
            <span>in benchmarks</span>
          </div>
          <div className="vb-item">
            <strong>98.4%</strong>
            <span>success rate</span>
          </div>
          <div className="vb-item">
            <strong>400M+</strong>
            <span>proxy IPs built in</span>
          </div>
          <div className="vb-item">
            <strong>195</strong>
            <span>countries covered</span>
          </div>
          <div className="vb-item">
            <strong>MCP</strong>
            <span>AI agent ready</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — 3 STEPS */}
      <section className="section animate-rise" id="steps">
        <div className="container">
          <div className="section-head">
            <span className="kicker">How it works</span>
            <h2>From zero to structured data in 3 steps</h2>
            <p>No proxies to configure, no infrastructure to manage. Just pick, call, and receive.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <span className="step-icon">01</span>
              <h3>Pick a scraper</h3>
              <p>Browse 1,300+ pre-built scrapers or create your own with AI in minutes.</p>
            </div>
            <div className="step-card">
              <span className="step-icon">02</span>
              <h3>Call the API</h3>
              <p>One REST call with your target URL. Works with Python, Node.js, cURL, or any HTTP client.</p>
            </div>
            <div className="step-card">
              <span className="step-icon">03</span>
              <h3>Get structured data</h3>
              <p>Receive clean, parsed data in JSON, NDJSON, or CSV. Delivered via API, webhook, or cloud storage.</p>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — UNDER THE HOOD */}
      <section className="section section-alt animate-rise" id="how">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Under the hood</span>
            <h2>Never get blocked again</h2>
            <p>
              Every scraper runs on Bright Data&rsquo;s infrastructure. One API call &mdash;
              we handle IP rotation, CAPTCHA solving, rendering, and retries automatically.
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">⟳</span>
              <h3>Automatic IP rotation</h3>
              <p>400M+ residential IPs across 195 countries. Requests are routed through real-user devices to avoid blocks.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">◈</span>
              <h3>CAPTCHA &amp; anti-bot bypass</h3>
              <p>Automated CAPTCHA solving, browser fingerprinting, and user-agent rotation. You never see a challenge page.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⬡</span>
              <h3>JavaScript rendering</h3>
              <p>Full browser rendering for SPAs and dynamic content. Get the same data a real user sees.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">⊞</span>
              <h3>Bulk &amp; scheduled collection</h3>
              <p>Send up to 5,000 URLs per request. Schedule recurring jobs, get results via webhook or API.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">✓</span>
              <h3>Data validation &amp; parsing</h3>
              <p>Raw HTML is parsed into structured JSON, NDJSON, or CSV. Built-in validation ensures data quality.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">∞</span>
              <h3>Unlimited scalability</h3>
              <p>No concurrency limits. Scale from 10 to 10M requests with the same API. Pay only for successful results.</p>
            </div>
          </div>
        </div>
      </section>

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
              <h3>E-commerce scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">Amazon</span>
                <span className="usecase-label">Walmart</span>
                <span className="usecase-label">Shopee</span>
                <span className="usecase-label">Target</span>
                <span className="usecase-label">eBay</span>
              </div>
              <p>
                Track competitor pricing, monitor stock levels, collect product reviews, and
                benchmark seller performance across Amazon, Walmart, Shopee, and 50+ marketplaces.
              </p>
            </div>
            <div className="usecase-card">
              <h3>Social media scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">Instagram</span>
                <span className="usecase-label">TikTok</span>
                <span className="usecase-label">LinkedIn</span>
                <span className="usecase-label">X</span>
                <span className="usecase-label">Facebook</span>
              </div>
              <p>
                Extract public posts, profiles, followers, engagement metrics, and trending
                hashtags. Power influencer analytics, sentiment analysis, and content monitoring at scale.
              </p>
            </div>
            <div className="usecase-card">
              <h3>Real estate scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">Zillow</span>
                <span className="usecase-label">Realtor</span>
                <span className="usecase-label">Redfin</span>
                <span className="usecase-label">Airbnb</span>
                <span className="usecase-label">Booking</span>
              </div>
              <p>
                Collect property listings, pricing history, neighborhood data, and agent info from
                Zillow, Realtor.com, and Redfin. Build market intelligence for residential and commercial real estate.
              </p>
            </div>
            <div className="usecase-card">
              <h3>Business &amp; B2B scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">LinkedIn</span>
                <span className="usecase-label">Crunchbase</span>
                <span className="usecase-label">Glassdoor</span>
                <span className="usecase-label">Indeed</span>
              </div>
              <p>
                Enrich leads with company data, job listings, funding rounds, and employee info from
                LinkedIn, Crunchbase, and Glassdoor. Fuel CRM enrichment, competitive intel, and market mapping.
              </p>
            </div>
            <div className="usecase-card">
              <h3>Search &amp; maps scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">Google Maps</span>
                <span className="usecase-label">Yelp</span>
                <span className="usecase-label">Tripadvisor</span>
                <span className="usecase-label">Yellow Pages</span>
              </div>
              <p>
                Collect Google Maps business listings, reviews, ratings, and local SEO data.
                Monitor rankings, analyze competitors, and track customer sentiment by location.
              </p>
            </div>
            <div className="usecase-card">
              <h3>Financial data scraping API</h3>
              <div className="usecase-labels">
                <span className="usecase-label">Yahoo Finance</span>
                <span className="usecase-label">Bloomberg</span>
                <span className="usecase-label">SEC</span>
                <span className="usecase-label">MarketWatch</span>
              </div>
              <p>
                Extract stock prices, market cap, earnings data, analyst ratings, and news sentiment
                from Yahoo Finance and public filings. Build alternative data feeds for quantitative strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARISON TABLE — SEO */}
      <section className="section animate-rise" id="compare">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Why Bright Data</span>
            <h2>Web Scraper API vs DIY scrapers and other providers</h2>
            <p>
              Compare Bright Data&rsquo;s managed Web Scraper API with other scraping providers and
              building your own scraper stack — infrastructure, anti-bot, proxies, maintenance, and compliance.
            </p>
          </div>
          <div className="compare-table-wrap">
            <table className="compare-table">
              <caption className="sr-only">
                Web Scraper API comparison: Bright Data vs other scraping providers vs DIY self-built scrapers
              </caption>
              <thead>
                <tr>
                  <th scope="col">Capability</th>
                  <th scope="col" className="compare-highlight">Bright Data</th>
                  <th scope="col">Other scraping providers</th>
                  <th scope="col">DIY (self-built)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Auto-scaling infrastructure</td><td className="compare-highlight">✓ Unlimited</td><td>Partial</td><td>Manual</td></tr>
                <tr><td>Anti-bot &amp; CAPTCHA bypass</td><td className="compare-highlight">✓ Built-in</td><td>Partial</td><td>Build yourself</td></tr>
                <tr><td>Residential proxy network</td><td className="compare-highlight">✓ 400M+ IPs</td><td>Limited pool</td><td>Buy separately</td></tr>
                <tr><td>Pre-built scrapers</td><td className="compare-highlight">✓ 1,300+</td><td>50–200</td><td>0 (build each)</td></tr>
                <tr><td>Auto-maintenance (site changes)</td><td className="compare-highlight">✓ 24/7</td><td>Varies</td><td>Your team</td></tr>
                <tr><td>Compliance (GDPR, CCPA, SOC 2)</td><td className="compare-highlight">✓ Full</td><td>Partial</td><td>Your responsibility</td></tr>
                <tr><td>Structured output (JSON/CSV)</td><td className="compare-highlight">✓ Automatic</td><td>✓</td><td>Build parsers</td></tr>
                <tr><td>Free tier</td><td className="compare-highlight">✓ 5K records/mo</td><td>Varies</td><td>Infra costs</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ — promoted next to comparison for SEO */}
      <section className="section section-alt animate-rise" id="faq">
        <div className="container">
          <div className="section-head">
            <span className="kicker">FAQs</span>
            <h2>Web Scraper API FAQs</h2>
            <p>
              Common questions about Bright Data&rsquo;s Web Scraping API — how it works, what you can scrape,
              compliance, pricing, and getting started.
            </p>
          </div>
          <div className="faq-list">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section animate-rise" id="pricing">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Pricing</span>
            <h2>Only pay for what&rsquo;s successfully delivered</h2>
            <p>No hidden fees. No charges for failed requests. Every plan includes full access to all scrapers and infrastructure.</p>
          </div>
          <div className="pricing-grid">
            <div className="price-card">
              <div className="price-tier">Free</div>
              <div className="price-amount">
                <strong>5K</strong>
                <span>records/mo</span>
              </div>
              <ul className="price-features">
                <li>No credit card required</li>
                <li>All scrapers included</li>
                <li>Full API access</li>
              </ul>
              <a href="https://brightdata.com/cp/start" className="btn btn-ghost btn-pill price-cta">
                Start free
              </a>
            </div>
            <div className="price-card price-card-featured">
              <div className="price-tier">Pay as you go</div>
              <div className="price-amount">
                <strong>$1.50</strong>
                <span>/1K records</span>
              </div>
              <ul className="price-features">
                <li>Pay only for success</li>
                <li>Unlimited concurrency</li>
                <li>Set monthly spend limits</li>
              </ul>
              <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill price-cta">
                Start free
              </a>
            </div>
            <div className="price-card">
              <div className="price-tier">Scale</div>
              <div className="price-amount">
                <strong>$499</strong>
                <span>/month</span>
              </div>
              <ul className="price-features">
                <li>384K records included</li>
                <li>$1.30/1K additional</li>
                <li>Cancel anytime</li>
              </ul>
              <a href="https://brightdata.com/cp/start" className="btn btn-ghost btn-pill price-cta">
                Get started
              </a>
            </div>
            <div className="price-card">
              <div className="price-tier">Enterprise</div>
              <div className="price-amount">
                <strong>Custom</strong>
              </div>
              <ul className="price-features">
                <li>Volume discounts</li>
                <li>Account manager</li>
                <li>Premium SLA &amp; SSO</li>
              </ul>
              <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill price-cta">
                Talk to sales
              </a>
            </div>
          </div>
          <p className="pricing-note">
            Rated <strong>4.6/5</strong> on Trustpilot · <strong>4.6/5</strong> on G2 · <strong>4.8/5</strong> on Capterra
          </p>
        </div>
      </section>

      {/* STAT BANNER */}
      <section className="stat-banner animate-rise">
        <div className="container">
          <p className="stat-banner-text">
            Every 15 minutes, our customers scrape enough data to train ChatGPT from scratch.
          </p>
        </div>
      </section>

      {/* DX + COMPLIANCE */}
      <section className="section animate-rise" id="why">
        <div className="container">
          <div className="twin-cols">
            <div className="twin-col">
              <span className="kicker">Developer experience</span>
              <h2>Easy to start. Easier to scale.</h2>
              <p>
                Get your API key and make your first call in minutes. Scale to millions of requests
                with unlimited concurrency &mdash; same API, same reliability, no infrastructure changes.
              </p>
            </div>
            <div className="twin-col">
              <span className="kicker">Compliance</span>
              <h2>Leading the way in ethical web data collection</h2>
              <p>
                Only publicly available data. ISO&nbsp;27001 certified, SOC&nbsp;2 controls,
                GDPR &amp; CCPA compliant. Backed by an industry-first Compliance &amp; Ethics team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AGENT SECTION */}
      <section className="section section-alt animate-rise" id="agents">
        <div className="container">
          <AgentGetStarted />
        </div>
      </section>

      {/* BUILD YOUR OWN */}
      <section className="section animate-rise" id="studio">
        <div className="container">
          <StudioAgentPrompts />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section animate-rise">
        <div className="container final-cta">
          <h2>The easiest way to scrape web data</h2>
          <p className="final-cta-sub">
            1,300+ scrapers, 400M+ proxy IPs, auto-maintained 24/7. Start with 5,000 free records &mdash; no credit card required.
          </p>
          <div className="hero-ctas">
            <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill">Start free</a>
            <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill">Contact sales</a>
          </div>
        </div>
      </section>
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import ScraperCard from "@/components/ScraperCard";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import AgentGetStarted from "@/components/AgentGetStarted";
import AgentSetupCta from "@/components/AgentSetupCta";
import { PricingCards } from "@/components/PricingCards";
import PricingAssurances from "@/components/PricingAssurances";
import PricingSlider from "@/components/PricingSlider";
import AmazonCodeExamples from "@/components/AmazonCodeExamples";
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

export default function AmazonHubPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
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
              {AMAZON_SCRAPERS.map((s) => (
                <ScraperCard
                  key={s.id}
                  name={s.name}
                  domain={AMAZON_SITE.domain}
                  category="E-commerce"
                  desc={s.desc}
                  fieldsPreview={s.fieldsPreview}
                  views={s.views}
                  downloads={s.downloads}
                  href={s.href}
                />
              ))}
            </div>

            <div className="hub-strip">
              <div className="hub-strip-item"><span className="hub-strip-icon">⚡</span><strong>5K free records/mo</strong><span>No credit card</span></div>
              <div className="hub-strip-item"><span className="hub-strip-icon">⟳</span><strong>API or no-code</strong><span>On demand</span></div>
              <div className="hub-strip-item"><span className="hub-strip-icon">✓</span><strong>Pay per success</strong><span>Failed = free</span></div>
              <div className="hub-strip-item"><span className="hub-strip-icon">⊞</span><strong>5K URLs/batch</strong><span>High volume</span></div>
            </div>

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

        {/* HOW IT WORKS — quick orientation */}
        <section className="section section-alt animate-rise hub-anchor" id="steps">
          <div className="container">
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2>From zero to Amazon data in 3 steps</h2>
              <p>No proxies to configure, no infrastructure to manage. Just pick, call, and receive.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <span className="step-icon">01</span>
                <h3>Pick a scraper</h3>
                <p>Choose from the Amazon scrapers above — products, reviews, sellers, rankings, and more.</p>
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

        {/* API vs NO-CODE */}
        <section className="section animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Effortlessly scrape Amazon data</h2>
              <p>Same scrapers, three ways to run them — pick the workflow that fits your team.</p>
            </div>
            <div className="hub-paths">
              <a
                href="https://brightdata.com/cp/start"
                className="hub-path-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hub-path-kicker">API-based scraper</span>
                <h3>Amazon Scraper API</h3>
                <p>Trigger collections with parameters, schedule at scale, and deliver to your storage or webhook.</p>
                <ul className="hub-path-list">
                  <li>Build requests in any language</li>
                  <li>Automate with schedulers &amp; webhooks</li>
                  <li>JSON, NDJSON, or CSV delivery</li>
                </ul>
                <span className="hub-path-cta">Start with API →</span>
              </a>
              <a
                href="https://brightdata.com/cp/data_collector/collectors/create?camp=plg"
                className="hub-path-card"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="hub-path-kicker">Control panel scraper</span>
                <h3>Amazon no-code scraper</h3>
                <p>Plug-and-play in the control panel — add inputs, run the scraper, download results.</p>
                <ul className="hub-path-list">
                  <li>No engineering required</li>
                  <li>Configure inputs in the UI</li>
                  <li>Download results from the CP</li>
                </ul>
                <span className="hub-path-cta">Open control panel →</span>
              </a>
              <a href="#agents" className="hub-path-card">
                <span className="hub-path-kicker">AI agent integration</span>
                <h3>Amazon agent scraper</h3>
                <p>Connect via MCP or CLI — your AI agent reads a skill file and scrapes autonomously.</p>
                <ul className="hub-path-list">
                  <li>Works with any MCP-compatible agent</li>
                  <li>Single prompt to scrape</li>
                  <li>Structured data returned to agent</li>
                </ul>
                <span className="hub-path-cta">Connect your agent →</span>
              </a>
            </div>
          </div>
        </section>

        {/* PRICING — buyers check cost early */}
        <section className="section section-alt animate-rise hub-anchor" id="pricing">
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
        <section className="section animate-rise hub-anchor" id="agents">
          <div className="container">
            <AgentGetStarted name="Amazon" domain="amazon.com" />
          </div>
        </section>

        {/* INCLUDED — what every plan gets */}
        <section className="section section-alt animate-rise hub-anchor" id="included">
          <div className="container">
            <div className="hub-plan-includes">
              <div className="hub-plan-includes-head">
                <span className="hub-plan-includes-kicker">Included in every plan</span>
                <h3>No feature gates between tiers</h3>
                <p>Every plan includes the full platform — pay less per record as you scale.</p>
              </div>
              <div className="hub-plan-cols">
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">◎</span>
                    <h4>No extra cost</h4>
                  </div>
                  <ul>
                    <li><span>Proxies &amp; IP rotation</span></li>
                    <li><span>CAPTCHA solving</span></li>
                    <li><span>JS rendering</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">∞</span>
                    <h4>No limits</h4>
                  </div>
                  <ul>
                    <li><span>Unlimited concurrency</span></li>
                    <li><span>5,000 URLs per batch</span></li>
                    <li><span>Scheduling &amp; webhooks</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">⇢</span>
                    <h4>Full delivery</h4>
                  </div>
                  <ul>
                    <li><span>JSON, NDJSON, or CSV</span></li>
                    <li><span>Webhook &amp; cloud storage</span></li>
                    <li><span>Data validation built in</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

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

        {/* HOW IT WORKS */}
        <section className="section animate-rise hub-anchor" id="how">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Under the hood</span>
              <h2>Scrape Amazon with one API call</h2>
              <p>Discovery, bulk handling, parsing, and validation — built into every Amazon scraper.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">◎</span>
                <h3>Data discovery</h3>
                <p>Detect structures and patterns for efficient, targeted Amazon extraction.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⊞</span>
                <h3>Bulk request handling</h3>
                <p>Send up to 5,000 URLs per request. Optimize high-volume collection without ops overhead.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⬡</span>
                <h3>Data parsing</h3>
                <p>Raw HTML becomes structured JSON, NDJSON, or CSV ready for your pipeline.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">✓</span>
                <h3>Data validation</h3>
                <p>Built-in checks improve reliability and cut manual preprocessing time.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⟳</span>
                <h3>Unblocking built in</h3>
                <p>IP rotation, CAPTCHA solving, JS rendering, and residential proxies — automatic.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">∞</span>
                <h3>Battle-proven scale</h3>
                <p>99.99% uptime, 400M+ IPs across 195 countries. Powering 20,000+ companies.</p>
              </div>
            </div>
          </div>
        </section>

        {/* USE CASES */}
        <section className="section section-alt animate-rise hub-anchor" id="use-cases">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Use cases</span>
              <h2>Amazon data scraping use cases</h2>
              <p>Real-time Amazon intelligence for pricing, competition, and brand reputation.</p>
            </div>
            <div className="usecases-grid">
              <div className="usecase-card">
                <h3>Product inventory and pricing strategy</h3>
                <p>
                  Scrape Amazon listings in real time to identify best sellers, track price changes, and monitor
                  availability. Collect titles, prices, ASINs, brands, and stock status to optimize inventory and
                  dynamic pricing.
                </p>
                <span className="usecase-sites">Products · Prices · ASINs · Availability</span>
              </div>
              <div className="usecase-card">
                <h3>Stay ahead of the competition</h3>
                <p>
                  Monitor bestseller rankings, seller profiles, and listings to benchmark against category leaders.
                  Collect seller ratings, feedback, and promotional signals to uncover product opportunities.
                </p>
                <span className="usecase-sites">Best sellers · Sellers · Rankings</span>
              </div>
              <div className="usecase-card">
                <h3>Consumer sentiment and brand reputation</h3>
                <p>
                  Scrape Amazon reviews and ratings across categories and countries. Collect review text, star ratings,
                  verified purchase status, and dates to spot demand shifts before they peak.
                </p>
                <span className="usecase-sites">Reviews · Ratings · Sentiment</span>
              </div>
              <div className="usecase-card">
                <h3>Catalog &amp; marketplace intelligence</h3>
                <p>
                  Build rich Amazon catalogs with images, variants, features, and category trees — ready for analytics,
                  enrichment, and machine learning pipelines.
                </p>
                <span className="usecase-sites">Catalog · Variants · Categories</span>
              </div>
            </div>
          </div>
        </section>

        {/* COMPARISON */}
        <section className="section animate-rise hub-anchor" id="compare">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Why Bright Data</span>
              <h2>Amazon Scraper API vs DIY and other providers</h2>
              <p>
                Compare Bright Data&rsquo;s managed Amazon scrapers with building your own or using other services.
              </p>
            </div>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <caption className="sr-only">
                  Amazon scraper comparison: Bright Data vs other providers vs DIY
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Capability</th>
                    <th scope="col" className="compare-highlight">Bright Data</th>
                    <th scope="col">Other providers</th>
                    <th scope="col">DIY (self-built)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Auto-scaling infrastructure</td><td className="compare-highlight">✓ Unlimited</td><td>Partial</td><td>Manual</td></tr>
                  <tr><td>Anti-bot &amp; CAPTCHA bypass</td><td className="compare-highlight">✓ Built-in</td><td>Partial</td><td>Build yourself</td></tr>
                  <tr><td>Residential proxy network</td><td className="compare-highlight">✓ 400M+ IPs</td><td>Limited pool</td><td>Buy separately</td></tr>
                  <tr><td>Pre-built Amazon scrapers</td><td className="compare-highlight">✓ 14+ ready</td><td>1–3</td><td>Build each</td></tr>
                  <tr><td>Auto-maintenance (site changes)</td><td className="compare-highlight">✓ 24/7</td><td>Varies</td><td>Your team</td></tr>
                  <tr><td>Compliance (GDPR, CCPA, SOC 2)</td><td className="compare-highlight">✓ Full</td><td>Partial</td><td>Your responsibility</td></tr>
                  <tr><td>Structured output (JSON/CSV)</td><td className="compare-highlight">✓ Automatic</td><td>✓</td><td>Build parsers</td></tr>
                  <tr><td>Free tier</td><td className="compare-highlight">✓ 5K records/mo</td><td>Varies</td><td>Infra costs</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DX + COMPLIANCE */}
        <section className="section section-alt animate-rise hub-anchor" id="why">
          <div className="container">
            <div className="twin-cols">
              <div className="twin-col">
                <span className="kicker">Developer experience</span>
                <h2>Easy to start. Easier to scale.</h2>
                <p>
                  Get your API key and make your first call in minutes. Scale to millions with the same API &mdash; no infra changes.
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

        {/* FAQ */}
        <section className="section animate-rise hub-anchor" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="kicker">FAQs</span>
              <h2>Amazon Scraper API FAQs</h2>
              <p>Common questions about scraping Amazon with Bright Data&rsquo;s Web Scraper API.</p>
            </div>
            <div className="faq-list">
              {AMAZON_FAQS.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <AiPromptCta headingPlain="Build your own" headingAccent="e-commerce scraper." />
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

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

        {/* API vs NO-CODE */}
        <section className="section section-alt animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Effortlessly scrape Amazon data</h2>
              <p>Same scrapers, two ways to run them — pick the workflow that fits your team.</p>
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
            </div>
          </div>
        </section>

        {/* PRODUCT TYPES */}
        <section className="section animate-rise hub-anchor" id="types">
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

        {/* CODE EXAMPLES */}
        <section className="section section-alt animate-rise hub-anchor" id="code">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Code examples</span>
              <h2>Easily scrape Amazon without getting blocked</h2>
              <p>Copy a working request for products, reviews, or sellers — cURL, Python, or Node.js.</p>
            </div>
            <AmazonCodeExamples />
          </div>
        </section>

        {/* PRICING */}
        <section className="section animate-rise hub-anchor" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Amazon Scraper API Pricing</span>
              <h2>Only pay for what&rsquo;s successfully delivered</h2>
              <p>No hidden fees. No charges for failed deliveries. Every plan includes full access to Amazon scrapers and infrastructure.</p>
            </div>
            <PricingCards unit="records" />

            <div className="hub-plan-includes">
              <div className="hub-plan-includes-head">
                <span className="hub-plan-includes-kicker">Included in every plan</span>
                <h3>Full platform access on every tier</h3>
                <p>
                  Pay less per record as you scale. Proxies, rendering, concurrency, and delivery
                  stay included — no feature gates between plans.
                </p>
              </div>
              <div className="hub-plan-cols">
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">◎</span>
                    <h4>Data collection</h4>
                  </div>
                  <ul>
                    <li><span>Automated proxy management</span></li>
                    <li><span>Full browser rendering</span></li>
                    <li><span>CAPTCHA solving</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">∞</span>
                    <h4>Performance at scale</h4>
                  </div>
                  <ul>
                    <li><span>Unlimited concurrency</span></li>
                    <li><span>Batch &amp; scheduled collection</span></li>
                    <li><span>Job management APIs</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon" aria-hidden="true">⇢</span>
                    <h4>Data delivery</h4>
                  </div>
                  <ul>
                    <li><span>Validation &amp; discovery</span></li>
                    <li><span>JSON or CSV parsing</span></li>
                    <li><span>Webhook or API delivery</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section section-alt animate-rise hub-anchor" id="how">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Deploy faster</span>
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
        <section className="section animate-rise hub-anchor" id="use-cases">
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

        {/* WHY */}
        <section className="section section-alt animate-rise hub-anchor" id="why">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Why Bright Data</span>
              <h2>Why 20,000+ customers choose Bright Data</h2>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <h3>100% compliant</h3>
                <p>Ethically obtained public data with GDPR &amp; CCPA-ready practices.</p>
              </div>
              <div className="feature-card">
                <h3>24/7 global support</h3>
                <p>A dedicated team of data professionals ready when you need them.</p>
              </div>
              <div className="feature-card">
                <h3>Complete data coverage</h3>
                <p>Access 400M+ global IPs to scrape Amazon from any geo.</p>
              </div>
              <div className="feature-card">
                <h3>Unmatched data quality</h3>
                <p>Advanced validation methods for reliable, analysis-ready Amazon data.</p>
              </div>
              <div className="feature-card">
                <h3>Powerful infrastructure</h3>
                <p>High-volume scraping without getting blocked or maintaining proxies.</p>
              </div>
              <div className="feature-card">
                <h3>Custom solutions</h3>
                <p>Tailored Amazon data programs for enterprise workflows and SLAs.</p>
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

        {/* AGENT SECTION */}
        <section className="section section-alt animate-rise hub-anchor" id="agents">
          <div className="container">
            <AgentGetStarted />
          </div>
        </section>

        {/* AI Prompt CTA */}
        <AiPromptCta headingPlain="Build your own" headingAccent="e-commerce scraper." />
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

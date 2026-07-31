import type { Metadata } from "next";
import Link from "next/link";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import ScraperCard from "@/components/ScraperCard";
import TrustedByStrip from "@/components/TrustedByStrip";
import { AMAZON_SCRAPERS, AMAZON_SITE, AMAZON_FAQS } from "@/lib/amazon-scrapers";

export const metadata: Metadata = {
  title: "Amazon Scraper API - 5K records/Month for Free | Bright Data",
  description:
    "Scrape Amazon products and collect data such as best sellers, prices, reviews, images, ratings, and more. Amazon Scraper API or no-code scraper. Free Trial.",
  openGraph: {
    title: "Amazon Scraper API - 5K records/Month for Free | Bright Data",
    description:
      "Scrape Amazon products and collect data such as best sellers, prices, reviews, images, ratings, and more.",
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
        {/* Breadcrumb */}
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
              <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
                Contact sales
              </a>
            </div>
          </div>
        </section>

        <TrustedByStrip />

        {/* AVAILABLE SCRAPERS */}
        <section className="section" id="scrapers">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Web Scrapers</span>
              <h2>Available Amazon scrapers</h2>
              <p>
                Remove the need to develop and maintain infrastructure. Extract high-volume Amazon data with
                scraper APIs or no-code scrapers — auto-maintained, unblockable, and production-ready.
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
              <div className="hub-dataset-cta-text">
                <strong>Just want Amazon data? Skip scraping.</strong>
                <span>Get pre-collected, ready-to-use Amazon datasets — updated daily, delivered instantly.</span>
              </div>
              <a href="https://brightdata.com/products/datasets/amazon" className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
                Browse Amazon datasets →
              </a>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section animate-rise" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Amazon Scraper API Pricing</span>
              <h2>Only pay for what&rsquo;s successfully delivered</h2>
              <p>No hidden fees. No charges for failed deliveries. Every plan includes full access to Amazon scrapers and infrastructure.</p>
            </div>
            <div className="pricing-grid">
              <div className="price-card">
                <div className="price-tier">Free Tier</div>
                <div className="price-amount">
                  <strong>5K</strong>
                  <span>records/mo</span>
                </div>
                <ul className="price-features">
                  <li>No credit card required</li>
                  <li>Expert support</li>
                  <li>Full API access</li>
                </ul>
                <a href="https://brightdata.com/cp/start" className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
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
                  <li>Set monthly spend limits</li>
                  <li>Unlimited concurrency</li>
                </ul>
                <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill price-cta" target="_blank" rel="noopener noreferrer">
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
                <a href="https://brightdata.com/cp/start" className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
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
                <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
                  Talk to sales
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section animate-rise" id="how">
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
        <section className="section section-alt animate-rise" id="use-cases">
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
        <section className="section animate-rise" id="why">
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
        <section className="section section-alt animate-rise" id="faq">
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

        {/* FINAL CTA */}
        <section className="section animate-rise">
          <div className="container final-cta">
            <h2>Want to scrape Amazon data?</h2>
            <p className="final-cta-sub">
              Talk to an expert about your Amazon scraping needs — or start free with 5,000 records/month.
            </p>
            <div className="hero-ctas">
              <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                Start free
              </a>
              <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
                Contact sales
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

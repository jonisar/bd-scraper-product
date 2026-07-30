import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import HeroSearch from "@/components/HeroSearch";
import ScraperLibrary from "@/components/ScraperLibrary";
import AgentGetStarted from "@/components/AgentGetStarted";
import StudioAgentPrompts from "@/components/StudioAgentPrompts";
import ScrollReveal from "@/components/ScrollReveal";
import { templates } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Web Scraping API - 5K Records/Month for Free | Bright Data",
  description:
    "The most reliable Web Scraping API. 1,238+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free — no credit card required.",
  openGraph: {
    title: "Web Scraping API - 5K Records/Month for Free | Bright Data",
    description:
      "1,238+ production-ready scrapers with automatic proxy rotation, anti-bot bypass, and JavaScript rendering. Start free.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper" },
};

export default function WebScraperHome() {
  return (
    <div className="lib-page">
      <Header />

      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-ratings">
            <span className="hero-rating">
              <span className="stars">★★★★★</span>
              <strong>4.6</strong> Trustpilot
            </span>
            <span className="hero-rating">
              <span className="stars">★★★★★</span>
              <strong>4.6</strong> G2
            </span>
            <span className="hero-rating">
              <span className="stars">★★★★★</span>
              <strong>4.8</strong> Capterra
            </span>
          </div>

          <h1>
            Get data from any website<br />
            with <span className="grad-text">Web Scraper API</span>
          </h1>

          <p className="hero-sub">
            The most reliable web scraping API. 1,000+ ready-made scrapers with
            automatic proxy rotation, anti-bot bypass, and JS rendering.
          </p>

          <HeroSearch templates={templates} />

          <div className="hero-checks">
            <span className="hero-check">Real-time data</span>
            <span className="hero-check">Pay only for success</span>
            <span className="hero-check">Free 5K/month</span>
            <span className="hero-check">$1.50 per 1K results</span>
            <span className="hero-check">GDPR &amp; CCPA compliant</span>
          </div>
        </div>
      </section>

      {/* CUSTOMER LOGOS STRIP */}
      <section className="customers-strip">
        <div className="container">
          <div className="customers-panel">
            <h2 className="customers-label">Trusted by 20,000+ customers worldwide</h2>
            <div className="customers-track">
              <div className="customers-fade customers-fade-l" />
              <div className="customers-fade customers-fade-r" />
              <div className="logo-marquee">
                {[0, 1].map((i) => (
                  <div key={i} className="logo-marquee-set" aria-hidden={i === 1 ? true : undefined}>
                    {[
                      { name: "McDonald\u2019s", domain: "mcdonalds.com" },
                      { name: "Moody\u2019s", domain: "moodys.com" },
                      { name: "NBCUniversal", domain: "nbcuniversal.com", cls: "logo-marquee-wide" },
                      { name: "Nokia", domain: "nokia.com", cls: "logo-marquee-caps" },
                      { name: "University of Oxford", domain: "ox.ac.uk", cls: "logo-marquee-sm" },
                      { name: "Pfizer", domain: "pfizer.com" },
                      { name: "Shopee", domain: "shopee.com" },
                      { name: "Taboola", domain: "taboola.com" },
                    ].map((co) => (
                      <span key={co.domain} className={`logo-item ${co.cls ?? ""}`}>
                        <span className="logo-text">{co.name}</span>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="logo-img"
                          src={`https://logo.clearbit.com/${co.domain}`}
                          alt={co.name}
                          loading="lazy"
                          width={80}
                          height={24}
                        />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SCRAPER LIBRARY */}
      <section className="library-section" id="library">
        <div className="container">
          <div className="section-head">
            <h2>Web Scraper API Library</h2>
            <p>
              1,238+ production-ready scrapers. No infrastructure to maintain &mdash; just pick a scraper, call the API, and get structured data back.
            </p>
          </div>
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
            <strong>$0</strong>
            <span>for failed requests</span>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section animate-rise" id="how">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Under the hood</span>
            <h2>Never worry about proxies and CAPTCHAs again</h2>
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

      {/* PRICING */}
      <section className="section section-alt animate-rise" id="pricing">
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
                Start free
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

      {/* FAQ */}
      <section className="section section-alt animate-rise" id="faq">
        <div className="container">
          <div className="section-head">
            <h2>Web Scraper API FAQs</h2>
          </div>
          <div className="faq-list">
            <details className="faq-item">
              <summary>What is a Web Scraper API?</summary>
              <p>A cloud-based service that automates web data extraction. It handles IP rotation, CAPTCHA solving, JavaScript rendering, and data parsing into structured formats (JSON, CSV) &mdash; so you get clean data without building or maintaining scraping infrastructure.</p>
            </details>
            <details className="faq-item">
              <summary>How is this different from building my own scraper?</summary>
              <p>DIY scrapers require managing proxies, solving CAPTCHAs, handling blocks, and constant maintenance when sites change. Bright Data&rsquo;s scrapers are auto-maintained 24/7, run on 400M+ residential IPs, and include unblocking &mdash; you just call the API and get structured data back.</p>
            </details>
            <details className="faq-item">
              <summary>What websites can I scrape?</summary>
              <p>There are 1,238+ pre-built scrapers for popular sites including Amazon, LinkedIn, Instagram, TikTok, Google Maps, Zillow, and hundreds more. For any other website, use Scraper Studio to create a custom scraper with AI in minutes.</p>
            </details>
            <details className="faq-item">
              <summary>Is web scraping with Bright Data legal and compliant?</summary>
              <p>Yes. Bright Data collects only publicly available data, is ISO 27001 certified, GDPR-ready, and maintains SOC&nbsp;2 controls. Our Compliance &amp; Ethics team ensures all practices follow data protection laws including GDPR and CCPA.</p>
            </details>
            <details className="faq-item">
              <summary>How do I get started?</summary>
              <p>Sign up for free (no credit card), get 5,000 records/month at no cost. Browse the scraper library, pick one, and make your first API call in minutes. Works with cURL, Python, Node.js, or any HTTP client. Also available as an MCP server for AI agents.</p>
            </details>
            <details className="faq-item">
              <summary>What data formats are supported?</summary>
              <p>JSON, NDJSON, and CSV. Data can be delivered via API response, webhook, Amazon S3, Google Cloud Storage, Snowflake, or SFTP.</p>
            </details>
            <details className="faq-item">
              <summary>What use cases are Web Scraper APIs optimized for?</summary>
              <p>Competitive benchmarking, market trend analysis, dynamic pricing, sentiment extraction, lead generation, and feeding data into ML pipelines. Essential for e-commerce, fintech, real estate, and social media analytics.</p>
            </details>
            <details className="faq-item">
              <summary>How does it handle large-scale extraction?</summary>
              <p>Built for high concurrency and batch processing. Send up to 5,000 URLs per request, schedule recurring jobs, and scale to millions of records with no infrastructure changes. Pay only for successfully delivered results.</p>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section animate-rise">
        <div className="container" style={{ textAlign: "center" }}>
          <h2>The easiest way to scrape web data</h2>
          <p style={{ color: "var(--text-3)", fontSize: "15px", marginTop: "var(--s3)", maxWidth: "480px", marginLeft: "auto", marginRight: "auto" }}>
            1,238+ scrapers, 400M+ proxy IPs, auto-maintained 24/7. Start with 5,000 free records &mdash; no credit card required.
          </p>
          <div className="hero-ctas" style={{ marginTop: "var(--s5)" }}>
            <a href="https://brightdata.com/cp/start" className="btn btn-primary btn-pill">Start free</a>
            <a href="https://brightdata.com/contact" className="btn btn-ghost btn-pill">Contact sales</a>
          </div>
        </div>
      </section>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

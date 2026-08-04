import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";

export const metadata: Metadata = {
  title: "AI Scraper Studio — Build Any Scraper With a Prompt",
  description:
    "Turn a plain-English prompt into a production-ready web scraper. AI generates, tests, and deploys your scraper with built-in proxies, auto-healing, and scheduled delivery. 5K page loads free.",
  openGraph: {
    title: "AI Scraper Studio — Build Any Scraper With a Prompt",
    description:
      "Describe the data you need. Our AI builds, tests, and deploys a production scraper in minutes — no code required.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/studio",
    siteName: "Bright Data",
  },
  alternates: { canonical: "https://brightdata.com/products/web-scraper/studio" },
};

const STUDIO_FAQS = [
  {
    q: "How do I create a scraper using an AI prompt?",
    a: "Choose a website, describe the data in plain English, and the AI instantly generates a ready-to-run scraper. The finished scraper appears in your IDE workspace for testing, running, and edits.",
  },
  {
    q: "Do I need my own servers or proxies?",
    a: "No. When you launch a job, the scraper executes on Bright Data's infrastructure — complete with built-in proxy rotation, geo-targeting, CAPTCHA/unblocking logic, and auto-scaling. You don't maintain any servers or proxy pools.",
  },
  {
    q: "Is any coding required?",
    a: "No coding is required to generate a scraper — the AI builds it from your prompt. You can optionally refine the auto-generated code in the built-in IDE if you want fine-grained control.",
  },
  {
    q: "How does self-healing work?",
    a: "When a target website changes its layout or structure, the AI automatically detects the break and regenerates the affected selectors and code paths. One click to fix — no manual debugging required.",
  },
  {
    q: "Can I schedule my scraper to run automatically?",
    a: "Yes. Set daily, weekly, or custom intervals directly in the subscription tab. Data is delivered via API, webhook, or to cloud storage like S3, GCS, BigQuery, and Snowflake.",
  },
  {
    q: "What data formats are supported?",
    a: "JSON by default, with options for CSV, Parquet, or direct loads to Amazon S3, Google Cloud Storage, Azure Blob, BigQuery, and Snowflake.",
  },
  {
    q: "What kind of data can I scrape?",
    a: "Publicly available data from any website. Due to our commitment to privacy laws, we do not allow scraping behind log-ins. Bright Data is ISO 27001 certified, GDPR-ready, and SOC 2 compliant.",
  },
  {
    q: "Do I have to wait while the scraper is being built?",
    a: "No. Generation usually takes about 10–15 minutes. You can close the window and we'll email you as soon as the scraper is ready in the IDE.",
  },
  {
    q: "What support is available if I get stuck?",
    a: "24/7 chat and ticket support, rich documentation, plus an optional managed-service add-on where Bright Data builds and operates your scraping operations end-to-end.",
  },
  {
    q: "How much does it cost?",
    a: "Start free with 5,000 page loads/month — no credit card required. Pay-as-you-go pricing is $1.50 per 1,000 page loads. Scale plans start at $499/month with volume discounts.",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://brightdata.com/products/web-scraper/studio",
      url: "https://brightdata.com/products/web-scraper/studio",
      name: "AI Scraper Studio — Build Any Scraper With a Prompt",
      description:
        "Turn a plain-English prompt into a production-ready web scraper. AI generates, tests, and deploys your scraper with built-in proxies, auto-healing, and scheduled delivery.",
      isPartOf: { "@id": "https://brightdata.com#website" },
      inLanguage: "en-US",
    },
    {
      "@type": "FAQPage",
      mainEntity: STUDIO_FAQS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

const BD = "https://brightdata.com";
const SIGNUP = `${BD}/cp/start`;
const CONTACT = `${BD}/contact`;

export default function StudioPage() {
  return (
    <div className="lib-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Header />

      <main>
        {/* HERO — unified section with ratings flowing into prompt */}
        <section className="studio-hero">
          <div className="container studio-hero-inner">
            <div className="studio-hero-ratings">
              <a className="studio-hero-rating" href="https://www.trustpilot.com/review/brightdata.com" target="_blank" rel="noopener noreferrer">
                <span className="studio-stars" aria-label="4.6 out of 5 stars">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </span>
                <strong>4.6</strong> Trustpilot
              </a>
              <a className="studio-hero-rating" href="https://www.g2.com/products/bright-data/reviews" target="_blank" rel="noopener noreferrer">
                <span className="studio-stars" aria-label="4.6 out of 5 stars">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </span>
                <strong>4.6</strong> G2
              </a>
              <a className="studio-hero-rating" href="https://www.capterra.com/p/146810/Luminati/" target="_blank" rel="noopener noreferrer">
                <span className="studio-stars" aria-label="4.8 out of 5 stars">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5c518"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                </span>
                <strong>4.8</strong> Capterra
              </a>
            </div>
            <h1 className="sr-only">AI Scraper Studio — Build Any Web Scraper With a Prompt</h1>
          </div>
        </section>

        <AiPromptCta variant="hero" />

        {/* HERO VALUE PROPS — key benefits directly under the prompt */}
        <section className="studio-value-props">
          <div className="container">
            <div className="studio-props-grid">
              <div className="studio-prop">
                <span className="studio-prop-icon">⊞</span>
                <strong>Any website</strong>
                <span>Scale to hundreds of domains from one prompt</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">⟳</span>
                <strong>Self-healing</strong>
                <span>AI auto-repairs when sites change layout</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">∞</span>
                <strong>Schedule &amp; monitor</strong>
                <span>Run on intervals via IDE, API, or webhook</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">☁</span>
                <strong>Infra included</strong>
                <span>Proxies, browsers, CAPTCHA solving built in</span>
              </div>
            </div>
          </div>
        </section>

        <TrustedByStrip />

        {/* VALUE BANNER */}
        <section className="value-banner">
          <div className="container value-banner-inner">
            <div className="vb-item">
              <strong>5 min</strong>
              <span>prompt to scraper</span>
            </div>
            <div className="vb-item">
              <strong>0</strong>
              <span>code required</span>
            </div>
            <div className="vb-item">
              <strong>400M+</strong>
              <span>proxy IPs built in</span>
            </div>
            <div className="vb-item">
              <strong>1-click</strong>
              <span>self-healing</span>
            </div>
            <div className="vb-item">
              <strong>24/7</strong>
              <span>scheduled delivery</span>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="section animate-rise" id="how">
          <div className="container">
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2>From prompt to production in 3 steps</h2>
              <p>No infrastructure to set up. No code to write. Just describe, review, and deploy.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <span className="step-icon">01</span>
                <h3>Describe your data</h3>
                <p>Tell the AI what website to scrape and which fields you need — product names, prices, reviews, anything publicly available.</p>
              </div>
              <div className="step-card">
                <span className="step-icon">02</span>
                <h3>AI generates the scraper</h3>
                <p>The AI writes the scraper code, configures proxies, and tests it against the target site. Review and edit in the built-in IDE.</p>
              </div>
              <div className="step-card">
                <span className="step-icon">03</span>
                <h3>Deploy &amp; schedule</h3>
                <p>Run once or schedule daily, weekly, or custom intervals. Data is delivered via API, webhook, S3, BigQuery, or Snowflake.</p>
              </div>
            </div>
          </div>
        </section>

        {/* SELF-HEALING */}
        <section className="section section-alt animate-rise" id="healing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">AI Self-Healing</span>
              <h2>Scrapers that fix themselves</h2>
              <p>
                When target websites change their layout, traditional scrapers break.
                Scraper Studio&rsquo;s AI detects changes and auto-repairs your scraper — one click, zero debugging.
              </p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">⟳</span>
                <h3>AI code fixes</h3>
                <p>Automatically repair broken scraper code with AI-driven refactors when site structure changes.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">◈</span>
                <h3>Fast schema updates</h3>
                <p>Add or modify output fields in seconds without manual coding. The AI adjusts selectors and parsing logic.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">✓</span>
                <h3>Lower maintenance</h3>
                <p>Cut ongoing upkeep as scrapers adapt to site changes automatically. Focus on using data, not fixing pipelines.</p>
              </div>
            </div>
          </div>
        </section>

        {/* KEY FEATURES */}
        <section className="section animate-rise" id="features">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Features</span>
              <h2>Everything you need to scrape at scale</h2>
              <p>AI code generation, cloud infrastructure, built-in proxies, and a full IDE — all included.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <span className="feature-icon">✦</span>
                <h3>AI code generation</h3>
                <p>Transform simple prompts into complete scraper code, ready to run. No templates to configure.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">☁</span>
                <h3>Cloud infrastructure</h3>
                <p>Run all compute on Bright Data&rsquo;s managed cloud. No hardware costs, no DevOps — scale instantly.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⊞</span>
                <h3>Built-in proxies &amp; unblocking</h3>
                <p>400M+ residential IPs, geo-targeting, CAPTCHA solving, browser fingerprinting, and automated retries — all built in.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⬡</span>
                <h3>IDE workspace</h3>
                <p>Fully hosted IDE where you can edit, debug, and test your scrapers with live logs and syntax highlighting.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">∞</span>
                <h3>Scheduled delivery</h3>
                <p>Trigger scrapers on a schedule or via API. Deliver data to S3, GCS, BigQuery, Snowflake, or webhook.</p>
              </div>
              <div className="feature-card">
                <span className="feature-icon">⟳</span>
                <h3>AI editing &amp; self-healing</h3>
                <p>Edit scrapers with natural language commands. Auto-repair when sites change — no manual maintenance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COLLECT DATA YOUR WAY */}
        <section className="section section-alt animate-rise" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Flexible</span>
              <h2>Collect data your way</h2>
              <p>Whether you want full control or a hands-off approach, Scraper Studio adapts to your workflow.</p>
            </div>
            <div className="hub-paths">
              <div className="hub-path-card">
                <span className="hub-path-kicker">Self-service</span>
                <h3>You drive, we support</h3>
                <p>Generate scrapers with AI, edit in the IDE, and manage your own pipelines.</p>
                <ul className="hub-path-list">
                  <li>Generate scraper from a prompt</li>
                  <li>Full IDE for code editing</li>
                  <li>24/7 expert support if you get stuck</li>
                  <li>Schedule and monitor your runs</li>
                </ul>
                <span className="hub-path-cta">
                  <a href={SIGNUP} target="_blank" rel="noopener noreferrer">Start free →</a>
                </span>
              </div>
              <div className="hub-path-card">
                <span className="hub-path-kicker">Managed service</span>
                <h3>We build it for you</h3>
                <p>Tell us what you need and we handle everything — building, maintaining, and monitoring.</p>
                <ul className="hub-path-list">
                  <li>We build and maintain the scraper</li>
                  <li>Ongoing monitoring included</li>
                  <li>Clean, structured data delivery</li>
                  <li>Perfect for non-technical teams</li>
                </ul>
                <span className="hub-path-cta">
                  <a href={CONTACT} target="_blank" rel="noopener noreferrer">Talk to sales →</a>
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING */}
        <section className="section animate-rise" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Pricing</span>
              <h2>Start free. Scale as you grow.</h2>
              <p>Every plan includes AI generation, proxies, unblocking, and cloud infrastructure. Pay only for page loads.</p>
            </div>
            <div className="pricing-grid">
              <div className="price-card">
                <div className="price-tier">Free</div>
                <div className="price-amount">
                  <strong>5K</strong>
                  <span>page loads/mo</span>
                </div>
                <ul className="price-features">
                  <li>No credit card required</li>
                  <li>AI generation included</li>
                  <li>Expert support</li>
                </ul>
                <a href={SIGNUP} className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
                  Start free
                </a>
              </div>
              <div className="price-card price-card-featured">
                <div className="price-tier">Pay as you go</div>
                <div className="price-amount">
                  <strong>$1.50</strong>
                  <span>/1K page loads</span>
                </div>
                <ul className="price-features">
                  <li>Pay only for success</li>
                  <li>Unlimited concurrency</li>
                  <li>Set monthly spend limits</li>
                </ul>
                <a href={SIGNUP} className="btn btn-primary btn-pill price-cta" target="_blank" rel="noopener noreferrer">
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
                  <li>384K page loads included</li>
                  <li>$1.30/1K additional</li>
                  <li>Cancel anytime</li>
                </ul>
                <a href={SIGNUP} className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
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
                <a href={CONTACT} className="btn btn-ghost btn-pill price-cta" target="_blank" rel="noopener noreferrer">
                  Talk to sales
                </a>
              </div>
            </div>
            <p className="pricing-note">
              Sign up now and we&rsquo;ll match your first deposit dollar for dollar, up to <strong>$500</strong>
            </p>

            {/* Every plan includes */}
            <div className="hub-plan-includes">
              <div className="hub-plan-includes-head">
                <span className="hub-plan-includes-kicker">What&rsquo;s included</span>
                <h3>Every plan gives you full access &mdash; pay less per page load as you scale</h3>
              </div>
              <div className="hub-plan-cols">
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon">⬡</span>
                    <h4>Data Collection</h4>
                  </div>
                  <ul>
                    <li><span>Automated proxy management</span></li>
                    <li><span>Full browser rendering</span></li>
                    <li><span>CAPTCHA solving</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon">∞</span>
                    <h4>Performance at Scale</h4>
                  </div>
                  <ul>
                    <li><span>Unlimited concurrency</span></li>
                    <li><span>Batch &amp; scheduled collection</span></li>
                    <li><span>Job management APIs</span></li>
                  </ul>
                </div>
                <div className="hub-plan-col">
                  <div className="hub-plan-col-title">
                    <span className="hub-plan-col-icon">◈</span>
                    <h4>Data Delivery</h4>
                  </div>
                  <ul>
                    <li><span>Data validation &amp; discovery</span></li>
                    <li><span>Parsing (JSON or CSV)</span></li>
                    <li><span>Webhook or API delivery</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SUPPORT */}
        <section className="section section-alt animate-rise" id="support">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Support</span>
              <h2>We&rsquo;ll support you every step of the way</h2>
              <p>Talk to a web data expert to get the most out of your data.</p>
            </div>
            <div className="studio-support-grid">
              <div className="studio-support-card">
                <span className="studio-support-icon">🏆</span>
                <strong>Rated #1</strong>
                <span>by customers on G2</span>
              </div>
              <div className="studio-support-card">
                <span className="studio-support-icon">⚡</span>
                <strong>&lt; 10 min</strong>
                <span>average response time</span>
              </div>
              <div className="studio-support-card">
                <span className="studio-support-icon">🌐</span>
                <strong>24/7</strong>
                <span>support anytime, anywhere</span>
              </div>
            </div>
          </div>
        </section>

        {/* INFRASTRUCTURE & COMPLIANCE */}
        <section className="section animate-rise" id="compliance">
          <div className="container">
            <div className="twin-cols">
              <div className="twin-col">
                <span className="kicker">Infrastructure</span>
                <h2>Powered by an award-winning proxy network</h2>
                <p>
                  Unlock the most complex anti-bots using an AI-based web unlocker built on top of a hyper-extensive IP pool.
                  Over 400M+ proxy IPs, best-in-class technology and the ability to target any country, city, ZIP code, carrier, &amp; ASN.
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
            <div className="studio-compliance-badges">
              <div className="studio-compliance-item">
                <span className="studio-compliance-icon">🛡</span>
                <span>Collaborations with security giants like VirusTotal, Avast, and AVG</span>
              </div>
              <div className="studio-compliance-item">
                <span className="studio-compliance-icon">🔍</span>
                <span>Monitoring of 30+ billion domains, blocking unapproved content</span>
              </div>
              <div className="studio-compliance-item">
                <span className="studio-compliance-icon">⚖</span>
                <span>Adherence to GDPR, CCPA, and SEC regulations</span>
              </div>
              <div className="studio-compliance-item">
                <span className="studio-compliance-icon">🤝</span>
                <span>Proactive abuse prevention through global partnerships</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="section section-alt animate-rise" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="kicker">FAQs</span>
              <h2>AI Scraper Studio FAQs</h2>
              <p>
                Common questions about Scraper Studio — how it works, what you can scrape,
                self-healing, pricing, and getting started.
              </p>
            </div>
            <div className="faq-list">
              {STUDIO_FAQS.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta animate-rise">
          <div className="container" style={{ textAlign: "center" }}>
            <h2>Ready to build your scraper?</h2>
            <p style={{ maxWidth: 520, margin: "0 auto 1.5rem", opacity: 0.8 }}>
              Start free with 5,000 page loads — no credit card, no code required. Describe what you need and let AI do the rest.
            </p>
            <a
              href={SIGNUP}
              className="btn btn-primary btn-pill"
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "1.05rem", padding: "0.85rem 2.4rem" }}
            >
              Start free trial
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

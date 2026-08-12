import type { Metadata } from "next";
import { Header, Footer } from "@/components/Chrome";
import { STUDIO_SUBNAV } from "@/lib/site-nav";
import ScrollReveal from "@/components/ScrollReveal";
import TrustedByStrip from "@/components/TrustedByStrip";
import AiPromptCta from "@/components/AiPromptCta";
import { PricingCards } from "@/components/PricingCards";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "AI Scraper Studio - Build Any Scraper With a Prompt",
  description:
    "Turn a plain-English prompt into a production-ready web scraper. AI generates, tests, and deploys your scraper with built-in proxies, auto-healing, and scheduled delivery. 5K page loads free.",
  openGraph: {
    title: "AI Scraper Studio - Build Any Scraper With a Prompt",
    description:
      "Describe the data you need. Our AI builds, tests, and deploys a production scraper in minutes, no code required.",
    type: "website",
    url: "https://brightdata.com/products/web-scraper/studio",
    siteName: "Bright Data",
    images: [
      {
        url: "/images/og-scraper-studio.png",
        width: 1200,
        height: 630,
        alt: "Bright Data AI Scraper Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Scraper Studio - Build Any Scraper With a Prompt",
    description:
      "Describe the data you need. AI builds, tests, and deploys a production scraper in minutes, no code required.",
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
    a: "No. When you launch a job, the scraper executes on Bright Data's infrastructure, complete with built-in proxy rotation, geo-targeting, CAPTCHA/unblocking logic, and auto-scaling. You don't maintain any servers or proxy pools.",
  },
  {
    q: "Is any coding required?",
    a: "No coding is required to generate a scraper, the AI builds it from your prompt. You can optionally refine the auto-generated code in the built-in IDE if you want fine-grained control.",
  },
  {
    q: "How does self-healing work?",
    a: "When a target website changes its layout or structure, the AI automatically detects the break and regenerates the affected selectors and code paths. One click to fix, no manual debugging required.",
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
    a: "Start free with 5,000 page loads/month, no credit card required. Pay-as-you-go pricing is $1.50 per 1,000 page loads. Scale plans start at $499/month with volume discounts.",
  },
] as const;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": "https://brightdata.com/products/web-scraper/studio",
      url: "https://brightdata.com/products/web-scraper/studio",
      name: "AI Scraper Studio - Build Any Scraper With a Prompt",
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
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Bright Data", item: "https://brightdata.com" },
        { "@type": "ListItem", position: 2, name: "Web Scraper", item: "https://brightdata.com/products/web-scraper" },
        { "@type": "ListItem", position: 3, name: "Scraper Studio", item: "https://brightdata.com/products/web-scraper/studio" },
      ],
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
      <Header subnav={STUDIO_SUBNAV} />

      <main>
        <h1 className="sr-only">AI Scraper Studio — Build Any Web Scraper With a Prompt</h1>
        <AiPromptCta variant="hero" />

        {/* HERO VALUE PROPS */}
        <section className="studio-value-props">
          <div className="container">
            <div className="studio-props-grid">
              <div className="studio-prop">
                <span className="studio-prop-icon">⊞</span>
                <strong>Any website</strong>
                <span>Build a scraper for any site from a prompt</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">🔄</span>
                <strong>Auto-maintained</strong>
                <span>AI detects site changes and fixes your scraper</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">∞</span>
                <strong>Schedule &amp; deliver</strong>
                <span>Run daily, weekly, or via API. Data to S3, webhook, etc.</span>
              </div>
              <div className="studio-prop">
                <span className="studio-prop-icon">🛡</span>
                <strong>Infrastructure included</strong>
                <span>400M+ IPs, proxies, CAPTCHA solving, all built in</span>
              </div>
            </div>
          </div>
        </section>

        <TrustedByStrip />

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
                <h3>AI builds the scraper</h3>
                <p>The AI writes scraper code, configures proxies, and tests it against the target site. Review and edit in the built-in IDE if you want.</p>
              </div>
              <div className="step-card">
                <span className="step-icon">03</span>
                <h3>Run &amp; forget</h3>
                <p>Schedule daily, weekly, or custom runs. Data is delivered via API, webhook, S3, BigQuery, or Snowflake. AI auto-fixes when sites change.</p>
              </div>
            </div>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="section section-alt animate-rise" id="features">
          <div className="container">
            <div className="section-head">
              <span className="kicker">What you get</span>
              <h2>Everything to scrape any site at any scale</h2>
              <p>AI generation, auto-maintenance, cloud infra, proxies, and a full IDE — all included in every plan.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">✦</span>
                  <h3>AI generates your scraper</h3>
                </div>
                <p>Describe the data you need in plain English. The AI writes the code, configures selectors, and tests it — ready to run in minutes.</p>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">🔄</span>
                  <h3>Auto-maintained by AI</h3>
                </div>
                <p>When target sites change layout or structure, the AI detects it and auto-repairs your scraper. No manual debugging, no downtime.</p>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">🛡</span>
                  <h3>400M+ IPs &amp; unblocking</h3>
                </div>
                <p>Proxies, geo-targeting, CAPTCHA solving, browser fingerprinting, retries — all built in. You never manage infrastructure.</p>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">☁</span>
                  <h3>Runs in the cloud</h3>
                </div>
                <p>All compute runs on Bright Data&rsquo;s managed cloud. No servers, no DevOps. Scale from 10 requests to 10 million.</p>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">⬡</span>
                  <h3>Built-in IDE</h3>
                </div>
                <p>Edit, debug, and test scrapers in a fully hosted IDE with live logs. Refine AI-generated code or write your own.</p>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span className="feature-icon">∞</span>
                  <h3>Scheduled delivery</h3>
                </div>
                <p>Trigger runs on a schedule or via API. Deliver data to S3, GCS, BigQuery, Snowflake, or your webhook.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CHOOSE YOUR WORKFLOW */}
        <section className="section animate-rise" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Your choice</span>
              <h2>Build it yourself or let us handle it</h2>
              <p>Use the AI Studio with full control, or hand it off and get clean data delivered automatically.</p>
            </div>
            <div className="hub-paths hub-paths-2">
              <div className="hub-path-card">
                <span className="hub-path-kicker">Self-service</span>
                <h3>You run it, AI helps</h3>
                <p>Generate scrapers with a prompt, edit code in the IDE, and manage your own runs.</p>
                <ul className="hub-path-list">
                  <li>AI generates the scraper from your prompt</li>
                  <li>Edit and debug in the built-in IDE</li>
                  <li>AI auto-fixes when sites change</li>
                  <li>Schedule runs and get data delivered</li>
                </ul>
                <span className="hub-path-cta">
                  <a href={SIGNUP} target="_blank" rel="noopener noreferrer">Start free →</a>
                </span>
              </div>
              <div className="hub-path-card">
                <span className="hub-path-kicker">Managed service</span>
                <h3>We handle everything</h3>
                <p>Tell us what data you need. We build, maintain, and monitor the scraper for you.</p>
                <ul className="hub-path-list">
                  <li>We build the scraper to your spec</li>
                  <li>Ongoing monitoring and maintenance</li>
                  <li>Clean, structured data delivery</li>
                  <li>No technical work required on your end</li>
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
            <PricingCards unit="page loads" />
            <p className="pricing-note">
              Sign up now and we&rsquo;ll match your first deposit dollar for dollar, up to <strong>$500</strong>
            </p>

            {/* Every plan includes */}
            <div className="hub-plan-includes">
              <div className="hub-plan-includes-head">
                <span className="hub-plan-includes-kicker">What&rsquo;s included</span>
                <h3>Every plan gives you full access, pay less per page load as you scale</h3>
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
                <h2>Powered by 400M+ proxy IPs</h2>
                <p>
                  Every scraper runs through Bright Data&rsquo;s proxy network with AI-based unblocking,
                  geo-targeting by country, city, or ASN, CAPTCHA solving, and browser fingerprinting built in.
                </p>
              </div>
              <div className="twin-col">
                <span className="kicker">Compliance</span>
                <h2>Ethical data collection</h2>
                <p>
                  Only publicly available data. ISO&nbsp;27001 certified, SOC&nbsp;2 controls,
                  GDPR &amp; CCPA compliant. Backed by an industry-first Compliance &amp; Ethics team.
                </p>
                <div className="compliance-badges">
                  <span className="compliance-badge">GDPR</span>
                  <span className="compliance-badge">CCPA</span>
                  <span className="compliance-badge">ISO 27001</span>
                  <span className="compliance-badge">SOC 2</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FaqSection
          title="AI Scraper Studio FAQs"
          description="Common questions about Scraper Studio, how it works, what you can scrape, self-healing, pricing, and getting started."
          items={STUDIO_FAQS}
          altBg
        />

        {/* FINAL CTA */}
        <section className="final-cta animate-rise">
          <div className="container" style={{ textAlign: "center" }}>
            <h2>Ready to build your scraper?</h2>
            <p className="final-cta-sub">
              Describe what you need. AI builds the scraper, you get the data. 5K free page loads, no credit card.
            </p>
            <div className="hero-ctas" style={{ justifyContent: "center" }}>
              <a href={SIGNUP} className="btn btn-primary btn-pill" target="_blank" rel="noopener noreferrer">
                Start free
              </a>
              <a href={CONTACT} className="btn btn-ghost btn-pill" target="_blank" rel="noopener noreferrer">
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

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
import { PricingCards } from "@/components/PricingCards";
import { sampleUrlForDomain, type DomainHubData } from "@/lib/domain-hubs";

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
              {hub.scrapers.map((s) => (
                <ScraperCard
                  key={s.id}
                  name={s.name}
                  domain={s.domain || hub.domain}
                  category={s.category || hub.category}
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
          </div>
        </section>

        {/* 2. PATHS — orient developers & buyers */}
        <section className="section section-alt animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Effortlessly scrape {hub.name} data</h2>
              <p>Same scrapers, two ways to run them — pick the workflow that fits your team.</p>
            </div>
            <div className="hub-paths">
              <a href="https://brightdata.com/cp/start" className="hub-path-card" target="_blank" rel="noopener noreferrer">
                <span className="hub-path-kicker">API-based scraper</span>
                <h3>{hub.name} Scraper API</h3>
                <p>Trigger collections with parameters, schedule at scale, and deliver to your storage or webhook.</p>
                <ul className="hub-path-list">
                  <li>Build requests in any language</li>
                  <li>Automate with schedulers &amp; webhooks</li>
                  <li>JSON, NDJSON, or CSV delivery</li>
                </ul>
                <span className="hub-path-cta">Start with API →</span>
              </a>
              <a href="https://brightdata.com/cp/data_collector/collectors/create?camp=plg" className="hub-path-card" target="_blank" rel="noopener noreferrer">
                <span className="hub-path-kicker">Control panel scraper</span>
                <h3>{hub.name} no-code scraper</h3>
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

        {/* 3. PRICING — buyers check cost early */}
        <section className="section animate-rise hub-anchor" id="pricing">
          <div className="container">
            <div className="section-head">
              <span className="kicker">{hub.name} Scraper API Pricing</span>
              <h2>Only pay for what&rsquo;s successfully delivered</h2>
              <p>No hidden fees. No charges for failed deliveries. Every plan includes full access to {hub.name} scrapers and infrastructure.</p>
            </div>
            <PricingCards unit="records" />
            <PricingAssurances />
          </div>
        </section>

        {/* 4. AGENTS — modern developer workflow */}
        <section className="section section-alt animate-rise hub-anchor" id="agents">
          <div className="container">
            <AgentGetStarted
              name={hub.name}
              domain={exampleHost}
              pipelineId={pipelineId}
              sampleUrl={sampleUrl}
            />
          </div>
        </section>

        {/* 5. HOW IT WORKS — infrastructure value */}
        <section className="section animate-rise hub-anchor" id="how">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Under the hood</span>
              <h2>Scrape {hub.name} with one API call</h2>
              <p>Discovery, bulk handling, parsing, and validation — built into every {hub.name} scraper.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card"><span className="feature-icon">◎</span><h3>Data discovery</h3><p>Detect structures and patterns for efficient, targeted {hub.name} extraction.</p></div>
              <div className="feature-card"><span className="feature-icon">⊞</span><h3>Bulk request handling</h3><p>Send up to 5,000 URLs per request. Optimize high-volume collection without ops overhead.</p></div>
              <div className="feature-card"><span className="feature-icon">⬡</span><h3>Data parsing</h3><p>Raw HTML becomes structured JSON, NDJSON, or CSV ready for your pipeline.</p></div>
              <div className="feature-card"><span className="feature-icon">✓</span><h3>Data validation</h3><p>Built-in checks improve reliability and cut manual preprocessing time.</p></div>
              <div className="feature-card"><span className="feature-icon">⟳</span><h3>Unblocking built in</h3><p>IP rotation, CAPTCHA solving, JS rendering, and residential proxies — automatic.</p></div>
              <div className="feature-card"><span className="feature-icon">∞</span><h3>Battle-proven scale</h3><p>99.99% uptime, 400M+ IPs across 195 countries. Powering 20,000+ companies.</p></div>
            </div>
          </div>
        </section>

        {/* 6. USE CASES — relevance */}
        <section className="section section-alt animate-rise hub-anchor" id="use-cases">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Use cases</span>
              <h2>{hub.name} data scraping use cases</h2>
              <p>Real-time {hub.name} intelligence for your business.</p>
            </div>
            <div className="usecases-grid">
              {hub.useCases.map((uc) => (
                <div key={uc.title} className="usecase-card">
                  <h3>{uc.title}</h3>
                  <p>{uc.body}</p>
                  <span className="usecase-sites">{uc.tags}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. WHY — trust for buyers */}
        <section className="section animate-rise hub-anchor" id="why">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Why Bright Data</span>
              <h2>Why 20,000+ customers choose Bright Data</h2>
            </div>
            <div className="features-grid">
              <div className="feature-card"><h3>100% compliant</h3><p>Ethically obtained public data with GDPR &amp; CCPA-ready practices.</p></div>
              <div className="feature-card"><h3>24/7 Expert support</h3><p>A dedicated team of data professionals ready when you need them.</p></div>
              <div className="feature-card"><h3>Complete data coverage</h3><p>Access 400M+ global IPs to scrape {hub.name} from any geo.</p></div>
              <div className="feature-card"><h3>Unmatched data quality</h3><p>Advanced validation methods for reliable, analysis-ready {hub.name} data.</p></div>
              <div className="feature-card"><h3>Powerful infrastructure</h3><p>High-volume scraping without getting blocked or maintaining proxies.</p></div>
              <div className="feature-card"><h3>Custom solutions</h3><p>Tailored {hub.name} data programs for enterprise workflows and SLAs.</p></div>
            </div>
          </div>
        </section>

        {/* 8. FAQ — reference at the bottom */}
        <section className="section section-alt animate-rise hub-anchor" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="kicker">FAQs</span>
              <h2>{hub.name} Scraper API FAQs</h2>
              <p>Common questions about scraping {hub.name} with Bright Data&rsquo;s Web Scraper API.</p>
            </div>
            <div className="faq-list">
              {hub.faqs.map((item) => (
                <details key={item.q} className="faq-item">
                  <summary>{item.q}</summary>
                  <p>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {hub.slug === "ecommerce" ? (
          <AiPromptCta headingPlain="Build your own" headingAccent="e-commerce scraper." />
        ) : (
          <AiPromptCta />
        )}
      </main>

      <Footer />
      <ScrollReveal />
    </div>
  );
}

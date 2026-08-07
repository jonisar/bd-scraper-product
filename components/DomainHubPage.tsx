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
import PricingSlider from "@/components/PricingSlider";
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

        {/* 2. HOW IT WORKS — quick orientation */}
        <section className="section section-alt animate-rise hub-anchor" id="steps">
          <div className="container">
            <div className="section-head">
              <span className="kicker">How it works</span>
              <h2>From zero to {hub.name} data in 3 steps</h2>
              <p>No proxies to configure, no infrastructure to manage. Just pick, call, and receive.</p>
            </div>
            <div className="steps-grid">
              <div className="step-card">
                <span className="step-icon">01</span>
                <h3>Pick a scraper</h3>
                <p>Choose from the {hub.name} scrapers above or create your own with AI in minutes.</p>
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

        {/* 3. PATHS — orient developers & buyers */}
        <section className="section animate-rise hub-anchor" id="paths">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Choose your path</span>
              <h2>Effortlessly scrape {hub.name} data</h2>
              <p>Same scrapers, three ways to run them — pick the workflow that fits your team.</p>
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
              <a href="#agents" className="hub-path-card">
                <span className="hub-path-kicker">AI agent integration</span>
                <h3>{hub.name} agent scraper</h3>
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

        {/* 4. PRICING — buyers check cost early */}
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

        {/* 5. AGENTS — modern developer workflow */}
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

        {/* INCLUDED — what every plan gets */}
        <section className="section section-alt animate-rise hub-anchor" id="included">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Included in every plan</span>
              <h2>Everything you need, built in</h2>
              <p>You pay for results. Proxies, rendering, concurrency, and delivery are always included — on every plan.</p>
            </div>
            <div className="features-grid">
              <div className="feature-card"><span className="feature-icon">⟳</span><h3>400M+ proxy IPs</h3><p>Residential IPs across 195 countries. Automatic rotation. No extra charge.</p></div>
              <div className="feature-card"><span className="feature-icon">◈</span><h3>CAPTCHA &amp; anti-bot</h3><p>Automated CAPTCHA solving, fingerprinting, and user-agent rotation. Always on.</p></div>
              <div className="feature-card"><span className="feature-icon">⬡</span><h3>JS rendering</h3><p>Full browser rendering for SPAs and dynamic pages. No headless browser to manage.</p></div>
              <div className="feature-card"><span className="feature-icon">∞</span><h3>Unlimited concurrency</h3><p>No rate limits. Scale from 10 to 10M requests with zero config changes.</p></div>
              <div className="feature-card"><span className="feature-icon">⊞</span><h3>5K URLs per batch</h3><p>Bulk collection with scheduling, webhooks, and job management APIs.</p></div>
              <div className="feature-card"><span className="feature-icon">⇢</span><h3>Flexible delivery</h3><p>JSON, NDJSON, or CSV. Deliver via API response, webhook, or cloud storage.</p></div>
            </div>
          </div>
        </section>

        {/* UNDER THE HOOD — infrastructure value */}
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

        {/* USE CASES — relevance */}
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

        {/* COMPARISON — decision-making */}
        <section className="section animate-rise hub-anchor" id="compare">
          <div className="container">
            <div className="section-head">
              <span className="kicker">Why Bright Data</span>
              <h2>{hub.name} Scraper API vs DIY and other providers</h2>
              <p>
                Compare Bright Data&rsquo;s managed scrapers with building your own or using other scraping services.
              </p>
            </div>
            <div className="compare-table-wrap">
              <table className="compare-table">
                <caption className="sr-only">
                  {hub.name} scraper comparison: Bright Data vs other providers vs DIY
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
                  <tr><td>Pre-built {hub.name} scrapers</td><td className="compare-highlight">✓ Ready to use</td><td>Limited</td><td>Build each</td></tr>
                  <tr><td>Auto-maintenance (site changes)</td><td className="compare-highlight">✓ 24/7</td><td>Varies</td><td>Your team</td></tr>
                  <tr><td>Compliance (GDPR, CCPA, SOC 2)</td><td className="compare-highlight">✓ Full</td><td>Partial</td><td>Your responsibility</td></tr>
                  <tr><td>Structured output (JSON/CSV)</td><td className="compare-highlight">✓ Automatic</td><td>✓</td><td>Build parsers</td></tr>
                  <tr><td>Free tier</td><td className="compare-highlight">✓ 5K records/mo</td><td>Varies</td><td>Infra costs</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* DX + COMPLIANCE — trust layer */}
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
                <h2>Leading ethical web data collection</h2>
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

        {/* FAQ — reference at the bottom */}
        <section className="section animate-rise hub-anchor" id="faq">
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

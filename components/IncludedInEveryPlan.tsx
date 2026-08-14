export default function IncludedInEveryPlan({
  altBg = false,
  hubAnchor = false,
}: {
  altBg?: boolean;
  hubAnchor?: boolean;
} = {}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="included">
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
          <div className="feature-card"><div className="feature-head"><span className="feature-icon">✓</span><h3>Every scraper you need, always maintained</h3></div><p>Built, tested, and kept working by Bright Data. Defined inputs, structured outputs. No community guesswork.</p></div>
          <div className="feature-card"><div className="feature-head"><span className="feature-icon">💲</span><h3>Pay per result, nothing extra</h3></div><p>One price per record delivered. Proxies, retries, rendering, unblocking &mdash; all included in that price.</p></div>
          <div className="feature-card"><div className="feature-head"><span className="feature-icon">🏛</span><h3>Compliant and fully supported</h3></div><p>GDPR &amp; CCPA compliant. 24/7 human support on every plan, including free.</p></div>
        </div>
      </div>
    </section>
  );
}

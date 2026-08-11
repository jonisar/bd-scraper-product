export default function IncludedInEveryPlan({
  name,
  altBg = false,
  hubAnchor = false,
}: {
  name: string;
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="included">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Included in every plan</span>
          <h2>Scrape {name} with one API call</h2>
          <p>Discovery, unblocking, parsing, and delivery are built into every {name} scraper. You pay for successful results, everything else is included.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card"><span className="feature-icon">⟳</span><h3>Unblocking built in</h3><p>IP rotation, CAPTCHA solving, JS rendering, and 400M+ residential proxies. No extra charge.</p></div>
          <div className="feature-card"><span className="feature-icon">◎</span><h3>Data discovery</h3><p>Detect structures and patterns for efficient, targeted {name} extraction.</p></div>
          <div className="feature-card"><span className="feature-icon">⊞</span><h3>5K URLs per batch</h3><p>Bulk collection with scheduling, webhooks, and job management APIs.</p></div>
          <div className="feature-card"><span className="feature-icon">✓</span><h3>Parsing &amp; validation</h3><p>Raw HTML becomes structured JSON, NDJSON, or CSV, with built-in quality checks.</p></div>
          <div className="feature-card"><span className="feature-icon">∞</span><h3>Unlimited concurrency</h3><p>No rate limits. Scale from 10 to 10M requests with zero config changes.</p></div>
          <div className="feature-card"><span className="feature-icon">⇢</span><h3>Flexible delivery</h3><p>Get results via API response, webhook, or cloud storage, in the format your pipeline expects.</p></div>
        </div>
      </div>
    </section>
  );
}

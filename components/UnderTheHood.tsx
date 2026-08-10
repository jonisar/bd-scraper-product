export default function UnderTheHood({
  name,
  altBg = false,
  hubAnchor = false,
}: {
  name: string;
  altBg?: boolean;
  hubAnchor?: boolean;
}) {
  return (
    <section className={`section ${altBg ? "section-alt " : ""}animate-rise${hubAnchor ? " hub-anchor" : ""}`} id="how">
      <div className="container">
        <div className="section-head">
          <span className="kicker">Under the hood</span>
          <h2>Scrape {name} with one API call</h2>
          <p>Discovery, bulk handling, parsing, and validation, built into every {name} scraper.</p>
        </div>
        <div className="features-grid">
          <div className="feature-card"><span className="feature-icon">◎</span><h3>Data discovery</h3><p>Detect structures and patterns for efficient, targeted {name} extraction.</p></div>
          <div className="feature-card"><span className="feature-icon">⊞</span><h3>Bulk request handling</h3><p>Send up to 5,000 URLs per request. Optimize high-volume collection without ops overhead.</p></div>
          <div className="feature-card"><span className="feature-icon">⬡</span><h3>Data parsing</h3><p>Raw HTML becomes structured JSON, NDJSON, or CSV ready for your pipeline.</p></div>
          <div className="feature-card"><span className="feature-icon">✓</span><h3>Data validation</h3><p>Built-in checks improve reliability and cut manual preprocessing time.</p></div>
          <div className="feature-card"><span className="feature-icon">⟳</span><h3>Unblocking built in</h3><p>IP rotation, CAPTCHA solving, JS rendering, and residential proxies, automatic.</p></div>
          <div className="feature-card"><span className="feature-icon">∞</span><h3>Battle-proven scale</h3><p>99.99% uptime, 400M+ IPs across 195 countries. Powering 20,000+ companies.</p></div>
        </div>
      </div>
    </section>
  );
}
